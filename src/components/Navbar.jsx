/**
 * Navbar — fixed header with a scroll-condensing pill, desktop links and a
 * full-screen mobile overlay.
 *
 * Nav items come from `nav_links` in `content.js`; adding a page there (plus a
 * route in `App.jsx`) is all that's needed to extend the menu.
 */
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { nav_links, site_info } from '../data/content';
import { springs } from '../lib/motion';
import { use_lenis } from './SmoothScroll';
import MagneticButton from './MagneticButton';

/** Overlay container: staggers its children, then reverses on exit. */
const overlay_variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0% round 0 0 2rem 2rem)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0% round 0 0 2rem 2rem)',
    transition: { type: 'spring', stiffness: 130, damping: 20, staggerChildren: 0.06, delayChildren: 0.12 },
  },
  exit: {
    clipPath: 'inset(0% 0% 100% 0% round 0 0 2rem 2rem)',
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
};

const overlay_item_variants = {
  hidden: { opacity: 0, y: 32, rotate: -3 },
  visible: { opacity: 1, y: 0, rotate: 0, transition: springs.bouncy },
};

/**
 * @returns {JSX.Element} The site header.
 */
export default function Navbar() {
  const [is_condensed, set_is_condensed] = useState(false);
  const [is_menu_open, set_is_menu_open] = useState(false);
  const location = useLocation();
  const lenis = use_lenis();
  const reduced_motion = useReducedMotion();

  // Condense the header once the user has scrolled past the hero fold.
  useEffect(() => {
    const on_scroll = () => set_is_condensed(window.scrollY > 40);
    on_scroll();
    window.addEventListener('scroll', on_scroll, { passive: true });
    return () => window.removeEventListener('scroll', on_scroll);
  }, []);

  // Close the overlay on navigation.
  useEffect(() => {
    set_is_menu_open(false);
  }, [location.pathname]);

  // Freeze scrolling (Lenis and native) while the overlay is open.
  useEffect(() => {
    if (is_menu_open) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [is_menu_open, lenis]);

  return (
    <>
      {/* Header sits above the mobile overlay (z-110) so the logo and close
          button stay reachable while the menu is open. */}
      <header className="fixed inset-x-0 top-0 z-[115]">
        <div className="shell">
          <motion.nav
            className="mt-4 flex items-center justify-between gap-4 rounded-pill border px-4 py-3 sm:px-6"
            animate={{
              backgroundColor: is_condensed ? 'rgb(var(--color-cream) / 0.82)' : 'rgb(var(--color-cream) / 0)',
              borderColor: is_condensed ? 'rgb(var(--color-ink) / 0.1)' : 'rgb(var(--color-ink) / 0)',
              backdropFilter: is_condensed ? 'blur(14px)' : 'blur(0px)',
              scale: is_condensed ? 0.985 : 1,
            }}
            transition={springs.soft}
          >
            {/* ── Logo ─────────────────────────────────────────────────── */}
            <Link
              to="/"
              className="group flex items-center gap-3 no-underline"
              data-cursor="Home"
              data-cursor-icon="🏠"
            >
              <motion.span
                className="grid h-9 w-9 place-items-center rounded-full bg-ink font-display text-[0.7rem] font-bold text-cream"
                whileHover={reduced_motion ? undefined : { rotate: 180, scale: 1.1 }}
                transition={springs.bouncy}
              >
                {site_info.short_name}
              </motion.span>
              <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
                {site_info.name}
              </span>
            </Link>

            {/* ── Desktop links ────────────────────────────────────────── */}
            <div className="hidden items-center gap-8 md:flex">
              {nav_links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      'font-display text-sm font-medium uppercase tracking-[0.14em] no-underline transition-colors',
                      isActive ? 'text-ink' : 'text-muted hover:text-ink',
                    ].join(' ')
                  }
                >
                  {/* `link-wipe` lives on the span so the underline can key off
                      the active state (see globals.css). */}
                  {({ isActive }) => (
                    <span className="link-wipe" data-active={isActive}>
                      {link.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="hidden md:block">
              <MagneticButton to="/contact" size="sm" variant="coral" cursor_label="Say hi">
                Start a project
              </MagneticButton>
            </div>

            {/* ── Mobile toggle ────────────────────────────────────────── */}
            <motion.button
              type="button"
              onClick={() => set_is_menu_open((open) => !open)}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-cream/80 md:hidden"
              aria-label={is_menu_open ? 'Close menu' : 'Open menu'}
              aria-expanded={is_menu_open}
              whileTap={reduced_motion ? undefined : { scale: 0.88 }}
            >
              <span className="sr-only">Menu</span>
              <span className="flex flex-col gap-1.5">
                <motion.span
                  className="block h-0.5 w-5 rounded-full bg-ink"
                  animate={is_menu_open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                  transition={springs.snappy}
                />
                <motion.span
                  className="block h-0.5 w-5 rounded-full bg-ink"
                  animate={is_menu_open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                  transition={springs.snappy}
                />
              </span>
            </motion.button>
          </motion.nav>
        </div>
      </header>

      {/* ── Mobile overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {is_menu_open ? (
          <motion.div
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-lime px-6 pb-10 pt-28 md:hidden"
            variants={overlay_variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav className="flex flex-col gap-2">
              {[{ label: 'Home', to: '/' }, ...nav_links].map((link) => (
                <motion.div key={link.to} variants={overlay_item_variants}>
                  <Link
                    to={link.to}
                    className="block font-display text-4xl font-semibold tracking-tight text-ink no-underline"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div variants={overlay_item_variants} className="space-y-2">
              <p className="eyebrow">Get in touch</p>
              <a href={`mailto:${site_info.email}`} className="block text-lg text-ink no-underline">
                {site_info.email}
              </a>
              <p className="text-sm text-ink/70">{site_info.location}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
