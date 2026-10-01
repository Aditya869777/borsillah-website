'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('borsillah_cookie_consent');
    if (!consent) {
      // Small delay for cinematic entrance
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('borsillah_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-8 right-8 z-[100] max-w-sm bg-[#050505]/90 backdrop-blur-md border border-white/10 p-6 shadow-2xl"
        >
          <div className="flex flex-col gap-4">
            <h4 className="font-beausite uppercase tracking-widest text-[#F5F5F0] text-sm">We Collect Cookies</h4>
            <p className="font-serif text-white/50 text-xs leading-relaxed">
              To provide you with a premium, tailored experience on our platform, we use cookies. By continuing, you agree to our digital tracking standards.
            </p>
            <button 
              onClick={acceptCookies}
              className="mt-2 self-start font-beausite uppercase tracking-widest text-xs text-[#050505] bg-[#F5F5F0] px-6 py-3 hover:bg-white transition-colors"
            >
              ACCEPT
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
