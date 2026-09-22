/**
 * Single place where GSAP plugins are registered.
 *
 * Import `gsap` / `scroll_trigger` from here (never straight from 'gsap') so
 * ScrollTrigger is guaranteed to be registered exactly once, before any
 * component tries to build a timeline.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Playful defaults so every ad-hoc tween inherits the studio's motion feel.
gsap.defaults({ ease: 'back.out(1.6)', duration: 0.9 });

export { gsap, ScrollTrigger as scroll_trigger };
