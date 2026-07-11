import HeroSection from '@/components/landing/HeroSection';
import StatsCounter from '@/components/landing/StatsCounter';
import FeaturedServices from '@/components/landing/FeaturedServices';
import Categories from '@/components/landing/Categories';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import Reviews from '@/components/landing/Reviews';
import FAQ from '@/components/landing/FAQ';
import Contact from '@/components/landing/Contact';
import Disclaimer from '@/components/shared/Disclaimer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <FeaturedServices />
      <Categories />
      <WhyChooseUs />
      <Reviews />
      <FAQ />

      {/* Full Disclaimer */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Disclaimer variant="full" />
      </div>

      <Contact />
    </>
  );
}
