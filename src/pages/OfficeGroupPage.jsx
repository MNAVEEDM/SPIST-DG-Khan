import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import PageSidebar from '../components/PageSidebar';
import Reveal from '../components/Reveal';
import { ArrowRight } from '../components/Icons';
import { officeContent } from '../data/officeContent';

/**
 * Landing page for a top-level Office entry that has more than one sub-role
 * (Rector, Administration Office, Finance Office, Examination Department,
 * DSA, QEC, Central Library, Security Office — see `src/data/officeGroups.js`).
 * Shows a "View details" card for each sub-role, linking through to that
 * sub-role's own dedicated page. Offices with a single page and no sub-items
 * (e.g. ORIC Office) render through `InnerPage` instead, not this component.
 */
export default function OfficeGroupPage({ officeGroup, title, trail, intro }) {
  if (!officeGroup) return null;

  return (
    <>
      <PageBanner
        title={title ?? officeGroup.label}
        trail={trail ?? ['Discover SPIST', 'Office', officeGroup.label]}
        intro={intro ?? officeGroup.intro}
      />

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {officeGroup.items.map((item, index) => (
                  <Reveal key={item.href} delay={index * 90}>
                    <Link
                      to={item.href}
                      className="group flex h-full flex-col rounded-xl border border-spist-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-spist-accent/60 hover:shadow-e3"
                    >
                      <h3 className="font-display text-base font-bold text-spist-charcoal">
                        {item.label}
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-spist-muted">
                        {officeContent[item.href]?.lead?.[0]}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-spist-green">
                        View details
                        <ArrowRight
                          width="14"
                          height="14"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>

            <PageSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
