import { Link } from 'react-router-dom';
import { ArrowRight } from '../components/Icons';

export default function NotFound() {
  return (
    <section className="banner-bg relative isolate flex min-h-[70vh] items-center overflow-hidden">
      <div className="container-spist header-offset relative pb-20 pt-20 text-center">
        <p className="font-display text-7xl font-extrabold text-white/20 sm:text-8xl">404</p>

        <h1 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/75">
          The page you are looking for may have been moved or is not yet published. Please use the
          navigation above or return to the homepage.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-spist-maroon px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-spist-maroon-dark"
        >
          Back to Homepage
          <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
