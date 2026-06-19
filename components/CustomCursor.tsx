'use client';

import { useEffect, useRef, useState } from 'react';

const COLOR = '#7a5a3a';

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const showRef = useRef(true);
  const [enabled, setEnabled] = useState(false);
  const cursorPos = useRef<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Only enable on fine-pointer (mouse) devices that don't request reduced motion.
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(finePointer && !reducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const drawCursor = () => {
      if (!showRef.current) return;
      const { x, y, visible } = cursorPos.current;
      if (!visible) return;
      
      ctx.save();
      ctx.translate(x, y);
      
      // Outer ring
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.strokeStyle = COLOR;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Inner dot
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = COLOR;
      ctx.fill();
      
      ctx.restore();
    };

    // Only repaint the canvas when something actually changed (cuts idle GPU/CPU cost).
    let dirty = true;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (!dirty) return;
      dirty = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCursor();
    };

    const handleMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY, visible: true };
      dirty = true;
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'input, textarea, select, button, [role="button"], [contenteditable="true"], a'
      );
      const nextShow = !interactive;
      if (nextShow !== showRef.current) {
        showRef.current = nextShow;
        document.body.style.cursor = nextShow ? 'none' : 'auto';
      }
    };

    const handleLeave = () => {
      showRef.current = false;
      cursorPos.current = { x: 0, y: 0, visible: false };
      dirty = true;
      document.body.style.cursor = 'auto';
    };

    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave, { passive: true });
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = 'auto';
    };
  }, [enabled]);

  if (!enabled) return null;

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[60]" aria-hidden />;
}
