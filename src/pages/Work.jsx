/**
 * WORK — the full portfolio grid.
 *
 * Filtering is driven by `project_categories` in `content.js`; a project joins a
 * filter simply by using that string as its `category`. Add a category there and
 * the chip appears automatically.
 *
 * Grid entry/exit is handled by Framer Motion (layout + AnimatePresence) rather
 * than GSAP, so re-filtering animates smoothly instead of fighting a
 * ScrollTrigger that was built for the previous list.
 */
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { filter_projects_by_category, project_categories } from '../data/content';
import { fade_up, springs, stagger_container } from '../lib/motion';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import Blob from '../components/Blob';

/** Cycles card aspect ratios so the grid reads as loose masonry. */
const size_cycle = ['standard', 'tall', 'wide', 'standard', 'wide', 'tall'];

/**
 * @returns {JSX.Element} The work index page.
 */
export default function Work() {
  const [active_category, set_active_category] = useState('All');
  const reduced_motion = useReducedMotion();

  const categories = useMemo(() => ['All', ...project_categories], []);
  const visible_projects = useMemo(
    () => filter_projects_by_category(active_category),
    [active_category],
  );

  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-44">
        <Blob accent="lime" className="-right-24 top-20 h-80 w-80" />
        <Blob accent="coral" className="-left-20 top-64 h-64 w-64 opacity-70" delay={3} />

        <div className="shell">
          <SectionHeading
            eyebrow={`${visible_projects.length} projects`}
            title={'Selected\nwork.'}
            lead="Motion, branding, web and illustration. Placeholder case studies — replace the entries in content.js with your own work."
            heading_tag="h1"
          />

          {/* ── Filter chips ───────────────────────────────────────────── */}
          <motion.div
            className="mt-12 flex flex-wrap gap-3"
            variants={stagger_container(0.05)}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category) => {
              const is_active = category === active_category;
              return (
                <motion.button
                  key={category}
                  type="button"
                  variants={fade_up(12)}
                  onClick={() => set_active_category(category)}
                  aria-pressed={is_active}
                  className={[
                    'relative rounded-pill border px-5 py-2.5 font-display text-xs font-medium uppercase tracking-[0.14em]',
                    'transition-colors duration-300 ease-springy',
                    is_active
                      ? 'border-ink bg-ink text-cream'
                      : 'border-ink/15 bg-transparent text-muted hover:border-ink hover:text-ink',
                  ].join(' ')}
                  whileHover={reduced_motion ? undefined : { y: -3, rotate: -1.5 }}
                  whileTap={reduced_motion ? undefined : { scale: 0.92 }}
                  transition={springs.bouncy}
                  data-cursor="Filter"
                  data-cursor-icon="⌗"
                >
                  {category}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <section className="shell pb-24">
        <motion.div layout className="grid gap-10 sm:grid-cols-2 sm:gap-x-8 lg:gap-x-12 lg:gap-y-20">
          <AnimatePresence mode="popLayout">
            {visible_projects.map((project, index) => (
              <motion.div
                key={project.slug}
                layout
                initial={reduced_motion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced_motion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -20 }}
                transition={{ ...springs.soft, delay: reduced_motion ? 0 : index * 0.05 }}
                className={index % 2 === 1 ? 'sm:mt-16' : ''}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  size={size_cycle[index % size_cycle.length]}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible_projects.length === 0 ? (
          <p className="py-20 text-center text-muted">
            No projects in this category yet — add one in <code>src/data/content.js</code>.
          </p>
        ) : null}
      </section>
    </PageTransition>
  );
}
