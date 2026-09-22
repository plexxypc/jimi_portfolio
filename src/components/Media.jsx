/**
 * Media — renders an image or a looping video from the same content shape, so
 * swapping a placeholder image for a real video loop is a one-word change in
 * `content.js` (`media_kind: 'image' | 'video'`).
 *
 * Videos are muted, looping and inline (required for mobile autoplay) and do
 * not autoplay under reduced motion — a poster frame is shown instead.
 */
import { useReducedMotion } from 'framer-motion';

/**
 * @param {Object} props - Component props.
 * @param {string} props.src - Image or video URL (place real files in /public).
 * @param {'image'|'video'} [props.media_kind='image'] - Which element to render.
 * @param {string} [props.alt=''] - Alt text for images.
 * @param {string} [props.poster] - Poster frame for videos.
 * @param {string} [props.className] - Classes applied to the media element.
 * @param {'lazy'|'eager'} [props.loading='lazy'] - Image loading strategy.
 * @returns {JSX.Element} An <img> or <video> element.
 */
export default function Media({
  src,
  media_kind = 'image',
  alt = '',
  poster,
  className = '',
  loading = 'lazy',
}) {
  const reduced_motion = useReducedMotion();

  if (media_kind === 'video') {
    return (
      <video
        className={className}
        src={src}
        poster={poster}
        autoPlay={!reduced_motion}
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  return <img className={className} src={src} alt={alt} loading={loading} decoding="async" />;
}
