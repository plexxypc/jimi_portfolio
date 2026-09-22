/**
 * Blob — soft organic background decoration.
 *
 * Purely ornamental (aria-hidden, pointer-events-none). Position it with
 * Tailwind classes on the parent's coordinate space, e.g.:
 *
 *   <div className="relative isolate overflow-hidden">
 *     <Blob accent="coral" className="-left-24 top-10 h-80 w-80" />
 *   </div>
 */
const accent_classes = {
  coral: 'bg-coral/30',
  lime: 'bg-lime/40',
  cobalt: 'bg-cobalt/20',
  sand: 'bg-sand',
};

/**
 * @param {Object} props - Component props.
 * @param {'coral'|'lime'|'cobalt'|'sand'} [props.accent='coral'] - Colour token.
 * @param {string} [props.className] - Position/size classes (e.g. 'top-0 h-72 w-72').
 * @param {boolean} [props.animate=true] - Whether to slowly drift and morph.
 * @param {number} [props.delay=0] - Animation delay in seconds (desync multiple blobs).
 * @returns {JSX.Element} The decorative blob.
 */
export default function Blob({ accent = 'coral', className = '', animate = true, delay = 0 }) {
  return (
    <div
      aria-hidden="true"
      className={[
        'blob',
        accent_classes[accent] ?? accent_classes.coral,
        animate ? 'animate-blob_drift' : '',
        className,
      ].join(' ')}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}
