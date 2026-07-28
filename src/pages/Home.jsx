import AcademicPrograms from '../components/AcademicPrograms';
import CTASection from '../components/CTASection';
import FacultyGrid from '../components/FacultyGrid';
import Gallery from '../components/Gallery';
import Hero from '../components/Hero';
import NewsCards from '../components/NewsCards';
import ShortCourses from '../components/ShortCourses';
import StatsCounter from '../components/StatsCounter';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsCounter />
      <AcademicPrograms />
      <ShortCourses />
      <FacultyGrid />
      <NewsCards />
      <Gallery />
      <CTASection />
    </>
  );
}
