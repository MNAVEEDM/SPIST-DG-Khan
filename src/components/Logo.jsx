import { institution } from '../data/site';

const ALT_TEXT = 'SPIST - South Punjab Institute of Science and Technology logo';

/**
 * Renders the official SPIST logo from /public/logo/spist_logo.png.
 *
 * `institution.logo` in src/data/site.js is the single source for this path —
 * every place the logo appears (navbar, footer, mobile drawer, favicon)
 * reads from that one value. There is no text-lockup fallback: the image is
 * the only logo asset site-wide.
 *
 * `chip` wraps the crest in a white rounded plate. The logo has a white
 * negative-space background, so on the translucent green glass navbar the
 * chip is what keeps the crest crisp instead of letting the green bleed
 * through it.
 */
export default function Logo({ className = 'h-11 w-auto', chip = false }) {
  const image = (
    <img
      src={institution.logo}
      alt={ALT_TEXT}
      className={`${className} object-contain`}
      width="1024"
      height="683"
      decoding="async"
      fetchPriority="high"
    />
  );

  if (!chip) return image;

  return (
    <span className="inline-flex items-center justify-center rounded-lg bg-white px-2 py-1 shadow-e1">
      {image}
    </span>
  );
}
