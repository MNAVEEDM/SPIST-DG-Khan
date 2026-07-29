import { useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { NewsDirectory } from '../components/NewsCards';
import { navEntryFor } from '../data/navUtils';

export default function LatestNewsPage() {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  return (
    <>
      <PageBanner
        title={entry?.label ?? 'Latest News'}
        trail={entry?.trail ?? ['Latest News']}
        intro="Admission announcements, examination schedules and campus events from across the institute."
      />

      <section className="bg-spist-accent-soft/45 py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <NewsDirectory />
        </div>
      </section>
    </>
  );
}
