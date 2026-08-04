import { Link } from 'react-router-dom';
import { institution } from '../data/site';
import { ArrowRight, Phone } from './Icons';
import Reveal from './Reveal';

export default function CTASection() {
  return (
    <section className="relative isolate overflow-hidden bg-spist-maroon" aria-labelledby="cta-heading">
      <div className="brand-pattern absolute inset-0" aria-hidden="true" />

      {/* Concentric rings echoing the logo's orbital mark */}
      <div
        className="pointer-events-none absolute -left-32 top-1/2 hidden h-[460px] w-[460px] -translate-y-1/2 rounded-full border-2 border-white/10 lg:block"
        aria-hidden="true"
      >
        <span className="absolute inset-12 rounded-full border border-white/10" />
        <span className="absolute inset-28 rounded-full border border-white/10" />
      </div>

      <div className="container-spist relative py-14 sm:py-16">
        <Reveal className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-white ring-1 ring-white/25">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Admissions Open — Fall 2026
            </span>

            <h2
              id="cta-heading"
              className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl"
            >
              Begin your journey at SPIST
            </h2>

            <p className="mt-4 text-[15px] leading-relaxed text-white/80 sm:text-base">
              Applications are open for BS, associate degree, diploma and certificate programs.
              Apply online or speak to our admissions office in D.G. Khan.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/admissions/online"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-7 py-3.5 text-sm font-bold text-spist-maroon shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-spist-accent-soft sm:w-auto"
            >
              Apply Online
              <ArrowRight />
            </Link>

            <a
              href={`tel:${institution.phones[0].replace(/-/g, '')}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-white/70 px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/15 sm:w-auto"
            >
              <Phone width="15" height="15" />
              {institution.phones[0]}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
