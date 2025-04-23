import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Chat, Message } from '../lib/supabase';
import { useAuth } from './AuthContext';

// Random AI responses for demonstration
const AI_RESPONSES = [
  "I'm thinking about that, give me a moment...",
  "That's an interesting question!",
  "I don't have all the answers, but here's what I think.",
  "Let me search my knowledge base for that...",
  "Have you considered looking at the problem from a different angle?",
  "That's a great point! Here's another perspective to consider.",
  "I'm not entirely sure, but my best guess would be...",
  "According to my training, the answer might be...",
  "I'm learning too, and that's a fascinating topic!",
  "Let me help you think through this problem."
];

interface ChatContextProps {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  createChat: () => Promise<string>;
  selectChat: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's chats when logged in
  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setChats([]);
      setCurrentChat(null);
      setMessages([]);
    }
  }, [user]);

  // Subscribe to messages when a chat is selected
  useEffect(() => {
    if (!currentChat) return;

    const messageSubscription = supabase
      .channel(`messages:${currentChat.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `chat_id=eq.${currentChat.id}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [currentChat]);

  const fetchChats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const createChat = async () => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const title = `Chat ${new Date().toLocaleString()}`;
      const { data, error } = await supabase
        .from('chats')
        .insert([{ user_id: user.id, title }])
        .select('*')
        .single();
      
      if (error) throw error;
      
      setChats(prev => [data, ...prev]);
      setCurrentChat(data);
      setMessages([]);
      return data.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (chatId: string) => {
    setLoading(true);
    try {
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .single();
      
      if (chatError) throw chatError;
      setCurrentChat(chatData);
      
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      
      if (messageError) throw messageError;
      setMessages(messageData || []);
    } catch (error) {
      console.error('Error selecting chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !currentChat) throw new Error('Chat not selected or user not authenticated');
    
    setLoading(true);
    try {
      // Insert user message
      const { error: userMessageError } = await supabase
        .from('messages')
        .insert([{
          chat_id: currentChat.id,
          content,
          sender: 'user',
        }]);
      
      if (userMessageError) throw userMessageError;
      
      // Generate random AI response
      const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      
      // Simulate AI processing time
      setTimeout(async () => {
        const { error: aiMessageError } = await supabase
          .from('messages')
          .insert([{
            chat_id: currentChat.id,
            content: aiResponse,
            sender: 'ai',
          }]);
        
        if (aiMessageError) console.error('Error sending AI message:', aiMessageError);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!currentChat || messages.length === 0) return;
    
    setLoading(true);
    try {
      const oldestMessageDate = messages[0].created_at;
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', currentChat.id)
        .lt('created_at', oldestMessageDate)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setMessages(prev => [...data.reverse(), ...prev]);
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      currentChat,
      messages,
      loading,
      createChat,
      selectChat,
      sendMessage,
      loadMoreMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 