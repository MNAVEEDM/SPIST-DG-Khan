import AcademicPrograms from '../components/AcademicPrograms';
import CTASection from '../components/CTASection';
import ChairpersonMessage from '../components/ChairpersonMessage';
import FacultyGrid from '../components/FacultyGrid';
import Gallery from '../components/Gallery';
import Hero from '../components/Hero';
import NewsCards from '../components/NewsCards';
import ShortCourses from '../components/ShortCourses';
import StatsCounter from '../components/StatsCounter';
import VisionMission from '../components/VisionMission';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsCounter />
      <ChairpersonMessage />
      <VisionMission />
      <AcademicPrograms />
      <ShortCourses />
      <FacultyGrid />
      <NewsCards />
      <Gallery />
      <CTASection />
    </>
  );
}
