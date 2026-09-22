/**
 * Magnetic hover hook — the element leans toward the pointer and springs back
 * when it leaves. Used for primary CTAs.
 *
 * Automatically inert on touch devices and under reduced motion.
 */
import { useCallback, useRef } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { springs, is_touch_device } from '../lib/motion';

/**
 * @param {number} [strength=0.35] - How far the element follows the pointer,
 *   as a fraction of the distance from its centre (0 = still, 1 = glued).
 * @returns {{
 *   ref: import('react').RefObject<HTMLElement>,
 *   x: import('framer-motion').MotionValue<number>,
 *   y: import('framer-motion').MotionValue<number>,
 *   handlers: {onPointerMove: Function, onPointerLeave: Function}
 * }} Ref, spring-smoothed offsets, and the pointer handlers to spread.
 */
export function use_magnetic(strength = 0.35) {
  const ref = useRef(null);
  const reduced_motion = useReducedMotion();

  const raw_x = useMotionValue(0);
  const raw_y = useMotionValue(0);
  const x = useSpring(raw_x, springs.bouncy);
  const y = useSpring(raw_y, springs.bouncy);

  const on_pointer_move = useCallback(
    /** @param {import('react').PointerEvent<HTMLElement>} event */
    (event) => {
      const node = ref.current;
      if (!node || reduced_motion || is_touch_device()) return;

      const bounds = node.getBoundingClientRect();
      const offset_x = event.clientX - (bounds.left + bounds.width / 2);
      const offset_y = event.clientY - (bounds.top + bounds.height / 2);

      raw_x.set(offset_x * strength);
      raw_y.set(offset_y * strength);
    },
    [raw_x, raw_y, reduced_motion, strength],
  );

  const on_pointer_leave = useCallback(() => {
    raw_x.set(0);
    raw_y.set(0);
  }, [raw_x, raw_y]);

  return {
    ref,
    x,
    y,
    handlers: { onPointerMove: on_pointer_move, onPointerLeave: on_pointer_leave },
  };
}
