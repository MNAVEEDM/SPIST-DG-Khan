import { Link, useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import { ArrowRight, Mail, Phone } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';
import { institution } from '../data/site';

/**
 * Generic template for every inner page that has not yet received real
 * institutional copy. It keeps all navigation links working and gives each
 * page a consistent, finished shell — drop the real content into `children`
 * (or build a dedicated page component) as it becomes available.
 */
export default function InnerPage({ title, trail, intro, children }) {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  const resolvedTitle = title ?? entry?.label ?? 'Page';
  const resolvedTrail = trail ?? entry?.trail ?? [];

  return (
    <>
      <PageBanner title={resolvedTitle} trail={resolvedTrail} intro={intro} />

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-8">
              {children ?? (
                <div className="space-y-5">
                  <h2 className="font-display text-2xl font-bold">{resolvedTitle}</h2>

                  <p className="text-[15px] leading-[1.85] text-spist-muted">
                    Content for this section of the {institution.shortName} website is being
                    finalised by the institute. This page is fully wired into the site navigation and
                    is ready for its official text, documents and downloads.
                  </p>

                  <p className="text-[15px] leading-[1.85] text-spist-muted">
                    For information relating to <strong className="text-spist-charcoal">{resolvedTitle}</strong>,
                    please contact the {institution.shortName} administration office in{' '}
                    {institution.city} using the details opposite, or visit the campus during office
                    hours.
                  </p>

                  <div
                    className="rounded-lg border-l-4 border-spist-accent bg-spist-accent-soft/60 p-5"
                    role="note"
                  >
                    <p className="text-[14px] leading-relaxed text-spist-charcoal">
                      <strong className="font-semibold">Note for content editors:</strong> replace
                      this placeholder by passing children to{' '}
                      <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[13px] text-spist-green">
                        InnerPage
                      </code>{' '}
                      in <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[13px] text-spist-green">
                        src/routes.jsx
                      </code>
                      , or by creating a dedicated page component.
                    </p>
                  </div>
                </div>
              )}
            </Reveal>

            {/* ---------- Sidebar ---------- */}
            <Reveal delay={120} className="lg:col-span-4">
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
                      href={`mailto:${institution.email}`}
                      className="flex items-center gap-2.5 break-all text-[14px] font-medium text-spist-charcoal transition-colors hover:text-spist-green"
                    >
                      <Mail width="15" height="15" className="text-spist-accent" />
                      {institution.email}
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
          </div>
        </div>
      </section>
    </>
  );
}
