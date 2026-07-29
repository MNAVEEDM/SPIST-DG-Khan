import { useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { FacultyDirectory } from '../components/FacultyGrid';
import { navEntryFor } from '../data/navUtils';

export default function FacultyPage() {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  return (
    <>
      <PageBanner
        title={entry?.label ?? 'Our Faculty'}
        trail={entry?.trail ?? ['Academic', 'Our Faculty']}
        intro="Qualified and experienced academics from leading universities across Pakistan, teaching and mentoring at every level."
      />

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <FacultyDirectory />
        </div>
      </section>
    </>
  );
}
