import { Link } from 'react-router-dom';
import { ChevronRight } from './Icons';

/**
 * Shared banner for every inner page: brand backdrop, page title and
 * a breadcrumb trail built from the navigation config.
 */
export default function PageBanner({ title, trail = [], intro }) {
  return (
    <section className="banner-bg relative isolate overflow-hidden">
      {/* Ring motif layered above the artwork, below the title */}
      <div
        className="pointer-events-none absolute -right-20 top-1/2 hidden h-80 w-80 -translate-y-1/2 rounded-full border-2 border-white/10 md:block"
        aria-hidden="true"
      >
        <span className="absolute inset-8 rounded-full border border-white/10" />
      </div>

      {/* header-offset clears the fixed glass header */}
      <div className="container-spist header-offset relative pb-14 pt-14 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-white/65">
            <li>
              <Link to="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            {trail.map((crumb, index) => (
              <li key={`${crumb}-${index}`} className="flex items-center gap-1.5">
                <ChevronRight width="13" height="13" className="text-white/40" />
                <span className={index === trail.length - 1 ? 'text-spist-accent' : undefined}>
                  {crumb}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>

        <span className="mt-5 block h-1 w-16 rounded-full bg-spist-maroon" aria-hidden="true" />

        {intro && <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/80">{intro}</p>}
      </div>
    </section>
  );
}
