'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform, animate } from 'framer-motion';

const capabilities = [
  { 
    id: '01', 
    title: 'B2B SUPPLY', 
    desc: 'Direct from the estates. We manage the entire supply chain to ensure unbroken provenance and high-volume delivery for global retail.'
  },
  { 
    id: '02', 
    title: 'CONSISTENT QUALITY', 
    desc: 'Rigorous cupping and scientific grading. Every batch is analyzed to maintain your exact flavor profile and standards across seasons.'
  },
  { 
    id: '03', 
    title: 'CUSTOM SOLUTIONS', 
    desc: 'Bespoke blending, private label packaging, and flavor matching designed exclusively for your brand\'s unique market position.'
  },
  { 
    id: '04', 
    title: 'PARTNERSHIP & SCALE', 
    desc: 'From boutique orders to multi-ton container shipments, our manufacturing infrastructure scales seamlessly with your business growth.'
  }
];

function Counter({ from, to, suffix = "", duration = 2 }: { from: number, to: number, suffix?: string, duration?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = Math.round(value) + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, inView, suffix, duration]);

  return <span ref={nodeRef}>{from}{suffix}</span>;
}

export default function Page6Business() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });
  const [activeCapability, setActiveCapability] = useState(0);

  // Parallax for the company image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  // Staggered letters
  const headline = "BUILT FOR BUSINESS.";
  const words = headline.split(" ");

  return (
    <section ref={containerRef} id="page-6" className="relative w-full min-h-screen bg-[#7851A9] text-[#F5F5F0] overflow-hidden flex flex-col py-32">
      
      {/* 1. OPENING VISUAL - BUILT FOR BUSINESS */}
      <div className="relative w-full px-8 md:px-24 mb-48 pt-24">
        <h1 className="font-beausite text-[12vw] leading-[0.85] tracking-tight uppercase flex flex-col">
          {words.map((word, wordIdx) => (
            <div key={wordIdx} className="overflow-hidden flex">
              {word.split("").map((letter, letterIdx) => (
                <motion.span
                  key={letterIdx}
                  className={`inline-block ${word === 'BUSINESS.' ? 'text-[#9B111E]' : word === 'FOR' ? 'text-[#F5F5F0]/50' : 'text-[#F5F5F0]'}`}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.19, 1, 0.22, 1], 
                    delay: 0.1 + (wordIdx * 0.2) + (letterIdx * 0.03) 
                  }}
                >
                  {letter}
                </motion.span>
              ))}
              {/* Space between words if inline, but here they are stacked blocks */}
            </div>
          ))}
        </h1>
      </div>

      {/* 2. BUSINESS CAPABILITIES */}
      <div className="relative w-full px-8 md:px-24 flex flex-col mb-48 gap-16 min-h-[50vh]">
        <motion.p 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-sm font-serif tracking-[0.2em] text-[#F5F5F0]/40 mb-8"
        >
          B2B CAPABILITY
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
          {capabilities.map((cap, idx) => (
            <motion.div 
              key={cap.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col group"
            >
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-sm font-serif text-[#9B111E] tracking-widest">{cap.id}</span>
                <h3 className="text-3xl md:text-5xl font-beausite uppercase tracking-tight text-[#F5F5F0] group-hover:text-[#F5F5F0]/80 transition-colors">
                  {cap.title}
                </h3>
              </div>
              <p className="text-lg font-serif text-[#F5F5F0]/50 leading-relaxed max-w-md pl-12 group-hover:text-[#F5F5F0]/70 transition-colors">
                {cap.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. FACTS / COMPANY SCALE */}
      <div className="relative w-full px-8 md:px-24 mb-48 flex flex-col md:flex-row justify-between items-start gap-24">
        <div className="w-full md:w-1/3">
           <p className="text-sm font-serif tracking-[0.2em] text-[#F5F5F0]/40 uppercase">The Scale</p>
        </div>
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-32">
          
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1, ease: "easeOut" }}>
            <h4 className="text-[8vw] md:text-8xl font-beausite tracking-tighter text-[#F5F5F0]">
              <Counter from={0} to={120} suffix="+" duration={2.5} />
            </h4>
            <p className="font-serif text-[#F5F5F0]/40 tracking-widest mt-2 uppercase text-sm">Years of Heritage</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}>
            <h4 className="text-[8vw] md:text-8xl font-beausite tracking-tighter text-[#F5F5F0]">
              <Counter from={0} to={50} suffix="+" duration={2} />
            </h4>
            <p className="font-serif text-[#F5F5F0]/40 tracking-widest mt-2 uppercase text-sm">Global Partners</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}>
            <h4 className="text-[8vw] md:text-8xl font-beausite tracking-tighter text-[#F5F5F0]">
              <Counter from={0} to={15} suffix="M" duration={2} />
            </h4>
            <p className="font-serif text-[#F5F5F0]/40 tracking-widest mt-2 uppercase text-sm">KGs Produced Annually</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}>
            <h4 className="text-[8vw] md:text-8xl font-beausite tracking-tighter text-[#F5F5F0]">
              <Counter from={0} to={24} duration={1.5} />
            </h4>
            <p className="font-serif text-[#F5F5F0]/40 tracking-widest mt-2 uppercase text-sm">Export Markets</p>
          </motion.div>

        </div>
      </div>

      {/* EDITORIAL DIVIDER */}
      <div className="w-full px-8 md:px-24 mb-48 flex justify-center">
        <motion.div 
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-20%" }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[1px] bg-[#F5F5F0]/10 origin-center" 
        />
      </div>

      {/* 4. THE COMPANY */}
      <div className="relative w-full px-8 md:px-24 mb-32">
        <div className="overflow-hidden mb-8">
          <motion.h2 
            initial={{ y: "100%", opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="text-6xl md:text-[8vw] font-beausite uppercase tracking-tight leading-none"
          >
            THE COMPANY
          </motion.h2>
        </div>
        <motion.p 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
          className="text-xl md:text-3xl font-serif text-[#F5F5F0]/60 max-w-2xl"
        >
          Built on experience. <br/>Designed for what comes next.
        </motion.p>
      </div>

      <div className="relative w-full px-8 md:px-24 mb-32 flex flex-col md:flex-row items-end gap-12">
        <div className="w-full md:w-2/3 h-[60vh] relative overflow-hidden rounded-sm">
          <motion.img 
            style={{ y: imageY, scale: 1.15 }}
            src="/assets/gallery/3.jpg" 
            alt="Company Heritage" 
            className="absolute inset-0 w-full h-full object-cover sepia-[0.2] saturate-[0.8]" 
          />
        </div>
        
        <div className="w-full md:w-1/3 flex flex-col space-y-12 pb-8">
          {[
            { label: "ESTABLISHED", val: "1902", color: "text-[#F5F5F0]/40", border: "border-[#F5F5F0]/10" },
            { label: "BASED IN", val: "ASSAM, INDIA", color: "text-[#F5F5F0]/40", border: "border-[#F5F5F0]/10" },
            { label: "FOCUS", val: "PREMIUM B2B SUPPLY", color: "text-[#9B111E]", border: "border-[#9B111E]/50" }
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
              className={`flex flex-col border-l ${item.border} pl-6`}
            >
              <span className={`text-xs ${item.color} font-serif tracking-[0.2em] mb-1`}>{item.label}</span>
              <span className="text-2xl font-beausite tracking-wide">{item.val}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. FINAL STATEMENT */}
      <div className="relative w-full px-8 md:px-24 py-48 flex justify-center text-center">
        <div className="overflow-hidden">
          <motion.h3 
            initial={{ y: "100%", opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-20%" }} transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="text-4xl md:text-7xl font-beausite uppercase tracking-tight text-[#F5F5F0]"
          >
            BUILT FOR WHAT <span className="text-[#F5F5F0]/30 italic">COMES NEXT.</span>
          </motion.h3>
        </div>
      </div>

    </section>
  );
}


