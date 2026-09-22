/**
 * SectionHeading — the standard section header used across every page:
 * small eyebrow label, big reveal-on-scroll heading, optional lead paragraph
 * and an optional action slot on the right.
 */
import { motion, useReducedMotion } from 'framer-motion';
import RevealText from './RevealText';
import { fade_up, in_view_props, stagger_container } from '../lib/motion';

/**
 * @param {Object} props - Component props.
 * @param {string} [props.eyebrow] - Small uppercase label above the heading.
 * @param {string} props.title - Heading text. Use '\n' to force line breaks.
 * @param {string} [props.lead] - Supporting paragraph under the heading.
 * @param {import('react').ReactNode} [props.action] - Right-aligned slot (e.g. a button).
 * @param {'left'|'center'} [props.align='left'] - Text alignment.
 * @param {string} [props.className] - Extra classes for the wrapper.
 * @param {keyof JSX.IntrinsicElements} [props.heading_tag='h2'] - Semantic heading level.
 * @returns {JSX.Element} The section header block.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  align = 'left',
  className = '',
  heading_tag = 'h2',
}) {
  const reduced_motion = useReducedMotion();
  const lines = title.split('\n');
  const is_centered = align === 'center';

  return (
    <div
      className={[
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        is_centered ? 'md:flex-col md:items-center' : '',
        className,
      ].join(' ')}
    >
      <motion.div
        className={['max-w-3xl', is_centered ? 'text-center' : ''].join(' ')}
        variants={stagger_container(0.08)}
        {...in_view_props(0.3)}
      >
        {eyebrow ? (
          <motion.p variants={fade_up(14)} className="eyebrow mb-4">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-coral align-middle" />
            {eyebrow}
          </motion.p>
        ) : null}

        <RevealText
          lines={lines}
          as={heading_tag}
          in_view
          className="text-giant"
          stagger={0.09}
        />

        {lead ? (
          <motion.p
            variants={fade_up(20)}
            className={[
              'mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg',
              is_centered ? 'mx-auto' : '',
            ].join(' ')}
          >
            {lead}
          </motion.p>
        ) : null}
      </motion.div>

      {action ? (
        <motion.div
          initial={reduced_motion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      ) : null}
    </div>
  );
}
