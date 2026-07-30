import { Link } from 'react-router-dom';
import { departmentFaculty } from '../data/site';
import { navEntryFor } from '../data/navUtils';
import { ArrowRight } from './Icons';
import Reveal from './Reveal';

/** "Dr. Sadia Bashir" → "SB" (titles stripped) */
function initialsOf(name) {
  return name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.|Engr\.)\s*/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function FacultyCard({ member, delay }) {
  return (
    <Reveal delay={delay}>
      <article className="group h-full overflow-hidden rounded-xl border border-spist-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-spist-accent/60 hover:shadow-e3">
        {/* Portrait */}
        <div className="relative aspect-[4/3] overflow-hidden bg-spist-green">
          {member.photo ? (
            <img
              src={member.photo}
              alt={`${member.name}, ${member.designation}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className="brand-pattern flex h-full w-full items-center justify-center bg-gradient-to-br from-spist-green-deep via-spist-green to-spist-green-dark"
              role="img"
              aria-label={`${member.name} — photograph to be added`}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/12 font-display text-2xl font-bold text-white ring-2 ring-white/25 transition-transform duration-300 group-hover:scale-110">
                {initialsOf(member.name)}
              </span>
            </div>
          )}

          <span
            className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-spist-maroon transition-transform duration-300 group-hover:scale-x-100"
            aria-hidden="true"
          />
        </div>

        {/* Details */}
        <div className="p-5">
          <h3 className="font-display text-base font-bold leading-snug">{member.name}</h3>

          <p className="mt-1 text-[12.5px] font-semibold uppercase tracking-wide text-spist-maroon">
            {member.designation}
          </p>

          <dl className="mt-3 space-y-1.5 border-t border-spist-line pt-3 text-[13px] leading-snug text-spist-muted">
            <div>
              <dt className="sr-only">Qualification</dt>
              <dd className="font-medium text-spist-charcoal">{member.qualification}</dd>
            </div>
            <div>
              <dt className="sr-only">Institution</dt>
              <dd>{member.institution}</dd>
            </div>
          </dl>
        </div>
      </article>
    </Reveal>
  );
}

/** The department-by-department faculty listing, shared by the homepage
 *  teaser section below and the dedicated Faculty page. Reads every
 *  department's roster from `departmentFaculty` (Chemistry, Computer
 *  Science, English) rather than a single-department subset, and resolves
 *  each department's display name from the nav config so it never drifts
 *  out of sync with the department pages themselves. */
export function FacultyDirectory() {
  return (
    <>
      {Object.entries(departmentFaculty).map(([slug, members]) => {
        if (members.length === 0) return null;

        const departmentName = navEntryFor(`/academic/${slug}`)?.label ?? slug;

        return (
          <div key={slug} className="mt-12 first:mt-0">
            <Reveal className="mb-6 flex items-center gap-4">
              <h3 className="font-display text-lg font-bold text-spist-green">
                {departmentName}
              </h3>
              <span className="h-px flex-1 bg-spist-line" aria-hidden="true" />
              <span className="text-[12.5px] font-medium text-spist-muted">
                {members.length} members
              </span>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <FacultyCard key={member.name} member={member} delay={(index % 3) * 110} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function FacultyGrid() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="faculty-heading">
      <div className="container-spist">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <span className="h-px w-7 bg-spist-maroon" />
              Our People
            </span>
            <h2 id="faculty-heading" className="section-title">
              Meet Our Faculty
            </h2>
            <p className="section-sub">
              Qualified and experienced academics from leading universities across Pakistan, teaching
              and mentoring at every level.
            </p>
          </div>

          <Link
            to="/academic"
            className="group inline-flex items-center gap-2 rounded-md border-2 border-spist-green px-6 py-3 text-sm font-semibold text-spist-green transition-all duration-200 hover:bg-spist-green hover:text-white"
          >
            All Departments
            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <FacultyDirectory />
      </div>
    </section>
  );
}
