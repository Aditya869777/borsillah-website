'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useChat } from './ChatContext';

export default function Page7Contact() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "-20%" });
  const { messages, isTyping, sendMessage, setIsPage7Visible } = useChat();
  useEffect(() => { setIsPage7Visible(isInView); }, [isInView, setIsPage7Visible]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue('');
    await sendMessage(text);
  };

  return (
    <section ref={containerRef} id="page-7" className="relative w-full min-h-screen bg-[#F4F4F8] text-[#1A1A24] overflow-hidden flex flex-col justify-between">
      
      {/* Background Atmosphere - Obsidian & High Tide Navy */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-[120vw] h-[120vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E2DCEF]/80 via-[#F4F4F8]/40 to-[#F4F4F8] blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full px-5 sm:px-8 md:px-24 pt-24 md:pt-48 flex-grow flex flex-col">
        
        {/* SPLIT LAYOUT */}
        <div className="flex flex-col lg:flex-row w-full gap-12 lg:gap-8 mb-20 md:mb-32 items-start justify-between">
          
          {/* LEFT: EDITORIAL TYPOGRAPHY */}
          <div className="w-full lg:w-1/2 flex flex-col pt-8">
            <h1 className="font-beausite text-[16vw] lg:text-[11vw] leading-[0.8] tracking-tighter uppercase flex flex-col">
              <div className="overflow-hidden">
                <motion.span 
                  className="block"
                  initial={{ y: "100%", opacity: 0 }} animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                >
                  LET'S
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span 
                  className="block text-[#1A1A24]/50"
                  initial={{ y: "100%", opacity: 0 }} animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                  TALK
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span 
                  className="block text-[#7042A4]"
                  initial={{ y: "100%", opacity: 0 }} animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                >
                  TEA.
                </motion.span>
              </div>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 1, delay: 0.8 }}
              className="text-lg md:text-xl font-serif text-[#1A1A24]/40 mt-8 max-w-sm"
            >
              Consult with the Borsillah AI to explore custom blending, bulk supply, or our brand heritage.
            </motion.p>
          </div>

          {/* RIGHT: DEDICATED AI INTERFACE */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[480px] xl:w-[540px] h-[500px] md:h-[600px] border border-[#1A1A24]/10 bg-[#F4F4F8]/80 backdrop-blur-xl flex flex-col shadow-2xl relative"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-8 py-6 border-b border-[#1A1A24]/10 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#9B111E] animate-pulse" />
              <span className="font-beausite uppercase tracking-[0.2em] text-sm text-[#1A1A24]">BORSILAH AI</span>
            </div>

            {/* Chat Area */}
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-beausite text-[#1A1A24]/30 mb-2">
                    {msg.role === 'user' ? 'YOU' : 'AI'}
                  </span>
                  <p className={`font-serif text-base leading-relaxed ${msg.role === 'user' ? 'text-[#1A1A24] text-right' : 'text-[#1A1A24]/60'}`}>
                    {msg.content}
                  </p>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex flex-col self-start items-start max-w-[85%]">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-beausite text-[#1A1A24]/30 mb-2">AI</span>
                  <div className="flex gap-2 pt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A24]/40 animate-bounce" style={{ animationDelay: '0ms' }}/>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A24]/40 animate-bounce" style={{ animationDelay: '150ms' }}/>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A24]/40 animate-bounce" style={{ animationDelay: '300ms' }}/>
                  </div>
                </div>
              )}
                          </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="shrink-0 p-6 border-t border-[#1A1A24]/10 bg-[#1A1A24]/[0.05]">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about products, supply, or heritage..."
                  className="w-full bg-transparent border-none text-[#1A1A24] font-sans text-sm focus:outline-none focus:ring-0 placeholder-black/30 pl-2 pr-12 py-3"
                />
                <button 
                  type="submit" 
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 text-[#1A1A24]/40 hover:text-[#1A1A24] disabled:opacity-50 transition-colors p-2"
                >
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M1 7L13 7M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5"/></svg>
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* MASSIVE BRAND FOOTER */}
        <div className="relative w-full mt-auto flex flex-col items-center justify-end pb-8 pt-16">
          
          <div className="w-full flex justify-between items-end px-4 mb-2 text-[10px] md:text-xs font-beausite uppercase tracking-[0.2em] text-[#1A1A24]/40">
            <span>&copy; {new Date().getFullYear()} BORSILAH T.</span>
            <span>CRAFTED WITH INTENT.</span>
            <span>ALL RIGHTS RESERVED.</span>
          </div>

          <div className="w-full overflow-hidden flex justify-center items-center select-none relative">
            <motion.div
              initial={{ y: "100%", opacity: 0 }} 
              whileInView={{ y: 0, opacity: 1 }} 
              viewport={{ once: true, margin: "10%" }} 
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="w-full text-[#1A1A24]"
            >
              <svg viewBox="0 0 1000 200" className="w-full h-auto drop-shadow-sm">
                <text 
                  x="50%" 
                  y="75%" 
                  textAnchor="middle" 
                  fill="currentColor"
                  className="font-serif uppercase"
                  style={{ fontSize: '175px', letterSpacing: '0.02em', fontWeight: 400 }}
                >
                  BORSILLAH
                </text>
              </svg>
            </motion.div>
          </div>
        </div>
        
      </div>
    </section>
  );
}









