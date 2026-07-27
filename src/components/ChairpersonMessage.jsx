import { Link } from 'react-router-dom';
import { chairperson } from '../data/site';
import { ArrowRight, Quote, User } from './Icons';
import Reveal from './Reveal';

export default function ChairpersonMessage() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="chairperson-heading">
      <div className="container-spist">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ---------- Portrait ---------- */}
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Offset frame accent */}
              <span
                className="absolute -bottom-4 -left-4 h-full w-full rounded-lg border-[3px] border-spist-accent/45"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-lg bg-spist-green shadow-panel">
                {chairperson.photo ? (
                  <img
                    src={chairperson.photo}
                    alt={`${chairperson.name}, ${chairperson.role} of SPIST`}
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div
                    className="brand-pattern flex aspect-[4/5] w-full flex-col items-center justify-center bg-gradient-to-br from-spist-green-deep via-spist-green to-spist-green-dark"
                    role="img"
                    aria-label={`Portrait of ${chairperson.name} — photograph to be added`}
                  >
                    <span className="flex h-28 w-28 items-center justify-center rounded-full bg-white/12 ring-2 ring-white/25">
                      <User width="52" height="52" className="text-white/80" strokeWidth={1.4} />
                    </span>
                    <span className="mt-5 px-6 text-center text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/60">
                      Photograph to be added
                    </span>
                  </div>
                )}

                {/* Name plate */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-spist-charcoal/90 to-transparent px-6 pb-5 pt-14">
                  <p className="font-display text-lg font-bold text-white">{chairperson.name}</p>
                  <p className="mt-0.5 text-[12.5px] font-medium uppercase tracking-[0.13em] text-spist-accent">
                    {chairperson.role}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ---------- Message ---------- */}
          <Reveal delay={120} className="lg:col-span-7">
            <span className="eyebrow">
              <span className="h-px w-7 bg-spist-maroon" />
              Welcome
            </span>

            <h2 id="chairperson-heading" className="section-title">
              Chairperson&rsquo;s Message
            </h2>

            <Quote className="mt-6 text-spist-accent/50" width="34" height="34" />

            <div className="mt-3 space-y-4 border-l-[3px] border-spist-accent/35 pl-6">
              {chairperson.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[15px] leading-[1.85] text-spist-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                to={chairperson.readMoreHref}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-spist-green transition-colors hover:text-spist-maroon"
              >
                Read Full Message
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <span className="text-[13px] text-spist-muted">
                <span className="font-semibold text-spist-charcoal">{chairperson.name}</span>
                {' — '}
                {chairperson.role}, {chairperson.institution}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
