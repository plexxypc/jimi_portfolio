/**
 * Loader — bouncing-dot loading state (no spinners in this studio).
 *
 * Used as the Suspense fallback for lazily-loaded routes in `App.jsx`.
 */
import { motion, useReducedMotion } from 'framer-motion';

const dot_accents = ['bg-coral', 'bg-lime', 'bg-cobalt'];

/**
 * @param {Object} props - Component props.
 * @param {string} [props.label='Loading'] - Accessible status text.
 * @param {boolean} [props.full_screen=true] - Fill the viewport while loading.
 * @returns {JSX.Element} The loading indicator.
 */
export default function Loader({ label = 'Loading', full_screen = true }) {
  const reduced_motion = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'flex flex-col items-center justify-center gap-4',
        full_screen ? 'min-h-screen' : 'py-20',
      ].join(' ')}
    >
      <div className="flex items-end gap-2">
        {dot_accents.map((accent, index) => (
          <motion.span
            key={accent}
            className={`block h-3.5 w-3.5 rounded-full ${accent}`}
            animate={reduced_motion ? { opacity: [0.4, 1, 0.4] } : { y: [0, -14, 0], scaleX: [1, 0.85, 1.15, 1] }}
            transition={{
              duration: 0.75,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.12,
            }}
          />
        ))}
      </div>
      <p className="eyebrow">{label}</p>
    </div>
  );
}
