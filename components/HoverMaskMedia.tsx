'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface HoverMaskMediaProps {
  revealMedia: string; // URL to mp4, jpg, png
  baseMedia?: string; // Optional URL for background
  baseFilter?: string; // e.g., 'grayscale(100%)'
  maskSize?: number;
  softness?: number; // 0 to 100 (%)
  followStrength?: number; // 0.01 to 1 (higher = faster follow)
  smoothing?: number;
  className?: string;
  isMobileFullscreen?: boolean; // If true, completely reveals on mobile
}

export default function HoverMaskMedia({
  revealMedia,
  baseMedia,
  baseFilter,
  maskSize = 400,
  softness = 60,
  followStrength = 0.1,
  className = '',
  isMobileFullscreen = true,
}: HoverMaskMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const isVideo = revealMedia.toLowerCase().endsWith('.mp4') || revealMedia.toLowerCase().endsWith('.webm');
  
  const [isTouch, setIsTouch] = useState(false);

  // Physics state
  const target = useRef({ x: 0, y: 0, active: 0 }); // active 0..1 (fades in/out)
  const current = useRef({ x: 0, y: 0, active: 0, velX: 0, velY: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    }

    const container = containerRef.current;
    if (!container) return;

    // Initialize to center
    const rect = container.getBoundingClientRect();
    target.current.x = rect.width / 2;
    target.current.y = rect.height / 2;
    current.current.x = rect.width / 2;
    current.current.y = rect.height / 2;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const bcr = container.getBoundingClientRect();
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      target.current.x = clientX - bcr.left;
      target.current.y = clientY - bcr.top;
    };

    const handleMouseEnter = () => {
      target.current.active = 1;
    };

    const handleMouseLeave = () => {
      target.current.active = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleMouseMove, { passive: false });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('touchstart', handleMouseEnter, { passive: false });
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchend', handleMouseLeave);

    const loop = () => {
      const dt = 16.66; // approx 60fps delta
      
      // Lerp positions
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      
      current.current.x += dx * followStrength;
      current.current.y += dy * followStrength;

      // Track velocity for stretch/scale
      current.current.velX = dx;
      current.current.velY = dy;
      
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      // Lerp active state (fade in/out)
      current.current.active += (target.current.active - current.current.active) * 0.08;

      if (mediaContainerRef.current) {
        // Expand mask slightly based on speed (organic stretch feel)
        const dynamicSize = maskSize + Math.min(speed * 0.5, maskSize * 0.4);
        
        // CSS Mask variables
        const el = mediaContainerRef.current;
        el.style.setProperty('--mx', `${current.current.x}px`);
        el.style.setProperty('--my', `${current.current.y}px`);
        el.style.setProperty('--msize', `${dynamicSize}px`);
        el.style.setProperty('--malpha', `${current.current.active}`);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('touchstart', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchend', handleMouseLeave);
    };
  }, [followStrength, maskSize]);

  // Determine mobile handling
  const applyMobileReveal = isTouch && isMobileFullscreen;

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        // Define base variables for the mask
        '--msoftness': `${softness}%`,
      } as React.CSSProperties}
    >
      {/* BASE LAYER (Optional) */}
      {baseMedia && (
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {baseMedia.endsWith('.mp4') ? (
            <video src={baseMedia} autoPlay loop muted playsInline className="w-full h-full object-cover scale-[1.05]" style={baseFilter ? { filter: baseFilter } : undefined} />
          ) : (
            <img src={baseMedia} alt="Base" className="w-full h-full object-cover scale-[1.05]" style={baseFilter ? { filter: baseFilter } : undefined} />
          )}
        </div>
      )}

      {/* REVEAL LAYER */}
      <div 
        ref={mediaContainerRef}
        className="absolute inset-0 z-10 w-full h-full pointer-events-none flex items-center justify-center"
        style={applyMobileReveal ? {
          opacity: 1, // Full reveal on mobile
        } : {
          // Desktop: CSS Masking
          WebkitMaskImage: `radial-gradient(circle, rgba(0,0,0,var(--malpha, 0)) 0%, rgba(0,0,0,0) var(--msoftness))`,
          WebkitMaskSize: `var(--msize) var(--msize)`,
          WebkitMaskPosition: `calc(var(--mx) - var(--msize)/2) calc(var(--my) - var(--msize)/2)`,
          WebkitMaskRepeat: 'no-repeat',
          maskImage: `radial-gradient(circle, rgba(0,0,0,var(--malpha, 0)) 0%, rgba(0,0,0,0) var(--msoftness))`,
          maskSize: `var(--msize) var(--msize)`,
          maskPosition: `calc(var(--mx) - var(--msize)/2) calc(var(--my) - var(--msize)/2)`,
          maskRepeat: 'no-repeat',
          willChange: 'mask-position, mask-size, -webkit-mask-position, -webkit-mask-size',
        }}
      >
        {isVideo ? (
          <video 
            src={revealMedia} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-[1.05]"
            style={{ filter: 'contrast(1.25) saturate(1.3) brightness(1.05)' }}
          />
        ) : (
          <img 
            src={revealMedia} 
            alt="Reveal" 
            className="w-full h-full object-cover scale-[1.05]"
            style={{ filter: 'contrast(1.25) saturate(1.3) brightness(1.05)' }}
          />
        )}
      </div>
    </div>
  );
}


