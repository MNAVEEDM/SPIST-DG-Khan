import { useState } from 'react';
import { Link } from 'react-router-dom';
import { certificateCourses, diplomaPrograms } from '../data/site';
import { ArrowRight, Check, Clock, Plus } from './Icons';
import Reveal from './Reveal';

const INITIAL_VISIBLE = 6;

function CourseColumn({ group, accent, delay }) {
  const [expanded, setExpanded] = useState(false);
  const isMaroon = accent === 'maroon';

  const hidden = group.items.length - INITIAL_VISIBLE;
  const visibleItems = expanded ? group.items : group.items.slice(0, INITIAL_VISIBLE);

  return (
    <Reveal delay={delay}>
      <section
        className="flex h-full flex-col overflow-hidden rounded-xl border border-spist-line bg-white shadow-card"
        aria-labelledby={`courses-${accent}`}
      >
        <header
          className={`relative overflow-hidden px-7 py-6 ${
            isMaroon ? 'bg-spist-maroon' : 'bg-spist-green'
          }`}
        >
          <div className="brand-pattern absolute inset-0 opacity-70" aria-hidden="true" />

          <div className="relative flex flex-col items-start gap-3">
            <h3
              id={`courses-${accent}`}
              className="w-full font-display text-xl font-bold text-white"
            >
              {group.title}
            </h3>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/15 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/25">
              <Clock width="12" height="12" />
              {group.duration}
            </span>
          </div>

          <p className="relative mt-2 text-[13px] text-white/75">
            {group.items.length} programs currently offered
          </p>
        </header>

        <ul className="flex-1 divide-y divide-spist-line/70 px-7">
          {visibleItems.map((item) => (
            <li key={item} className="flex items-start gap-3 py-3 text-[14.5px] leading-snug">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  isMaroon
                    ? 'bg-spist-maroon/10 text-spist-maroon'
                    : 'bg-spist-accent/20 text-spist-green'
                }`}
                aria-hidden="true"
              >
                <Check width="12" height="12" strokeWidth={3} />
              </span>
              <span className="text-spist-charcoal">{item}</span>
            </li>
          ))}
        </ul>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-spist-line px-7 py-4">
          {hidden > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className={`inline-flex min-h-11 items-center gap-1.5 text-[13.5px] font-semibold transition-colors duration-200 ${
                isMaroon
                  ? 'text-spist-maroon hover:text-spist-maroon-dark'
                  : 'text-spist-green hover:text-spist-green-dark'
              }`}
            >
              <Plus
                width="14"
                height="14"
                className={`transition-transform duration-200 ${expanded ? 'rotate-45' : ''}`}
              />
              {expanded ? 'Show less' : `Show all ${group.items.length}`}
            </button>
          ) : (
            <span />
          )}

          <Link
            to={group.href}
            className="group inline-flex min-h-11 items-center gap-2 text-[13.5px] font-semibold text-spist-charcoal transition-colors duration-200 hover:text-spist-green"
          >
            Details &amp; fees
            <ArrowRight
              width="14"
              height="14"
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </footer>
      </section>
    </Reveal>
  );
}

export default function ShortCourses() {
  return (
    <section
      className="relative isolate overflow-hidden bg-spist-charcoal/[0.03] py-16 sm:py-20 lg:py-24"
      aria-labelledby="short-courses-heading"
    >
      <div className="container-spist">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-7 bg-spist-maroon" />
            Skills &amp; Short Courses
            <span className="h-px w-7 bg-spist-maroon" />
          </span>
          <h2 id="short-courses-heading" className="section-title">
            Diplomas &amp; Certificate Courses
          </h2>
          <p className="section-sub mx-auto">
            Short, practical, employment-focused programs — open to students and professionals alike,
            with morning and evening sessions.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <CourseColumn group={diplomaPrograms} accent="green" delay={0} />
          <CourseColumn group={certificateCourses} accent="maroon" delay={130} />
        </div>
      </div>
    </section>
  );
}
