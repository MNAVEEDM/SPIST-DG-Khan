import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { heroSlides } from '../data/site';
import { ArrowRight, ChevronLeft, ChevronRight } from './Icons';

const SLIDE_DURATION = 6500;

/**
 * Per-slide tint layered over the shared hero artwork so the four slides
 * read as distinct without swapping the background image (which would
 * cause a flash). Each is subtle enough to preserve text contrast.
 */
const THEMES = {
  green: 'from-spist-green-deep/45 via-transparent to-transparent',
  deep: 'from-[#04170e]/55 via-transparent to-transparent',
  maroon: 'from-[#4a0806]/45 via-transparent to-spist-maroon/15',
  accent: 'from-spist-green-dark/40 via-transparent to-spist-accent/15',
};

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const goTo = useCallback((next) => {
    setIndex(((next % heroSlides.length) + heroSlides.length) % heroSlides.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-rotate, pausing on hover/focus and when the tab is hidden.
  useEffect(() => {
    if (paused) return;

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    timer.current = setTimeout(next, SLIDE_DURATION);
    return () => clearTimeout(timer.current);
  }, [index, paused, next]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') prev();
  };

  return (
    <section
      className="hero-bg relative isolate overflow-hidden"
      aria-label="Featured highlights"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      {/* Concentric ring motif — layered above the artwork, below the text */}
      <div
        className="pointer-events-none absolute -right-24 top-1/2 z-[5] hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full border-[3px] border-white/10 lg:block"
        aria-hidden="true"
      >
        <span className="absolute inset-10 rounded-full border border-white/10" />
        <span className="absolute inset-24 rounded-full border border-white/10" />
      </div>

      {/* h-* is fixed and the artwork is a CSS background, so there is no
          layout shift while the SVG decodes. */}
      <div className="relative h-[600px] sm:h-[640px] lg:h-[700px]">
        {heroSlides.map((slide, i) => {
          const active = i === index;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-600 ease-out ${
                active ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
              aria-hidden={!active}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${heroSlides.length}: ${slide.title}`}
            >
              {/* Per-slide tint over the shared artwork; a real photo, when
                  supplied, replaces the artwork for that slide only. */}
              {slide.image ? (
                <>
                  <img
                    src={slide.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-spist-green-deep/95 via-spist-green-deep/80 to-spist-green-deep/35" />
                </>
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    THEMES[slide.theme] ?? THEMES.green
                  }`}
                  aria-hidden="true"
                />
              )}

              <div className="container-spist header-offset relative flex h-full items-center">
                <div
                  className={`max-w-2xl transition-all duration-600 ease-out ${
                    active ? 'translate-y-0 opacity-100 delay-150' : 'translate-y-5 opacity-0'
                  }`}
                >
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white ring-1 ring-white/25 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-spist-accent" />
                    {slide.eyebrow}
                  </span>

                  <h1 className="font-display text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                    {slide.text}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      to={slide.cta.href}
                      tabIndex={active ? 0 : -1}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-spist-maroon px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-spist-maroon-dark"
                    >
                      {slide.cta.label}
                      <ArrowRight />
                    </Link>

                    <Link
                      to="/discover/overview"
                      tabIndex={active ? 0 : -1}
                      className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white/70 px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/15"
                    >
                      Discover SPIST
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Controls ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="container-spist flex items-center justify-between gap-4 pb-7">
          {/* Progress dots — .tap-target gives each a 44x44 hit area */}
          <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose slide">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={slide.title}
                onClick={() => goTo(i)}
                className={`tap-target h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-10 bg-spist-maroon' : 'w-5 bg-white/45 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 text-white transition-colors duration-200 hover:border-white hover:bg-white/15"
            >
              <ChevronLeft width="18" height="18" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 text-white transition-colors duration-200 hover:border-white hover:bg-white/15"
            >
              <ChevronRight width="18" height="18" />
            </button>
          </div>
        </div>
      </div>

      {/* Announce slide changes to screen readers without stealing focus */}
      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {heroSlides.length}: {heroSlides[index].title}
      </p>
    </section>
  );
}
