/**
 * CustomCursor — a springy dot that morphs into a labelled blob over
 * interactive elements.
 *
 * ── HOW TO USE IT ──────────────────────────────────────────────────────────
 * Any element can drive the cursor with data attributes, so new content picks
 * this up for free:
 *
 *   <a data-cursor="View">…</a>                     → label blob
 *   <button data-cursor="Play" data-cursor-icon="▶">  → label + icon
 *   <div data-cursor="Drag" data-cursor-accent="lime"> → tinted blob
 *
 * Plain <a> / <button> elements without the attribute still get a subtle
 * "link" state automatically.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Never renders on touch devices or when reduced motion is requested — the
 * native cursor is left alone in both cases.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { springs, is_touch_device } from '../lib/motion';

/** Accent token → Tailwind classes for the label blob. */
const accent_classes = {
  coral: 'bg-coral text-cream',
  lime: 'bg-lime text-ink',
  cobalt: 'bg-cobalt text-cream',
};

/**
 * @returns {JSX.Element|null} The cursor layer, or null on unsupported devices.
 */
export default function CustomCursor() {
  const reduced_motion = useReducedMotion();
  const [is_enabled, set_is_enabled] = useState(false);
  const [is_visible, set_is_visible] = useState(false);
  const [is_pressed, set_is_pressed] = useState(false);
  const [hover_state, set_hover_state] = useState({ kind: 'default', label: '', icon: '', accent: 'coral' });

  const pointer_x = useMotionValue(-100);
  const pointer_y = useMotionValue(-100);
  // Slightly under-damped so the cursor trails and settles with a touch of life.
  const x = useSpring(pointer_x, { stiffness: 900, damping: 40, mass: 0.35 });
  const y = useSpring(pointer_y, { stiffness: 900, damping: 40, mass: 0.35 });

  // Decide once on mount whether the custom cursor should exist at all.
  useEffect(() => {
    const enabled = !is_touch_device() && !reduced_motion;
    set_is_enabled(enabled);

    if (enabled) document.body.classList.add('cursor-none-fine');
    return () => document.body.classList.remove('cursor-none-fine');
  }, [reduced_motion]);

  useEffect(() => {
    if (!is_enabled) return undefined;

    /** @param {PointerEvent} event */
    const on_pointer_move = (event) => {
      pointer_x.set(event.clientX);
      pointer_y.set(event.clientY);
      set_is_visible(true);

      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const labelled = target.closest('[data-cursor]');
      if (labelled) {
        set_hover_state({
          kind: 'label',
          label: labelled.getAttribute('data-cursor') ?? '',
          icon: labelled.getAttribute('data-cursor-icon') ?? '',
          accent: labelled.getAttribute('data-cursor-accent') ?? 'coral',
        });
        return;
      }

      const interactive = target.closest('a, button, input, textarea, select, [role="button"]');
      set_hover_state({
        kind: interactive ? 'link' : 'default',
        label: '',
        icon: '',
        accent: 'coral',
      });
    };

    const on_leave = () => set_is_visible(false);
    const on_down = () => set_is_pressed(true);
    const on_up = () => set_is_pressed(false);

    window.addEventListener('pointermove', on_pointer_move, { passive: true });
    window.addEventListener('pointerdown', on_down);
    window.addEventListener('pointerup', on_up);
    document.addEventListener('mouseleave', on_leave);

    return () => {
      window.removeEventListener('pointermove', on_pointer_move);
      window.removeEventListener('pointerdown', on_down);
      window.removeEventListener('pointerup', on_up);
      document.removeEventListener('mouseleave', on_leave);
    };
  }, [is_enabled, pointer_x, pointer_y]);

  if (!is_enabled) return null;

  const is_label = hover_state.kind === 'label';
  const is_link = hover_state.kind === 'link';
  const press_scale = is_pressed ? 0.82 : 1;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[130] hidden lg:block"
    >
      <motion.div
        className="absolute left-0 top-0"
        style={{ x, y }}
        animate={{ opacity: is_visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            className={[
              'flex items-center justify-center overflow-hidden',
              is_label
                ? `${accent_classes[hover_state.accent] ?? accent_classes.coral} shadow-lift`
                : 'bg-ink',
            ].join(' ')}
            animate={{
              width: is_label ? 86 : is_link ? 38 : 14,
              height: is_label ? 86 : is_link ? 38 : 14,
              // Squircle → circle → dot, with a lazy spin on the label state.
              borderRadius: is_label ? '42%' : '999px',
              rotate: is_label ? -8 : 0,
              scale: press_scale,
              opacity: is_link ? 0.28 : 1,
            }}
            transition={springs.bouncy}
          >
            <AnimatePresence mode="popLayout">
              {is_label ? (
                <motion.span
                  key={`${hover_state.label}-${hover_state.icon}`}
                  initial={{ opacity: 0, scale: 0.5, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -8 }}
                  transition={springs.snappy}
                  className="flex flex-col items-center gap-0.5 px-2 text-center font-display text-[0.62rem] font-semibold uppercase leading-none tracking-[0.12em]"
                >
                  {hover_state.icon ? <span className="text-sm">{hover_state.icon}</span> : null}
                  {hover_state.label}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
