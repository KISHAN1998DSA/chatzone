import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ArrowLeft, Send, Bot, User, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Function to format message content with proper line breaks and code blocks
const formatMessageContent = (content: string) => {
  // Split the content by newlines
  const lines = content.split('\n');
  
  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};

const ChatInterface = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();
  const { messages, currentChat, loading, selectChat, sendMessage } = useChat();
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatId) {
      selectChat(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || sending) return;

    setSending(true);
    try {
      // Clear input immediately to improve UX
      const messageToSend = messageInput.trim();
      setMessageInput('');
      
      await sendMessage(messageToSend);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentChat && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-xl font-semibold mb-4">Chat not found</h2>
        <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBackToDashboard}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="font-semibold">
          {currentChat?.title || 'Loading...'}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center">
              <RotateCw className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading conversation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="h-12 w-12 text-primary/60 mb-4" />
            <h3 className="text-xl font-semibold">Start a conversation</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Send a message to begin chatting with the Google AI assistant.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className="mt-0.5">
                    {message.sender === 'user' ? (
                      <>
                        <AvatarImage src={`https://avatars.dicebear.com/api/initials/${user?.email?.charAt(0) || 'U'}.svg`} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback>
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div className="space-y-1">
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {formatMessageContent(message.content)}
                    </div>
                    <p className="text-xs text-muted-foreground px-1">
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
        
        {/* "AI is typing" indicator */}
        {sending && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-start gap-2 max-w-[80%]">
              <Avatar className="mt-0.5">
                <AvatarImage src="/bot-avatar.png" />
                <AvatarFallback>
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="rounded-lg p-3 text-sm bg-muted flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-foreground/70 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="inline-block w-1.5 h-1.5 bg-foreground/70 rounded-full mx-1 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="inline-block w-1.5 h-1.5 bg-foreground/70 rounded-full ml-1 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            disabled={!currentChat || sending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!messageInput.trim() || !currentChat || sending}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 