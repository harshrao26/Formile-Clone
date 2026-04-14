'use client';

import Navbar from './homepage/components/Navbar';
import Hero from './homepage/components/Hero';
import FeaturesSection from './homepage/components/FeaturesSection';
import ProjectShowcase from './homepage/components/ProjectShowcase';
import ScaleSection from './homepage/components/ScaleSection';
import SecondarySection from './homepage/components/SecondarySection';
import AiSection from './homepage/components/AiSection';
import TestimonialsSection from './homepage/components/TestimonialsSection';
import PricingSection from './homepage/components/PricingSection';
import FaqSection from './homepage/components/FaqSection';
import CtaSection from './homepage/components/CtaSection';
import Footer from './homepage/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-orange-500/10 selection:text-orange-900 overflow-x-hidden font-sans relative">
      {/* Global Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-50/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-5%] w-[30%] h-[30%] bg-purple-50/30 blur-[100px] rounded-full" />
      </div>

      <Navbar />
      <Hero />
      <FeaturesSection />
      {/* <ScaleSection /> */}
      {/* <SecondarySection /> */}
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
