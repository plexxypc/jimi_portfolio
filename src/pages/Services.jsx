/**
 * SERVICES
 *
 * Each service from `content.js` becomes an expandable card: the row springs
 * open to reveal the long description and deliverables list. The structure is
 * deliberately shallow (title / blurb / body / deliverables) so real copy can
 * drop straight in.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { services } from '../data/content';
import { scroll_trigger } from '../lib/gsap';
import { fade_up, in_view_props, springs, stagger_container } from '../lib/motion';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import Blob from '../components/Blob';

/** Accent token → open-state background + text colours. */
const accent_classes = {
  coral: { surface: 'bg-coral/10 border-coral/40', dot: 'bg-coral', text: 'text-coral' },
  lime: { surface: 'bg-lime/20 border-lime/60', dot: 'bg-lime', text: 'text-ink' },
  cobalt: { surface: 'bg-cobalt/10 border-cobalt/40', dot: 'bg-cobalt', text: 'text-cobalt' },
};

/**
 * @returns {JSX.Element} The services page.
 */
export default function Services() {
  // First card starts open so the page never looks like a bare list.
  const [open_id, set_open_id] = useState(services[0]?.id ?? null);
  const reduced_motion = useReducedMotion();

  // Expanding a card changes page height — let ScrollTrigger re-measure.
  useEffect(() => {
    const refresh_id = window.setTimeout(() => scroll_trigger.refresh(), 420);
    return () => window.clearTimeout(refresh_id);
  }, [open_id]);

  /**
   * Toggles a card open, closing whichever was open.
   *
   * @param {string} service_id - The `id` of the clicked service.
   * @returns {void}
   */
  const toggle_service = (service_id) => {
    set_open_id((current) => (current === service_id ? null : service_id));
  };

  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-44">
        <Blob accent="coral" className="-right-20 top-24 h-80 w-80" />
        <Blob accent="cobalt" className="-left-24 top-72 h-64 w-64 opacity-60" delay={2} />

        <div className="shell">
          <p className="eyebrow mb-6">Services</p>
          <RevealText
            lines={['What I do,', 'and how far', 'I take it.']}
            as="h1"
            className="text-mega"
          />
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            Four core offers. Most projects combine two or three — placeholder descriptions below,
            ready for real scopes and deliverables.
          </p>
        </div>
      </section>

      {/* ── Expandable service cards ─────────────────────────────────── */}
      <section className="shell py-12 sm:py-16">
        <motion.div
          className="flex flex-col gap-4"
          variants={stagger_container(0.09)}
          {...in_view_props(0.1)}
        >
          {services.map((service, index) => {
            const is_open = open_id === service.id;
            const accent = accent_classes[service.accent] ?? accent_classes.coral;

            return (
              <motion.div
                key={service.id}
                variants={fade_up(28)}
                className={[
                  'overflow-hidden rounded-squish border transition-colors duration-500',
                  is_open ? accent.surface : 'border-ink/10 bg-transparent hover:border-ink/30',
                ].join(' ')}
              >
                <motion.button
                  type="button"
                  onClick={() => toggle_service(service.id)}
                  aria-expanded={is_open}
                  aria-controls={`service-panel-${service.id}`}
                  className="flex w-full items-center justify-between gap-6 px-6 py-7 text-left sm:px-9"
                  whileTap={reduced_motion ? undefined : { scale: 0.99 }}
                  data-cursor={is_open ? 'Close' : 'Open'}
                  data-cursor-icon={is_open ? '−' : '+'}
                  data-cursor-accent={service.accent}
                >
                  <div className="flex items-center gap-5">
                    <motion.span
                      aria-hidden="true"
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream text-xl shadow-sm"
                      animate={
                        reduced_motion
                          ? undefined
                          : { rotate: is_open ? [0, -12, 12, 0] : 0, scale: is_open ? 1.08 : 1 }
                      }
                      transition={springs.bouncy}
                    >
                      {service.icon}
                    </motion.span>

                    <div>
                      <span className="font-display text-xs uppercase tracking-[0.18em] text-muted">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-2xl font-semibold leading-tight sm:text-4xl">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <motion.span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/15 font-display text-lg"
                    animate={{ rotate: is_open ? 135 : 0 }}
                    transition={springs.bouncy}
                  >
                    +
                  </motion.span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {is_open ? (
                    <motion.div
                      id={`service-panel-${service.id}`}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={
                        reduced_motion
                          ? { duration: 0.15 }
                          : { type: 'spring', stiffness: 200, damping: 26 }
                      }
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 px-6 pb-9 sm:grid-cols-[1.4fr_1fr] sm:px-9">
                        <p className="max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
                          {service.body}
                        </p>

                        <ul className="space-y-3">
                          <li className="eyebrow">Deliverables</li>
                          {service.deliverables.map((deliverable) => (
                            <li key={deliverable} className="flex items-start gap-3 text-sm">
                              <span
                                aria-hidden="true"
                                className={`mt-1.5 block h-2 w-2 shrink-0 rounded-full ${accent.dot}`}
                              />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Engagement note + CTA ────────────────────────────────────── */}
      <section className="shell py-16">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-sand px-6 py-16 sm:px-14">
          <Blob accent="lime" className="-right-10 top-0 h-64 w-64 opacity-80" />

          <SectionHeading
            eyebrow="How we work together"
            title={'Project, retainer,\nor a day rate.'}
            lead="Placeholder copy: most work runs as a fixed-scope project. For teams shipping constantly I also offer monthly retainers and single-day sprints."
            action={
              <MagneticButton to="/contact" size="lg" variant="coral" cursor_label="Say hi">
                Request a quote
              </MagneticButton>
            }
          />
        </div>
      </section>
    </PageTransition>
  );
}
