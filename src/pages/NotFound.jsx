/**
 * NOT FOUND — catch-all 404 route.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { springs } from '../lib/motion';
import PageTransition from '../components/PageTransition';
import MagneticButton from '../components/MagneticButton';
import Blob from '../components/Blob';

/**
 * @returns {JSX.Element} The 404 page.
 */
export default function NotFound() {
  const reduced_motion = useReducedMotion();

  return (
    <PageTransition>
      <section className="relative isolate grid min-h-screen place-items-center overflow-hidden px-6 text-center">
        <Blob accent="lime" className="left-1/4 top-1/4 h-80 w-80" />
        <Blob accent="coral" className="bottom-1/4 right-1/4 h-72 w-72 opacity-70" delay={2} />

        <div>
          <motion.p
            className="font-display text-[8rem] font-bold leading-none sm:text-[12rem]"
            animate={reduced_motion ? undefined : { rotate: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            404
          </motion.p>
          <motion.h1
            className="mt-4 text-giant"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.bouncy}
          >
            This page wandered off.
          </motion.h1>
          <p className="mx-auto mt-5 max-w-md text-muted">
            Probably off making something move. Let’s get you back.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <MagneticButton to="/" size="lg" cursor_label="Home" cursor_icon="🏠">
              Back home
            </MagneticButton>
            <MagneticButton to="/work" size="lg" variant="outline" cursor_label="Work">
              See the work
            </MagneticButton>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
