import { useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import CTASection from '../components/CTASection';
import { AccordionCourseCard } from '../components/CourseCards';
import { certificateCourses, diplomaPrograms, shortCoursesPage } from '../data/site';
import { Check } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';

function IntroSection() {
  const { heading, paragraphs } = shortCoursesPage.intro;

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="container-spist">
        <Reveal className="mx-auto max-w-3xl space-y-4">
          <h2 className="font-display text-2xl font-bold leading-snug text-spist-charcoal sm:text-[1.75rem]">
            {heading}
          </h2>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[15px] leading-[1.85] text-spist-muted">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const { heading, text, advantagesHeading, advantages } = shortCoursesPage.whyChoose;

  return (
    <section
      className="bg-spist-accent-soft/45 py-14 sm:py-16 lg:py-20"
      aria-labelledby="why-choose-heading"
    >
      <div className="container-spist">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-7 bg-spist-maroon" />
            Why SPIST
            <span className="h-px w-7 bg-spist-maroon" />
          </span>
          <h2 id="why-choose-heading" className="section-title">
            {heading}
          </h2>
          <p className="section-sub mx-auto">{text}</p>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-10 rounded-xl border border-spist-line bg-white p-7 shadow-card sm:p-9"
        >
          <h3 className="font-display text-lg font-bold text-spist-charcoal">{advantagesHeading}</h3>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {advantages.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[14.5px] leading-relaxed">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-spist-accent/20 text-spist-green"
                  aria-hidden="true"
                >
                  <Check width="12" height="12" strokeWidth={3} />
                </span>
                <span className="text-spist-charcoal">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function PracticalLearningSection() {
  const { heading, paragraphs } = shortCoursesPage.practicalLearning;

  return (
    <section
      className="bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="practical-learning-heading"
    >
      <div className="container-spist">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="practical-learning-heading" className="section-title">
            {heading}
          </h2>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="section-sub mx-auto">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function CareerOpportunitiesSection() {
  const { heading, text, fields, footnote } = shortCoursesPage.careerOpportunities;

  return (
    <section
      className="bg-spist-accent-soft/45 py-14 sm:py-16 lg:py-20"
      aria-labelledby="career-opportunities-heading"
    >
      <div className="container-spist">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-7 bg-spist-maroon" />
            After Graduation
            <span className="h-px w-7 bg-spist-maroon" />
          </span>
          <h2 id="career-opportunities-heading" className="section-title">
            {heading}
          </h2>
          <p className="section-sub mx-auto">{text}</p>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-10 rounded-xl border border-spist-line bg-white p-7 shadow-card sm:p-9"
        >
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <li key={field} className="flex items-start gap-3 text-[14.5px] leading-relaxed">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-spist-maroon/10 text-spist-maroon"
                  aria-hidden="true"
                >
                  <Check width="12" height="12" strokeWidth={3} />
                </span>
                <span className="text-spist-charcoal">{field}</span>
              </li>
            ))}
          </ul>

          <p className="mt-7 border-t border-spist-line pt-6 text-[14.5px] leading-relaxed text-spist-muted">
            {footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CourseSection({ group, accent }) {
  const isMaroon = accent === 'maroon';

  return (
    <section className={isMaroon ? 'bg-spist-accent-soft/45 py-14 sm:py-16 lg:py-20' : 'bg-white py-14 sm:py-16 lg:py-20'}>
      <div className="container-spist">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">
              <span className="h-px w-7 bg-spist-maroon" />
              {group.duration} Program
            </span>
            <h2 className="section-title">{group.title}</h2>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-bold uppercase tracking-wider ${
              isMaroon ? 'bg-spist-maroon text-white' : 'bg-spist-green text-white'
            }`}
          >
            {group.items.length} Programs
          </span>
        </Reveal>

        {group.tagline && (
          <Reveal delay={50} className="mt-6 max-w-3xl">
            <h3 className="font-display text-lg font-bold text-spist-charcoal">{group.tagline}</h3>
          </Reveal>
        )}

        {group.intro && (
          <Reveal delay={70} className="mt-3 max-w-3xl">
            <p className="text-[15px] leading-relaxed text-spist-muted">{group.intro}</p>
          </Reveal>
        )}

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {group.items.map((item, index) => (
            <AccordionCourseCard
              key={item.name}
              name={item.name}
              description={item.description}
              duration={group.duration}
              accent={accent}
              delay={(index % 6) * 70}
            />
          ))}
        </div>

        {group.footnote && (
          <Reveal delay={100} className="mt-7 max-w-3xl">
            <p className="text-[14px] leading-relaxed text-spist-muted">{group.footnote}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default function ShortCoursesPage({ intro }) {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  return (
    <>
      <PageBanner
        title={entry?.label ?? 'Diploma & Certificate Programs'}
        trail={entry?.trail ?? ['Academic', 'Diploma & Certificate Programs']}
        intro={
          intro ??
          'Short, practical, employment-focused programs open to students and professionals alike — six-month diplomas and three-month certificate courses across IT, business, design and language skills.'
        }
      />

      <IntroSection />
      <WhyChooseSection />

      <CourseSection group={diplomaPrograms} accent="green" />
      <CourseSection group={certificateCourses} accent="maroon" />

      <PracticalLearningSection />
      <CareerOpportunitiesSection />

      <CTASection />
    </>
  );
}
