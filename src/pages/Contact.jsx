/**
 * CONTACT
 *
 * ── WIRING UP A REAL BACKEND ───────────────────────────────────────────────
 * `submit_form()` below is a fake async call (750 ms, always succeeds). Replace
 * its body with one of these:
 *
 *  1. FORMSPREE (no backend needed)
 *       const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
 *         body: JSON.stringify(payload),
 *       });
 *       if (!response.ok) throw new Error('Form submission failed');
 *
 *  2. EMAILJS
 *       npm i @emailjs/browser
 *       import emailjs from '@emailjs/browser';
 *       await emailjs.send(SERVICE_ID, TEMPLATE_ID, payload, { publicKey: PUBLIC_KEY });
 *
 *  3. YOUR OWN ENDPOINT
 *       await fetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
 *
 * Keep keys in a `.env` file as `VITE_…` variables and read them with
 * `import.meta.env.VITE_FORMSPREE_ID`. Never commit real keys.
 * ───────────────────────────────────────────────────────────────────────────
 */
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { social_links, site_info } from '../data/content';
import { fade_up, in_view_props, springs, stagger_container } from '../lib/motion';
import PageTransition from '../components/PageTransition';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import Blob from '../components/Blob';

/** Empty form state, also used to reset after a successful send. */
const empty_form = { name: '', email: '', message: '' };

/**
 * Pretends to send the form. REPLACE with a real request — see the file header.
 *
 * @param {{name: string, email: string, message: string}} payload - Form values.
 * @returns {Promise<void>} Resolves when the message has been "sent".
 */
async function submit_form(payload) {
  // eslint-disable-next-line no-console
  console.info('[contact] placeholder submit — wire this up to a real service:', payload);
  await new Promise((resolve) => setTimeout(resolve, 750));
}

/**
 * Minimal client-side validation.
 *
 * @param {{name: string, email: string, message: string}} values - Form values.
 * @returns {{name?: string, email?: string, message?: string}} Field errors, keyed by field name.
 */
function validate_form(values) {
  /** @type {{name?: string, email?: string, message?: string}} */
  const errors = {};
  if (!values.name.trim()) errors.name = 'Tell me your name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'A valid email, please';
  if (values.message.trim().length < 10) errors.message = 'A little more detail helps';
  return errors;
}

/** Shared classes for inputs so all three fields stay consistent. */
const field_class_name =
  'w-full rounded-2xl border-2 border-ink/10 bg-cream px-5 py-4 text-base outline-none ' +
  'transition-colors duration-300 placeholder:text-muted/60 focus:border-coral';

/**
 * @returns {JSX.Element} The contact page.
 */
export default function Contact() {
  const [form_values, set_form_values] = useState(empty_form);
  const [field_errors, set_field_errors] = useState({});
  /** @type {['idle'|'sending'|'sent'|'error', Function]} */
  const [status, set_status] = useState('idle');
  const reduced_motion = useReducedMotion();

  /**
   * Keeps controlled inputs in sync and clears that field's error.
   *
   * @param {import('react').ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} event - Change event.
   * @returns {void}
   */
  const handle_change = (event) => {
    const { name, value } = event.target;
    set_form_values((current) => ({ ...current, [name]: value }));
    set_field_errors((current) => ({ ...current, [name]: undefined }));
  };

  /**
   * Validates, then hands the payload to `submit_form`.
   *
   * @param {import('react').FormEvent<HTMLFormElement>} event - Submit event.
   * @returns {Promise<void>} Resolves once the attempt finishes.
   */
  const handle_submit = async (event) => {
    event.preventDefault();

    const errors = validate_form(form_values);
    set_field_errors(errors);
    if (Object.keys(errors).length > 0) return;

    set_status('sending');
    try {
      await submit_form(form_values);
      set_status('sent');
      set_form_values(empty_form);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[contact] submit failed:', error);
      set_status('error');
    }
  };

  const contact_details = [
    { label: 'Email', value: site_info.email, href: `mailto:${site_info.email}` },
    { label: 'Phone', value: site_info.phone, href: `tel:${site_info.phone.replace(/[^\d+]/g, '')}` },
    { label: 'Based in', value: site_info.location, href: null },
  ];

  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden pb-20 pt-32 sm:pt-44">
        {/* Animated background — keeps a text-heavy page visually alive. */}
        <Blob accent="coral" className="-left-28 top-20 h-[24rem] w-[24rem]" />
        <Blob accent="lime" className="-right-24 top-52 h-[26rem] w-[26rem]" delay={2} />
        <Blob accent="cobalt" className="bottom-10 left-1/4 h-72 w-72 opacity-60" delay={4} />

        <div className="shell">
          <p className="eyebrow mb-6">Contact</p>
          <RevealText lines={['Let’s talk', 'about it.']} as="h1" className="text-mega" />
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            Tell me about the project, the deadline and the budget range. I reply to everything
            within two working days.
          </p>

          <div className="mt-16 grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            {/* ── Form ───────────────────────────────────────────────── */}
            <motion.form
              onSubmit={handle_submit}
              className="rounded-[2rem] border border-ink/10 bg-cream/70 p-6 backdrop-blur sm:p-9"
              variants={stagger_container(0.08)}
              {...in_view_props(0.15)}
              noValidate
            >
              <motion.div variants={fade_up(20)} className="space-y-2">
                <label htmlFor="name" className="eyebrow block">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form_values.name}
                  onChange={handle_change}
                  placeholder="Alex Rivera"
                  className={field_class_name}
                  aria-invalid={Boolean(field_errors.name)}
                />
                {field_errors.name ? (
                  <p className="text-sm text-coral">{field_errors.name}</p>
                ) : null}
              </motion.div>

              <motion.div variants={fade_up(20)} className="mt-6 space-y-2">
                <label htmlFor="email" className="eyebrow block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form_values.email}
                  onChange={handle_change}
                  placeholder="alex@company.com"
                  className={field_class_name}
                  aria-invalid={Boolean(field_errors.email)}
                />
                {field_errors.email ? (
                  <p className="text-sm text-coral">{field_errors.email}</p>
                ) : null}
              </motion.div>

              <motion.div variants={fade_up(20)} className="mt-6 space-y-2">
                <label htmlFor="message" className="eyebrow block">
                  Project details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form_values.message}
                  onChange={handle_change}
                  placeholder="We are launching in October and need a 30-second film plus social cut-downs…"
                  className={`${field_class_name} resize-none`}
                  aria-invalid={Boolean(field_errors.message)}
                />
                {field_errors.message ? (
                  <p className="text-sm text-coral">{field_errors.message}</p>
                ) : null}
              </motion.div>

              <motion.div variants={fade_up(20)} className="mt-8 flex flex-wrap items-center gap-5">
                <MagneticButton
                  type="submit"
                  size="lg"
                  variant="coral"
                  cursor_label="Send"
                  disabled={status === 'sending'}
                  onClick={undefined}
                >
                  {status === 'sending' ? 'Sending…' : 'Send it'}
                </MagneticButton>

                {/* Status feedback — bouncing dots instead of a spinner. */}
                <AnimatePresence mode="wait">
                  {status === 'sending' ? (
                    <motion.div
                      key="sending"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-end gap-1.5"
                      aria-live="polite"
                    >
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="block h-2.5 w-2.5 rounded-full bg-ink"
                          animate={reduced_motion ? { opacity: 0.6 } : { y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.12 }}
                        />
                      ))}
                    </motion.div>
                  ) : null}

                  {status === 'sent' ? (
                    <motion.p
                      key="sent"
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={springs.bouncy}
                      className="rounded-pill bg-lime px-4 py-2 text-sm font-medium"
                      role="status"
                    >
                      Got it — I’ll be in touch 🎉
                    </motion.p>
                  ) : null}

                  {status === 'error' ? (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-coral"
                      role="alert"
                    >
                      Something broke. Email me directly instead?
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.div>

              <p className="mt-6 text-xs text-muted">
                Placeholder handler — no message is actually sent. See the comment at the top of{' '}
                <code>src/pages/Contact.jsx</code> to connect Formspree or EmailJS.
              </p>
            </motion.form>

            {/* ── Details + socials ──────────────────────────────────── */}
            <motion.div
              className="space-y-10"
              variants={stagger_container(0.1)}
              {...in_view_props(0.15)}
            >
              <motion.dl variants={fade_up(24)} className="space-y-6">
                {contact_details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="eyebrow">{detail.label}</dt>
                    <dd className="mt-1 font-display text-xl">
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="no-underline underline-offset-4 hover:text-coral hover:underline"
                          data-cursor="Copy"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                ))}
              </motion.dl>

              <motion.div variants={fade_up(24)}>
                <p className="eyebrow mb-4">Elsewhere</p>
                <ul className="flex flex-wrap gap-3">
                  {social_links.map((social) => (
                    <li key={social.label}>
                      <motion.a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-block rounded-pill border border-ink/15 px-5 py-2.5 font-display text-xs uppercase tracking-[0.14em] no-underline"
                        whileHover={
                          reduced_motion
                            ? undefined
                            : { y: -4, rotate: -2, backgroundColor: 'rgb(var(--color-lime))' }
                        }
                        whileTap={reduced_motion ? undefined : { scale: 0.92 }}
                        transition={springs.bouncy}
                        data-cursor="Visit"
                        data-cursor-icon="↗"
                      >
                        {social.label}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                variants={fade_up(24)}
                className="rounded-squish border border-ink/10 bg-sand/60 p-6"
              >
                <p className="eyebrow">Availability</p>
                <p className="mt-2 text-lg">{site_info.availability}</p>
                <p className="mt-3 text-sm text-muted">
                  Placeholder note: I usually book two to three weeks ahead.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
