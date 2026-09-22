/**
 * PROJECT DETAIL — dynamic case study at /work/:slug
 *
 * The page is data-driven: everything below the meta block is rendered from the
 * project's `blocks` array in `content.js`. Supported block types are 'text',
 * 'media', 'gallery' and 'quote' — add a new type by extending `render_block`.
 *
 * Scroll reveals use GSAP ScrollTrigger via `use_scroll_reveal()`; any element
 * tagged `data-reveal` animates in as it enters the viewport.
 */
import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { get_next_project, get_project_by_slug } from '../data/content';
import { springs } from '../lib/motion';
import { use_scroll_reveal } from '../hooks/use_scroll_reveal';
import PageTransition from '../components/PageTransition';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import Media from '../components/Media';
import Blob from '../components/Blob';

/** Accent token → text colour for the project's highlight colour. */
const accent_text_classes = {
  coral: 'text-coral',
  lime: 'text-lime',
  cobalt: 'text-cobalt',
};

/**
 * Renders one case-study block.
 *
 * @param {Object} block - A block object from `project.blocks`.
 * @param {number} index - Block position, used for alternating alignment.
 * @returns {JSX.Element|null} The rendered block, or null for unknown types.
 */
function render_block(block, index) {
  const is_offset_right = index % 2 === 1;

  if (block.type === 'text') {
    return (
      <div
        data-reveal
        className={[
          'max-w-xl',
          // Alternating alignment keeps the long scroll from feeling like a column.
          is_offset_right ? 'md:ml-auto md:text-right' : '',
        ].join(' ')}
      >
        {block.heading ? <h2 className="text-huge">{block.heading}</h2> : null}
        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{block.body}</p>
      </div>
    );
  }

  if (block.type === 'media') {
    return (
      <figure data-reveal className={block.wide ? '' : 'mx-auto max-w-4xl'}>
        {/* Fixed aspect ratio reserves the space before the image loads, which
            keeps ScrollTrigger positions stable (no late layout shift). */}
        <div className="aspect-[16/10] overflow-hidden rounded-[2rem] bg-sand">
          <Media
            src={block.src}
            media_kind={block.media_kind}
            alt={block.caption ?? ''}
            className="h-full w-full object-cover"
          />
        </div>
        {block.caption ? (
          <figcaption className="mt-3 text-sm text-muted">{block.caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === 'gallery') {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {block.items.map((item, item_index) => (
          <div
            key={item.src}
            data-reveal
            className={[
              'aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand',
              item_index % 2 === 1 ? 'sm:mt-12' : '',
            ].join(' ')}
          >
            <Media
              src={item.src}
              media_kind={item.media_kind}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  if (block.type === 'quote') {
    return (
      <blockquote data-reveal className="mx-auto max-w-3xl text-center">
        <p className="font-display text-huge font-semibold">“{block.body}”</p>
        <footer className="mt-6 text-sm uppercase tracking-[0.16em] text-muted">
          {block.attribution}
        </footer>
      </blockquote>
    );
  }

  return null;
}

/**
 * @returns {JSX.Element} The case study page, or a not-found state.
 */
export default function ProjectDetail() {
  const { slug } = useParams();
  const project = get_project_by_slug(slug);
  const next_project = get_next_project(slug);
  const reduced_motion = useReducedMotion();
  const body_ref = use_scroll_reveal({ y: 64, deps: [slug] });
  const hero_ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: hero_ref,
    offset: ['start start', 'end start'],
  });
  const hero_scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const hero_y = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  // Unknown slug — keep it friendly and offer a way back.
  if (!project) {
    return (
      <PageTransition>
        <section className="shell grid min-h-screen place-items-center py-32 text-center">
          <div>
            <p className="eyebrow">404</p>
            <h1 className="mt-4 text-giant">That project moved.</h1>
            <p className="mx-auto mt-5 max-w-md text-muted">
              No case study matches “{slug}”. Check the slug in{' '}
              <code>src/data/content.js</code>.
            </p>
            <div className="mt-10 flex justify-center">
              <MagneticButton to="/work" size="lg" cursor_label="Work">
                Back to all work
              </MagneticButton>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  const accent_class = accent_text_classes[project.accent] ?? accent_text_classes.coral;

  const meta_rows = [
    { label: 'Client', value: project.client },
    { label: 'Role', value: project.role },
    { label: 'Year', value: project.year },
    { label: 'Tools', value: project.tools.join(', ') },
  ];

  return (
    <PageTransition>
      {/* ── Title block ──────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden pb-10 pt-32 sm:pt-44">
        <Blob accent={project.accent} className="-right-24 top-24 h-80 w-80" />

        <div className="shell">
          <Link
            to="/work"
            className="eyebrow inline-flex items-center gap-2 no-underline hover:text-ink"
            data-cursor="Back"
            data-cursor-icon="←"
          >
            ← All work
          </Link>

          <p className={`mt-8 font-display text-sm uppercase tracking-[0.2em] ${accent_class}`}>
            {project.category}
          </p>

          <RevealText lines={[project.title]} as="h1" className="mt-3 text-mega" />

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{project.description}</p>
        </div>
      </section>

      {/* ── Hero media (parallax) ────────────────────────────────────── */}
      <section ref={hero_ref} className="shell">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-sand">
          <div className="aspect-[16/9] w-full overflow-hidden">
            <motion.div
              className="h-full w-full"
              style={reduced_motion ? undefined : { scale: hero_scale, y: hero_y }}
            >
              <Media
                src={project.hero}
                media_kind={project.hero_kind}
                alt={`${project.title} hero`}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Meta ─────────────────────────────────────────────────────── */}
      <section className="shell py-16 sm:py-20">
        <dl className="grid gap-8 border-y border-ink/10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {meta_rows.map((row) => (
            <div key={row.label}>
              <dt className="eyebrow">{row.label}</dt>
              <dd className="mt-2 font-display text-lg font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Case study body ─────────────────────────────────────────── */}
      <article ref={body_ref} className="shell flex flex-col gap-20 pb-24 sm:gap-28">
        {project.blocks.map((block, index) => (
          <div key={`${block.type}-${index}`}>{render_block(block, index)}</div>
        ))}
      </article>

      {/* ── Next project ─────────────────────────────────────────────── */}
      {next_project ? (
        <section className="shell pb-8">
          <Link
            to={`/work/${next_project.slug}`}
            className="group relative block overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 no-underline sm:px-14 sm:py-24"
            data-cursor="Next"
            data-cursor-icon="→"
            data-cursor-accent={next_project.accent}
          >
            <Blob accent={next_project.accent} className="-right-16 top-0 h-72 w-72 opacity-60" />

            <p className="eyebrow text-cream/50">Next project</p>
            <motion.h2
              className="mt-4 text-giant text-cream"
              whileHover={reduced_motion ? undefined : { x: 16, rotate: -1 }}
              transition={springs.bouncy}
            >
              {next_project.title}
            </motion.h2>
            <p className="mt-5 max-w-lg text-cream/60">{next_project.summary}</p>
          </Link>
        </section>
      ) : null}
    </PageTransition>
  );
}
