import React from 'react';
import ChatInterface from '../components/chat/ChatInterface';
import Navbar from '../components/layout/Navbar';

const ChatPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ChatInterface />
      </main>
    </div>
  );
};

export default ChatPage; 