import { useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import { Award, Book, Cpu, Heart, MessageCircle, Trophy, Target, Users } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';
import { studentLife } from '../data/students';

const ICONS = {
  library: Book,
  sports: Trophy,
  career: Target,
  scholarships: Award,
  'it-labs': Cpu,
  health: Heart,
  counselling: MessageCircle,
  clubs: Users,
};

export default function StudentsPage({ intro }) {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);
  const { intro: campusLife, supportServices, closing } = studentLife;

  return (
    <>
      <PageBanner
        title={entry?.label ?? 'Students'}
        trail={entry?.trail ?? ['Students']}
        intro={intro ?? 'Campus life, facilities and support services for SPIST students.'}
      />

      {/* ---------- Campus life intro ---------- */}
      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <Reveal>
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl font-bold">{campusLife.heading}</h2>
              {campusLife.paragraphs.map((paragraph, index) => (
                <p key={index} className="mt-4 text-[15px] leading-[1.85] text-spist-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {/* ---------- Student Support Services ---------- */}
          <div className="mt-14">
            <Reveal>
              <div className="max-w-3xl">
                <h2 className="font-display text-2xl font-bold">{supportServices.heading}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-spist-muted">
                  {supportServices.intro}
                </p>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {supportServices.items.map(({ id, title, description }, index) => {
                const Icon = ICONS[id];

                return (
                  <Reveal key={id} delay={index * 80}>
                    <article className="group flex h-full flex-col rounded-xl border border-spist-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-spist-accent/60 hover:shadow-e3">
                      <span
                        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-spist-green/10 text-spist-green transition-colors duration-300 group-hover:bg-spist-green group-hover:text-white"
                        aria-hidden="true"
                      >
                        <Icon width="22" height="22" />
                      </span>

                      <h3 className="mt-4 font-display text-base font-bold leading-snug">{title}</h3>

                      <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-spist-muted">
                        {description}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* ---------- Campus environment & safety ---------- */}
          <Reveal className="mt-14">
            <article className="relative overflow-hidden rounded-xl border border-spist-line bg-white p-8 shadow-card sm:p-10 lg:p-12">
              <span className="absolute inset-x-0 top-0 h-1 bg-spist-maroon" aria-hidden="true" />

              <div className="max-w-3xl">
                <h2 className="font-display text-xl font-bold text-spist-charcoal sm:text-2xl">
                  {closing.heading}
                </h2>

                {closing.paragraphs.map((paragraph, index) => (
                  <p key={index} className="mt-4 text-[15px] leading-[1.85] text-spist-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}
