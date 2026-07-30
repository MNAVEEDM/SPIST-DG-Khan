import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { ArrowRight, Mail, Phone } from './Icons';
import { institution } from '../data/site';

/**
 * Shared sidebar for inner pages laid out in the InnerPage 8/4-column grid —
 * contact details plus an "Apply Online" nudge. Pass `email` to show a
 * page-specific office address instead of the general institute inbox.
 */
export default function PageSidebar({ delay = 120, email }) {
  const contactEmail = email ?? institution.email;

  return (
    <Reveal delay={delay} className="lg:col-span-4">
      <div className="sticky top-32 space-y-5">
        <div className="overflow-hidden rounded-xl border border-spist-line shadow-card">
          <h2 className="bg-spist-green px-6 py-4 font-display text-base font-bold text-white">
            Need Help?
          </h2>

          <div className="space-y-3.5 p-6">
            <p className="text-[14px] leading-relaxed text-spist-muted">
              Our admissions and administration teams are available Monday to Saturday,
              8:00&nbsp;AM&nbsp;–&nbsp;4:00&nbsp;PM.
            </p>

            {institution.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/-/g, '')}`}
                className="flex items-center gap-2.5 text-[14px] font-medium text-spist-charcoal transition-colors hover:text-spist-green"
              >
                <Phone width="15" height="15" className="text-spist-accent" />
                {phone}
              </a>
            ))}

            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2.5 break-all text-[14px] font-medium text-spist-charcoal transition-colors hover:text-spist-green"
            >
              <Mail width="15" height="15" className="text-spist-accent" />
              {contactEmail}
            </a>
          </div>
        </div>

        <div className="brand-pattern overflow-hidden rounded-xl bg-gradient-to-br from-spist-maroon to-spist-maroon-dark p-6 text-white">
          <h2 className="font-display text-lg font-bold">Admissions Open</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-white/80">
            Apply now for degree, diploma and certificate programs for the Fall 2026 session.
          </p>
          <Link
            to="/admissions/online"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-[13.5px] font-bold text-spist-maroon transition-colors hover:bg-spist-accent-soft"
          >
            Apply Online
            <ArrowRight width="14" height="14" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
