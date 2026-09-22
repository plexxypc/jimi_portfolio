/**
 * Marquee — infinite horizontal ticker (skills, client logos, big CTA text).
 *
 * The track renders its children twice and slides by exactly -50%, so the loop
 * is seamless. Driven by CSS (`animation: marquee`) rather than JS to keep it
 * off the main thread. Under reduced motion it becomes a static wrapped list.
 */
import { useReducedMotion } from 'framer-motion';

/**
 * @param {Object} props - Component props.
 * @param {Array<string>} props.items - Text items to repeat.
 * @param {number} [props.duration=28] - Seconds for one full loop (higher = slower).
 * @param {'left'|'right'} [props.direction='left'] - Travel direction.
 * @param {string} [props.separator='✦'] - Glyph rendered between items.
 * @param {string} [props.className] - Classes for the outer wrapper.
 * @param {string} [props.item_class_name] - Classes for each item.
 * @returns {JSX.Element} The marquee strip.
 */
export default function Marquee({
  items,
  duration = 28,
  direction = 'left',
  separator = '✦',
  className = '',
  item_class_name = '',
}) {
  const reduced_motion = useReducedMotion();

  const row = (copy_index) =>
    items.map((item, index) => (
      <span
        key={`${copy_index}-${item}-${index}`}
        className={`flex shrink-0 items-center gap-6 whitespace-nowrap ${item_class_name}`}
      >
        {item}
        <span aria-hidden="true" className="text-coral">
          {separator}
        </span>
      </span>
    ));

  if (reduced_motion) {
    return (
      <div className={`flex flex-wrap items-center gap-6 ${className}`}>{row('static')}</div>
    );
  }

  return (
    <div className={`mask-fade-x overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-marquee items-center gap-6"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {/* Two identical copies — the -50% translate lands exactly on copy two. */}
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
