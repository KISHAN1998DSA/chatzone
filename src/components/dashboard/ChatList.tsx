import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useChat } from '../../contexts/ChatContext';
import { PlusCircle, MessageSquare } from 'lucide-react';

const ChatList = () => {
  const { chats, createChat, loading } = useChat();
  const navigate = useNavigate();

  const handleCreateChat = async () => {
    try {
      const chatId = await createChat();
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Chats</h1>
        <Button onClick={handleCreateChat} disabled={loading} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : chats.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <MessageSquare className="h-12 w-12 text-gray-400" />
              <CardTitle>No chats yet</CardTitle>
              <CardDescription>
                Start a new conversation to begin chatting with AI.
              </CardDescription>
              <Button onClick={handleCreateChat} className="mt-2">
                Start Your First Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chats.map((chat) => (
            <Card 
              key={chat.id} 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => handleSelectChat(chat.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{chat.title}</CardTitle>
                <CardDescription>{formatDate(chat.created_at)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">
                  Click to continue this conversation
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList; 