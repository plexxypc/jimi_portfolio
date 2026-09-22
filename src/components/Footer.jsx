/**
 * Footer — oversized closing CTA, contact details, nav columns and socials.
 *
 * All copy comes from `content.js`. The "back to top" control uses the shared
 * Lenis instance so it glides rather than jumps.
 */
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { nav_links, social_links, site_info } from '../data/content';
import { springs } from '../lib/motion';
import { use_lenis } from './SmoothScroll';
import Marquee from './Marquee';
import Blob from './Blob';

/**
 * @returns {JSX.Element} The site footer.
 */
export default function Footer() {
  const lenis = use_lenis();
  const reduced_motion = useReducedMotion();
  const current_year = new Date().getFullYear();

  /** Scrolls back to the top, using Lenis when available. */
  const scroll_to_top = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
      return;
    }
    window.scrollTo({ top: 0, behavior: reduced_motion ? 'auto' : 'smooth' });
  };

  return (
    <footer className="relative isolate mt-24 overflow-hidden rounded-t-[3rem] bg-ink pb-10 pt-20 text-cream">
      <Blob accent="cobalt" className="-left-20 top-10 h-72 w-72 opacity-60" />
      <Blob accent="coral" className="-right-16 bottom-0 h-80 w-80 opacity-50" delay={3} />

      {/* ── Oversized CTA ─────────────────────────────────────────────── */}
      <div className="shell">
        <Link to="/contact" className="group block no-underline" data-cursor="Let's talk" data-cursor-icon="✉️">
          <p className="eyebrow text-cream/50">{site_info.availability}</p>
          <motion.h2
            className="mt-4 text-mega text-cream"
            whileHover={reduced_motion ? undefined : { x: 12, rotate: -1 }}
            transition={springs.bouncy}
          >
            Got something
            <br />
            <span className="text-lime">fun</span> to move?
          </motion.h2>
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          <a
            href={`mailto:${site_info.email}`}
            className="font-display text-lg text-cream no-underline underline-offset-4 hover:text-lime hover:underline sm:text-xl"
            data-cursor="Email"
          >
            {site_info.email}
          </a>
          <a
            href={`tel:${site_info.phone.replace(/[^\d+]/g, '')}`}
            className="text-cream/70 no-underline hover:text-lime"
          >
            {site_info.phone}
          </a>
        </div>
      </div>

      {/* ── Scrolling divider ─────────────────────────────────────────── */}
      <div className="my-14 border-y border-cream/10 py-5">
        <Marquee
          items={['Motion Design', 'Brand Identity', 'Web Design', 'Video Editing', 'Illustration']}
          duration={34}
          item_class_name="font-display text-2xl uppercase tracking-[0.06em] text-cream/80 sm:text-3xl"
        />
      </div>

      {/* ── Columns ───────────────────────────────────────────────────── */}
      <div className="shell grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="eyebrow text-cream/40">About</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">{site_info.intro}</p>
        </div>

        <div>
          <p className="eyebrow text-cream/40">Menu</p>
          <ul className="mt-3 space-y-2">
            {[{ label: 'Home', to: '/' }, ...nav_links].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-cream/70 no-underline hover:text-lime">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-cream/40">Elsewhere</p>
          <ul className="mt-3 space-y-2">
            {social_links.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-cream/70 no-underline hover:text-lime"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start gap-4">
          <p className="eyebrow text-cream/40">Based in</p>
          <p className="text-sm text-cream/70">{site_info.location}</p>
          <motion.button
            type="button"
            onClick={scroll_to_top}
            className="mt-auto inline-flex items-center gap-2 rounded-pill border border-cream/20 px-4 py-2 font-display text-xs uppercase tracking-[0.16em] text-cream"
            whileHover={reduced_motion ? undefined : { y: -4, backgroundColor: 'rgb(var(--color-lime))', color: 'rgb(var(--color-ink))' }}
            whileTap={reduced_motion ? undefined : { scale: 0.92 }}
            transition={springs.bouncy}
            data-cursor="Top"
            data-cursor-icon="↑"
          >
            Back to top
          </motion.button>
        </div>
      </div>

      <div className="shell mt-16 flex flex-col gap-2 border-t border-cream/10 pt-6 text-xs text-cream/40 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {current_year} {site_info.name}. Placeholder content — swap in{' '}
          <span className="text-cream/60">src/data/content.js</span>.
        </p>
        <p>Built with React, Tailwind, Framer Motion, GSAP &amp; Lenis.</p>
      </div>
    </footer>
  );
}
