import { Link, useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import { iconFor } from '../components/AcademicPrograms';
import { ArrowRight, Clock } from '../components/Icons';
import { faculties } from '../data/site';
import { navEntryFor } from '../data/navUtils';

export default function Academic({ intro }) {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  return (
    <>
      <PageBanner
        title={entry?.label ?? 'Academic'}
        trail={entry?.trail ?? ['Academic']}
        intro={
          intro ??
          'Three faculties offering degree, associate degree, and skills-based programs across the sciences, social sciences and languages.'
        }
      />

      {/* ---------- Faculty directory ---------- */}
      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <div className="grid gap-6 lg:grid-cols-3">
            {faculties.map((faculty, index) => (
              <Reveal key={faculty.id} delay={index * 110}>
                <article className="flex h-full flex-col rounded-xl border border-spist-line bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-spist-accent/60 hover:shadow-e3">
                  <h2 className="font-display text-lg font-bold leading-snug">{faculty.name}</h2>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-spist-muted">
                    {faculty.blurb}
                  </p>

                  <ul className="mt-6 space-y-2.5 border-t border-spist-line pt-5">
                    {faculty.programs.map((program) => {
                      const Icon = iconFor(program.department);

                      return (
                        <li key={program.name}>
                          <Link
                            to={program.href}
                            className="group flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 transition-colors hover:bg-spist-accent-soft/60"
                          >
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-spist-green/10 text-spist-green transition-colors group-hover:bg-spist-green group-hover:text-white"
                              aria-hidden="true"
                            >
                              <Icon width="16" height="16" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13.5px] font-semibold text-spist-charcoal">
                                {program.name}
                              </span>
                              <span className="flex items-center gap-1 text-[12px] text-spist-muted">
                                <Clock width="11" height="11" />
                                {program.duration}
                              </span>
                            </span>
                            <ArrowRight
                              width="14"
                              height="14"
                              className="shrink-0 text-spist-accent opacity-0 transition-opacity group-hover:opacity-100"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          {/* ---------- Quick access: Diploma & Certificate Programs ---------- */}
          <Reveal delay={280} className="mt-8">
            <Link
              to="/academic/short-courses"
              className="group relative flex flex-col items-center gap-5 overflow-hidden rounded-xl bg-spist-maroon p-8 text-center shadow-panel transition-transform duration-300 hover:-translate-y-1 sm:flex-row sm:text-left"
            >
              <div className="brand-pattern absolute inset-0" aria-hidden="true" />

              <span
                className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25"
                aria-hidden="true"
              >
                <Clock width="28" height="28" />
              </span>

              <div className="relative flex-1">
                <h2 className="font-display text-xl font-bold text-white">
                  Diploma &amp; Certificate Programs
                </h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/80">
                  10 six-month diploma programs and 16 three-month certificate courses — short,
                  practical and employment-focused.
                </p>
              </div>

              <span className="relative inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold text-spist-maroon transition-colors group-hover:bg-spist-accent-soft">
                View All Courses
                <ArrowRight width="15" height="15" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
