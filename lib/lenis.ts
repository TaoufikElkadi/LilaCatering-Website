// Shared access to the active Lenis smooth-scroll instance so any component can
// drive programmatic scrolling through the same momentum engine (with a graceful
// native fallback when smooth scroll is disabled, e.g. prefers-reduced-motion).
import type Lenis from 'lenis';

let _lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  _lenis = instance;
}

export function getLenis(): Lenis | null {
  return _lenis;
}

type ScrollTarget = number | string | HTMLElement;

export function smoothScrollTo(
  target: ScrollTarget,
  opts: { offset?: number; duration?: number } = {}
) {
  if (_lenis) {
    _lenis.scrollTo(target, { offset: opts.offset ?? 0, duration: opts.duration });
    return;
  }
  // Fallback: native smooth scroll.
  if (typeof window === 'undefined') return;
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset + (opts.offset ?? 0);
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
