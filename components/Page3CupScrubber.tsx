'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface CupData {
  id: number;
  slug: string;
  name: string;
  titleLines: [string, string, string];
  tagline: string;
  notes: string[];
  description: string;
  image: string;
  video: string;
  accent: string;
}

const CUPS: CupData[] = [
  {
    id: 1,
    slug: 'brown',
    name: 'Centenary Malty Dark',
    titleLines: ['CENTENARY', 'MALTY', 'DARK'],
    tagline: 'Single Origin • Second Flush',
    notes: ['Smoked Molasses', 'Malty Oak', 'Wild Honey'],
    description: 'Deep, full-bodied golden amber brew with notes of caramelized muscatel and earthy Assam soil.',
    image: '/assets/cup-brown.png',
    video: '/assets/cup-brown.webm',
    accent: '#8c593b',
  },
  {
    id: 2,
    slug: 'cream',
    name: 'Signature Reserve Gold',
    titleLines: ['SIGNATURE', 'RESERVE', 'GOLD'],
    tagline: 'Handcrafted Golden Tips',
    notes: ['Muscatel Nectar', 'Sun-Dried Peach', 'Warm Cocoa'],
    description: 'The pinnacle of Borsillah tea estate. Rare tender buds steeped into liquid gold with a buttery, lingering finish.',
    image: '/assets/cup-cream.png',
    video: '/assets/cup-cream.webm',
    accent: '#cf9b34',
  },
  {
    id: 3,
    slug: 'green',
    name: 'Imperial Spring Flush',
    titleLines: ['IMPERIAL', 'SPRING', 'FLUSH'],
    tagline: 'High-Elevation Tender Leaf',
    notes: ['Fresh Meadow', 'Dewed Jasmine', 'White Grape'],
    description: 'Harvested at dawn during the first spring shower. Incredibly clean, lively botanical notes with natural floral vibrancy.',
    image: '/assets/cup-green.png',
    video: '/assets/cup-green.webm',
    accent: '#5a7a58',
  },
];

// ─────────────────────────────────────────────────────────────
// AtmosphericBg
// Renders a living dark-blue cinematic light field via canvas.
// – Layer 1: deep navy base (#020916)
// – Layer 2: three slow-drifting Blue Glow (#2C6FA8) radial fields
// – Layer 3: soft Sky Highlight (#78D7FF) breathing behind center
// – Cursor: local influence field (soft deformation, not spotlight)
// ─────────────────────────────────────────────────────────────
function AtmosphericBg({ cursorX, cursorY }: { cursorX: number; cursorY: number }) {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef({ x: cursorX, y: cursorY });
  const smoothCursorRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    cursorRef.current = { x: cursorX, y: cursorY };
  }, [cursorX, cursorY]);

  useEffect(() => {
    const canvas = bgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const radial = (
      ax: number, ay: number,
      r: number,
      c0: string, c1: string,
      alpha: number
    ) => {
      const g = ctx.createRadialGradient(ax * w, ay * h, 0, ax * w, ay * h, r * Math.max(w, h));
      g.addColorStop(0, c0);
      g.addColorStop(1, c1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    };

    const render = (ts: number) => {
      const t = ts * 0.001; // seconds

      // Smooth cursor — very slow settle (creates natural swish on stop)
      smoothCursorRef.current.x += (cursorRef.current.x - smoothCursorRef.current.x) * 0.022;
      smoothCursorRef.current.y += (cursorRef.current.y - smoothCursorRef.current.y) * 0.022;
      const cx = smoothCursorRef.current.x;
      const cy = smoothCursorRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // ── Layer 1: Deep navy base
      ctx.fillStyle = '#020916';
      ctx.fillRect(0, 0, w, h);

      // ── Layer 2: Blue Glow fields (slow, organic drift)
      // Field A — upper centre, primary glow
      const g1x = 0.50 + Math.sin(t * 0.07) * 0.09;
      const g1y = 0.30 + Math.cos(t * 0.05) * 0.07;
      radial(g1x, g1y, 0.68, 'rgba(44,111,168,0.50)', 'rgba(44,111,168,0)', 1.0);

      // Field B — lower left drift
      const g2x = 0.14 + Math.sin(t * 0.04 + 1.2) * 0.07;
      const g2y = 0.74 + Math.cos(t * 0.06 + 0.8) * 0.06;
      radial(g2x, g2y, 0.52, 'rgba(44,111,168,0.28)', 'rgba(44,111,168,0)', 1.0);

      // Field C — right side drift
      const g3x = 0.83 + Math.sin(t * 0.05 + 2.4) * 0.06;
      const g3y = 0.54 + Math.cos(t * 0.04 + 1.6) * 0.08;
      radial(g3x, g3y, 0.48, 'rgba(44,111,168,0.26)', 'rgba(44,111,168,0)', 1.0);

      // ── Layer 3: Sky Highlight — gentle breathe behind main product
      const breathe = 0.70 + Math.sin(t * 0.11) * 0.30;
      const skyX = 0.50 + Math.sin(t * 0.033) * 0.03;
      const skyY = 0.42 + Math.cos(t * 0.038) * 0.04;
      radial(skyX, skyY, 0.35, `rgba(120,215,255,${0.12 * breathe})`, 'rgba(120,215,255,0)', 1.0);

      // ── Cursor influence field — soft local deformation, not spotlight
      const cInfluence = 0.30 + Math.sin(t * 0.14) * 0.04;
      radial(cx, cy, cInfluence, 'rgba(44,111,168,0.20)', 'rgba(44,111,168,0)', 1.0);
      radial(cx, cy, 0.16, `rgba(120,215,255,${0.055 * breathe})`, 'rgba(120,215,255,0)', 1.0);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={bgRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Page3CupScrubber — main export
// ─────────────────────────────────────────────────────────────
export default function Page3CupScrubber({ totalFrames = 240 }: { totalFrames?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCupId, setActiveCupId] = useState<number>(2);
  const [cupOrder, setCupOrder] = useState<number[]>([1, 2, 3]);
  const [isInPage3, setIsInPage3] = useState(false);
  const [videoFailed, setVideoFailed] = useState<{ [key: number]: boolean }>({});
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Cursor tracking — normalized 0..1 for AtmosphericBg
  const [cursorNorm, setCursorNorm] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setCursorNorm({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Preload 240 frames
  useEffect(() => {
    let cancelled = false;
    const arr: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image();
      img.decoding = 'async';
      img.src = `/cups_keyed/frame_${String(i).padStart(4, '0')}.png`;
      img.onload = () => {
        if (cancelled) return;
        arr[i - 1] = img;
        if (i === 1 && currentProgressRef.current === 0) drawFrame(0);
      };
      img.onerror = () => { if (!cancelled) arr[i - 1] = null; };
    }
    imagesRef.current = arr;
    return () => { cancelled = true; };
  }, [totalFrames]);

  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let img = imagesRef.current[idx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let d = 1; d < totalFrames; d++) {
        const lo = idx - d, hi = idx + d;
        if (lo >= 0 && imagesRef.current[lo]?.complete) { img = imagesRef.current[lo]; break; }
        if (hi < totalFrames && imagesRef.current[hi]?.complete) { img = imagesRef.current[hi]; break; }
      }
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width, ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw = cw, dh = ch, dx = 0, dy = 0;
    if (cr > ir) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; }
    else { dw = cw; dh = cw / ir; dy = (ch - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
  }, [totalFrames]);

  // Scroll + animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      drawFrame(Math.min(totalFrames - 1, Math.max(0, Math.floor(currentProgressRef.current * (totalFrames - 1)))));
    };

    const onScroll = () => {
      const c = containerRef.current;
      if (!c) return;
      const r = c.getBoundingClientRect();
      const dist = r.height - window.innerHeight;
      if (dist <= 0) return;
      setIsInPage3(r.top <= 100 && r.bottom > 100);
      targetProgressRef.current = Math.max(0, Math.min(1, -r.top / dist));
    };

    const loop = () => {
      // EXTREMELY TIGHT INERTIA: factor 0.45 (stops instantly when scroll stops)
      // Frame mapping: 240 frames spread over 80% of scroll progress.
      // At 480vh container → ~304vh physical scroll for the full animation.
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0003) {
        currentProgressRef.current += diff * 0.45;
        const p = currentProgressRef.current;
        setScrollProgress(p);
        const videoP = Math.min(1, p / 0.80);
        drawFrame(Math.min(totalFrames - 1, Math.max(0, Math.round(videoP * (totalFrames - 1)))));
      }
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    resize();
    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [totalFrames, drawFrame]);

  const handleSelectCup = (id: number) => {
    setActiveCupId(id);
    setHasUserInteracted(true);
    setCupOrder((prev) => {
      const i = prev.indexOf(id);
      if (i === 1) return prev;
      if (i === 0) return [prev[2], prev[0], prev[1]];
      return [prev[1], prev[2], prev[0]];
    });
  };

  // Thresholds now at 80%/85% (was 72%/76%)
  const isInteractive = scrollProgress > 0.80;
  const isExpanded = scrollProgress > 0.85 || hasUserInteracted;

  return (
    <div ref={containerRef} className="relative w-full h-[480vh]">

      {/* ════════════════════════════════════════════════════════════
          SINGLE STICKY VIEWPORT
          All layers live inside one sticky container so they
          always overlay each other correctly at z-index depth.
      ════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── z-0: Atmospheric background canvas ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <AtmosphericBg cursorX={cursorNorm.x} cursorY={cursorNorm.y} />
        </div>

        {/* ── z-10: FLAVOR header — top of viewport, below product ── */}
        <div
          className={`absolute top-0 left-0 right-0 pointer-events-none transition-all duration-700 ${isInPage3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
          style={{ zIndex: 10 }}
        >
          <div className="max-w-7xl mx-auto px-8 md:px-16 pt-8 md:pt-12 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
            <div>
              <h2
                className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight font-light select-none"
                style={{
                  color: 'rgba(255,255,255,0.92)',
                  textShadow: '0 2px 24px rgba(0,0,0,0.6)',
                }}
              >
                FLAVOR
              </h2>
              <p
                className="font-mono text-xs uppercase tracking-[0.25em] mt-2"
                style={{ color: 'rgba(255,255,255,0.38)' }}
              >
                Borsillah Single Estate &bull; Universe of Infusion
              </p>
            </div>
            <div
              className={`transition-all duration-500 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] ${isInteractive ? 'opacity-100' : 'opacity-0'}`}
              style={{ color: 'rgba(120,215,255,0.55)' }}
            >
              Click any cup to inspect flavour &amp; notes
            </div>
          </div>
        </div>

        {/* ── z-20: Product stage — centered in viewport ── */}
        <div
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-4 md:px-12 select-none"
          style={{ zIndex: 20 }}
        >

          {/* CANVAS SCRUBBER: transparent keyed frames on dark bg */}
          <div
            className={`relative w-full max-w-[1500px] xl:max-w-[1800px] aspect-[16/9] flex items-center justify-center transition-opacity duration-300 ${isInteractive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain select-none"
              style={{
                filter: 'drop-shadow(0 28px 56px rgba(44,111,168,0.40)) drop-shadow(0 8px 24px rgba(120,215,255,0.10))',
              }}
            />
          </div>

          {/* INTERACTIVE 3-CUP CAROUSEL */}
          <div
            className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-300 ${isInteractive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <div className="relative w-full max-w-[1700px] mx-auto h-[680px] md:h-[750px] flex items-center justify-center">

              {cupOrder.map((cupId, slotIdx) => {
                const cup = CUPS.find((c) => c.id === cupId)!;
                const isCenter = slotIdx === 1;
                const isLeft = slotIdx === 0;
                const isRight = slotIdx === 2;

                // Visual hierarchy:
                //   Center  → 100% scale, full opacity, sky highlight glow
                //   Sides   → ~80-82% scale, reduced opacity (75%), blue glow shadow
                let transformClasses = 'translate-x-0 scale-95 md:scale-100 z-20';
                if (isExpanded) {
                  if (isCenter) {
                    transformClasses = 'translate-x-0 scale-115 md:scale-125 z-20';
                  } else if (isLeft) {
                    transformClasses = '-translate-x-[320px] md:-translate-x-[420px] lg:-translate-x-[490px] xl:-translate-x-[530px] scale-[0.78] md:scale-[0.82] opacity-70 z-10 hover:opacity-88 hover:scale-[0.86] cursor-pointer';
                  } else if (isRight) {
                    transformClasses = 'translate-x-[340px] md:translate-x-[440px] lg:translate-x-[510px] xl:translate-x-[550px] scale-[0.78] md:scale-[0.82] opacity-70 z-10 hover:opacity-88 hover:scale-[0.86] cursor-pointer';
                  }
                } else {
                  // Compact resting layout (matches video end frame)
                  if (isCenter) {
                    transformClasses = 'translate-x-0 scale-90 md:scale-95 z-20';
                  } else if (isLeft) {
                    transformClasses = '-translate-x-[150px] md:-translate-x-[190px] lg:-translate-x-[225px] xl:-translate-x-[240px] scale-[0.74] md:scale-[0.78] opacity-75 z-10';
                  } else if (isRight) {
                    transformClasses = 'translate-x-[150px] md:translate-x-[190px] lg:translate-x-[225px] xl:translate-x-[240px] scale-[0.74] md:scale-[0.78] opacity-75 z-10';
                  }
                }

                const cupSizeClasses =
                  cup.id === 1 ? 'w-[420px] md:w-[490px] lg:w-[550px]'
                  : cup.id === 2 ? 'w-[440px] md:w-[515px] lg:w-[575px]'
                  : 'w-[380px] md:w-[445px] lg:w-[500px]';

                const hasVideo = Boolean(cup.video && !videoFailed[cup.id]);

                // Center → sky highlight glow; sides → blue atmospheric shadow
                const dropFilter = isCenter
                  ? 'drop-shadow(0 32px 72px rgba(120,215,255,0.20)) drop-shadow(0 10px 32px rgba(44,111,168,0.40))'
                  : 'drop-shadow(0 20px 44px rgba(44,111,168,0.28))';

                return (
                  <div
                    key={cup.id}
                    onClick={() => handleSelectCup(cup.id)}
                    className={`absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${transformClasses}`}
                  >
                    <div className="relative group">
                      <div
                        className={`relative transition-transform duration-700 ${isCenter && isExpanded ? 'animate-cup-loop hover:scale-105' : 'hover:scale-105'}`}
                        style={{ filter: dropFilter }}
                      >
                        {hasVideo ? (
                          <video
                            src={cup.video}
                            autoPlay loop muted playsInline
                            onError={() => setVideoFailed((prev) => ({ ...prev, [cup.id]: true }))}
                            className={`${cupSizeClasses} h-auto object-contain transition-transform duration-500`}
                          />
                        ) : (
                          <Image
                            src={cup.image}
                            alt={cup.name}
                            width={750}
                            height={750}
                            className={`${cupSizeClasses} h-auto object-contain transition-transform duration-500`}
                            priority
                          />
                        )}
                      </div>

                      {/* Pedestal shadow — blue-tinted for dark bg */}
                      <div
                        className="w-3/4 mx-auto h-4 rounded-full blur-lg -mt-3"
                        style={{
                          background: isCenter
                            ? 'rgba(120,215,255,0.14)'
                            : 'rgba(44,111,168,0.18)',
                        }}
                      />
                    </div>

                    {/* PURE TYPOGRAPHY — 3 lines, 1 word each, no boxes */}
                    <div
                      className={`mt-4 md:mt-6 text-center select-none transition-all duration-700 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
                    >
                      <div
                        className={`font-serif uppercase tracking-[0.14em] leading-[1.06] transition-colors duration-500 ${
                          isCenter
                            ? 'text-2xl md:text-3xl lg:text-4xl font-medium'
                            : 'text-lg md:text-xl lg:text-2xl font-light'
                        }`}
                        style={{
                          color: isCenter ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.35)',
                          textShadow: isCenter ? '0 2px 18px rgba(120,215,255,0.18)' : 'none',
                        }}
                      >
                        <span className="block">{cup.titleLines[0]}</span>
                        <span className="block">{cup.titleLines[1]}</span>
                        <span className="block">{cup.titleLines[2]}</span>
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>

        </div>

      </div>{/* end sticky */}

      <style jsx global>{`
        @keyframes cupLoop {
          0%   { transform: translateY(0px)  rotate(0deg);    }
          25%  { transform: translateY(-6px) rotate(0.8deg);  }
          50%  { transform: translateY(0px)  rotate(0deg);    }
          75%  { transform: translateY(-5px) rotate(-0.8deg); }
          100% { transform: translateY(0px)  rotate(0deg);    }
        }
        .animate-cup-loop {
          animation: cupLoop 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
