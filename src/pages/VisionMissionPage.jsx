import { useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import { Check, Eye, Target } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';
import { vision, mission, chairpersonFullMessage } from '../data/site';

const { blocks: messageBlocks, signOff } = chairpersonFullMessage;

// The Chairperson's message content, from the "Why SPIST?" section onward —
// reuses the single source of truth in `chairpersonFullMessage` rather than
// duplicating the copy here.
const whySpistIndex = messageBlocks.findIndex(
  (block) => block.type === 'heading' && block.text === 'Why SPIST?'
);
const closingMessageBlocks = messageBlocks.slice(whySpistIndex);

export default function VisionMissionPage() {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  return (
    <>
      <PageBanner
        title={entry?.label ?? 'Vision & Mission'}
        trail={entry?.trail ?? ['Discover SPIST', 'Vision & Mission']}
        intro="The commitment that shapes every program, appointment and decision at SPIST."
      />

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            <Reveal>
              <article className="relative h-full overflow-hidden rounded-xl border border-spist-line bg-white p-8 shadow-card sm:p-10">
                <span
                  className="absolute inset-x-0 top-0 h-1 bg-spist-accent"
                  aria-hidden="true"
                />

                <span
                  className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-spist-green/10 text-spist-green"
                  aria-hidden="true"
                >
                  <Eye width="27" height="27" />
                </span>

                <h1 className="mt-6 font-display text-2xl font-bold">{vision.title}</h1>

                <p className="mt-4 text-[15px] leading-[1.85] text-spist-muted">{vision.text}</p>

                <ul className="mt-6 space-y-3 border-t border-spist-line pt-6">
                  {vision.points.map((point) => (
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
              </article>
            </Reveal>

            <Reveal delay={90}>
              <article className="relative h-full overflow-hidden rounded-xl border border-spist-line bg-white p-8 shadow-card sm:p-10">
                <span
                  className="absolute inset-x-0 top-0 h-1 bg-spist-maroon"
                  aria-hidden="true"
                />

                <span
                  className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-spist-maroon/10 text-spist-maroon"
                  aria-hidden="true"
                >
                  <Target width="27" height="27" />
                </span>

                <h2 className="mt-6 font-display text-2xl font-bold">{mission.title}</h2>

                <p className="mt-4 text-[15px] leading-[1.85] text-spist-muted">{mission.text}</p>

                <ul className="mt-6 space-y-3 border-t border-spist-line pt-6">
                  {mission.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[14.5px] leading-relaxed">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-spist-maroon/12 text-spist-maroon"
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
          </div>

          <Reveal delay={160} className="mt-6 lg:mt-8">
            <article className="relative overflow-hidden rounded-xl border border-spist-line bg-white p-8 shadow-card sm:p-10 lg:p-12">
              <span
                className="absolute inset-x-0 top-0 h-1 bg-spist-accent"
                aria-hidden="true"
              />

              <div className="max-w-3xl">
                {closingMessageBlocks.map((block, index) => {
                  if (block.type === 'heading') {
                    return (
                      <h3
                        key={block.text}
                        className={`font-display text-xl font-bold text-spist-charcoal sm:text-2xl ${
                          index === 0 ? '' : 'mt-9'
                        }`}
                      >
                        {block.text}
                      </h3>
                    );
                  }

                  if (block.type === 'unorderedList') {
                    return (
                      <ul key={index} className="mt-4 space-y-3">
                        {block.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-[15px] leading-[1.85] text-spist-muted"
                          >
                            <span
                              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-spist-accent"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={index} className="mt-4 text-[15px] leading-[1.85] text-spist-muted">
                      {block.lead && (
                        <strong className="font-semibold text-spist-charcoal">{block.lead} </strong>
                      )}
                      {block.text}
                    </p>
                  );
                })}

                <div className="mt-10 border-t border-spist-line pt-6">
                  <p className="text-[13.5px] leading-relaxed text-spist-muted">{signOff.valediction}</p>
                  <p className="mt-3 font-display text-base font-bold text-spist-charcoal">
                    {signOff.name}
                  </p>
                  <p className="text-[13px] text-spist-muted">{signOff.role}</p>
                  <p className="text-[13px] text-spist-muted">
                    {signOff.institutionLine}, {signOff.city}
                  </p>
                  <p className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-spist-green">
                    {signOff.recognition}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}
