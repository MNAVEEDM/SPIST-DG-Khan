import { useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import { Quote, User } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';
import { chairperson, chairpersonFullMessage } from '../data/site';

/** Renders one block of the chairperson's full message content stream. */
function MessageBlock({ block }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="mt-9 font-display text-xl font-bold text-spist-charcoal sm:text-2xl">
          {block.text}
        </h2>
      );

    case 'orderedList':
      return (
        <ol className="mt-4 space-y-3">
          {block.items.map((item, index) => (
            <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.85] text-spist-muted">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-spist-green/10 text-[12px] font-bold text-spist-green">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );

    case 'unorderedList':
      return (
        <ul className="mt-4 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.85] text-spist-muted">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-spist-accent" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'paragraph':
    default:
      return (
        <p className="mt-4 text-[15px] leading-[1.85] text-spist-muted">
          {block.lead && <strong className="font-semibold text-spist-charcoal">{block.lead} </strong>}
          {block.text}
        </p>
      );
  }
}

export default function ChairpersonMessagePage() {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);
  const { signOff } = chairpersonFullMessage;

  return (
    <>
      <PageBanner
        title={entry?.label ?? "Chairperson's Message"}
        trail={entry?.trail ?? ['Discover SPIST', "Chairperson's Message"]}
        intro="A welcome note from the Chairperson of South Punjab Institute of Science and Technology, Dera Ghazi Khan."
      />

      {/* ---------- Portrait + short quote ---------- */}
      <section className="bg-white py-14 sm:py-16 lg:py-20" aria-labelledby="chairperson-heading">
        <div className="container-spist">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
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

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-spist-charcoal/90 to-transparent px-6 pb-5 pt-14">
                    <p className="font-display text-lg font-bold text-white">{chairperson.name}</p>
                    <p className="mt-0.5 text-[12.5px] font-medium uppercase tracking-[0.13em] text-spist-accent">
                      {chairperson.role}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-7">
              <span className="eyebrow">
                <span className="h-px w-7 bg-spist-maroon" />
                Welcome
              </span>

              <h2 id="chairperson-heading" className="section-title">
                A Message From Our Chairperson
              </h2>

              <Quote className="mt-6 text-spist-accent/50" width="34" height="34" />

              <div className="mt-3 space-y-4 border-l-[3px] border-spist-accent/35 pl-6">
                {chairperson.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-[15px] leading-[1.85] text-spist-muted">
                    {paragraph}
                  </p>
                ))}
              </div>

              <p className="mt-7 text-[13px] text-spist-muted">
                <span className="font-semibold text-spist-charcoal">{chairperson.name}</span>
                {' — '}
                {chairperson.role}, {chairperson.institution}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Full message ---------- */}
      <section className="bg-spist-accent-soft/45 py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow justify-center">
              <span className="h-px w-7 bg-spist-maroon" />
              Full Message
              <span className="h-px w-7 bg-spist-maroon" />
            </span>
            <h2 className="section-title">In Her Own Words</h2>
          </Reveal>

          <Reveal delay={100} className="mx-auto mt-10 max-w-3xl">
            <div className="rounded-xl border border-spist-line bg-white p-7 text-left shadow-card sm:p-10">
              {chairpersonFullMessage.blocks.map((block, index) => (
                <MessageBlock key={index} block={block} />
              ))}

              <div className="mt-10 border-t border-spist-line pt-6">
                <p className="text-[15px] leading-[1.85] text-spist-muted">{signOff.valediction}</p>
                <p className="mt-3 font-display text-base font-bold text-spist-charcoal">
                  {signOff.name}
                </p>
                <p className="text-[13.5px] text-spist-muted">{signOff.role}</p>
                <p className="text-[13.5px] text-spist-muted">
                  {signOff.institutionLine}, {signOff.city}
                </p>
                <p className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-spist-green">
                  {signOff.recognition}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
