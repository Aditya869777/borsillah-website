'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // Phase 1: progress bar runs 0→100 over ~3.2 seconds
    const startTime = performance.now();
    const DURATION = 3400; // ms — minimum display time
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = elapsed / DURATION;
      // Ease-out curve so it slows near 100%
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 3);
      setProgress(Math.floor(eased * 100));
      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);

    // Phase 2: after fonts + 3.5s minimum, dismiss
    const dismiss = () => {
      setProgress(100);
      setPhase('exit');
      setTimeout(() => {
        setIsLoaded(true);
        document.body.style.overflow = '';
        window.scrollTo(0, 0);
      }, 900);
    };

    const minWait = new Promise<void>(res => setTimeout(res, 3500));
    const fontWait = document.fonts?.ready ?? Promise.resolve();
    Promise.all([minWait, fontWait]).then(dismiss);

    // Hard cap at 6s no matter what
    const cap = setTimeout(dismiss, 6000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cap);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100vh', opacity: 0, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-center"
        >
          {/* ── Animated Liquid Background ── */}
          <div className="absolute inset-0 bg-[#04040a]">
            {/* Blob 1 — deep amber */}
            <motion.div
              className="absolute rounded-full blur-[120px] opacity-30"
              style={{ width: '60vw', height: '60vw', background: 'radial-gradient(circle, #7C2D12 0%, #9B111E 60%, transparent 100%)', top: '-10%', left: '-10%' }}
              animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0], scale: [1, 1.15, 0.95, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Blob 2 — violet plum */}
            <motion.div
              className="absolute rounded-full blur-[140px] opacity-25"
              style={{ width: '50vw', height: '50vw', background: 'radial-gradient(circle, #4C1D95 0%, #7C3AED 60%, transparent 100%)', bottom: '-15%', right: '-10%' }}
              animate={{ x: [0, -50, 30, 0], y: [0, -40, 20, 0], scale: [1, 0.9, 1.1, 1] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
            {/* Blob 3 — gold accent */}
            <motion.div
              className="absolute rounded-full blur-[100px] opacity-20"
              style={{ width: '40vw', height: '40vw', background: 'radial-gradient(circle, #92400E 0%, #D97706 60%, transparent 100%)', top: '40%', left: '30%' }}
              animate={{ x: [0, 60, -30, 0], y: [0, -50, 25, 0], scale: [1, 1.2, 0.85, 1] }}
              transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            {/* Fine grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '128px 128px',
            }} />
          </div>

          {/* ── Image Mask Text — BORSILLAH ── */}
          <div className="relative z-10 flex flex-col items-center gap-10 select-none">

            {/* Main masked heading */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                className="font-beausite uppercase leading-none tracking-[-0.02em] text-center"
                style={{
                  fontSize: 'clamp(3.5rem, 14vw, 12rem)',
                  backgroundImage: 'url(/assets/gallery/3.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'brightness(1.3) saturate(1.2)',
                }}
              >
                BORSILLAH
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[#F5F5F0]/40 tracking-[0.35em] uppercase text-xs text-center"
            >
              Est. 1902 &nbsp;·&nbsp; Assam, India
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-[min(280px,60vw)] flex flex-col items-end gap-2"
            >
              <span className="text-[10px] tracking-[0.3em] font-mono text-[#F5F5F0]/25 uppercase">
                {progress < 100 ? `Loading ${progress}%` : 'Ready'}
              </span>
              <div className="w-full h-[1px] bg-white/8 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #9B111E, #D97706, #7C3AED)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </motion.div>

          </div>

          {/* ── Corner mark ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-8 left-8 text-[#F5F5F0]/15 text-[10px] tracking-[0.25em] uppercase font-mono"
          >
            Premium B2B Tea
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-8 right-8 text-[#F5F5F0]/15 text-[10px] tracking-[0.25em] uppercase font-mono"
          >
            15M KG / Year
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
