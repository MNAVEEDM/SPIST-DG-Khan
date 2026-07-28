import { useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import { Check, Target } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';
import { mission } from '../data/site';

export default function MissionPage() {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  return (
    <>
      <PageBanner
        title={entry?.label ?? mission.title}
        trail={entry?.trail ?? ['Discover SPIST', mission.title]}
        intro="The commitment that shapes every program, appointment and decision at SPIST."
      />

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <Reveal className="mx-auto max-w-3xl">
            <article className="relative overflow-hidden rounded-xl border border-spist-line bg-white p-8 shadow-card sm:p-10">
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

              <h1 className="mt-6 font-display text-2xl font-bold">{mission.title}</h1>

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
      </section>
    </>
  );
}
