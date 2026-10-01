'use client';
import { useEffect, useRef, useState } from 'react';
import DrawingOverlay from '@/components/DrawingOverlay';
import Page3CupScrubber from '@/components/Page3CupScrubber';

export default function Home() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const scrubberCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const textState1Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLElement>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [displayFrame, setDisplayFrame] = useState(1);
  const [detectedHz, setDetectedHz] = useState<number>(0);
  const [liveFps, setLiveFps] = useState<number>(0);
  const [isPastPage2, setIsPastPage2] = useState(false);
  const totalFramesCount = 600; // 330 (Video 1) + 270 (Video 2)

  // References for frames and physics loop
  const framesRef = useRef<HTMLImageElement[]>([]);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const bgCanvas = bgCanvasRef.current;
    const scrubberCanvas = scrubberCanvasRef.current;
    if (!bgCanvas || !scrubberCanvas) return;

    const bgCtx = bgCanvas.getContext('2d');
    const scrubCtx = scrubberCanvas.getContext('2d', { willReadFrequently: true });
    if (!bgCtx || !scrubCtx) return;

    // Retina-sharp Canvas Resize
    const resizeCanvases = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      bgCanvas.width = width * dpr;
      bgCanvas.height = height * dpr;
      bgCanvas.style.width = `${width}px`;
      bgCanvas.style.height = `${height}px`;
      bgCtx.scale(dpr, dpr);

      scrubberCanvas.width = width * dpr;
      scrubberCanvas.height = height * dpr;
      scrubberCanvas.style.width = `${width}px`;
      scrubberCanvas.style.height = `${height}px`;
      scrubCtx.scale(dpr, dpr);

      scrubCtx.imageSmoothingEnabled = true;
      scrubCtx.imageSmoothingQuality = 'high';

      renderBg();
      renderScene(currentProgressRef.current);
    };

    // Deep Atmospheric Background
    const renderBg = () => {
      bgCtx.save();
      const bgGrad = bgCtx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#030814');
      bgGrad.addColorStop(1, '#02050e');
      bgCtx.fillStyle = bgGrad;
      bgCtx.fillRect(0, 0, width, height);

      // Atmospheric radial ambient glow
      const radial = bgCtx.createRadialGradient(
        width * 0.5, height * 0.5, 0,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.5
      );
      radial.addColorStop(0, 'rgba(28, 62, 115, 0.7)');
      radial.addColorStop(0.5, 'rgba(12, 30, 60, 0.35)');
      radial.addColorStop(1, 'rgba(3, 8, 20, 0)');
      bgCtx.fillStyle = radial;
      bgCtx.fillRect(0, 0, width, height);
      bgCtx.restore();
    };

    // Main Scene Render: Maps progress -> Cup Position + Frame Index (Video 1 -> Video 2)
    const renderScene = (progress: number) => {
      if (!scrubCtx || framesRef.current.length === 0) return;

      const scale = Math.max(width / 1920, height / 1080) * 0.82;
      const drawWidth = 1920 * scale;
      const drawHeight = 950 * scale;
      const drawX = (width * 0.5) - (drawWidth / 2);

      // Position Coordinates:
      // Page 1 center: height * 0.44
      // Page 2 center: height * 0.55
      const yPage1 = (height * 0.44) - (drawHeight / 2);
      const yPage2 = (height * 0.55) - (drawHeight / 2);

      let currentDrawY = yPage1;
      let frameIndex = 0;

      // Video 1 occupies progress: 0.0 -> 0.55 (frames 0 to 329)
      // Video 2 occupies progress: 0.55 -> 1.0 (frames 330 to 599)
      if (progress <= 0.55) {
        const v1Progress = progress / 0.55; // 0 to 1 across Video 1
        frameIndex = Math.min(329, Math.floor(v1Progress * 329));

        // First 68% of Video 1: Cup stays centered in Page 1
        // Last 32% of Video 1 (milk pouring): Cup descends across boundary into Page 2!
        if (v1Progress < 0.68) {
          currentDrawY = yPage1;
        } else {
          const moveProgress = (v1Progress - 0.68) / (1 - 0.68); // 0 to 1
          const ease = moveProgress < 0.5
            ? 2 * moveProgress * moveProgress
            : -1 + (4 - 2 * moveProgress) * moveProgress;
          currentDrawY = yPage1 + (yPage2 - yPage1) * ease;
        }
      } else {
        // Video 2 begins INSTANTLY at frame 330 right at the Page 2 position!
        const v2Progress = Math.min(1, Math.max(0, (progress - 0.55) / 0.45)); // 0 to 1 across Video 2
        frameIndex = 330 + Math.min(269, Math.floor(v2Progress * 269));
        currentDrawY = yPage2; // Resting in center of Page 2
      }

      // Display frame is strictly between 1 and 600
      setDisplayFrame(Math.min(totalFramesCount, frameIndex + 1));

      const img = framesRef.current[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      scrubCtx.clearRect(0, 0, width, height);
      scrubCtx.save();
      scrubCtx.imageSmoothingEnabled = true;
      scrubCtx.imageSmoothingQuality = 'high';
      scrubCtx.globalCompositeOperation = 'source-over';
      scrubCtx.drawImage(img, drawX, currentDrawY, drawWidth, drawHeight);

      // Clean bottom fade mask
      scrubCtx.globalCompositeOperation = 'destination-out';
      const fadeHeight = drawHeight * 0.14;
      const fadeY = currentDrawY + drawHeight - fadeHeight;
      const maskGradient = scrubCtx.createLinearGradient(0, fadeY, 0, fadeY + fadeHeight);
      maskGradient.addColorStop(0, 'rgba(0,0,0,0)');
      maskGradient.addColorStop(1, 'rgba(0,0,0,1)');
      scrubCtx.fillStyle = maskGradient;
      scrubCtx.fillRect(drawX, fadeY, drawWidth, fadeHeight);
      scrubCtx.restore();

      // Dynamic Boundary Line Tracking (The Revealer):
      if (leftColRef.current) {
        let leftWidthPercent = 31; // Initial position (10mm left of packet in frame 1 of Video 2)
        if (progress > 0.55) {
          const v2Progress = Math.min(1, Math.max(0, (progress - 0.55) / 0.45));
          const shiftEase = v2Progress < 0.5
            ? 2 * v2Progress * v2Progress
            : -1 + (4 - 2 * v2Progress) * v2Progress;
          leftWidthPercent = 31 + (shiftEase * 27);
        }
        leftColRef.current.style.width = `${leftWidthPercent}%`;
      }

      // Typography: PURE ASSAM stably visible
      if (textState1Ref.current) {
        textState1Ref.current.style.opacity = '1';
        textState1Ref.current.style.transform = 'translateY(0)';
      }
    };

    // Exactly 600 frames total: Video 1 (330 frames) + Video 2 (270 frames)
    const framePaths: string[] = [];
    for (let i = 0; i < 330; i++) {
      const f = Math.round(1 + (i * 599) / 329);
      framePaths.push(`/tea_frames/frame_${String(f).padStart(4, '0')}.png`);
    }
    for (let i = 0; i < 270; i++) {
      const f = Math.round(717 + (i * 483) / 269);
      framePaths.push(`/tea_frames/frame_${String(f).padStart(4, '0')}.png`);
    }

    let isCancelled = false;
    let initialDrawn = false;
    const imgElements: HTMLImageElement[] = new Array(framePaths.length);
    framesRef.current = imgElements;

    let loaded = 0;
    framePaths.forEach((path, idx) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = path;
      img.onload = () => {
        if (isCancelled) return;
        imgElements[idx] = img;
        loaded++;
        setLoadedCount(loaded);

        if (idx === 0 && !initialDrawn) {
          initialDrawn = true;
          renderScene(0);
        }
      };
    });

    // Hardware Refresh Rate (Hz) & Live Render FPS Detection
    const frameTimestamps: number[] = [];
    let lastFpsSample = performance.now();
    let frameCountSinceSample = 0;
    let hzDetected = false;
    let lastTime = performance.now();

    // Delta-Time Normalized Physics Loop (Smooth, calm, deliberate inertia)
    const updateLoop = () => {
      const now = performance.now();
      lastTime = now;

      // Sample timestamps for FPS and display refresh rate
      frameTimestamps.push(now);
      if (frameTimestamps.length > 70) frameTimestamps.shift();

      frameCountSinceSample++;
      if (now - lastFpsSample >= 500) {
        const measuredFps = Math.round((frameCountSinceSample * 1000) / (now - lastFpsSample));
        setLiveFps(measuredFps);
        frameCountSinceSample = 0;
        lastFpsSample = now;
      }

      // Calculate hardware display Hz from inter-frame deltas (median filter)
      if (!hzDetected && frameTimestamps.length >= 45) {
        const intervals: number[] = [];
        for (let i = 1; i < frameTimestamps.length; i++) {
          intervals.push(frameTimestamps[i] - frameTimestamps[i - 1]);
        }
        intervals.sort((a, b) => a - b);
        const medianDt = intervals[Math.floor(intervals.length / 2)];
        if (medianDt > 0) {
          const rawHz = Math.round(1000 / medianDt);
          const tiers = [60, 75, 90, 120, 144, 165, 240];
          const closestHz = tiers.reduce((prev, curr) =>
            Math.abs(curr - rawHz) < Math.abs(prev - rawHz) ? curr : prev
          );
          setDetectedHz(closestHz);
          hzDetected = true;
        }
      }

      // EXTREMELY TIGHT INERTIA: The moment the user stops scrolling, the animation stops instantly.
      // Removed the floaty/loose lerp (0.06) and replaced with a tight immediate snap (0.45)
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.45;
        renderScene(currentProgressRef.current);
      }

      animFrameIdRef.current = requestAnimationFrame(updateLoop);
    };
    animFrameIdRef.current = requestAnimationFrame(updateLoop);

    // Sync with Page Scroll across Sections 1 & 2
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const page3El = page3Ref.current;

      if (page3El) {
        const p3Top = page3El.offsetTop;
        // Video 2 finishes exactly at the Page 2 bottom border (p3Top - window.innerHeight)
        const p12Track = Math.max(1, p3Top - window.innerHeight);
        targetProgressRef.current = Math.max(0, Math.min(1, scrollY / p12Track));
        // As soon as Page 3 begins entering, fade out the video canvas so it NEVER crosses into Page 3!
        setIsPastPage2(scrollY >= p3Top - 20);
      } else {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        targetProgressRef.current = Math.max(0, Math.min(1, scrollY / maxScroll));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resizeCanvases);

    resizeCanvases();

    return () => {
      isCancelled = true;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvases);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  return (
    <main ref={containerRef} className="relative w-full bg-[#030712] select-none text-white overflow-x-clip">
      
      {/* Loading Progress Bar */}
      {loadedCount < totalFramesCount && (
        <div className="fixed top-0 left-0 w-full h-[2px] bg-white/10 z-[100] pointer-events-none">
          <div 
            className="h-full bg-amber-400 transition-all duration-200" 
            style={{ width: `${(loadedCount / totalFramesCount) * 100}%` }}
          />
        </div>
      )}

      {/* LAYER 1: Fixed Atmospheric Midnight Blue Canvas (z-0) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <canvas ref={bgCanvasRef} className="absolute top-0 left-0 w-full h-full block" />
      </div>

      {/* FIXED HEADER (Top Right Minimalist Menu) */}
      <header className="fixed top-0 left-0 z-50 w-full flex justify-end items-start px-8 pt-8 md:px-12 md:pt-10 pointer-events-none">
        <button 
          aria-label="Menu"
          className="flex flex-col justify-center items-end gap-[7px] w-8 h-8 group cursor-pointer focus:outline-none pointer-events-auto"
        >
          <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8" />
          <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8" />
        </button>
      </header>

      {/* 
        LAYER 3: Video Canvas (z-20)
        - ALWAYS overlays text in Pages 1 & 2
        - Fades out cleanly before Page 3
        - Completely covered by Page 3 (z-40 bg-white) so it NEVER crosses into Page 3!
      */}
      <div 
        className={`fixed top-0 left-0 w-full h-full overflow-hidden z-20 pointer-events-none transition-opacity duration-300 ${
          isPastPage2 ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <canvas 
          ref={scrubberCanvasRef} 
          className="absolute top-0 left-0 w-full h-full block"
          style={{
            filter: 'contrast(1.08) brightness(1.04) saturate(1.1)',
            imageRendering: '-webkit-optimize-contrast',
            transform: 'translateZ(0)',
          }}
        />
      </div>

      {/* ========================================================
          PAGE 1 (Hero Marquee Stage)
          Height increased massively (min-h-[300vh]) to dramatically 
          slow down the frame advance per scroll pixel.
      ======================================================== */}
      <section className="relative z-10 w-full min-h-[300vh] flex flex-col justify-between items-center pointer-events-none pt-24 pb-12">
        
        {/* Top spacer */}
        <div className="w-full h-12" />

        {/* LAYER 2: Massive Sticky Typography (Behind Cup) */}
        <div className="w-full sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          <h1 
            className="font-serif uppercase tracking-[0.05em] text-center select-none"
            style={{ 
              fontSize: 'clamp(100px, 22vw, 400px)', 
              lineHeight: 0.85, 
              fontWeight: 200,
              color: 'rgba(255, 255, 255, 0.4)', // Bright enough to read clearly behind the cup
              textShadow: '0 8px 60px rgba(0, 0, 0, 0.6)',
              whiteSpace: 'nowrap'
            }}
          >
            BORSILAH
          </h1>
          <h2 
            className="font-beausite uppercase tracking-[0.4em] text-center select-none mt-6 md:mt-10"
            style={{ 
              fontSize: 'clamp(24px, 4vw, 60px)', 
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            SINGLE ESTATE
          </h2>
        </div>

      </section>

      {/* ========================================================
          PAGE 2 (Destination Stage for Video 2)
          Clean layout with vertical guideline drawn down from 'P'
          Height increased massively (min-h-[350vh]) to dramatically 
          slow down the frame advance per scroll pixel.
      ======================================================== */}
      <section className="relative z-10 w-full min-h-[350vh] flex flex-col justify-between pointer-events-none px-8 md:px-16 pt-16 pb-20">
        
        {/* 
          TWO-COLUMN CONTAINER FOR PAGE 2:
          - Left column: Dedicated text area for PURE ASSAM
          - Right area: Dedicated stage for the tea cup and Video 2
        */}
        <div className="relative w-full flex-1 flex">
          
          {/* LEFT SIDE: Text Column (Pure typography without borders) */}
          <div 
            ref={leftColRef}
            className="sticky top-[14vh] h-[70vh] flex flex-col justify-start overflow-hidden transition-none select-none pl-[5mm] pr-[5mm]"
            style={{ width: '31%' }}
          >

            {/* STATE 1: PURE ASSAM */}
            <div 
              ref={textState1Ref} 
              className="w-full flex flex-col justify-start transition-all duration-200"
            >
              {/* TOP ZONE: PURE */}
              <div className="w-full flex flex-col justify-start m-0 p-0">
                <h2 
                  className="font-beausite uppercase font-light text-white tracking-[0.02em] leading-[0.85] m-0 p-0"
                  style={{
                    fontSize: 'clamp(78px, 11vw, 178px)',
                    fontWeight: 200,
                    margin: 0,
                    padding: 0,
                    textShadow: '0 0 40px rgba(255, 255, 255, 0.16), 0 4px 20px rgba(0, 0, 0, 0.9)',
                  }}
                >
                  PURE
                </h2>
              </div>

              {/* LOWER ZONE: ASSAM */}
              <div 
                className="w-full flex flex-col justify-start gap-3 m-0 p-0"
                style={{ marginTop: 'clamp(80px, 13vh, 150px)' }}
              >
                <h2 
                  className="font-beausite uppercase font-light text-white tracking-[0.015em] leading-[0.85] m-0 p-0"
                  style={{
                    fontSize: 'clamp(57px, 8.0vw, 132px)',
                    fontWeight: 200,
                    margin: 0,
                    padding: 0,
                    textShadow: '0 0 40px rgba(255, 255, 255, 0.16), 0 4px 20px rgba(0, 0, 0, 0.9)',
                  }}
                >
                  ASSAM
                </h2>
                
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Cup and Video 2 Stage (Unobstructed open space) */}
          <div className="flex-1 relative">
            {/* The cup rests and animates cleanly here in open space */}
          </div>

        </div>

      </section>

      {/* ========================================================
          PAGE 3: 100% Pure Blank White Page (As explicitly requested)
          - All video, cups, flavor cards, buttons completely removed!
          - z-40 so it physically occludes the video canvas below it!
          - Video 2 CANNOT cross into Page 3!
      ======================================================== */}
      <section 
        ref={page3Ref} 
        id="page-3" 
        className="relative z-40 w-full bg-white"
      >
        <Page3CupScrubber />
      </section>

      {/* ON-SCREEN MARKER PEN TOOL FOR COLLABORATION & SKETCHING */}
      <DrawingOverlay 
        currentFrame={displayFrame} 
        totalFrames={totalFramesCount} 
        fps={liveFps} 
        refreshRate={detectedHz} 
      />

    </main>
  );
}
