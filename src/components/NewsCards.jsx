import { Link } from 'react-router-dom';
import { news } from '../data/site';
import { ArrowRight, Calendar } from './Icons';
import Reveal from './Reveal';

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

function splitDate(iso) {
  const date = new Date(`${iso}T00:00:00`);
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: MONTHS[date.getMonth()],
    year: date.getFullYear(),
    readable: date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}

/** The news/notice card grid, shared by the homepage teaser section and the
 *  dedicated Latest News page. */
export function NewsDirectory() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item, index) => {
        const date = splitDate(item.date);

        return (
          <Reveal key={item.id} delay={index * 120}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-spist-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-spist-accent/60 hover:shadow-e3">
              {/* Banner + date badge */}
              <div className="brand-pattern relative h-32 bg-gradient-to-br from-spist-green-deep via-spist-green to-spist-green-dark">
                <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/25">
                  {item.category}
                </span>

                <div className="absolute -bottom-6 right-5 flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-spist-maroon text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <span className="font-display text-xl font-extrabold leading-none">
                    {date.day}
                  </span>
                  <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/85">
                    {date.month}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 pt-8">
                <p className="flex items-center gap-1.5 text-[12px] font-medium text-spist-muted">
                  <Calendar width="13" height="13" className="text-spist-accent" />
                  <time dateTime={item.date}>{date.readable}</time>
                </p>

                <h3 className="mt-2.5 font-display text-lg font-bold leading-snug">
                  <Link
                    to={item.href}
                    className="transition-colors after:absolute after:inset-0 hover:text-spist-green"
                  >
                    {item.title}
                  </Link>
                </h3>

                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-spist-muted">
                  {item.excerpt}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 border-t border-spist-line pt-4 text-[13.5px] font-semibold text-spist-green">
                  Read More
                  <ArrowRight
                    width="14"
                    height="14"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

export default function NewsCards() {
  return (
    <section
      className="bg-spist-accent-soft/45 py-16 sm:py-20 lg:py-24"
      aria-labelledby="news-heading"
    >
      <div className="container-spist">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <span className="h-px w-7 bg-spist-maroon" />
              Notice Board
            </span>
            <h2 id="news-heading" className="section-title">
              Latest News &amp; Notices
            </h2>
            <p className="section-sub">
              Admission announcements, examination schedules and campus events from across the
              institute.
            </p>
          </div>

          <Link
            to="/latest-news"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-spist-green transition-colors hover:text-spist-maroon"
          >
            View All Notices
            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-11">
          <NewsDirectory />
        </div>
      </div>
    </section>
  );
}
