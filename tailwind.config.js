/**
 * Tailwind theme = the studio's design system.
 *
 * ── HOW TO RESTYLE THE WHOLE SITE ──────────────────────────────────────────
 * Colors are wired to CSS custom properties declared in `src/styles/globals.css`
 * (as space-separated RGB channels so Tailwind's `/opacity` modifiers work).
 * Change the variables there and every component follows — no class renaming.
 *
 * Fonts are loaded from Google Fonts in `index.html`. Swap the <link> there and
 * the `fontFamily` stacks below to change typography.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        cream: 'rgb(var(--color-cream) / <alpha-value>)',
        sand: 'rgb(var(--color-sand) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        // Bold accents — used for CTAs, hover states and background blobs
        coral: 'rgb(var(--color-coral) / <alpha-value>)',
        lime: 'rgb(var(--color-lime) / <alpha-value>)',
        cobalt: 'rgb(var(--color-cobalt) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid display sizes: clamp(min, preferred, max)
        mega: ['clamp(2.75rem, 11vw, 10rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        giant: ['clamp(2.25rem, 7vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
        huge: ['clamp(1.75rem, 4.5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        blob: '48% 52% 44% 56% / 55% 43% 57% 45%',
        squish: '2rem',
        pill: '999px',
      },
      boxShadow: {
        pop: '0 18px 0 -6px rgb(var(--color-ink) / 0.08)',
        lift: '0 24px 60px -24px rgb(var(--color-ink) / 0.35)',
      },
      transitionTimingFunction: {
        springy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0, 0, 0)' },
          to: { transform: 'translate3d(-50%, 0, 0)' },
        },
        blob_drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)' },
          '33%': { transform: 'translate3d(3%, -4%, 0) scale(1.06) rotate(8deg)' },
          '66%': { transform: 'translate3d(-3%, 3%, 0) scale(0.96) rotate(-6deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        blob_drift: 'blob_drift 18s ease-in-out infinite',
        wiggle: 'wiggle 0.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
