import { useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import PageSidebar from '../components/PageSidebar';
import Reveal from '../components/Reveal';
import { Check } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';
import { institution } from '../data/site';

/**
 * Renders the structured `{ lead, responsibilitiesHeading, responsibilities,
 * audience, closing }` shape used by `src/data/officeContent.js` so office
 * and ORIC sub-pages share one consistent look without each needing a
 * bespoke page component.
 */
function OfficeBody({ title, body }) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold">{title}</h2>

      {body.lead.map((paragraph, index) => (
        <p key={index} className="text-[15px] leading-[1.85] text-spist-muted">
          {paragraph}
        </p>
      ))}

      <h3 className="pt-2 font-display text-lg font-bold text-spist-charcoal">
        {body.responsibilitiesHeading ?? 'Key Responsibilities'}
      </h3>

      <ul className="space-y-3">
        {body.responsibilities.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-[15px] leading-[1.85]">
            <span
              className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-spist-accent/20 text-spist-green"
              aria-hidden="true"
            >
              <Check width="12" height="12" strokeWidth={3} />
            </span>
            <span className="text-spist-muted">{item}</span>
          </li>
        ))}
      </ul>

      <p className="text-[15px] leading-[1.85] text-spist-muted">{body.audience}</p>
      <p className="text-[15px] leading-[1.85] text-spist-muted">{body.closing}</p>
    </div>
  );
}

/**
 * Generic template for every inner page. Pages with real institutional copy
 * supply `body` (see `src/data/officeContent.js`) and it renders in place of
 * the placeholder; pages awaiting copy fall back to the placeholder note
 * below. Bespoke layouts can still pass `children` directly.
 */
export default function InnerPage({ title, trail, intro, body, contactEmail, children }) {
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
              {children ??
                (body ? (
                  <OfficeBody title={resolvedTitle} body={body} />
                ) : (
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
                ))}
            </Reveal>

            <PageSidebar email={contactEmail} />
          </div>
        </div>
      </section>
    </>
  );
}
