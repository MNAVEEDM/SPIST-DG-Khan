import { Link, useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import PageSidebar from '../components/PageSidebar';
import Reveal from '../components/Reveal';
import { AccordionCourseCard } from '../components/CourseCards';
import { ArrowRight } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';
import { certificateCourses } from '../data/site';

export default function CertificateCoursesPage() {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  return (
    <>
      <PageBanner
        title={entry?.label ?? certificateCourses.title}
        trail={entry?.trail ?? ['Admissions', certificateCourses.title]}
        intro={certificateCourses.tagline}
      />

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-8">
              <h2 className="font-display text-2xl font-bold">{certificateCourses.title}</h2>

              <p className="mt-4 text-[15px] leading-[1.85] text-spist-muted">
                {certificateCourses.intro}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {certificateCourses.items.map((item, index) => (
                  <AccordionCourseCard
                    key={item.name}
                    name={item.name}
                    description={item.description}
                    duration={certificateCourses.duration}
                    accent="maroon"
                    delay={(index % 6) * 70}
                  />
                ))}
              </div>

              {certificateCourses.footnote && (
                <p className="mt-7 border-t border-spist-line pt-6 text-[14px] leading-relaxed text-spist-muted">
                  {certificateCourses.footnote}
                </p>
              )}

              <Link
                to={certificateCourses.href}
                className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-spist-maroon transition-colors hover:text-spist-maroon-dark"
              >
                View full program details on the Academic page
                <ArrowRight width="14" height="14" />
              </Link>
            </Reveal>

            <PageSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
