/**
 * RevealText — masked, staggered type reveal built on Framer Motion.
 *
 * Each line (or word) sits inside an `overflow-hidden` mask and springs up into
 * place with a slight rotation, so display type feels like it lands rather than
 * fades. Falls back to a simple fade under reduced motion.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { line_reveal, stagger_container } from '../lib/motion';

/**
 * @param {Object} props - Component props.
 * @param {string[]} props.lines - Lines of text; each animates separately.
 * @param {keyof JSX.IntrinsicElements} [props.as='h1'] - Wrapper element/tag.
 * @param {string} [props.className] - Classes for the wrapper.
 * @param {string} [props.line_class_name] - Classes for each line.
 * @param {number} [props.stagger=0.1] - Delay between lines, in seconds.
 * @param {number} [props.delay=0] - Delay before the first line, in seconds.
 * @param {boolean} [props.in_view=false] - Trigger on scroll into view instead of on mount.
 * @returns {JSX.Element} The animated block of type.
 */
export default function RevealText({
  lines,
  as = 'h1',
  className = '',
  line_class_name = '',
  stagger = 0.1,
  delay = 0,
  in_view = false,
}) {
  const reduced_motion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.h1;

  const animation_props = in_view
    ? { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.4 } }
    : { initial: 'hidden', animate: 'visible' };

  if (reduced_motion) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0 }}
        {...(in_view
          ? { whileInView: { opacity: 1 }, viewport: { once: true, amount: 0.4 } }
          : { animate: { opacity: 1 } })}
        transition={{ duration: 0.3 }}
      >
        {lines.map((line) => (
          <span key={line} className={`block ${line_class_name}`}>
            {line}
          </span>
        ))}
      </MotionTag>
    );
  }

  return (
    <MotionTag className={className} variants={stagger_container(stagger, delay)} {...animation_props}>
      {lines.map((line) => (
        // The mask has to be `block` + `overflow-hidden` for the push-up to clip.
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span variants={line_reveal} className={`block origin-left ${line_class_name}`}>
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
