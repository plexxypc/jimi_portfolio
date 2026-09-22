/**
 * ProjectCard — the portfolio tile used on Home and Work.
 *
 * Interactions: image scales and drifts (parallax) as the card moves through
 * the viewport, the whole card tilts on hover, the accent colour floods in
 * behind it, and the custom cursor morphs into a "View" blob.
 *
 * Carries `data-reveal-item` so a parent `use_stagger_reveal()` can cascade a
 * whole grid in without wiring anything per card.
 */
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Media from './Media';
import { springs } from '../lib/motion';

/** Accent token → tint + tag colours. */
const accent_classes = {
  coral: { tint: 'bg-coral', tag: 'bg-coral text-cream', glow: 'bg-coral/30' },
  lime: { tint: 'bg-lime', tag: 'bg-lime text-ink', glow: 'bg-lime/40' },
  cobalt: { tint: 'bg-cobalt', tag: 'bg-cobalt text-cream', glow: 'bg-cobalt/25' },
};

/** Aspect ratios for a loose masonry feel without a masonry library. */
const size_classes = {
  tall: 'aspect-[3/4]',
  standard: 'aspect-[4/5]',
  wide: 'aspect-[16/11]',
};

/**
 * @param {Object} props - Component props.
 * @param {Object} props.project - A project entry from `content.js`.
 * @param {number} [props.index=0] - Position in the grid; drives the 01/02 label.
 * @param {'tall'|'standard'|'wide'} [props.size='standard'] - Thumbnail aspect ratio.
 * @param {boolean} [props.show_summary=true] - Show the one-line summary under the title.
 * @param {string} [props.className] - Extra classes for the card wrapper.
 * @returns {JSX.Element} The project card.
 */
export default function ProjectCard({
  project,
  index = 0,
  size = 'standard',
  show_summary = true,
  className = '',
}) {
  const card_ref = useRef(null);
  const [is_hovered, set_is_hovered] = useState(false);
  const reduced_motion = useReducedMotion();
  const accent = accent_classes[project.accent] ?? accent_classes.coral;

  // Scroll parallax: the thumbnail drifts against the card as it passes through.
  const { scrollYProgress } = useScroll({
    target: card_ref,
    offset: ['start end', 'end start'],
  });
  const parallax_raw = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const parallax_y = useSpring(parallax_raw, springs.heavy);

  return (
    <motion.article
      ref={card_ref}
      data-reveal-item
      className={`group relative ${className}`}
      onHoverStart={() => set_is_hovered(true)}
      onHoverEnd={() => set_is_hovered(false)}
      whileHover={reduced_motion ? undefined : { rotate: index % 2 === 0 ? -1.4 : 1.4, y: -8 }}
      transition={springs.bouncy}
    >
      <Link
        to={`/work/${project.slug}`}
        className="block no-underline"
        data-cursor="View"
        data-cursor-icon="👀"
        data-cursor-accent={project.accent}
        aria-label={`${project.title} — ${project.category} case study`}
      >
        <div className="relative overflow-hidden rounded-squish bg-sand">
          {/* Accent flood behind the image. */}
          <motion.div
            aria-hidden="true"
            className={`absolute inset-0 ${accent.tint}`}
            animate={{ opacity: is_hovered && !reduced_motion ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          <div className={`relative overflow-hidden ${size_classes[size] ?? size_classes.standard}`}>
            <motion.div
              className="absolute inset-[-6%]"
              style={reduced_motion ? undefined : { y: parallax_y }}
            >
              <motion.div
                className="h-full w-full"
                animate={{ scale: is_hovered && !reduced_motion ? 1.08 : 1 }}
                transition={springs.soft}
              >
                <Media
                  src={project.thumbnail}
                  media_kind={project.thumbnail_kind}
                  alt={`${project.title} thumbnail`}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Index label + category pill overlay. */}
          <div className="pointer-events-none absolute inset-0 flex items-start justify-between p-4">
            <span className="font-display text-xs font-semibold tracking-[0.2em] text-cream mix-blend-difference">
              {String(index + 1).padStart(2, '0')}
            </span>
            <motion.span
              className={`rounded-pill px-3 py-1 font-display text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${accent.tag}`}
              animate={{
                y: is_hovered && !reduced_motion ? 0 : -6,
                opacity: is_hovered && !reduced_motion ? 1 : 0,
              }}
              transition={springs.snappy}
            >
              {project.category}
            </motion.span>
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold leading-tight sm:text-2xl">{project.title}</h3>
            {show_summary ? (
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{project.summary}</p>
            ) : null}
          </div>
          <span className="mt-1 shrink-0 font-display text-xs uppercase tracking-[0.16em] text-muted">
            {project.year}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
