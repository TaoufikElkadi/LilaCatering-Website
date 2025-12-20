import Hero from '@/components/Hero';
import Craft from '@/components/Craft';
import Services from '@/components/Services';
import CompanyLogos from '@/components/CompanyLogos';
import Testimonials from '@/components/Testimonials';
import MenuBuilder from '@/components/MenuBuilder';
import CulturalAuthenticity from '@/components/CulturalAuthenticity';
import Gallery from '@/components/Gallery';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CompanyLogos />
      <Craft />
      <CulturalAuthenticity />
      <Services />
      <Testimonials />
      <MenuBuilder />
      <Gallery />
    </main>
  );
}

