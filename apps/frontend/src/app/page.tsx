"use client";
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// interface NumberInputProps {
//   min?: number;
//   max?: number;
//   step?: number;
//   initialValue?: number;
//   onValueChange?: (value: number) => void;
// }


export default function Home() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [bookingStarted, setBookingStarted] = useState<boolean>(false);
  const [optionSelected, setOptionSelected] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [userData ,setUserData]=useState<{ [key: string]: string}>({});

  const questions = [
    "What's your date for the visit?",
    "What's your name?",
    "How many tickets do you need?",
    "What is your UID type?",
    "What is your UID no.?",
    "Enter the email for verification?",
    "Enter OTP?",
    "Thank you for providing your information",
  ];

  const toggleChatbot = () => {
    if (!showChatbot) {
      setMessages([{ sender: 'bot', text: 'Do you like to buy tickets?' }]);
    }
    setShowChatbot(!showChatbot);
  };

  const sendMessage = (message: string, sender: string) => {
    if (message.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, { sender, text: message }]);
      setInputValue('');

      if (!bookingStarted && !optionSelected) {
        setOptionSelected(true);
        if (message.toLowerCase() === 'yes') {
          setBookingStarted(true);
          setCurrentQuestion(1);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: questions[currentQuestion] },
          ]);
        } else if (message.toLowerCase() === 'no') {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: 'Thank you for your time!' },
          ]);
          setTimeout(() => {
            setOptionSelected(false);
            setShowChatbot(false);
          }, 2000);
        }
      } else {
        const questionKey=`question_${currentQuestion}`;
        setUserData((prevData)=>({
          ...prevData,
          [questionKey]: message,
        }));
        if (currentQuestion === 1 && selectedDate) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'user', text: selectedDate.toDateString() },
            { sender: 'bot', text: questions[currentQuestion + 1] }
          ]);
          setCurrentQuestion((prev) => prev + 1);
          setSelectedDate(null); // Reset the date picker for the next question
        } else if (currentQuestion < questions.length) {
          setCurrentQuestion((prev) => prev + 1);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: questions[currentQuestion] },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: 'Thank you for providing the information!' },
          ]);
          setTimeout(() => {
            setShowChatbot(false);
          }, 0);
        }
      }
    }
  };

  // const NumberInput: React.FC<NumberInputProps>=({
  //   min = 0,
  //   max = 100,
  //   step = 1,
  //   initialValue = 0,
  //   onValueChange,
  // })=>{
  //   const [value , setValue ]=useState<number>(initialValue);

  //   const handleIncrement=()=>{
  //     const newValue= value +step;
  //     if(newValue<=max){
  //       setValue(newValue);
  //       onValueChange?.(newValue);
  //     }
  //   };

  //   const handleDecrement=()=>{
  //     const newValue= value -step;
  //     if(newValue>=min){
  //       setValue(newValue);
  //       onValueChange?.(newValue);
  //     }
  //   }
  // };
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setInputValue(date.toDateString());
      sendMessage(date.toDateString(), 'user');
    }
  };

  const handleSendButtonClick = () => {
    if (currentQuestion === 1 && selectedDate) {
      sendMessage(selectedDate.toDateString(), 'user');
    } else {
      sendMessage(inputValue, 'user');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendButtonClick();
    }
  };
useEffect(()=>{
  if(currentQuestion=== questions.length-1){
    console.log('all user Input',userData);
  }
}, [currentQuestion,userData]);
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Chatbot Interface</h1>
      </header>
      <div style={styles.buttonContainer}>
        <button
          style={{ ...styles.chatButton, ...(showChatbot ? styles.chatButtonHover : {}) }}
          onClick={toggleChatbot}
        >
          {showChatbot ? 'Close Chat' : <img src="aichatbot.png" alt="Chatbot" />}
        </button>
      </div>

      {showChatbot && (
        <div style={styles.chatContainer}>
          <div style={styles.chatHeader} onClick={toggleChatbot}>
            Chatbot
          </div>
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
            {!bookingStarted && !optionSelected && (
              <div style={styles.initialOptions}>
                <button style={styles.yesButton} onClick={() => sendMessage('yes', 'user')}>
                  Yes
                </button>
                <button style={styles.noButton} onClick={() => sendMessage('no', 'user')}>
                  No
                </button>
              </div>
            )}
          </div>
          <div style={styles.chatInputContainer}>
            {currentQuestion === 1 ? (
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText="Select a date"
                style={styles.chatInput}
              />
            ) : (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type your message..."
                style={styles.chatInput}
              />
            )}
            <button
              style={{ ...styles.sendButton, ...(inputValue || selectedDate ? styles.sendButtonHover : {}) }}
              onClick={handleSendButtonClick}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#e0e5ec',
    position: 'relative',
    backgroundImage: 'url("himan.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  header: {
    textAlign: 'center',
    marginBottom: '500px',
    padding: '20px',
    background: '#cdf0ff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    width: '80%',
    maxWidth: '600px',
  },
  title: {
    color: '#333333',
    fontSize: '2rem',
    margin: 0,
  },
  buttonContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    borderRadius: '50%',
  },
  chatButton: {
    padding: '15px 15px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#1e1f1f',
    border: 'none',
    marginRight: '25px',
    cursor: 'pointer',
    boxShadow: '6px 6px 8px #000000, -4px -4px 8px #000000',
    transition: 'background-color 0.3s, transform 0.3s',
    width: '90px',
    height: '90px',
    borderRadius: '50%',
  },
  chatButtonHover: {
    backgroundColor: '#0056b3',
    transform: 'translateY(-2px)',
  },
  chatContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '350px',
    height: '450px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    backgroundColor: '#114378',
    color: '#ffffff',
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  },
  chatMessages: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    borderBottom: '1px solid #ddd',
  },
  message: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
    wordWrap: 'break-word',
  },
  botMessage: {
    backgroundColor: 'blue',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#b4bbc6',
    color: '#ffffff',
    alignSelf: 'flex-end',
    textAlign:'right',
  },
  initialOptions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  yesButton: {
    backgroundColor: '#28a745',
    color: '#ffffff',
    padding: '10px 20px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  noButton: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    padding: '10px 20px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  chatInputContainer: {
    padding: '10px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    color:'black',
  },
  chatInput: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
    marginRight: '10px',
  },
  sendButton: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  sendButtonHover: {
    backgroundColor: '#0056b3',
  },
};