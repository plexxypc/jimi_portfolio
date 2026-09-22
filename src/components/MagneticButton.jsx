/**
 * MagneticButton — the studio's primary call-to-action.
 *
 * Behaviour: leans toward the pointer (magnetic), tilts and grows on hover,
 * squashes on click, and drives the custom cursor label. Renders as a router
 * <Link>, an external <a>, or a <button> depending on which prop you pass.
 *
 *   <MagneticButton to="/work">See the work</MagneticButton>
 *   <MagneticButton href="https://…" variant="outline">Vimeo</MagneticButton>
 *   <MagneticButton onClick={handler} variant="lime" type="submit">Send</MagneticButton>
 */
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { springs } from '../lib/motion';
import { use_magnetic } from '../hooks/use_magnetic';

const MotionLink = motion(Link);

/** Visual variants — all rounded, all high contrast against the cream base. */
const variant_classes = {
  solid: 'bg-ink text-cream hover:bg-coral',
  coral: 'bg-coral text-cream hover:bg-ink',
  lime: 'bg-lime text-ink hover:bg-ink hover:text-lime',
  outline: 'border-2 border-ink/15 bg-transparent text-ink hover:border-ink hover:bg-cream',
};

const size_classes = {
  sm: 'px-5 py-2.5 text-xs',
  md: 'px-7 py-3.5 text-sm',
  lg: 'px-9 py-5 text-base',
};

/**
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - Button label.
 * @param {string} [props.to] - Internal route; renders a react-router <Link>.
 * @param {string} [props.href] - External URL; renders an <a target="_blank">.
 * @param {Function} [props.onClick] - Click handler; renders a <button>.
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Native button type.
 * @param {'solid'|'coral'|'lime'|'outline'} [props.variant='solid'] - Visual style.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Padding scale.
 * @param {string} [props.className] - Extra classes.
 * @param {string} [props.cursor_label='Go'] - Label shown inside the custom cursor.
 * @param {string} [props.cursor_icon] - Optional glyph/emoji shown above that label.
 * @param {boolean} [props.disabled=false] - Disables a <button> variant.
 * @param {number} [props.strength=0.3] - Magnetic pull strength (0–1).
 * @returns {JSX.Element} The interactive button.
 */
export default function MagneticButton({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'solid',
  size = 'md',
  className = '',
  cursor_label = 'Go',
  cursor_icon,
  disabled = false,
  strength = 0.3,
}) {
  const reduced_motion = useReducedMotion();
  const { ref, x, y, handlers } = use_magnetic(strength);

  const shared_class_name = [
    'group relative inline-flex items-center justify-center gap-2.5 rounded-pill',
    'font-display font-medium uppercase tracking-[0.12em] no-underline',
    'transition-colors duration-300 ease-springy will-change-transform',
    variant_classes[variant] ?? variant_classes.solid,
    size_classes[size] ?? size_classes.md,
    disabled ? 'pointer-events-none opacity-40' : '',
    className,
  ].join(' ');

  // Hover tilt + click squash. Disabled wholesale under reduced motion.
  const interaction_props = reduced_motion
    ? {}
    : {
        whileHover: { scale: 1.05, rotate: -1.5 },
        whileTap: { scale: 0.9, rotate: 0 },
        transition: springs.bouncy,
      };

  const inner = (
    <>
      <span>{children}</span>
      <motion.span
        aria-hidden="true"
        className="inline-block"
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        whileHover={reduced_motion ? undefined : { x: 4 }}
      >
        ↗
      </motion.span>
    </>
  );

  // Attributes the CustomCursor reads off whichever element we render.
  const cursor_props = { 'data-cursor': cursor_label, 'data-cursor-icon': cursor_icon };

  const element = (() => {
    if (to) {
      return (
        <MotionLink to={to} className={shared_class_name} {...cursor_props} {...interaction_props}>
          {inner}
        </MotionLink>
      );
    }
    if (href) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className={shared_class_name}
          {...cursor_props}
          {...interaction_props}
        >
          {inner}
        </motion.a>
      );
    }
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={shared_class_name}
        {...cursor_props}
        {...interaction_props}
      >
        {inner}
      </motion.button>
    );
  })();

  return (
    // Outer layer owns the magnetic offset so it never fights the inner
    // hover/tap transforms.
    <motion.span
      ref={ref}
      className="inline-block"
      style={reduced_motion ? undefined : { x, y }}
      {...(reduced_motion ? {} : handlers)}
    >
      {element}
    </motion.span>
  );
}
