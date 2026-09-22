/**
 * PageTransition — wraps a route's content so it springs in and slides out.
 *
 * Every page component returns `<PageTransition>…</PageTransition>`; the
 * `AnimatePresence` that drives the exit lives in `App.jsx`, keyed on pathname.
 * Under reduced motion this degrades to a plain cross-fade.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { page_variants, page_variants_reduced } from '../lib/motion';

/**
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - Page content.
 * @param {string} [props.className] - Extra classes for the wrapper.
 * @returns {JSX.Element} Animated page wrapper.
 */
export default function PageTransition({ children, className = '' }) {
  const reduced_motion = useReducedMotion();
  const variants = reduced_motion ? page_variants_reduced : page_variants;

  return (
    <motion.main
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-screen ${className}`}
    >
      {children}
    </motion.main>
  );
}
