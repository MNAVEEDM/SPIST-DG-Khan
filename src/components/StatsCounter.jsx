import { stats } from '../data/site';
import { useCountUp, useReveal } from '../hooks/useReveal';

function Stat({ stat, delay }) {
  const [ref, visible] = useReveal({ threshold: 0.35 });
  const value = useCountUp(stat.value, { start: visible, duration: 1800 });

  return (
    <li
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} relative px-4 py-6 text-center`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="block font-display text-4xl font-extrabold leading-none text-white sm:text-5xl">
        {value.toLocaleString('en-US')}
        <span className="text-spist-accent">{stat.suffix}</span>
      </span>
      <span className="mt-3 block text-[12.5px] font-semibold uppercase tracking-[0.13em] text-white/75">
        {stat.label}
      </span>
    </li>
  );
}

export default function StatsCounter() {
  return (
    <section className="relative isolate overflow-hidden bg-spist-green" aria-label="SPIST at a glance">
      <div className="brand-pattern absolute inset-0 opacity-60" aria-hidden="true" />
      <span
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-spist-maroon via-spist-accent to-spist-maroon"
        aria-hidden="true"
      />

      <div className="container-spist relative py-10 sm:py-12">
        <ul className="grid grid-cols-2 gap-x-2 divide-white/15 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {stats.map((stat, index) => (
            <Stat key={stat.id} stat={stat} delay={index * 90} />
          ))}
        </ul>
      </div>
    </section>
  );
}
