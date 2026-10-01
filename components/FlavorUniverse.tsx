'use client';

import React, { useEffect, useRef, useState } from 'react';

interface FlavorUniverseProps {
  scrollProgress: number; // 0 to 1 across Page 3
  isVisible: boolean;
}

interface FlavorData {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  cupColor: string;
  notes: string[];
  description: string;
  elevation: string;
  liquorColor: string;
  accentColor: string;
}

const FLAVORS: FlavorData[] = [
  {
    id: 'robust-ctc',
    number: '01',
    name: 'ROBUST CTC',
    subtitle: 'Malty & Full-Bodied',
    cupColor: 'Handcrafted Terracotta Glaze',
    notes: ['Dark Malt', 'Caramel', 'Cocoa Shell'],
    description: 'High-fired granular CTC with intense amber depth and brisk, authoritative body. Engineered for traditional milk brewing and morning vitality.',
    elevation: '520m Upper Assam Valley',
    liquorColor: 'Deep Ruby Amber',
    accentColor: '#cf7234',
  },
  {
    id: 'centennial-gold',
    number: '02',
    name: 'CENTENNIAL GOLD',
    subtitle: 'Muscatel & Silken',
    cupColor: 'Bone Ceramic Pure Glaze',
    notes: ['Wild Honey', 'Muscatel', 'Toasted Pine'],
    description: 'Our crown single-estate harvest. Whole-leaf golden tips yield a silken liquor with sweet muscatel fragrance and lingering floral finish.',
    elevation: '610m Centennial Heritage Block',
    liquorColor: 'Shimmering Sunlit Gold',
    accentColor: '#cf9b34',
  },
  {
    id: 'estate-green',
    number: '03',
    name: 'ESTATE GREEN',
    subtitle: 'Fresh & Vegetal',
    cupColor: 'Sage Earth Ceramic Glaze',
    notes: ['Fresh Dew', 'Sweet Grass', 'Bamboo Shoots'],
    description: 'First flush tender shoots delicately pan-steamed at dawn to lock in living polyphenols. Exceptionally crisp with mineral sweetness.',
    elevation: '680m Mist Terraces',
    liquorColor: 'Pale Jade Green',
    accentColor: '#5b8c5a',
  },
];

export default function FlavorUniverse({ scrollProgress, isVisible }: FlavorUniverseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [selectedFlavorId, setSelectedFlavorId] = useState<string>('centennial-gold');
  const [hoveredFlavorId, setHoveredFlavorId] = useState<string | null>(null);

  const totalP3Frames = 240;

  // Preload Page 3 transparent PNG frames
  useEffect(() => {
    let isCancelled = false;
    const imgs: HTMLImageElement[] = new Array(totalP3Frames);
    framesRef.current = imgs;
    let loaded = 0;

    for (let i = 1; i <= totalP3Frames; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `/cups_keyed/frame_${String(i).padStart(4, '0')}.png`;
      const idx = i - 1;
      img.onload = () => {
        if (isCancelled) return;
        imgs[idx] = img;
        loaded++;
        setLoadedCount(loaded);
      };
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  // Canvas drawing loop linked to scrollProgress
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate frame and position based on scrollProgress
    // Progress 0.0 -> 0.32: Single white cup enters and floats downward in slow motion (frames 0 to 35)
    // Progress 0.32 -> 1.0: Other 2 cups emerge and rotate in balanced 3-cup constellation (frames 36 to 239)
    let frameIdx = 0;
    const targetY = height * 0.47;
    let drawY = targetY;

    if (scrollProgress < 0.32) {
      const enterProgress = Math.max(0, scrollProgress / 0.32);
      frameIdx = Math.min(35, Math.floor(enterProgress * 35));
      // Ease in-out float down
      const ease = enterProgress < 0.5 
        ? 2 * enterProgress * enterProgress 
        : -1 + (4 - 2 * enterProgress) * enterProgress;
      drawY = (height * 0.36) + (ease * (targetY - height * 0.36));
    } else {
      const constellationProgress = Math.min(1, Math.max(0, (scrollProgress - 0.32) / 0.68));
      frameIdx = 36 + Math.min(203, Math.floor(constellationProgress * 203));
      drawY = targetY;
    }

    ctx.clearRect(0, 0, width, height);

    const img = framesRef.current[frameIdx];
    if (img && img.complete && img.naturalWidth > 0) {
      // Scale cups cleanly to stay in optical center without overlapping header or footer
      const scale = Math.min(width / 1600, height / 1050) * 0.80;
      const dw = 1280 * scale;
      const dh = 720 * scale;
      const dx = (width * 0.5) - (dw / 2);
      const dy = drawY - (dh / 2);

      ctx.save();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    }
  }, [scrollProgress, loadedCount]);

  const activeFlavor = FLAVORS.find((f) => f.id === (hoveredFlavorId || selectedFlavorId)) || FLAVORS[1];

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center select-none overflow-hidden px-6 md:px-16 pt-28 md:pt-32 pb-6 md:pb-8">
      
      {/* 
        Background Depth Architecture: 
        Dynamic Ambient Glow matching Active Flavor + Sub-vignette + Nocturnal Assam Estate Palette
      */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 47%, ${activeFlavor.accentColor}18 0%, rgba(91, 96, 56, 0.08) 32%, rgba(6, 11, 8, 0.95) 70%, #060b08 100%)`,
        }}
      />

      {/* Subtle Architectural Hairline Corner Accents */}
      <div className="absolute top-28 left-8 text-white/20 font-mono text-xs pointer-events-none hidden md:block">+</div>
      <div className="absolute top-28 right-8 text-white/20 font-mono text-xs pointer-events-none hidden md:block">+</div>
      <div className="absolute bottom-8 left-8 text-white/20 font-mono text-xs pointer-events-none hidden md:block">+</div>
      <div className="absolute bottom-8 right-8 text-white/20 font-mono text-xs pointer-events-none hidden md:block">+</div>

      {/* TOP EDITORIAL HEADING LAYER (Cormorant Garamond / Beausite + DM Mono) */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl pointer-events-none mt-1">
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md mb-2.5">
          <span 
            className="w-1.5 h-1.5 rounded-full transition-colors duration-300 animate-pulse" 
            style={{ backgroundColor: activeFlavor.accentColor }}
          />
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.28em] text-[#cf9b34]">
            03 // THE FLAVOR UNIVERSE
          </span>
        </div>

        <h2 
          className="font-beausite uppercase font-extralight tracking-[0.04em] leading-[1.0] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f3eee1] to-white/70"
          style={{ 
            fontWeight: 200,
            textShadow: '0 0 45px rgba(255, 255, 255, 0.18), 0 4px 24px rgba(0, 0, 0, 0.9)',
          }}
        >
          THE FLAVOR UNIVERSE
        </h2>

        <p className="font-sans text-xs sm:text-sm text-[#f3eee1]/70 tracking-wider font-light mt-2 max-w-lg">
          Three master-crafted expressions of Centennial single-origin harvest.
        </p>
      </div>

      {/* CENTER FLOATING CANVAS FOR THE 3D CERAMIC CUPS */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10 block"
      />

      {/* BOTTOM INTERACTIVE FLAVOR EXPLORATION INTERFACE (State B) */}
      <div className="relative z-20 w-full max-w-4xl flex flex-col items-center gap-3 pointer-events-auto">
        
        {/* 3 Flavor Selector Pills aligned directly above details */}
        <div className="flex flex-wrap justify-center items-center gap-2.5">
          {FLAVORS.map((f) => {
            const isSelected = selectedFlavorId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFlavorId(f.id)}
                onMouseEnter={() => setHoveredFlavorId(f.id)}
                onMouseLeave={() => setHoveredFlavorId(null)}
                className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(207,155,52,0.35)] scale-105' 
                    : 'bg-[#09120c]/80 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                }`}
                style={{
                  borderColor: isSelected ? f.accentColor : undefined,
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full transition-transform duration-200" 
                  style={{ 
                    backgroundColor: f.accentColor,
                    boxShadow: isSelected ? `0 0 8px ${f.accentColor}` : 'none'
                  }} 
                />
                <span className="font-mono text-[11px] tracking-wider uppercase font-medium">
                  {f.number} {f.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Flavor Detail Card (Compact Luxury Editorial Spec Sheet) */}
        <div className="w-full bg-[#0d1510]/85 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span 
                  className="font-mono text-xs font-semibold"
                  style={{ color: activeFlavor.accentColor }}
                >
                  {activeFlavor.number}
                </span>
                <span className="text-white/20 text-xs">&bull;</span>
                <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">{activeFlavor.cupColor}</span>
              </div>
              <h3 className="font-beausite text-lg md:text-xl text-white font-light tracking-wide uppercase">
                {activeFlavor.name} <span className="text-xs font-mono font-normal tracking-normal text-white/40 block sm:inline">({activeFlavor.subtitle})</span>
              </h3>
            </div>

            <button 
              className="px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-wider text-black font-semibold transition-all duration-200 shadow-[0_0_15px_rgba(207,155,52,0.4)] hover:shadow-[0_0_22px_rgba(207,155,52,0.6)] whitespace-nowrap cursor-pointer active:scale-95"
              style={{ backgroundColor: activeFlavor.accentColor }}
              onClick={() => alert(`Enquiry initiated for Borsillah ${activeFlavor.name}`)}
            >
              Request Sample Tin &rarr;
            </button>
          </div>

          {/* Terroir & Tasting Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs font-light">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-[#cf9b34]/80 uppercase tracking-widest block font-medium">Tasting Notes</span>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {activeFlavor.notes.map((note) => (
                  <span key={note} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80 font-mono text-[10px]">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block font-medium">Terroir & Elevation</span>
              <p className="text-[#f3eee1]/90 font-mono text-[11px] pt-0.5">{activeFlavor.elevation}</p>
              <p className="text-white/40 text-[10px]">Centennial Clone 1867</p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block font-medium">Liquor Character</span>
              <p className="text-[#f3eee1]/90 font-mono text-[11px] pt-0.5">{activeFlavor.liquorColor}</p>
              <p className="text-white/40 text-[10px]">Brisk astringency &bull; 4 min steep</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
