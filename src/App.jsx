/**
 * App shell — global chrome plus the route table.
 *
 * Layer order (outer → inner):
 *   SmoothScroll (Lenis + GSAP sync)
 *     CustomCursor      — pointer devices only
 *     Navbar            — fixed
 *     AnimatePresence   — page transitions, keyed on pathname
 *       Suspense        — lazy route chunks, shows the bouncing Loader
 *     Footer
 *
 * ── ADDING A PAGE ──────────────────────────────────────────────────────────
 *   1. Create `src/pages/Blog.jsx` returning <PageTransition>…</PageTransition>.
 *   2. `const Blog = lazy(() => import('./pages/Blog'));`
 *   3. Add `{ path: '/blog', element: <Blog /> }` to `route_config` below.
 *   4. Add `{ label: 'Blog', to: '/blog' }` to `nav_links` in data/content.js.
 * Nested routes work too — give an entry a `children` array and React Router
 * handles it; nothing else in the shell needs to change.
 * ───────────────────────────────────────────────────────────────────────────
 */
import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';

// Code-split every route so the first paint stays light.
const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * The site's route table. Keeping it as data (rather than inline JSX) means new
 * pages are a one-line addition.
 *
 * @type {Array<{path: string, element: JSX.Element}>}
 */
const route_config = [
  { path: '/', element: <Home /> },
  { path: '/work', element: <Work /> },
  { path: '/work/:slug', element: <ProjectDetail /> },
  { path: '/about', element: <About /> },
  { path: '/services', element: <Services /> },
  { path: '/contact', element: <Contact /> },
  // Catch-all — keep last.
  { path: '*', element: <NotFound /> },
];

/**
 * @returns {JSX.Element} The application shell.
 */
export default function App() {
  const location = useLocation();

  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />

      {/* `mode="wait"` lets the outgoing page finish its exit before the next
          one springs in — without it the two overlap and the layout jumps. */}
      <AnimatePresence mode="wait" initial={false}>
        <Suspense key={location.pathname} fallback={<Loader label="Loading" />}>
          <Routes location={location}>
            {route_config.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </AnimatePresence>

      <Footer />
    </SmoothScroll>
  );
}
