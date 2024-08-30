"use client";

// Importing necessary hooks and types from React
import { useState, CSSProperties } from 'react';

export default function Home() {
  // State to toggle the visibility of the chatbot
  const [showChatbot, setShowChatbot] = useState(false);

  // State to store chat messages
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  // State to manage the input field value
  const [inputValue, setInputValue] = useState('');

  // State to track the current question
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  // List of questions to ask
  const questions = [
    "What's your name?",
    "What's your roll number?",
    "What's your father's name?",
    "What's your mother's name?",
    "What's your date of birth?"
  ];

  // Function to toggle chatbot visibility
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  // Function to send a message, and simulate a bot response
  const sendMessage = (message: string, sender: string) => {
    if (message.trim() !== '') {
      // Update message list with user message
      setMessages((prevMessages) => [...prevMessages, { sender, text: message }]);
      setInputValue('');

      // If there are still questions to ask, proceed to the next question
      if (currentQuestion < questions.length) {
        setTimeout(() => {
          // Add the next question to messages
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: questions[currentQuestion] }
          ]);
          // Move to the next question
          setCurrentQuestion((prev) => prev + 1);
        }, 500);
      } else {
        // Simulate final response or end of conversation
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: 'Thank you for providing the information!' }
          ]);
        }, 500);
      }
    }
  };

  // Handle send button click event
  const handleSendButtonClick = () => {
    sendMessage(inputValue, 'user');
  };

  // Handle key down event in input field to send message on Enter key
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendButtonClick();
    }
  };

  return (
    <div style={styles.container}>
      {/* Header section with title */}
      <header style={styles.header}>
        <h1 style={styles.title}>Chatbot Interface</h1>
      </header>
      {/* Button to toggle chatbot visibility */}
      <div style={styles.buttonContainer}>
        <button style={styles.chatButton} onClick={toggleChatbot}>
          {showChatbot ? 'Close Chat' : 'Open Chat'}
        </button>
      </div>

      {/* Chatbot UI */}
      {showChatbot && (
        <div style={styles.chatContainer}>
          {/* Header of the chatbot */}
          <div style={styles.chatHeader} onClick={toggleChatbot}>
            Chatbot
          </div>
          {/* Chat messages area */}
          <div style={styles.chatMessages}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  ...(message.sender === 'user' ? styles.userMessage : styles.botMessage),
                }}
              >
                {message.text}
              </div>
            ))}
          </div>
          {/* Chat input and send button */}
          <div style={styles.chatInputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Type your message..."
              style={styles.chatInput}
            />
            <button style={styles.sendButton} onClick={handleSendButtonClick}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// CSS styles for the components
const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif', // Font family for the entire page
    margin: 0, // Remove default margin
    padding: 0, // Remove default padding
    height: '100vh', // Full viewport height
    display: 'flex', // Flexbox layout
    flexDirection: 'column', // Column layout
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
    background: '#e0e5ec', // Background color
    position: 'relative', // Positioning for child elements
    backgroundImage: 'url("himan.jpg")', // Background image path
    backgroundSize: 'cover', // Cover the entire container
    backgroundPosition: 'center', // Center the background image
    backgroundRepeat: 'no-repeat', // Do not repeat the background image
  },
    header: {
    textAlign: 'center', // Center align text in header
    marginBottom: '500px', // Margin below header
    padding: '20px', // Padding inside header
    background: '#cdf0ff', // Header background color
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Header shadow
    borderRadius: '10px', // Rounded corners
    width: '80%', // Width of header
    maxWidth: '600px', // Maximum width of header
  },
  title: {
    color: '#333333', // Title text color
    fontSize: '2rem', // Font size of title
    margin: 0, // Remove default margin
  },
  buttonContainer: {
    position: 'fixed', // Fixed positioning for the button
    bottom: '20px', // Distance from the bottom
    right: '20px', // Distance from the right
  },
  chatButton: {
    padding: '12px 24px', // Button padding
    fontSize: '16px', // Font size of button text
    color: '#fff', // Button text color
    backgroundColor: '#007bff', // Button background color
    border: 'none', // Remove border
    borderRadius: '25px', // Rounded corners
    cursor: 'pointer', // Pointer cursor on hover
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Button shadow
    transition: 'background-color 0.3s, transform 0.3s', // Transition effects
  },
  chatButtonHover: {
    backgroundColor: '#0056b3', // Hover background color
    transform: 'translateY(-2px)', // Hover transform effect
  },
  chatContainer: {
    position: 'fixed', // Fixed positioning for the chat container
    bottom: '20px', // Distance from the bottom
    right: '20px', // Distance from the right
    width: '350px', // Width of chat container
    height: '450px', // Height of chat container
    borderRadius: '10px', // Rounded corners
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow for chat container
    background: '#ffffff', // Background color of chat container
    display: 'flex', // Flexbox layout
    flexDirection: 'column', // Column layout
    zIndex: 1000, // Ensure chat container is on top
  },
  chatHeader: {
    background: '#007bff', // Header background color
    color: '#ffffff', // Header text color
    padding: '15px', // Padding inside header
    borderRadius: '10px 10px 0 0', // Rounded top corners
    textAlign: 'center', // Center align text
    cursor: 'pointer', // Pointer cursor on hover
    fontWeight: 'bold', // Bold text
  },
  chatMessages: {
    flex: 1, // Flex-grow to fill available space
    padding: '15px', // Padding inside messages area
    overflowY: 'auto', // Scroll if content overflows vertically
    borderBottom: '1px solid #ddd', // Bottom border for messages area
  },
  chatInputContainer: {
    display: 'flex', // Flexbox layout for input and button
    borderTop: '1px solid #ddd', // Top border for input container
    padding: '10px', // Padding inside input container
  },
  chatInput: {
    flex: 1, // Flex-grow to fill available space
    border: '1px solid #ddd', // Border around input field
    padding: '10px', // Padding inside input field
    borderRadius: '20px 0 0 20px', // Rounded left corners
    color: '#333333', // Text color inside input field
    fontSize: '14px', // Font size of input text
  },
  sendButton: {
    padding: '10px 20px', // Button padding
    border: 'none', // Remove border
    background: '#007bff', // Button background color
    color: '#fff', // Button text color
    borderRadius: '0 20px 20px 0', // Rounded right corners
    cursor: 'pointer', // Pointer cursor on hover
    transition: 'background-color 0.3s', // Transition effect for background color
    fontSize: '14px', // Font size of button text
  },
  sendButtonHover: {
    background: '#0056b3', // Hover background color
  },
  message: {
    marginBottom: '10px', // Margin below each message
    padding: '10px', // Padding inside message box
    borderRadius: '15px', // Rounded corners
    fontSize: '14px', // Font size of message text
    maxWidth: '80%', // Maximum width of message box
  },
  userMessage: {
    background: '#007bff', // Background color for user messages
    color: '#ffffff', // Text color for user messages
    alignSelf: 'flex-end', // Align messages to the end (right)
  },
  botMessage: {
    background: '#f1f1f1', // Background color for bot messages
    color: '#333333', // Text color for bot messages
    alignSelf: 'flex-start', // Align messages to the start (left)
  },
};
