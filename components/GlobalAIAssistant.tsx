'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from './ChatContext';

export default function GlobalAIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const { messages, isTyping, sendMessage, isPage7Visible } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isExpanded]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!hasInteracted) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!hasInteracted) setIsExpanded(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setHasInteracted(true);
    const text = inputValue;
    setInputValue('');
    await sendMessage(text);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setHasInteracted(false);
  };

  // Prevent closing when clicking inside
  const handlePanelClick = () => {
    if (!isExpanded) setIsExpanded(true);
    setHasInteracted(true);
  };

  return (
    <AnimatePresence>
    {!isPage7Visible && (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-8 right-8 z-[100] flex flex-col items-end"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        layout
        onClick={handlePanelClick}
        initial={false}
        animate={{ 
          width: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 'calc(100vw - 64px)' : 380) : 160,
          height: isExpanded ? 500 : 52,
          borderRadius: isExpanded ? 16 : 30,
          backgroundColor: isExpanded ? '#050505' : '#1A1A24', // Midnight Plum for the pill
          borderColor: isExpanded ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
        }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.15 }}
        className="relative overflow-hidden border shadow-2xl backdrop-blur-md cursor-pointer flex flex-col"
        style={{ originX: 1, originY: 1 }}
      >
        {/* COMPACT CAPSULE CONTENT */}
        <AnimatePresence mode="wait">
          {!isExpanded && (
            <motion.div 
              key="compact"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center gap-3 w-full h-full"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#9B111E] animate-pulse" />
              <span className="font-beausite uppercase tracking-[0.2em] text-[11px] font-semibold text-[#F5F5F0]">
                ASK AI
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EXPANDED PANEL CONTENT */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col h-full w-full"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#9B111E] animate-pulse" />
                  <span className="font-beausite uppercase tracking-widest text-xs text-[#F5F5F0]">BORSILAH AI</span>
                </div>
                {hasInteracted && (
                  <button onClick={handleClose} className="text-white/40 hover:text-white transition-colors p-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </button>
                )}
              </div>

              {/* CHAT AREA */}
              <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                    <span className="text-[9px] uppercase tracking-widest font-beausite text-white/30 mb-1.5">
                      {msg.role === 'user' ? 'YOU' : 'AI'}
                    </span>
                    <p className={`font-serif text-sm leading-relaxed ${msg.role === 'user' ? 'text-[#F5F5F0] text-right' : 'text-white/70'}`}>
                      {msg.content}
                    </p>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex flex-col self-start items-start max-w-[85%]">
                    <span className="text-[9px] uppercase tracking-widest font-beausite text-white/30 mb-1.5">AI</span>
                    <div className="flex gap-1.5 pt-2">
                      <div className="w-1 h-1 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }}/>
                      <div className="w-1 h-1 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }}/>
                      <div className="w-1 h-1 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }}/>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT AREA */}
              <form onSubmit={handleSubmit} className="shrink-0 p-4 border-t border-white/5 bg-white/[0.02]">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about products, supply, or heritage..."
                    className="w-full bg-transparent border-none text-[#F5F5F0] font-sans text-xs focus:outline-none focus:ring-0 placeholder-white/30 pl-2 pr-10 py-2"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-2 text-white/40 hover:text-white disabled:opacity-50 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7L13 7M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>
  );
}



