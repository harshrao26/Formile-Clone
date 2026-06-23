'use client';

import { Shield, Zap, TrendingUp, Building2, Briefcase, Globe } from 'lucide-react';

const partners = [
  { name: 'GrowthLabs', icon: TrendingUp },
  { name: 'PropEdge', icon: Building2 },
  { name: 'EduFirst', icon: Globe },
  { name: 'ApexCloud', icon: Shield },
  { name: 'Fintechify', icon: Zap },
  { name: 'LeadGenius', icon: Briefcase },
];

// Duplicate the array to create a seamless infinite loop
const doubledPartners = [...partners, ...partners];

export default function LogoWall() {
  return (
    <section className="py-12 bg-white border-y border-zinc-100/80 overflow-hidden select-none relative">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold text-zinc-400 uppercase tracking-widest mb-8">
          Helping high-growth teams capture first-party data
        </p>
        
        {/* Infinite Marquee Container */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient Masks for fade effect on left and right edges */}
          <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
          
          {/* Logo Flowing Element */}
          <div className="flex gap-x-16 md:gap-x-24 w-max animate-marquee py-2 opacity-45 hover:opacity-85 transition-opacity duration-500">
            {doubledPartners.map((partner, i) => {
              const Icon = partner.icon;
              return (
                <div 
                  key={i} 
                  className="flex items-center gap-2.5 text-zinc-950 font-extrabold tracking-tight text-lg md:text-xl transition-all duration-300 hover:scale-105 hover:text-orange-600 cursor-default shrink-0"
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5px] text-zinc-900" />
                  <span>{partner.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Self-contained Keyframe Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}
