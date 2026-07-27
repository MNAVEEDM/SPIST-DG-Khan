import { useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import CTASection from '../components/CTASection';
import { certificateCourses, diplomaPrograms } from '../data/site';
import { Check, Clock } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';

function CourseCard({ name, duration, accent, delay }) {
  const isMaroon = accent === 'maroon';

  return (
    <Reveal delay={delay}>
      <article className="group flex h-full items-start gap-4 rounded-xl border border-spist-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-spist-accent/60 hover:shadow-e3">
        <span
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
            isMaroon
              ? 'bg-spist-maroon/10 text-spist-maroon group-hover:bg-spist-maroon group-hover:text-white'
              : 'bg-spist-green/10 text-spist-green group-hover:bg-spist-green group-hover:text-white'
          }`}
          aria-hidden="true"
        >
          <Check width="17" height="17" strokeWidth={2.5} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[15px] font-bold leading-snug text-spist-charcoal">
            {name}
          </h3>
          <span
            className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
              isMaroon ? 'bg-spist-maroon/10 text-spist-maroon' : 'bg-spist-green/10 text-spist-green'
            }`}
          >
            <Clock width="11" height="11" />
            {duration}
          </span>
        </div>
      </article>
    </Reveal>
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

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {group.items.map((name, index) => (
            <CourseCard key={name} name={name} duration={group.duration} accent={accent} delay={(index % 6) * 70} />
          ))}
        </div>
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

      <CourseSection group={diplomaPrograms} accent="green" />
      <CourseSection group={certificateCourses} accent="maroon" />

      <CTASection />
    </>
  );
}
