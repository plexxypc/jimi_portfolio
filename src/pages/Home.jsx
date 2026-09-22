/**
 * HOME
 *
 * Sections, in order:
 *   1. Hero            — staggered line reveal + scroll-scrubbed visual
 *   2. Featured work   — 4 project cards, cascading in on scroll
 *   3. Statement       — GSAP ScrollTrigger word-by-word highlight
 *   4. Services teaser — expanding rows linking to /services
 *   5. Social proof    — client logo marquee + testimonials
 *   6. Closing CTA     — magnetic button to /contact
 *
 * Copy comes from `content.js`. To drop in a 3D hero, see the Spline note in
 * the hero section below.
 */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  client_logos,
  get_featured_projects,
  services,
  site_info,
  testimonials,
} from '../data/content';
import { gsap } from '../lib/gsap';
import { fade_up, gsap_eases, in_view_props, springs, stagger_container } from '../lib/motion';
import { use_scroll_reveal, use_stagger_reveal } from '../hooks/use_scroll_reveal';
import PageTransition from '../components/PageTransition';
import RevealText from '../components/RevealText';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import MagneticButton from '../components/MagneticButton';
import Marquee from '../components/Marquee';
import Blob from '../components/Blob';

/** Grid sizing pattern for the featured cards — keeps the layout lively. */
const featured_sizes = ['tall', 'standard', 'standard', 'tall'];

/**
 * @returns {JSX.Element} The home page.
 */
export default function Home() {
  const reduced_motion = useReducedMotion();
  const featured_projects = get_featured_projects(4);

  const hero_ref = useRef(null);
  const statement_ref = useRef(null);
  const work_grid_ref = use_stagger_reveal({ stagger: 0.12 });
  const services_ref = use_scroll_reveal({ y: 40 });
  const proof_ref = use_scroll_reveal({ y: 32 });

  // Hero visual drifts and shrinks slightly as the page scrolls away.
  const { scrollYProgress: hero_progress } = useScroll({
    target: hero_ref,
    offset: ['start start', 'end start'],
  });
  const hero_visual_y = useTransform(hero_progress, [0, 1], ['0%', '18%']);
  const hero_visual_scale = useTransform(hero_progress, [0, 1], [1, 1.12]);
  const hero_text_opacity = useTransform(hero_progress, [0, 0.7], [1, 0]);

  // Statement: each word lifts from muted to ink as it scrubs through view.
  useEffect(() => {
    const root = statement_ref.current;
    if (!root || reduced_motion) return undefined;

    const context = gsap.context(() => {
      const words = gsap.utils.toArray('[data-word]', root);
      gsap.fromTo(
        words,
        { opacity: 0.18, y: 12 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: gsap_eases.glide,
          duration: 0.6,
          scrollTrigger: {
            trigger: root,
            start: 'top 78%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        },
      );
    }, root);

    return () => context.revert();
  }, [reduced_motion]);

  return (
    <PageTransition>
      {/* ═══ 1. HERO ═══════════════════════════════════════════════════ */}
      <section ref={hero_ref} className="relative isolate overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
        <Blob accent="coral" className="-left-24 top-24 h-[22rem] w-[22rem]" />
        <Blob accent="lime" className="-right-20 top-56 h-[26rem] w-[26rem]" delay={2.5} />
        <Blob accent="cobalt" className="bottom-0 left-1/3 h-72 w-72 opacity-70" delay={5} />

        <div className="shell">
          <motion.div style={reduced_motion ? undefined : { opacity: hero_text_opacity }}>
           {/* <motion.p
              className="tag-pill mb-8"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.bouncy, delay: 0.1 }}
            >
              {/*<span className="inline-block h-2 w-2 animate-pulse rounded-full bg-coral" />
              {/*{site_info.availability}
            </motion.p>*/}

            <RevealText
              lines={site_info.hero_lines}
              as="h1"
              className="text-mega"
              stagger={0.11}
              delay={0.15}
            />

            <motion.div
              className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center"
              variants={stagger_container(0.1, 0.6)}
              initial="hidden"
              animate="visible"
            >
              <motion.p variants={fade_up(18)} className="max-w-md text-lg leading-relaxed text-muted">
                {site_info.tagline} {site_info.intro}
              </motion.p>

              <motion.div variants={fade_up(18)} className="flex flex-wrap items-center gap-4">
                <MagneticButton
                  to="/work"
                  size="lg"
                  cursor_label="View"
                  cursor_icon="👀"
                  variant="solid"
                >
                  See the work
                </MagneticButton>
                <MagneticButton
                  to="/contact"
                  size="lg"
                  variant="outline"
                  cursor_label="Say hi"
                  cursor_icon="👋"
                  strength={0.22}
                >
                  Start a project
                </MagneticButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero visual.
            SPLINE SWAP-IN: replace this block with
              <Spline scene="https://prod.spline.design/…/scene.splinecode" />
            after `npm i @splinetool/react-spline`. Keep the rounded wrapper and
            the `reduced_motion` guard so the 3D scene stays optional. */}
        <div className="shell mt-16">
          <motion.div
            className="relative overflow-hidden rounded-[2.5rem] bg-sand"
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...springs.heavy, delay: 0.45 }}
            data-cursor="Play"
            data-cursor-icon="▶"
            data-cursor-accent="lime"
          >
            <div className="aspect-[16/9] w-full overflow-hidden">
              <motion.img
                // REPLACE: studio reel poster frame or a looping <video>.
                src="https://picsum.photos/seed/kinetic-hero/2000/1125"
                alt="Studio reel poster frame"
                className="h-full w-full object-cover"
                style={reduced_motion ? undefined : { y: hero_visual_y, scale: hero_visual_scale }}
              />
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-5 sm:p-8">
              <span className="tag-pill bg-cream/80">{site_info.reel_label}</span>
              <span className="hidden font-display text-xs uppercase tracking-[0.2em] text-cream mix-blend-difference sm:block">
                Since {site_info.since}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. FEATURED WORK ══════════════════════════════════════════ */}
      <section className="shell py-20 sm:py-28">
        <SectionHeading
          eyebrow="Selected work"
          title={'Things I made\nmove.'}
          lead="A few recent projects. Placeholder thumbnails and copy — swap them in content.js."
          action={
            <MagneticButton to="/work" variant="outline" cursor_label="All work">
              All projects
            </MagneticButton>
          }
        />

        <div
          ref={work_grid_ref}
          className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-x-8 lg:gap-x-12 lg:gap-y-20"
        >
          {featured_projects.map((project, index) => (
            <div key={project.slug} className={index % 2 === 1 ? 'sm:mt-16' : ''}>
              <ProjectCard project={project} index={index} size={featured_sizes[index] ?? 'standard'} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. STATEMENT (GSAP scrub) ═════════════════════════════════ */}
      <section className="shell py-20 sm:py-28">
        <p
          ref={statement_ref}
          className="mx-auto max-w-4xl text-center font-display text-huge font-semibold"
        >
          {'I design motion systems, not one-off renders — so your brand keeps moving long after I hand it over.'
            .split(' ')
            .map((word, index) => (
              <span key={`${word}-${index}`} data-word className="inline-block">
                {word}
                {'\u00A0'}
              </span>
            ))}
        </p>
      </section>

      {/* ═══ 4. SERVICES TEASER ════════════════════════════════════════ */}
      <section ref={services_ref} className="shell py-20 sm:py-28">
        <SectionHeading
          eyebrow="What I do"
          title={'Four ways\nI can help.'}
          action={
            <MagneticButton to="/services" variant="outline" cursor_label="Services">
              All services
            </MagneticButton>
          }
        />

        <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {services.map((service, index) => (
            <li key={service.id} data-reveal>
              <Link
                to="/services"
                className="group flex items-center justify-between gap-6 py-7 no-underline"
                data-cursor="Explore"
                data-cursor-accent={service.accent}
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-xs text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <motion.h3
                    className="text-2xl font-semibold sm:text-4xl"
                    whileHover={reduced_motion ? undefined : { x: 14, rotate: -1 }}
                    transition={springs.bouncy}
                  >
                    {service.title}
                  </motion.h3>
                </div>
                <div className="flex items-center gap-6">
                  <p className="hidden max-w-xs text-sm text-muted md:block">{service.blurb}</p>
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/10 transition-all duration-300 ease-springy group-hover:scale-110 group-hover:border-coral group-hover:bg-coral group-hover:text-cream"
                  >
                    ↗
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══ 5. SOCIAL PROOF ═══════════════════════════════════════════ */}
      <section ref={proof_ref} className="py-20 sm:py-28">
        <div className="shell">
          <p className="eyebrow text-center" data-reveal>
            Trusted by nice people at
          </p>
        </div>

        {/* REPLACE: swap text labels for <img> logo files in /public/logos. */}
        <Marquee
          items={client_logos.map((logo) => logo.label)}
          duration={30}
          className="mt-8 py-4"
          item_class_name="font-display text-2xl font-semibold uppercase tracking-tight text-ink/35 sm:text-4xl"
        />

        <motion.div
          className="shell mt-16 grid gap-6 md:grid-cols-3"
          variants={stagger_container(0.12)}
          {...in_view_props(0.2)}
        >
          {testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={testimonial.name + testimonial.company}
              variants={fade_up(28)}
              whileHover={reduced_motion ? undefined : { y: -8, rotate: index % 2 === 0 ? 1.2 : -1.2 }}
              transition={springs.bouncy}
              className="rounded-squish border border-ink/10 bg-sand/60 p-7"
            >
              <p className="text-lg leading-relaxed">“{testimonial.quote}”</p>
              <footer className="mt-6 text-sm text-muted">
                <span className="font-medium text-ink">{testimonial.name}</span> · {testimonial.company}
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </section>

      {/* ═══ 6. CLOSING CTA ════════════════════════════════════════════ */}
      <section className="shell pb-10 pt-8">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-lime px-6 py-20 text-center sm:px-16">
          <Blob accent="coral" className="-left-10 top-0 h-64 w-64 opacity-70" />
          <Blob accent="cobalt" className="-right-8 bottom-0 h-72 w-72 opacity-40" delay={2} />

          <RevealText
            lines={['Let’s make', 'something loud.']}
            as="h2"
            in_view
            className="text-giant"
          />
          <p className="mx-auto mt-6 max-w-lg text-base text-ink/70">
            Tell me what you’re launching and I’ll tell you how to make it move.
          </p>
          <div className="mt-10 flex justify-center">
            <MagneticButton
              to="/contact"
              size="lg"
              variant="solid"
              cursor_label="Say hi"
              cursor_icon="👋"
              strength={0.4}
            >
              Start a project
            </MagneticButton>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
