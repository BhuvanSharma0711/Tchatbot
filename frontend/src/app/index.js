// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>My Project</h1>
      </header>

      <button style={styles.chatButton} onClick={toggleChatbot}>
        {showChatbot ? 'Close Chat' : 'Chat with us!'}
      </button>

      {showChatbot && (
        <div style={styles.chatbotContainer}>
          <div style={styles.chatHeader}>
            <h3>AI Chatbot</h3>
            <button onClick={toggleChatbot} style={styles.closeButton}>X</button>
          </div>
          <div style={styles.chatBody}>
            {/* Chat messages will go here */}
            <p>Hello! How can I help you today?</p>
          </div>
          <div style={styles.chatInputContainer}>
            <input type="text" placeholder="Type a message..." style={styles.chatInput} />
            <button style={styles.sendButton}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#f4f4f4',
  },
  header: {
    textAlign: 'center',
  },
  chatButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  chatbotContainer: {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '300px',
    height: '400px',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
  chatBody: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
  },
  chatInputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ddd',
  },
  chatInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    marginRight: '10px',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};
