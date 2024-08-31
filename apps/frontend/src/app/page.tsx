"use client";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Home() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [bookingStarted, setBookingStarted] = useState<boolean>(false);
  const [optionSelected, setOptionSelected] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [userData, setUserData] = useState<{ [key: string]: string }>({});
  const [emailVerified, setEmailVerified] = useState<boolean>(false); // Track email submission status

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Replace with your actual API base URL

  const questions = [
    "What's your name?",
    "What is your UID type?",
    "What is your UID no.?",
    "Enter the email for verification?",
    "Enter OTP?",
    "What's your date for the visit?",
    "How many tickets do you need?",
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
          setCurrentQuestion(0); // Start with the first question in the new sequence
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
        const questionKey = getQuestionKey(currentQuestion);
        setUserData((prevData) => ({
          ...prevData,
          [questionKey]: message,
        }));

        if (currentQuestion === 3) {
          handleEmailInput(message); // Store email as soon as it is entered
        } else if (currentQuestion === 5 && selectedDate) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'user', text: selectedDate.toDateString() },
            { sender: 'bot', text: questions[currentQuestion + 1] }
          ]);
          setUserData((prevData) => ({
            ...prevData,
            'date_for_visit': selectedDate.toDateString(), // Store selected date in userData
          }));
          setCurrentQuestion((prev) => prev + 1);
          setSelectedDate(null); // Reset the date picker for the next question
        } else if (currentQuestion < questions.length - 1) {
          if (currentQuestion === 4 && !emailVerified) {
            // Do not proceed to next question if email submission is not successful
            return;
          }
          setCurrentQuestion((prev) => prev + 1);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: questions[currentQuestion + 1] },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: 'Thank you for providing the information!' },
          ]);
          setTimeout(() => {
            setShowChatbot(false);
          }, 2000);
        }
      }
    }
  };

  const getQuestionKey = (index: number) => {
    switch (index) {
      case 0: return 'name';
      case 1: return 'UID_type';
      case 2: return 'UID';
      case 3: return 'email';
      case 4: return 'OTP';
      case 5: return 'date_for_visit';
      case 6: return 'ticket_count';
      default: return '';
    }
  };

  const handleEmailInput = async (email: string) => {
    setUserData((prevData) => ({
      ...prevData,
      email,
    }));

    const datatosend = { ...userData, email }
    console.log(datatosend)

    try {
      const response = await fetch(`${apiBaseUrl}/user/getinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datatosend),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log(result)
          sendMessage(email, 'user');
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: 'An error occurred while processing your data. Please enter your email again.' },
          ]);
          setInputValue('');
        }
      } else {
        // Handle HTTP errors
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'An error occurred while processing your data. Please enter your email again.' },
        ]);
        setInputValue('');
        setEmailVerified(false); // Ensure email is not verified
      }
    } catch (error) {
      // Handle fetch errors
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'An error occurred while processing your data. Please enter your email again.' },
      ]);
      setInputValue('');
      setEmailVerified(false); // Ensure email is not verified
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setInputValue(date.toDateString());
      sendMessage(date.toDateString(), 'user');
    }
  };

  const handleSendButtonClick = () => {
    if (currentQuestion === 5 && selectedDate) {
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#e0e5ec] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("himan.jpg")' }}>
      <header className="text-center mb-[500px] p-5 bg-[#cdf0ff] shadow-lg rounded-lg w-4/5 max-w-[600px]">
        <h1 className="text-[#333] text-3xl m-0">Chatbot Interface</h1>
      </header>
      <div className="fixed bottom-5 right-5">
        <button
          className={`w-16 h-16 p-2 text-lg font-semibold text-white bg-[#1e1f1f] border-none rounded-full shadow-lg transition-transform ${showChatbot ? 'bg-[#0056b3] translate-y-[-2px]' : ''}`}
          onClick={toggleChatbot}
        >
          {showChatbot ? 'Close' : <img src="aichatbot.png" alt="Chatbot" className="w-12 h-12" />}
        </button>
      </div>

      {showChatbot && (
        <div className="fixed bottom-5 right-5 w-[350px] h-[450px] rounded-lg bg-white shadow-lg flex flex-col">
          <div className="bg-[#114378] text-white p-2 text-center cursor-pointer rounded-t-lg" onClick={toggleChatbot}>
            Chatbot
          </div>
          <div className="flex-1 p-2 overflow-y-auto border-b border-gray-300">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg max-w-[80%] break-words ${message.sender === 'user' ? 'bg-[#b4bbc6] text-white ml-auto text-right' : 'bg-blue-500 text-white'}`}
              >
                {message.text}
              </div>
            ))}
            {!bookingStarted && !optionSelected && (
              <div className="flex justify-center mt-2">
                <button className="bg-[#28a745] text-white p-2 mx-1 rounded cursor-pointer" onClick={() => sendMessage('yes', 'user')}>
                  Yes
                </button>
                <button className="bg-[#dc3545] text-white p-2 mx-1 rounded cursor-pointer" onClick={() => sendMessage('no', 'user')}>
                  No
                </button>
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-300 flex items-center">
            {currentQuestion === 5 ? (
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText="Select a date"
                className="flex-1 p-2 text-sm bg-white text-black border border-gray-300 rounded mr-2"
              />
            ) : (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type your message..."
                className="flex-1 p-2 text-sm bg-white text-black border border-gray-300 rounded mr-2"
              />
            )}
            <button
              className={`bg-[#007bff] text-white border-none p-2 rounded cursor-pointer transition-colors ${inputValue || selectedDate ? 'bg-[#0056b3]' : ''}`}
              onClick={handleSendButtonClick}
              disabled={currentQuestion === 4 && !emailVerified} // Disable send button if email is not verified
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
