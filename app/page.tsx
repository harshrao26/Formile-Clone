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
    <div className="dark min-h-screen bg-[#000000] text-white selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden font-sans relative">
      {/* Global Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src="/bg.avif"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <Navbar />
      <Hero />
      <FeaturesSection />
      <ScaleSection />
      <SecondarySection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
