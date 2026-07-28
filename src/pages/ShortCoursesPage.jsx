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

function IntroSection() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="container-spist">
        <Reveal className="mx-auto max-w-3xl space-y-4">
          <p className="text-[15px] leading-[1.85] text-spist-muted">
            The South Punjab Institute of Science &amp; Technology (SPIST), Dera Ghazi Khan,
            offers professionally designed Diploma and Certificate Programs that prepare students
            with practical knowledge, technical expertise, and career-ready skills. Our programs
            are developed to meet the growing demands of today&rsquo;s industries, helping
            students, graduates, professionals, and entrepreneurs build successful careers in
            Pakistan and beyond.
          </p>
          <p className="text-[15px] leading-[1.85] text-spist-muted">
            Whether your goal is to secure a better job, launch a freelance career, start your own
            business, or continue your higher education, SPIST provides quality education through
            experienced faculty, modern learning resources, and hands-on training.
          </p>
          <p className="text-[15px] leading-[1.85] text-spist-muted">
            Our curriculum combines academic excellence with practical experience, ensuring
            graduates are confident, skilled, and ready for real-world challenges.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const ADVANTAGES = [
  'Industry-relevant and regularly updated curriculum',
  'Practical, project-based learning approach',
  'Experienced and qualified instructors',
  'Modern computer laboratories and learning facilities',
  'Affordable tuition with excellent value',
  'Career-oriented training and professional development',
  'Supportive learning environment',
  'Opportunities to develop freelancing and entrepreneurial skills',
  'Focus on innovation, creativity, and lifelong learning',
  'Strong commitment to academic excellence and student success',
];

function WhyChooseSection() {
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
            Why Choose SPIST?
          </h2>
          <p className="section-sub mx-auto">
            SPIST is committed to delivering affordable, high-quality education that empowers
            learners with practical skills and professional confidence.
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-10 rounded-xl border border-spist-line bg-white p-7 shadow-card sm:p-9"
        >
          <h3 className="font-display text-lg font-bold text-spist-charcoal">Our Advantages</h3>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {ADVANTAGES.map((point) => (
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
  return (
    <section
      className="bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="practical-learning-heading"
    >
      <div className="container-spist">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="practical-learning-heading" className="section-title">
            Practical Learning That Creates Opportunities
          </h2>
          <p className="section-sub mx-auto">
            Education at SPIST goes beyond textbooks. Students participate in practical
            assignments, live projects, presentations, workshops, and collaborative activities
            that strengthen technical expertise, communication abilities, and problem-solving
            skills.
          </p>
          <p className="section-sub mx-auto">
            Our learning environment encourages creativity, innovation, teamwork, and continuous
            personal development while preparing graduates for the evolving needs of local and
            international industries.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const CAREER_FIELDS = [
  'Information Technology',
  'Artificial Intelligence',
  'Software & Web Development',
  'Graphic Design & Creative Media',
  'Digital Marketing & E-Commerce',
  'Data Analytics & Business Intelligence',
  'Office Administration',
  'Business Management',
  'Entrepreneurship',
  'Education & Training',
  'Government Organizations',
  'Private Sector Companies',
  'Freelancing & Remote Work',
];

function CareerOpportunitiesSection() {
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
            Career Opportunities
          </h2>
          <p className="section-sub mx-auto">
            Graduates of SPIST Diploma and Certificate Programs are prepared for careers in a wide
            range of industries, including:
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-10 rounded-xl border border-spist-line bg-white p-7 shadow-card sm:p-9"
        >
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {CAREER_FIELDS.map((field) => (
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
            These programs also provide an excellent foundation for higher education and
            professional certifications.
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

        {group.intro && (
          <Reveal delay={60} className="mt-4 max-w-3xl">
            <p className="text-[15px] leading-relaxed text-spist-muted">{group.intro}</p>
          </Reveal>
        )}

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
