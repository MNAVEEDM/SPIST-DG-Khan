import { Mail, User } from './Icons';
import Reveal from './Reveal';

/** "Dr. Muhammad Usman" → "MU" (titles stripped) */
function initialsOf(name) {
  return name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.|Engr\.)\s*/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Compact office-holder card — photo/avatar, name, designation, and contact
 * email — following the flat staff-listing format used on the reference
 * site (ue.edu.pk/office.php). Reusable across any office page that names a
 * staff member; driven by `person` entries in `src/data/officePersons.js`.
 */
export default function StaffCard({ person }) {
  if (!person) return null;

  const { name, designation, email, photo } = person;

  return (
    <Reveal>
      <article className="flex flex-col items-center gap-5 rounded-xl border border-spist-line bg-white p-6 text-center shadow-card sm:flex-row sm:text-left">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-spist-green">
          {photo ? (
            <img
              src={photo}
              alt={`${name}, ${designation}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="brand-pattern flex h-full w-full items-center justify-center bg-gradient-to-br from-spist-green-deep via-spist-green to-spist-green-dark"
              role="img"
              aria-label={`${name} — photograph to be added`}
            >
              <span className="font-display text-xl font-bold text-white/90">
                {initialsOf(name) || <User width="26" height="26" className="text-white/80" />}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="font-display text-lg font-bold text-spist-charcoal">{name}</p>
          <p className="mt-1 text-[13px] font-semibold uppercase tracking-wide text-spist-maroon">
            {designation}
          </p>
          {email && (
            <a
              href={`mailto:${email}`}
              className="mt-2 inline-flex items-center gap-2 text-[13.5px] text-spist-muted transition-colors hover:text-spist-green"
            >
              <Mail width="14" height="14" className="text-spist-accent" />
              {email}
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}
