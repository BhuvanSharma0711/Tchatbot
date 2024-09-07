import sys
import json
import uuid
from sqlalchemy import create_engine, text, inspect
from PIL import Image, ImageDraw, ImageFont
import qrcode
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from io import BytesIO
import os

# Define your database URL
DATABASE_URL = "postgresql://postgres:pass@localhost:5432/db"

# Create a database engine
engine = create_engine(DATABASE_URL)

# Create an inspector object to list tables
inspector = inspect(engine)

def fetch_ticket_data(user_id):
    with engine.connect() as connection:
        tables = inspector.get_table_names()
        if 'Ticket' in tables:
            result = connection.execute(text('SELECT * FROM "Ticket" WHERE "userId" = :user_id;'), {'user_id': user_id})
            row = result.fetchone()
            if row:
                # Map the tuple to a dictionary
                return {
                    "ticket_id": row[0],
                    "user_id": row[1],
                    "show1": row[2],
                    "show2": row[3],
                    "timestamp": row[4],
                    "numbTicket": row[5],
                    "email":row[6],
                    "payment":row[7]
                }
            else:
                raise ValueError('No tickets found for this user ID')
        else:
            raise ValueError("The 'Ticket' table does not exist in the database.")

def generate_ticket(ticket_data):
    # Extract data from the dictionary
    name = ticket_data.get('name', 'Event Ticket')
    show1 = str(ticket_data['show1'])
    show2 = str(ticket_data['show2'])
    event_date = ticket_data['timestamp']
    
    # Generate unique ticket ID if not already present
    ticket_id = ticket_data['ticket_id']

    # Create a QR code with the ticket ID
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=12,
        border=4,
    )
    qr.add_data(ticket_id)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")

    # Create a ticket image
    ticket = Image.new('RGB', (1500, 900), color=(255, 255, 255))
    d = ImageDraw.Draw(ticket)
    
    # Fonts
    header_font = ImageFont.truetype("arial.ttf", 80)
    main_font = ImageFont.truetype("arial.ttf", 50)
    small_font = ImageFont.truetype("arial.ttf", 30)

    # Title at the top
    d.text((50, 30), name, fill=(0, 0, 0), font=header_font)
    
    # Show 1
    d.text((50, 150), "Show 1: " + show1, fill=(0, 0, 0), font=main_font)

    # Show 2
    d.text((50, 300), "Show 2: " + show2, fill=(0, 0, 0), font=main_font)

    # Event date and time
    d.text((50, 450), "Date & Time: " + event_date , fill=(0, 0, 0), font=main_font)

    # Ticket ID
    d.text((50, 600), "Ticket ID: " + ticket_id, fill=(0, 0, 0), font=main_font)
    
    # QR code placement
    ticket.paste(qr_img, (900, 150))
    
    # Footer
    d.text((50, 800), "Please present this ticket at the event entrance.", fill=(0, 0, 0), font=small_font)
    
    # Save the ticket image to a file
    ticket_path = f"{ticket_id}.jpg"
    ticket.save(ticket_path, "JPEG")

    return ticket_id, ticket_path

def send_ticket_via_email(email, ticket_id, ticket_path):
    sender_email = "tixbot.nitkkr@gmail.com"
    sender_password = "fpqm qlwz egtv zkui"
    subject = "Your Event Ticket"

    body = f"Dear {email.split('@')[0]},\n\nAttached is your ticket. Your Ticket ID is {ticket_id}.\n\nThank you!"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    with open(ticket_path, "rb") as attachment:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            f"attachment; filename= {ticket_path}",
        )
        msg.attach(part)

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender_email, sender_password)
    text = msg.as_string()
    server.sendmail(sender_email, email, text)
    server.quit()

# Main function
if __name__ == "__main__":
    try:
        # Get the user ID from command line arguments
        user_id = sys.argv[1]

        # Fetch ticket data from the database
        ticket_data = fetch_ticket_data(user_id)

        # Generate ticket and save the image
        ticket_id, ticket_path = generate_ticket(ticket_data)

        # Send the ticket via email
        send_ticket_via_email(ticket_data['email'], ticket_id, ticket_path)
        os.remove(ticket_path)
        result={
            "ticked_data":ticket_data,
            "message":"Ticket created and sent successfully"
        }
        print(json.dumps(result))
    
    except Exception as e:
        print(json.dumps({'error': str(e)}))
