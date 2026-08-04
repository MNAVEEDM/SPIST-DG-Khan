import { useCallback, useEffect, useState } from 'react';
import { galleryCategories, galleryItems } from '../data/site';
import { Beaker, ChevronLeft, ChevronRight, Close, Globe, Search } from './Icons';
import Reveal from './Reveal';

const CATEGORY_ICON = {
  Labs: Beaker,
  Events: Globe,
  Campus: Globe,
};

/** Deterministic gradient per tile so the grid reads as varied, not random. */
const TILE_GRADIENTS = [
  'from-spist-green-deep via-spist-green to-spist-green-dark',
  'from-spist-green-dark via-spist-green to-spist-accent',
  'from-[#5e0a08] via-spist-maroon-dark to-spist-green-deep',
  'from-spist-green via-spist-accent to-spist-green-dark',
];

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null); // index within `visible`

  const visible =
    filter === 'All' ? galleryItems : galleryItems.filter((item) => item.category === filter);

  const close = useCallback(() => setLightbox(null), []);

  const step = useCallback(
    (delta) => {
      setLightbox((current) => {
        if (current === null) return current;
        return (current + delta + visible.length) % visible.length;
      });
    },
    [visible.length],
  );

  // Lightbox: Escape closes, arrows navigate, background scroll is locked.
  useEffect(() => {
    if (lightbox === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox, close, step]);

  const activeItem = lightbox === null ? null : visible[lightbox];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="gallery-heading">
      <div className="container-spist">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-7 bg-spist-maroon" />
            Campus Life
            <span className="h-px w-7 bg-spist-maroon" />
          </span>
          <h2 id="gallery-heading" className="section-title">
            Campus Gallery
          </h2>
          <p className="section-sub mx-auto">
            Laboratories, facilities and moments from student life at SPIST, D.G. Khan.
          </p>
        </Reveal>

        {/* ---------- Filters ---------- */}
        <Reveal delay={90}>
          <div
            className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3"
            role="group"
            aria-label="Filter gallery by category"
          >
            {galleryCategories.map((category) => {
              const selected = filter === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setFilter(category);
                    setLightbox(null);
                  }}
                  aria-pressed={selected}
                  className={`min-h-11 rounded-full border-2 px-6 py-3 text-[13.5px] font-semibold transition-all duration-200 ${
                    selected
                      ? 'border-spist-maroon bg-spist-maroon text-white shadow-md'
                      : 'border-spist-line bg-white text-spist-muted hover:border-spist-accent hover:text-spist-green'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ---------- Grid ---------- */}
        <div className="mt-9 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {visible.map((item, index) => {
            const Icon = CATEGORY_ICON[item.category] ?? Globe;

            return (
              <Reveal key={item.id} delay={(index % 4) * 90}>
                <button
                  type="button"
                  onClick={() => setLightbox(index)}
                  className="group relative block aspect-4/3 w-full overflow-hidden rounded-lg bg-spist-green text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-e3"
                  aria-label={`View larger: ${item.caption}`}
                >
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <span
                      className={`brand-pattern flex h-full w-full items-center justify-center bg-gradient-to-br ${
                        TILE_GRADIENTS[index % TILE_GRADIENTS.length]
                      } transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon
                        width="34"
                        height="34"
                        className="text-white/45"
                        strokeWidth={1.3}
                        aria-hidden="true"
                      />
                    </span>
                  )}

                  {/* Hover overlay */}
                  <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-spist-charcoal/90 via-spist-charcoal/25 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wider text-spist-accent">
                      {item.category}
                    </span>
                    <span className="mt-1 text-[13.5px] font-semibold leading-snug text-white">
                      {item.caption}
                    </span>
                  </span>

                  {/* Zoom affordance */}
                  <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Search width="15" height="15" />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="mt-10 text-center text-sm text-spist-muted">
            No images in this category yet.
          </p>
        )}
      </div>

      {/* ---------- Lightbox ---------- */}
      {activeItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-spist-charcoal/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.caption}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close image viewer"
          >
            <Close width="26" height="26" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 rounded-full border border-white/25 p-3 text-white/80 transition-colors hover:border-white hover:bg-white/10 hover:text-white sm:left-8"
            aria-label="Previous image"
          >
            <ChevronLeft width="22" height="22" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            className="absolute right-3 rounded-full border border-white/25 p-3 text-white/80 transition-colors hover:border-white hover:bg-white/10 hover:text-white sm:right-8"
            aria-label="Next image"
          >
            <ChevronRight width="22" height="22" />
          </button>

          <figure
            className="max-h-[85vh] w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            {activeItem.src ? (
              <img
                src={activeItem.src}
                alt={activeItem.caption}
                className="max-h-[72vh] w-full rounded-lg object-contain"
              />
            ) : (
              <div
                className={`brand-pattern flex aspect-video w-full items-center justify-center rounded-lg bg-gradient-to-br ${
                  TILE_GRADIENTS[lightbox % TILE_GRADIENTS.length]
                }`}
              >
                <span className="px-6 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  Photograph to be added
                </span>
              </div>
            )}

            <figcaption className="mt-4 text-center">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-spist-accent">
                {activeItem.category}
              </span>
              <span className="mt-1 block font-display text-lg font-semibold text-white">
                {activeItem.caption}
              </span>
              <span className="mt-1.5 block text-[12.5px] text-white/55">
                {lightbox + 1} of {visible.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
