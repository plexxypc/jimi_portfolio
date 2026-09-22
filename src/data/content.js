/**
 * ============================================================================
 *  SITE CONTENT — the only file you need to edit to launch with real copy.
 * ============================================================================
 *
 *  Everything the site renders (profile info, navigation, projects, services,
 *  process, testimonials, socials) is exported from here. Components never
 *  hard-code copy, so replacing placeholders never means touching layout code.
 *
 *  Voice: first person singular ("I", not "we") — this is a one-person
 *  portfolio. Keep that voice when you swap in real copy.
 *
 *  REPLACE CHECKLIST
 *    1. `site_info`        — name, tagline, email, location.
 *    2. `projects`         — one entry per case study. `slug` becomes the URL
 *                            (/work/:slug). `blocks` is the scrolling body.
 *    3. Images/video       — swap `https://picsum.photos/...` placeholders for
 *                            files in /public (e.g. '/media/project-01.jpg') or
 *                            a CDN URL. `media_kind: 'video'` renders a muted,
 *                            looping <video> instead of an <img>.
 *    4. `services`, `process_steps`, `skills`, `testimonials`, `client_logos`.
 *    5. `founder`          — portrait, role and short bio.
 *    6. `social_links`     — real profile URLs.
 *
 *  Keys are snake_case; every exported value is a plain object/array so this
 *  file can later be swapped for a CMS response with the same shape.
 */

/**
 * Core identity and contact details.
 *
 * @type {{
 *   name: string, short_name: string, role: string, tagline: string,
 *   hero_lines: string[], intro: string, email: string, phone: string,
 *   location: string, availability: string, since: string, reel_label: string
 * }}
 */
export const site_info = {
  name: 'Jimi',
  short_name: 'J',
  role: 'Motion Designer & Art Director',
  tagline: 'I make brands move — literally.',
  // Each string is revealed as its own line in the Home hero (staggered).
  hero_lines: ['Motion that', 'makes people', 'stop scrolling.'],
  intro:
    'I’m Jimi, an independent motion designer and art director. I build identities, animations and websites that feel alive — playful, precise and a little bit loud.',
  email: 'hello@jimi.design',
  phone: '+234 812 121 2577',
  location: 'Lagos · Remote worldwide',
  availability: 'Taking on new projects for Q3',
  since: '2019',
  reel_label: 'Watch the 2026 reel',
};

/**
 * Primary navigation. Add an entry here (plus a route in `App.jsx`) to grow the
 * site — e.g. { label: 'Blog', to: '/blog' } — nothing else needs to change.
 *
 * @type {Array<{label: string, to: string}>}
 */
export const nav_links = [
  { label: 'Work', to: '/work' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

/**
 * Filter chips on the Work page. 'All' is prepended automatically.
 * Adding a category only requires using the same string in a project's
 * `category` field.
 *
 * @type {string[]}
 */
export const project_categories = ['Motion', 'Branding', 'Web', 'Illustration'];

/**
 * Case studies.
 *
 * Field notes:
 *   · `slug`        — URL segment, must be unique.
 *   · `featured`    — surfaces the project in the Home page preview grid.
 *   · `accent`      — Tailwind token name ('coral' | 'lime' | 'cobalt'), used
 *                     for the card tint and detail-page accents.
 *   · `blocks`      — ordered body of the case study. Supported `type` values:
 *                       'text'    { heading?, body }
 *                       'media'   { src, media_kind: 'image'|'video', caption?, wide? }
 *                       'gallery' { items: [{ src, media_kind }] }
 *                       'quote'   { body, attribution }
 *
 * @type {Array<Object>}
 */
export const projects = [
  {
    slug: 'project-title-01',
    title: 'Project Title 01',
    client: 'Client Name 01',
    year: '2026',
    role: 'Art direction, Motion design',
    category: 'Motion',
    tags: ['Motion', 'Art direction'],
    tools: ['After Effects', 'Cinema 4D', 'Figma'],
    accent: 'coral',
    featured: true,
    summary: 'A kinetic identity system built for a product launch that needed to feel loud.',
    description:
      'Lorem ipsum placeholder: a short, realistic paragraph describing the brief, the constraint that shaped the work, and the outcome. Two or three sentences is plenty here — the case study body below carries the detail.',
    thumbnail: 'https://picsum.photos/seed/kinetic-01/1200/1500',
    thumbnail_kind: 'image',
    hero: 'https://picsum.photos/seed/kinetic-01-hero/2000/1200',
    hero_kind: 'image',
    blocks: [
      {
        type: 'text',
        heading: 'The brief',
        body: 'Placeholder copy: the client needed a launch system that worked across a 6-second pre-roll and a 40-metre trade-show wall. I built one motion grammar and scaled it in both directions.',
      },
      {
        type: 'media',
        src: 'https://picsum.photos/seed/kinetic-01-a/1600/1000',
        media_kind: 'image',
        caption: 'Placeholder caption — frame studies from the opening sequence.',
        wide: true,
      },
      {
        type: 'text',
        heading: 'Building the system',
        body: 'Placeholder copy: three motion primitives — squash, wipe and overshoot — were documented as an animation spec so the in-house team could keep producing assets after handoff.',
      },
      {
        type: 'gallery',
        items: [
          { src: 'https://picsum.photos/seed/kinetic-01-b/900/1100', media_kind: 'image' },
          { src: 'https://picsum.photos/seed/kinetic-01-c/900/1100', media_kind: 'image' },
        ],
      },
      {
        type: 'quote',
        body: 'He gave us a language, not just a video. Six months later we are still animating with it.',
        attribution: 'Placeholder Name, Head of Brand',
      },
      {
        type: 'media',
        src: 'https://picsum.photos/seed/kinetic-01-d/1600/900',
        media_kind: 'image',
        caption: 'Placeholder caption — final broadcast cut-down.',
        wide: true,
      },
    ],
  },
  {
    slug: 'project-title-02',
    title: 'Project Title 02',
    client: 'Client Name 02',
    year: '2025',
    role: 'Brand identity, Type design',
    category: 'Branding',
    tags: ['Branding', 'Identity'],
    tools: ['Illustrator', 'Glyphs', 'Figma'],
    accent: 'lime',
    featured: true,
    summary: 'A full identity refresh for a food brand that wanted to look as fresh as it tastes.',
    description:
      'Lorem ipsum placeholder: describe the positioning shift, the visual decision that carried it, and how the system rolled out across packaging and social.',
    thumbnail: 'https://picsum.photos/seed/kinetic-02/1200/1400',
    thumbnail_kind: 'image',
    hero: 'https://picsum.photos/seed/kinetic-02-hero/2000/1200',
    hero_kind: 'image',
    blocks: [
      {
        type: 'text',
        heading: 'Starting point',
        body: 'Placeholder copy: the old mark worked on a shelf and nowhere else. I rebuilt it for a feed-first world, then made sure it still held up in print.',
      },
      {
        type: 'media',
        src: 'https://picsum.photos/seed/kinetic-02-a/1600/1000',
        media_kind: 'image',
        caption: 'Placeholder caption — logotype construction.',
        wide: true,
      },
      {
        type: 'text',
        heading: 'Rollout',
        body: 'Placeholder copy: packaging, delivery bags, in-store signage and a 30-page guideline document the team actually reads.',
      },
      {
        type: 'gallery',
        items: [
          { src: 'https://picsum.photos/seed/kinetic-02-b/900/1100', media_kind: 'image' },
          { src: 'https://picsum.photos/seed/kinetic-02-c/900/1100', media_kind: 'image' },
        ],
      },
    ],
  },
  {
    slug: 'project-title-03',
    title: 'Project Title 03',
    client: 'Client Name 03',
    year: '2025',
    role: 'Design, Build',
    category: 'Web',
    tags: ['Web', 'Interaction'],
    tools: ['Figma', 'React', 'GSAP'],
    accent: 'cobalt',
    featured: true,
    summary: 'An interactive site where every scroll position tells a different part of the story.',
    description:
      'Lorem ipsum placeholder: outline the interaction concept, the performance budget you held yourself to, and the measurable result.',
    thumbnail: 'https://picsum.photos/seed/kinetic-03/1200/1300',
    thumbnail_kind: 'image',
    hero: 'https://picsum.photos/seed/kinetic-03-hero/2000/1200',
    hero_kind: 'image',
    blocks: [
      {
        type: 'text',
        heading: 'Concept',
        body: 'Placeholder copy: one continuous scroll, five chapters, zero page loads. Motion was used to explain the product, not decorate it.',
      },
      {
        type: 'media',
        src: 'https://picsum.photos/seed/kinetic-03-a/1600/900',
        media_kind: 'image',
        caption: 'Placeholder caption — scroll choreography map.',
        wide: true,
      },
      {
        type: 'quote',
        body: 'Time on page tripled. People were scrolling it twice just to watch it again.',
        attribution: 'Placeholder Name, Product Lead',
      },
      {
        type: 'text',
        heading: 'Under the hood',
        body: 'Placeholder copy: GSAP ScrollTrigger timelines, Lenis for inertia, and a strict reduced-motion path for anyone who asks for one.',
      },
    ],
  },
  {
    slug: 'project-title-04',
    title: 'Project Title 04',
    client: 'Client Name 04',
    year: '2024',
    role: 'Illustration, Character design',
    category: 'Illustration',
    tags: ['Illustration', 'Character'],
    tools: ['Procreate', 'Illustrator', 'After Effects'],
    accent: 'coral',
    featured: true,
    summary: 'A cast of characters built to carry a campaign across twelve markets.',
    description:
      'Lorem ipsum placeholder: explain the cast, how it was designed for reuse, and what the animation layer added.',
    thumbnail: 'https://picsum.photos/seed/kinetic-04/1200/1450',
    thumbnail_kind: 'image',
    hero: 'https://picsum.photos/seed/kinetic-04-hero/2000/1200',
    hero_kind: 'image',
    blocks: [
      {
        type: 'text',
        heading: 'The cast',
        body: 'Placeholder copy: six characters, one construction logic, endless combinations — so regional teams could stage their own scenes without redrawing anything.',
      },
      {
        type: 'gallery',
        items: [
          { src: 'https://picsum.photos/seed/kinetic-04-b/900/1100', media_kind: 'image' },
          { src: 'https://picsum.photos/seed/kinetic-04-c/900/1100', media_kind: 'image' },
        ],
      },
      {
        type: 'media',
        src: 'https://picsum.photos/seed/kinetic-04-a/1600/1000',
        media_kind: 'image',
        caption: 'Placeholder caption — rig tests and expression sheets.',
        wide: true,
      },
    ],
  },
  {
    slug: 'project-title-05',
    title: 'Project Title 05',
    client: 'Client Name 05',
    year: '2024',
    role: 'Editing, Sound design',
    category: 'Motion',
    tags: ['Motion', 'Edit'],
    tools: ['Premiere Pro', 'After Effects', 'Audition'],
    accent: 'lime',
    featured: false,
    summary: 'A documentary-style brand film cut three ways for three very different feeds.',
    description:
      'Lorem ipsum placeholder: the footage you were handed, the story you found in it, and how the cut-downs performed.',
    thumbnail: 'https://picsum.photos/seed/kinetic-05/1200/1350',
    thumbnail_kind: 'image',
    hero: 'https://picsum.photos/seed/kinetic-05-hero/2000/1200',
    hero_kind: 'image',
    blocks: [
      {
        type: 'text',
        heading: 'Finding the cut',
        body: 'Placeholder copy: forty hours of footage, one honest 90-second story, then vertical and square versions that keep the same emotional beat.',
      },
      {
        type: 'media',
        src: 'https://picsum.photos/seed/kinetic-05-a/1600/900',
        media_kind: 'image',
        caption: 'Placeholder caption — grade references.',
        wide: true,
      },
    ],
  },
  {
    slug: 'project-title-06',
    title: 'Project Title 06',
    client: 'Client Name 06',
    year: '2023',
    role: 'Design system, Web',
    category: 'Web',
    tags: ['Web', 'Design system'],
    tools: ['Figma', 'React', 'Tailwind'],
    accent: 'cobalt',
    featured: false,
    summary: 'A component library that let a small team ship pages in hours instead of weeks.',
    description:
      'Lorem ipsum placeholder: the scale problem, the system that solved it, and the handover that made it stick.',
    thumbnail: 'https://picsum.photos/seed/kinetic-06/1200/1500',
    thumbnail_kind: 'image',
    hero: 'https://picsum.photos/seed/kinetic-06-hero/2000/1200',
    hero_kind: 'image',
    blocks: [
      {
        type: 'text',
        heading: 'Systemising it',
        body: 'Placeholder copy: 34 components, documented tokens, and a motion spec so animation stopped being improvised per page.',
      },
      {
        type: 'gallery',
        items: [
          { src: 'https://picsum.photos/seed/kinetic-06-b/900/1100', media_kind: 'image' },
          { src: 'https://picsum.photos/seed/kinetic-06-c/900/1100', media_kind: 'image' },
        ],
      },
    ],
  },
];

/**
 * Services — rendered as expandable cards on /services and as a teaser on Home.
 *
 * @type {Array<{
 *   id: string, title: string, blurb: string, body: string,
 *   deliverables: string[], icon: string, accent: string
 * }>}
 */
export const services = [
  {
    id: 'motion-design',
    title: 'Motion Design',
    blurb: 'Animation systems, product films, social cut-downs.',
    body: 'Placeholder copy: I design motion as a system rather than a one-off render — so your team can keep making assets long after I hand over. Includes storyboards, animatics, final renders and a short motion spec.',
    deliverables: ['Storyboards & animatics', 'Final renders (16:9 / 9:16 / 1:1)', 'Motion spec sheet'],
    icon: '🎬',
    accent: 'coral',
  },
  {
    id: 'brand-identity',
    title: 'Brand Identity',
    blurb: 'Logotypes, type systems, guidelines people actually use.',
    body: 'Placeholder copy: positioning-led identity work. I build the mark, the type system and the rules, then pressure-test everything on the channels you actually ship to.',
    deliverables: ['Logo & lockups', 'Type + colour system', 'Brand guidelines'],
    icon: '✦',
    accent: 'lime',
  },
  {
    id: 'web-design',
    title: 'Web Design & Build',
    blurb: 'Interactive sites, design systems, front-end builds.',
    body: 'Placeholder copy: design and build from one pair of hands, so the interaction you approved in Figma is the interaction that ships. React, Tailwind, GSAP — fast, accessible, and reduced-motion aware.',
    deliverables: ['UX + UI design', 'Front-end build', 'CMS wiring & handover'],
    icon: '◈',
    accent: 'cobalt',
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    blurb: 'Story-first edits, grading, sound design.',
    body: 'Placeholder copy: I cut for story first and polish second. Full post pipeline including grade, sound design, subtitles and every aspect-ratio version you need.',
    deliverables: ['Offline & online edit', 'Grade + sound design', 'Platform cut-downs'],
    icon: '▶',
    accent: 'coral',
  },
];

/**
 * "How I work" steps for the About page.
 *
 * @type {Array<{step: string, title: string, body: string}>}
 */
export const process_steps = [
  {
    step: '01',
    title: 'Dig in',
    body: 'Placeholder copy: a workshop, a pile of questions, and a written point of view before I open a design tool.',
  },
  {
    step: '02',
    title: 'Sketch loud',
    body: 'Placeholder copy: fast, rough, disposable directions. I would rather kill ten ideas early than defend one late.',
  },
  {
    step: '03',
    title: 'Make it move',
    body: 'Placeholder copy: motion tests early, because a thing that looks great still frame can feel wrong in time.',
  },
  {
    step: '04',
    title: 'Hand it over',
    body: 'Placeholder copy: files, specs and a walkthrough call so your team owns the work rather than renting it.',
  },
];

/**
 * Tools / skills marquee on the About page.
 *
 * @type {string[]}
 */
export const skills = [
  'After Effects',
  'Cinema 4D',
  'Blender',
  'Figma',
  'Illustrator',
  'Premiere Pro',
  'GSAP',
  'React',
  'Tailwind',
  'Spline',
  'Houdini',
  'Procreate',
];

/**
 * Bio block for the About page.
 *
 * @type {{name: string, role: string, bio: string, portrait: string}}
 */
export const founder = {
  name: 'Jimi',
  role: 'Motion Designer & Art Director',
  bio: 'Placeholder copy: ten years of moving pixels for brands big and small. Type nerd turned interaction designer. Believes a good overshoot fixes most things.',
  portrait: 'https://picsum.photos/seed/jimi-portrait/900/1100',
};

/**
 * Short quotes for the Home testimonial strip.
 *
 * @type {Array<{quote: string, name: string, company: string}>}
 */
export const testimonials = [
  {
    quote: 'He turned a vague brief into the best-performing campaign we have ever run.',
    name: 'Placeholder Name',
    company: 'Client Name 01',
  },
  {
    quote: 'Fast, funny, and weirdly good at hitting deadlines. Rare combination.',
    name: 'Placeholder Name',
    company: 'Client Name 03',
  },
  {
    quote: 'The motion system he built is still the most useful thing in our brand toolkit.',
    name: 'Placeholder Name',
    company: 'Client Name 05',
  },
];

/**
 * Client logo strip. Text-only placeholders — swap `label` for an <img> src when
 * you have real assets (see ClientStrip usage in Home.jsx).
 *
 * @type {Array<{label: string}>}
 */
export const client_logos = [
  { label: 'Northwind' },
  { label: 'Fablabs' },
  { label: 'Orbit&Co' },
  { label: 'Sundry' },
  { label: 'Marmalade' },
  { label: 'Tidewater' },
];

/**
 * Social profiles — rendered in the Footer and on /contact.
 *
 * @type {Array<{label: string, href: string}>}
 */
export const social_links = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Behance', href: 'https://behance.net' },
  { label: 'Vimeo', href: 'https://vimeo.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
];

/**
 * Stats shown on the About page.
 *
 * @type {Array<{value: string, label: string}>}
 */
export const stats = [
  { value: '120+', label: 'Projects shipped' },
  { value: '14', label: 'Countries' },
  { value: '6yrs', label: 'Making things move' },
];

/**
 * Looks up a project by its URL slug.
 *
 * @param {string} slug - URL segment from the /work/:slug route.
 * @returns {Object|undefined} The matching project, or undefined if not found.
 */
export function get_project_by_slug(slug) {
  return projects.find((project) => project.slug === slug);
}

/**
 * Returns the project after `slug`, wrapping around to the first one.
 * Used for the "Next project" link at the bottom of a case study.
 *
 * @param {string} slug - Current project slug.
 * @returns {Object|undefined} The next project, or undefined if `slug` is unknown.
 */
export function get_next_project(slug) {
  const current_index = projects.findIndex((project) => project.slug === slug);
  if (current_index === -1) return undefined;
  return projects[(current_index + 1) % projects.length];
}

/**
 * Filters projects by category label.
 *
 * @param {string} [category='All'] - Category name, or 'All' for everything.
 * @returns {Array<Object>} Matching projects, in authoring order.
 */
export function filter_projects_by_category(category = 'All') {
  if (category === 'All') return projects;
  return projects.filter((project) => project.category === category);
}

/**
 * Featured projects for the Home page preview grid.
 *
 * @param {number} [limit=4] - Maximum number of projects to return.
 * @returns {Array<Object>} Projects flagged `featured`, capped at `limit`.
 */
export function get_featured_projects(limit = 4) {
  return projects.filter((project) => project.featured).slice(0, limit);
}
