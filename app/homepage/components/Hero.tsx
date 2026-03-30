'use client';

import Link from 'next/link';
import { TrendingUp, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-44 pb-32 px-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero.png" 
          alt="" 
          className="w-full h-full object- blur-[4px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <h1 className="text-5xl md:text-[90px] font-bold tracking-tighter mb-10 leading-[0.9] max-w-5xl mx-auto">
          <span className="block opacity-90">Forge better leads,</span>
          <span className="flex items-center justify-center gap-x-4 flex-wrap">
            convert 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-white-500 to-black/70">at scale</span>
            <span className="inline-flex items-center justify-center w-14 h-14 md:w-24 md:h-24 bg-orange-500 rounded-2xl md:rounded-[32px] shadow-[0_0_50px_rgba(249,115,22,0.3)] rotate-[-3deg] transition-all hover:rotate-0 hover:scale-110 duration-500 mx-2">
              <TrendingUp className="w-[60%] h-[60%] text-black stroke-[3px]" />
            </span>
          </span>
        </h1>
        
        <p className="text-white text-base md:text-xl max-w-2xl mb-12 leading-relaxed font-medium">
          Accelerate your lead generation lifecycle with enterprise-grade security. <br className="hidden md:block" />
          Build high-conversion forms and manage multi-tenant partner networks.
        </p>

        <Link
          href="/admin/login"
          className="group relative px-12 py-5 bg-[#ff7b00] hover:bg-[#ff8c00] rounded-full font-bold text-lg transition-all shadow-2xl shadow-orange-500/35 active:scale-95 text-black overflow-hidden"
        >
          <span className="relative z-10">Scale Your Business</span>
          <div className="absolute inset-0 bg-white/20 translate-y-20 group-hover:translate-y-0 transition-transform duration-500" />
        </Link>
      </div>
    </section>
  );
}
