'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isTyping: boolean;
  isPage7Visible: boolean;
  setIsPage7Visible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: (text: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to Borsillah. How may I assist you with our premium B2B tea supply?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPage7Visible, setIsPage7Visible] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: text } as Message];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      });

      const data = await response.json();
      
      const reply = data.content || 'Our tea consultants are momentarily indisposed. Please try again shortly.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I am currently experiencing a high volume of requests. Please try again shortly.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, setMessages, isTyping, setIsTyping, sendMessage, isPage7Visible, setIsPage7Visible }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

