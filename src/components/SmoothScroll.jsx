/**
 * SmoothScroll — global Lenis inertia scrolling, wired to GSAP.
 *
 * Responsibilities:
 *   1. Create one Lenis instance for the whole app.
 *   2. Drive Lenis from GSAP's ticker (one rAF loop instead of two) and push
 *      every scroll event into ScrollTrigger.update() so scroll-driven
 *      timelines stay in sync with the smoothed scroll position.
 *   3. Jump to the top on route change and refresh ScrollTrigger once the new
 *      page has laid out.
 *   4. Skip smoothing entirely under `prefers-reduced-motion` (native scroll).
 *
 * Any component can reach the instance with `use_lenis()` — handy for
 * "scroll to top" buttons or anchor links.
 */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import { gsap, scroll_trigger } from '../lib/gsap';

/** @type {import('react').Context<Lenis|null>} */
const lenis_context = createContext(null);

/**
 * Access the app-wide Lenis instance.
 *
 * @returns {Lenis|null} The instance, or null under reduced motion / before mount.
 */
export function use_lenis() {
  return useContext(lenis_context);
}

/**
 * @param {{children: import('react').ReactNode}} props - Component props.
 * @returns {JSX.Element} Provider wrapping the app.
 */
export default function SmoothScroll({ children }) {
  const [lenis_instance, set_lenis_instance] = useState(null);
  const reduced_motion = useReducedMotion();
  const location = useLocation();
  const raf_handler_ref = useRef(null);

  useEffect(() => {
    if (reduced_motion) {
      set_lenis_instance(null);
      return undefined;
    }

    const lenis = new Lenis({
      // Lower lerp = longer glide. 0.09 feels weighty without going syrupy.
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      // Native scrolling on touch — smoothing there fights the OS and feels laggy.
      syncTouch: false,
    });

    set_lenis_instance(lenis);

    const on_scroll = () => scroll_trigger.update();
    lenis.on('scroll', on_scroll);

    /** @param {number} time - GSAP ticker time in seconds. */
    const raf_handler = (time) => lenis.raf(time * 1000);
    raf_handler_ref.current = raf_handler;
    gsap.ticker.add(raf_handler);
    // Prevents GSAP from "catching up" after a tab is backgrounded, which would
    // otherwise make Lenis jump.
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', on_scroll);
      if (raf_handler_ref.current) gsap.ticker.remove(raf_handler_ref.current);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      set_lenis_instance(null);
    };
  }, [reduced_motion]);

  // Late-loading images, swapped fonts and expanding panels all change document
  // height after ScrollTrigger has measured. Watching the body keeps trigger
  // positions honest — without this, reveals fire against stale coordinates.
  useEffect(() => {
    let debounce_id = 0;
    const request_refresh = () => {
      window.clearTimeout(debounce_id);
      debounce_id = window.setTimeout(() => scroll_trigger.refresh(), 150);
    };

    const observer = new ResizeObserver(request_refresh);
    observer.observe(document.body);
    window.addEventListener('load', request_refresh);

    return () => {
      window.clearTimeout(debounce_id);
      observer.disconnect();
      window.removeEventListener('load', request_refresh);
    };
  }, []);

  // Reset scroll + recalculate triggers whenever the route changes.
  useEffect(() => {
    if (lenis_instance) {
      lenis_instance.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    // Wait for the incoming page to paint before measuring trigger positions.
    const refresh_id = window.setTimeout(() => scroll_trigger.refresh(), 220);
    return () => window.clearTimeout(refresh_id);
  }, [location.pathname, lenis_instance]);

  return <lenis_context.Provider value={lenis_instance}>{children}</lenis_context.Provider>;
}
