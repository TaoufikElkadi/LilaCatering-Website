'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis } from '@/lib/lenis';

/**
 * Buttery momentum scrolling (HBA-style) via Lenis.
 * - Respects prefers-reduced-motion (skips entirely).
 * - Intercepts same-page #hash links so they glide instead of jumping.
 * - Exposes the instance through lib/lenis so programmatic scrolls share it.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.085,          // lower = silkier, longer glide
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
    });
    setLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Smoothly scroll same-page anchor links (e.g. #menu-builder, #gallery).
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      const hashIndex = href.indexOf('#');
      if (hashIndex < 0) return;
      const id = href.slice(hashIndex + 1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return; // cross-page hash → let the router handle it
      e.preventDefault();
      lenis.scrollTo(el, { offset: -80 });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
