/**
 * ============================================================================
 *  MOTION PERSONALITY
 * ============================================================================
 *  Shared easings, spring presets and Framer Motion variants. Tuning the
 *  studio's motion feel happens here — springy and slightly overshooting
 *  rather than corporate ease-in-out.
 *
 *  Every consumer is expected to respect reduced motion: either via Framer's
 *  `useReducedMotion()` hook or `prefers_reduced_motion()` below.
 */

/**
 * GSAP ease strings, grouped so timelines read consistently.
 *
 * @type {{pop: string, bounce: string, elastic: string, glide: string}}
 */
export const gsap_eases = {
  pop: 'back.out(1.7)',
  bounce: 'back.out(2.4)',
  elastic: 'elastic.out(1, 0.55)',
  glide: 'power3.out',
};

/**
 * Framer Motion spring presets.
 *
 * @type {{
 *   soft: import('framer-motion').Transition,
 *   snappy: import('framer-motion').Transition,
 *   bouncy: import('framer-motion').Transition,
 *   heavy: import('framer-motion').Transition
 * }}
 */
export const springs = {
  soft: { type: 'spring', stiffness: 160, damping: 20, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 420, damping: 28, mass: 0.6 },
  bouncy: { type: 'spring', stiffness: 320, damping: 14, mass: 0.8 },
  heavy: { type: 'spring', stiffness: 120, damping: 18, mass: 1.4 },
};

/**
 * Reads the user's OS-level motion preference.
 * Safe to call during render (returns false when `window` is unavailable).
 *
 * @returns {boolean} True when the user asked for reduced motion.
 */
export function prefers_reduced_motion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * True on coarse-pointer devices (phones, tablets), where the custom cursor and
 * hover-driven effects are skipped.
 *
 * @returns {boolean} True when the primary pointer is coarse or hover is absent.
 */
export function is_touch_device() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

/**
 * Parent variant that staggers its children in.
 *
 * @param {number} [stagger=0.08] - Delay between children, in seconds.
 * @param {number} [delay=0] - Delay before the first child, in seconds.
 * @returns {import('framer-motion').Variants} Variants for a motion container.
 */
export function stagger_container(stagger = 0.08, delay = 0) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/**
 * Child variant: rises into place with a spring overshoot.
 *
 * @param {number} [distance=28] - Starting offset in pixels below final position.
 * @returns {import('framer-motion').Variants} Variants for a motion child.
 */
export function fade_up(distance = 28) {
  return {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0, transition: springs.soft },
  };
}

/**
 * Child variant for a masked line of display type — the line pushes up from
 * below its own clipping container and settles with a slight overshoot.
 *
 * @type {import('framer-motion').Variants}
 */
export const line_reveal = {
  hidden: { y: '115%', rotate: 4, opacity: 0 },
  visible: {
    y: '0%',
    rotate: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 190, damping: 19, mass: 1 },
  },
};

/**
 * Route transition used by `PageTransition`.
 *
 * @type {import('framer-motion').Variants}
 */
export const page_variants = {
  initial: { opacity: 0, y: 24, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1, transition: springs.soft },
  exit: { opacity: 0, y: -16, scale: 0.995, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * Reduced-motion replacement for `page_variants`: opacity only, no movement.
 *
 * @type {import('framer-motion').Variants}
 */
export const page_variants_reduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/**
 * Picks between a full-motion variant set and a plain fade, based on the user's
 * motion preference.
 *
 * @param {import('framer-motion').Variants} variants - Full-motion variants.
 * @param {boolean} reduced - Whether reduced motion is requested.
 * @returns {import('framer-motion').Variants} The variants safe to animate with.
 */
export function motion_safe(variants, reduced) {
  if (!reduced) return variants;
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
  };
}

/**
 * Standard `whileInView` props for one-shot scroll reveals driven by Framer
 * Motion (GSAP ScrollTrigger handles the longer choreographed sequences).
 *
 * @param {number} [amount=0.3] - Fraction of the element that must be visible.
 * @returns {{initial: string, whileInView: string, viewport: Object}} Motion props.
 */
export function in_view_props(amount = 0.3) {
  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, amount },
  };
}
