'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    // Artificial progress up to 85% while waiting for massive assets
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 12;
      if (currentProgress > 85) currentProgress = 85; 
      setProgress(Math.floor(currentProgress));
    }, 300);

    const handleLoad = () => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsLoaded(true);
        document.body.style.overflow = ''; // Restore scrolling
        window.scrollTo(0, 0); // Ensure we start at the top
      }, 600);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100vh', transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center"
        >
          {/* Elegant Borsillah typography */}
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-beausite text-5xl md:text-7xl text-[#F5F5F0] tracking-[0.2em] uppercase"
            >
              Borsillah
            </motion.h1>
          </div>
          
          {/* Progress number */}
          <div className="mt-12 font-mono text-sm tracking-widest text-[#F5F5F0]/50">
            {progress}%
          </div>
          
          {/* Progress bar */}
          <div className="w-48 md:w-64 h-[1px] bg-white/10 mt-4 relative overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-[#9B111E]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
