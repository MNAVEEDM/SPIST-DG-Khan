import { useId, useState } from 'react';
import Reveal from './Reveal';
import { Check, ChevronDown, Clock } from './Icons';

/** Plain course card — used for the non-expandable (certificate) list. */
export function CourseCard({ name, duration, accent, delay }) {
  const isMaroon = accent === 'maroon';

  return (
    <Reveal delay={delay}>
      <article className="group flex h-full items-start gap-4 rounded-xl border border-spist-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-spist-accent/60 hover:shadow-e3">
        <span
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
            isMaroon
              ? 'bg-spist-maroon/10 text-spist-maroon group-hover:bg-spist-maroon group-hover:text-white'
              : 'bg-spist-green/10 text-spist-green group-hover:bg-spist-green group-hover:text-white'
          }`}
          aria-hidden="true"
        >
          <Check width="17" height="17" strokeWidth={2.5} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[15px] font-bold leading-snug text-spist-charcoal">
            {name}
          </h3>
          <span
            className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
              isMaroon ? 'bg-spist-maroon/10 text-spist-maroon' : 'bg-spist-green/10 text-spist-green'
            }`}
          >
            <Clock width="11" height="11" />
            {duration}
          </span>
        </div>
      </article>
    </Reveal>
  );
}

/** Course card that expands in place to reveal its full description. */
export function AccordionCourseCard({ name, description, duration, accent, delay }) {
  const isMaroon = accent === 'maroon';
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <Reveal delay={delay}>
      <article className="overflow-hidden rounded-xl border border-spist-line bg-white shadow-card transition-all duration-300 hover:border-spist-accent/60 hover:shadow-e3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-start gap-4 p-5 text-left"
        >
          <span
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              isMaroon
                ? open
                  ? 'bg-spist-maroon text-white'
                  : 'bg-spist-maroon/10 text-spist-maroon'
                : open
                  ? 'bg-spist-green text-white'
                  : 'bg-spist-green/10 text-spist-green'
            }`}
            aria-hidden="true"
          >
            <Check width="17" height="17" strokeWidth={2.5} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-display text-[15px] font-bold leading-snug text-spist-charcoal">
              {name}
            </span>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                isMaroon ? 'bg-spist-maroon/10 text-spist-maroon' : 'bg-spist-green/10 text-spist-green'
              }`}
            >
              <Clock width="11" height="11" />
              {duration}
            </span>
          </span>

          <ChevronDown
            width="18"
            height="18"
            className={`mt-1.5 shrink-0 transition-transform duration-200 ${
              isMaroon ? 'text-spist-maroon' : 'text-spist-green'
            } ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <div
          id={panelId}
          aria-hidden={!open}
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <p className="border-t border-spist-line px-5 pb-5 pt-4 text-[13.5px] leading-relaxed text-spist-muted">
              {description}
            </p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
