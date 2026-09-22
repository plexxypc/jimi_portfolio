/**
 * ABOUT
 *
 * Sections: intro + stats, portrait/bio, "How I work" process steps
 * (GSAP reveal), and an animated tools marquee.
 *
 * All copy lives in `content.js` (`site_info`, `founder`, `stats`,
 * `process_steps`, `skills`).
 */
import { motion, useReducedMotion } from 'framer-motion';
import { founder, process_steps, skills, stats, site_info } from '../data/content';
import { fade_up, in_view_props, springs, stagger_container } from '../lib/motion';
import { use_scroll_reveal } from '../hooks/use_scroll_reveal';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import Marquee from '../components/Marquee';
import Blob from '../components/Blob';

/** Rotating accent used behind the process step numbers. */
const step_accents = ['bg-coral text-cream', 'bg-lime text-ink', 'bg-cobalt text-cream', 'bg-ink text-cream'];

/**
 * @returns {JSX.Element} The about page.
 */
export default function About() {
  const reduced_motion = useReducedMotion();
  const process_ref = use_scroll_reveal({ y: 48 });
  const profile_ref = use_scroll_reveal({ y: 56 });

  return (
    <PageTransition>
      {/* ── Intro ────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden pb-16 pt-32 sm:pt-44">
        <Blob accent="cobalt" className="-left-24 top-28 h-80 w-80" />
        <Blob accent="lime" className="-right-16 top-72 h-72 w-72 opacity-70" delay={2} />

        <div className="shell">
          <p className="eyebrow mb-6">About me</p>
          <RevealText
            lines={['One designer', 'with a loud', 'sense of motion.']}
            as="h1"
            className="text-mega"
          />

          <motion.div
            className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr]"
            variants={stagger_container(0.1)}
            {...in_view_props(0.2)}
          >
            <motion.div variants={fade_up(24)} className="space-y-6 text-lg leading-relaxed text-muted">
              {/* REPLACE: your story. Keep it to two or three paragraphs. */}
              <p>{site_info.intro}</p>
              <p>
                Placeholder copy: I started in {site_info.since} making title sequences for friends,
                and somehow never stopped. Today I work with in-house teams who want the energy of an
                independent designer without losing the rigour of a system.
              </p>
              <p>
                Placeholder copy: I care about craft, deadlines and making the work genuinely fun to
                look at. Usually in that order — occasionally in reverse.
              </p>
            </motion.div>

            <motion.dl variants={fade_up(24)} className="grid grid-cols-3 gap-6 self-start lg:grid-cols-1">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-squish border border-ink/10 bg-sand/50 p-5">
                  <dt className="font-display text-3xl font-semibold sm:text-4xl">{stat.value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">{stat.label}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>
      </section>

      {/* ── Portrait + bio ───────────────────────────────────────────── */}
      <section ref={profile_ref} className="shell py-20 sm:py-24">
        <SectionHeading eyebrow="Who you'll work with" title={`Hi, I’m ${founder.name}.`} />

        <div className="mt-14 grid items-center gap-10 sm:grid-cols-2 lg:gap-16">
          <motion.div
            data-reveal
            className="group"
            whileHover={reduced_motion ? undefined : { y: -10, rotate: -1.2 }}
            transition={springs.bouncy}
            data-cursor="Hello"
            data-cursor-icon="👋"
          >
            <div className="overflow-hidden rounded-squish bg-sand">
              <img
                // REPLACE: real portrait in /public (e.g. '/media/portrait.jpg').
                src={founder.portrait}
                alt={founder.name}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-springy group-hover:scale-[1.06]"
              />
            </div>
          </motion.div>

          <div data-reveal>
            <p className="text-sm uppercase tracking-[0.14em] text-coral">{founder.role}</p>
            <p className="mt-5 text-lg leading-relaxed text-muted sm:text-xl">{founder.bio}</p>
            <p className="mt-6 text-muted">
              Placeholder copy: you work with me directly — no account managers, no handoffs between
              five people, no telephone game between the brief and the render.
            </p>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────── */}
      <section ref={process_ref} className="shell py-20 sm:py-24">
        <SectionHeading
          eyebrow="Process"
          title={'How I work.'}
          lead="Four steps, no mystery. Same shape whether the project is a 15-second bumper or a full rebrand."
        />

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process_steps.map((step, index) => (
            <motion.li
              key={step.step}
              data-reveal
              className="flex flex-col gap-4 rounded-squish border border-ink/10 p-6"
              whileHover={reduced_motion ? undefined : { y: -8, rotate: index % 2 === 0 ? 1 : -1 }}
              transition={springs.bouncy}
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-full font-display text-sm font-semibold ${
                  step_accents[index % step_accents.length]
                }`}
              >
                {step.step}
              </span>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ── Tools marquee ────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="shell">
          <p className="eyebrow">Tools of the trade</p>
        </div>
        <Marquee
          items={skills}
          duration={26}
          className="mt-6 border-y border-ink/10 py-6"
          item_class_name="font-display text-xl uppercase tracking-tight text-ink/70 sm:text-3xl"
        />
        <Marquee
          items={[...skills].reverse()}
          duration={32}
          direction="right"
          separator="●"
          className="border-b border-ink/10 py-6"
          item_class_name="font-display text-xl uppercase tracking-tight text-ink/30 sm:text-3xl"
        />
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="shell py-16 text-center">
        <h2 className="text-giant">Want the long version?</h2>
        <p className="mx-auto mt-5 max-w-md text-muted">
          I’ll happily talk you through the process over a call.
        </p>
        <div className="mt-10 flex justify-center">
          <MagneticButton to="/contact" size="lg" variant="coral" cursor_label="Say hi">
            Get in touch
          </MagneticButton>
        </div>
      </section>
    </PageTransition>
  );
}
