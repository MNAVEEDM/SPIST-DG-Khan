import { mission, vision } from '../data/site';
import { Check, Eye, Target } from './Icons';
import Reveal from './Reveal';

const CARDS = [
  {
    key: 'vision',
    data: vision,
    Icon: Eye,
    accent: 'green',
  },
  {
    key: 'mission',
    data: mission,
    Icon: Target,
    accent: 'maroon',
  },
];

export default function VisionMission() {
  return (
    <section
      className="relative bg-spist-accent-soft/45 py-16 sm:py-20 lg:py-24"
      aria-labelledby="vision-mission-heading"
    >
      <div className="container-spist">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-7 bg-spist-maroon" />
            What Drives Us
            <span className="h-px w-7 bg-spist-maroon" />
          </span>
          <h2 id="vision-mission-heading" className="section-title">
            Vision &amp; Mission
          </h2>
          <p className="section-sub mx-auto">
            The commitments that shape every program, appointment and decision at SPIST.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
          {CARDS.map(({ key, data, Icon, accent }, index) => {
            const isMaroon = accent === 'maroon';

            return (
              <Reveal key={key} delay={index * 130}>
                <article
                  className={`group relative h-full overflow-hidden rounded-xl border border-spist-line bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-e3 lg:p-10 ${
                    isMaroon ? 'hover:border-spist-maroon/35' : 'hover:border-spist-accent/50'
                  }`}
                >
                  {/* Top accent rule */}
                  <span
                    className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                      isMaroon ? 'bg-spist-maroon' : 'bg-spist-accent'
                    }`}
                    aria-hidden="true"
                  />

                  <span
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-lg transition-colors duration-300 ${
                      isMaroon
                        ? 'bg-spist-maroon/10 text-spist-maroon group-hover:bg-spist-maroon group-hover:text-white'
                        : 'bg-spist-green/10 text-spist-green group-hover:bg-spist-green group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  >
                    <Icon width="27" height="27" />
                  </span>

                  <h3 className="mt-6 font-display text-2xl font-bold">{data.title}</h3>

                  <p className="mt-4 text-[15px] leading-[1.85] text-spist-muted">{data.text}</p>

                  <ul className="mt-6 space-y-3 border-t border-spist-line pt-6">
                    {data.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[14.5px] leading-relaxed">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            isMaroon
                              ? 'bg-spist-maroon/12 text-spist-maroon'
                              : 'bg-spist-accent/20 text-spist-green'
                          }`}
                          aria-hidden="true"
                        >
                          <Check width="12" height="12" strokeWidth={3} />
                        </span>
                        <span className="text-spist-charcoal">{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
