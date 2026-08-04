import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { faculties } from '../data/site';
import { ArrowRight, Beaker, Book, Clock, Cpu, Globe } from './Icons';
import Reveal from './Reveal';

/** Department name → icon. Falls back to a book for anything unmapped. */
export const iconFor = (department = '') => {
  if (/chem/i.test(department)) return Beaker;
  if (/computer|software|IT/i.test(department)) return Cpu;
  if (/english|language/i.test(department)) return Globe;
  return Book;
};

export default function AcademicPrograms() {
  const [active, setActive] = useState(faculties[0].id);
  const tabRefs = useRef([]);

  const activeFaculty = faculties.find((faculty) => faculty.id === active) ?? faculties[0];
  const activeIndex = faculties.findIndex((faculty) => faculty.id === active);

  // Roving-tabindex arrow navigation between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (event) => {
    let nextIndex = null;
    if (event.key === 'ArrowRight') nextIndex = (activeIndex + 1) % faculties.length;
    if (event.key === 'ArrowLeft') nextIndex = (activeIndex - 1 + faculties.length) % faculties.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = faculties.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      setActive(faculties[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="programs-heading">
      <div className="container-spist">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-7 bg-spist-maroon" />
            Academics
            <span className="h-px w-7 bg-spist-maroon" />
          </span>
          <h2 id="programs-heading" className="section-title">
            Academic Programs
          </h2>
          <p className="section-sub mx-auto">
            Three faculties offering degree, associate degree and skills-based programs across the
            sciences, social sciences and languages.
          </p>
        </Reveal>

        {/* ---------- Faculty tabs ---------- */}
        <Reveal delay={100}>
          <div
            role="tablist"
            aria-label="Faculties"
            onKeyDown={onKeyDown}
            className="mt-11 flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {faculties.map((faculty, index) => {
              const selected = faculty.id === active;

              return (
                <button
                  key={faculty.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${faculty.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${faculty.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(faculty.id)}
                  className={`min-h-11 rounded-full border-2 px-5 py-3 text-[13.5px] font-semibold transition-all duration-200 sm:px-7 sm:text-sm ${
                    selected
                      ? 'border-spist-green bg-spist-green text-white shadow-md'
                      : 'border-spist-line bg-white text-spist-muted hover:border-spist-accent hover:text-spist-green'
                  }`}
                >
                  <span className="hidden sm:inline">{faculty.name}</span>
                  <span className="sm:hidden">{faculty.short}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ---------- Active faculty panel ---------- */}
        <div
          role="tabpanel"
          id={`panel-${activeFaculty.id}`}
          aria-labelledby={`tab-${activeFaculty.id}`}
          className="mt-10"
          key={activeFaculty.id} /* remount so the fade replays on tab change */
        >
          <div className="reveal is-visible">
            <p className="mx-auto max-w-3xl text-center text-[15px] leading-relaxed text-spist-muted">
              {activeFaculty.blurb}
            </p>

            <div
              className={`mt-9 grid gap-6 ${
                activeFaculty.programs.length > 1
                  ? 'sm:grid-cols-2 lg:grid-cols-2'
                  : 'mx-auto max-w-xl'
              }`}
            >
              {activeFaculty.programs.map((program) => {
                const Icon = iconFor(program.department);

                return (
                  <article
                    key={program.name}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-spist-line bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-spist-accent/60 hover:shadow-e3"
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-spist-maroon transition-transform duration-300 group-hover:scale-y-100"
                      aria-hidden="true"
                    />

                    <div className="flex items-start justify-between gap-4">
                      <span
                        className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-lg bg-spist-green/10 p-3.5 text-spist-green transition-colors duration-300 group-hover:bg-spist-green group-hover:text-white"
                        aria-hidden="true"
                      >
                        <Icon width="24" height="24" />
                      </span>

                      <span className="rounded-full bg-spist-maroon/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-spist-maroon">
                        {program.degreeType}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-xl font-bold leading-snug">
                      {program.name}
                    </h3>

                    <p className="mt-1.5 text-[13.5px] font-medium text-spist-accent">
                      {program.department}
                    </p>

                    <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-spist-line pt-5 text-[13px] text-spist-muted">
                      <div className="flex items-center gap-1.5">
                        <dt className="sr-only">Duration</dt>
                        <Clock width="14" height="14" className="text-spist-green" />
                        <dd>{program.duration}</dd>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <dt className="sr-only">Credit hours</dt>
                        <Book width="14" height="14" className="text-spist-green" />
                        <dd>{program.credits}</dd>
                      </div>
                    </dl>

                    <Link
                      to={program.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-spist-green transition-colors hover:text-spist-maroon"
                    >
                      Program Details
                      <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
