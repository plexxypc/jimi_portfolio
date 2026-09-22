/**
 * GSAP ScrollTrigger reveal hooks.
 *
 * Usage — mark up what should animate, no per-element JS required:
 *
 *   const section_ref = use_scroll_reveal();
 *   <section ref={section_ref}>
 *     <h2 data-reveal>Heading</h2>
 *     <img data-reveal />
 *   </section>
 *
 * Both hooks bail out (and leave content fully visible) when the user prefers
 * reduced motion, so nothing is ever hidden behind an animation that won't run.
 */
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from '../lib/gsap';
import { gsap_eases } from '../lib/motion';

/**
 * Reveals each matching descendant on its own ScrollTrigger.
 *
 * @param {Object} [options] - Reveal configuration.
 * @param {string} [options.selector='[data-reveal]'] - Descendant selector to animate.
 * @param {number} [options.y=56] - Pixels to travel upward into place.
 * @param {number} [options.duration=1] - Tween duration in seconds.
 * @param {string} [options.start='top 88%'] - ScrollTrigger start position.
 * @param {string} [options.ease=gsap_eases.pop] - GSAP ease string.
 * @param {Array<unknown>} [options.deps=[]] - Re-create triggers when these change.
 * @returns {import('react').RefObject<HTMLElement>} Ref to attach to the container.
 */
export function use_scroll_reveal(options = {}) {
  const {
    selector = '[data-reveal]',
    y = 56,
    duration = 1,
    start = 'top 88%',
    ease = gsap_eases.pop,
    deps = [],
  } = options;

  const container_ref = useRef(null);
  const reduced_motion = useReducedMotion();

  useEffect(() => {
    const root = container_ref.current;
    if (!root) return undefined;

    const targets = gsap.utils.toArray(selector, root);
    if (targets.length === 0) return undefined;

    // Reduced motion: make sure everything is simply visible.
    if (reduced_motion) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' });
      return undefined;
    }

    const context = gsap.context(() => {
      targets.forEach((target) => {
        gsap.from(target, {
          opacity: 0,
          y,
          duration,
          ease,
          scrollTrigger: {
            trigger: target,
            start,
            toggleActions: 'play none none none',
            // Re-measure on refresh so late layout shifts can't leave the
            // reveal firing at the wrong scroll position.
            invalidateOnRefresh: true,
          },
        });
      });
    }, root);

    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, y, duration, start, ease, reduced_motion, ...deps]);

  return container_ref;
}

/**
 * Reveals matching descendants together, staggered, on a single trigger tied to
 * the container. Best for grids and lists where items should cascade.
 *
 * @param {Object} [options] - Reveal configuration.
 * @param {string} [options.selector='[data-reveal-item]'] - Descendant selector.
 * @param {number} [options.y=64] - Pixels to travel upward into place.
 * @param {number} [options.stagger=0.1] - Delay between items, in seconds.
 * @param {number} [options.duration=1] - Tween duration in seconds.
 * @param {string} [options.start='top 85%'] - ScrollTrigger start position.
 * @param {string} [options.ease=gsap_eases.pop] - GSAP ease string.
 * @param {Array<unknown>} [options.deps=[]] - Re-create triggers when these change.
 * @returns {import('react').RefObject<HTMLElement>} Ref to attach to the container.
 */
export function use_stagger_reveal(options = {}) {
  const {
    selector = '[data-reveal-item]',
    y = 64,
    stagger = 0.1,
    duration = 1,
    start = 'top 85%',
    ease = gsap_eases.pop,
    deps = [],
  } = options;

  const container_ref = useRef(null);
  const reduced_motion = useReducedMotion();

  useEffect(() => {
    const root = container_ref.current;
    if (!root) return undefined;

    const targets = gsap.utils.toArray(selector, root);
    if (targets.length === 0) return undefined;

    if (reduced_motion) {
      gsap.set(targets, { opacity: 1, y: 0, scale: 1, clearProps: 'transform' });
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        scale: 0.96,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: root,
          start,
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, y, stagger, duration, start, ease, reduced_motion, ...deps]);

  return container_ref;
}
