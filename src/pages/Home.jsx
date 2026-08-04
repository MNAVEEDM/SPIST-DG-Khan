import CTASection from '../components/CTASection';
import Gallery from '../components/Gallery';
import Hero from '../components/Hero';
import StatsCounter from '../components/StatsCounter';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsCounter />
      <Gallery />
      <CTASection />
    </>
  );
}
