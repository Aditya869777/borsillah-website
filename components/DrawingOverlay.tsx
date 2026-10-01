'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface DrawingOverlayProps {
  currentFrame?: number;
  totalFrames?: number;
  fps?: number;
  refreshRate?: number;
}

export default function DrawingOverlay({
  currentFrame = 0,
  totalFrames = 600,
  fps = 0,
  refreshRate = 0,
}: DrawingOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const color = '#ffe600'; // Neon Yellow
  const lineWidth = 7;

  // Resize canvas to cover window exactly
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const temp = document.createElement('canvas');
      temp.width = canvas.width;
      temp.height = canvas.height;
      const tempCtx = temp.getContext('2d');
      if (tempCtx && canvas.width > 0 && canvas.height > 0) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      if (tempCtx && temp.width > 0 && temp.height > 0) {
        ctx.drawImage(temp, 0, 0, window.innerWidth, window.innerHeight);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global Keyboard Shortcuts: 'D' to toggle pen, 'C' to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (key === 'd' || key === 'm') {
        e.preventDefault();
        setIsDrawingMode((prev) => !prev);
      } else if (key === 'c') {
        clearCanvas();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: e.clientX, y: e.clientY };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    const coords = getCanvasCoords(e);
    lastPos.current = coords;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();

    setHasDrawing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !isDrawingMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPos.current) return;

    const coords = getCanvasCoords(e);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPos.current = coords;
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPos.current = null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore capture release error
    }
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  }, []);

  return (
    <>
      {/* 
        DRAWING CANVAS:
        Only intercepts pointer events when drawing mode is ON.
      */}
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: isDrawingMode ? 99990 : 35,
          pointerEvents: isDrawingMode ? 'auto' : 'none',
          cursor: isDrawingMode ? 'crosshair' : 'default',
          touchAction: isDrawingMode ? 'none' : 'auto',
        }}
      />

      {/* Screen Border Highlight When Drawing Mode is Active */}
      {isDrawingMode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            border: '3px solid #ffe600',
            boxShadow: 'inset 0 0 20px rgba(255, 230, 0, 0.35)',
            zIndex: 99995,
          }}
        />
      )}

      {/* 
        COMPACT CORNER TOOLBAR (Positioned in Top-Right as circled by user)
      */}
      <aside
        aria-label="Collaboration Drawing Toolbar"
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(10, 15, 28, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '24px',
          padding: '6px 12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(245, 158, 11, 0.25)',
          userSelect: 'none',
        }}
      >
        {/* Toggle Pen Button */}
        <button
          type="button"
          onClick={() => setIsDrawingMode((prev) => !prev)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '16px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: isDrawingMode ? '#ffe600' : 'rgba(255, 255, 255, 0.1)',
            color: isDrawingMode ? '#000000' : '#ffffff',
            border: isDrawingMode ? '1.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: isDrawingMode ? '0 0 12px rgba(255, 230, 0, 0.7)' : 'none',
          }}
        >
          <span>{isDrawingMode ? '✏️ Drawing' : '✏️ Draw (D)'}</span>
        </button>

        {/* Clear Button */}
        {hasDrawing && (
          <button
            type="button"
            onClick={clearCanvas}
            style={{
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
              transition: 'all 0.2s ease',
            }}
          >
            Clear (C)
          </button>
        )}

        {/* Frame & FPS HUD */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            paddingLeft: '6px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '10px',
            fontFamily: 'monospace',
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: refreshRate >= 120 ? '#a855f7' : '#10b981',
              boxShadow: refreshRate >= 120 ? '0 0 6px #a855f7' : '0 0 6px #10b981',
            }}
          />
          {refreshRate > 0 && (
            <span style={{ color: '#34d399' }}>
              {fps || refreshRate}fps
            </span>
          )}
          <span style={{ color: '#fbbf24' }}>
            {currentFrame}/{totalFrames}
          </span>
        </div>
      </aside>
    </>
  );
}
