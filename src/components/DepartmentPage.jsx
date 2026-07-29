import { useLocation } from 'react-router-dom';
import PageBanner from './PageBanner';
import Reveal from './Reveal';
import { iconFor } from './AcademicPrograms';
import { Book, Clock, Mail, User } from './Icons';
import { navEntryFor } from '../data/navUtils';

/** Deterministic gradient per card so the grid reads as varied, not random —
 *  same palette used for the Campus Gallery placeholder tiles. */
const TILE_GRADIENTS = [
  'from-spist-green-deep via-spist-green to-spist-green-dark',
  'from-spist-green-dark via-spist-green to-spist-accent',
  'from-[#5e0a08] via-spist-maroon-dark to-spist-green-deep',
  'from-spist-green via-spist-accent to-spist-green-dark',
];

/**
 * Shared template for every department subsection page (Chemistry, Computer
 * Science, English, and any future department). A wrapper page supplies the
 * department's programs and faculty roster; this component handles layout,
 * the breadcrumb/title (resolved from the nav config), the programs summary
 * and the faculty table so all department pages stay visually consistent.
 *
 * `deanEmail` is optional and only shown when a wrapper page supplies it —
 * it renders a small contact line under the department header rather than
 * being fabricated for departments that haven't provided one.
 */
export default function DepartmentPage({
  departmentName,
  intro,
  programs = [],
  facultyList = [],
  deanEmail,
}) {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  const title = departmentName ?? entry?.label ?? 'Department';
  const trail = entry?.trail ?? [title];

  return (
    <>
      <PageBanner title={title} trail={trail} intro={intro} />

      {/* ---------- Programs offered ---------- */}
      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-7 bg-spist-maroon" />
              Programs Offered
            </span>
            <h2 className="section-title">{title}</h2>

            {deanEmail && (
              <a
                href={`mailto:${deanEmail}`}
                className="mt-3 inline-flex items-center gap-2 text-[13.5px] font-medium text-spist-muted transition-colors duration-200 hover:text-spist-green"
              >
                <Mail width="14" height="14" className="text-spist-accent" />
                Dean&rsquo;s Office:&nbsp;<span className="font-semibold text-spist-charcoal">{deanEmail}</span>
              </a>
            )}
          </Reveal>

          {programs.length > 0 ? (
            <div
              className={`mt-9 grid gap-6 ${
                programs.length > 1 ? 'sm:grid-cols-2' : 'max-w-xl'
              }`}
            >
              {programs.map((program, index) => {
                const Icon = iconFor(program.department);

                return (
                  <Reveal key={program.name} delay={index * 110}>
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-spist-line bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-spist-accent/60 hover:shadow-e3">
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
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <Reveal delay={100}>
              <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-spist-muted">
                Program details for this department will be published shortly.
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------- Department faculty ---------- */}
      <section className="bg-spist-accent-soft/45 py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-7 bg-spist-maroon" />
              Our People
            </span>
            <h2 className="section-title">Department Faculty</h2>
            <p className="section-sub">
              Qualified teaching staff of {title}, {facultyList.length > 0 ? `${facultyList.length} members` : 'roster to be announced'}.
            </p>
          </Reveal>

          {facultyList.length > 0 ? (
            <div className="mt-9 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {facultyList.map((member, index) => (
                <Reveal key={member.name} delay={(index % 4) * 90}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-spist-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-e3">
                    {/* Photo / placeholder — same treatment as the Campus Gallery tiles */}
                    <div className="relative aspect-square w-full overflow-hidden bg-spist-green">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={`${member.name}, ${member.designation}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <span
                          className={`brand-pattern flex h-full w-full items-center justify-center bg-gradient-to-br ${
                            TILE_GRADIENTS[index % TILE_GRADIENTS.length]
                          } transition-transform duration-300 group-hover:scale-110`}
                          role="img"
                          aria-label={`${member.name} — photograph to be added`}
                        >
                          <User width="34" height="34" className="text-white/45" strokeWidth={1.3} aria-hidden="true" />
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-display text-[14.5px] font-bold leading-snug text-spist-charcoal">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-wide text-spist-maroon">
                        {member.designation}
                      </p>

                      <dl className="mt-3 flex-1 space-y-1.5 border-t border-spist-line pt-3 text-[12.5px] leading-snug text-spist-muted">
                        <div>
                          <dt className="sr-only">Qualification</dt>
                          <dd className="font-medium text-spist-charcoal">{member.qualification}</dd>
                        </div>
                        <div>
                          <dt className="sr-only">Institution</dt>
                          <dd>{member.institution}</dd>
                        </div>
                      </dl>

                      <span className="mt-3 inline-flex w-fit items-center rounded-full bg-spist-accent/20 px-2.5 py-1 text-[11px] font-semibold text-spist-green">
                        {member.appointment ?? '—'}
                      </span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={100}>
              <div className="mt-9 flex flex-col items-center gap-3 rounded-xl border border-dashed border-spist-accent/50 bg-white px-6 py-12 text-center">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-spist-green/10 text-spist-green"
                  aria-hidden="true"
                >
                  <User width="24" height="24" />
                </span>
                <p className="font-display text-base font-bold">Faculty List Coming Soon</p>
                <p className="max-w-md text-[14px] leading-relaxed text-spist-muted">
                  The official teaching staff roster for {title} is being finalised and will be
                  published here shortly.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
