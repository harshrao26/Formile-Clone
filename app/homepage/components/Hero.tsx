'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  BarChart3,
  MousePointer2,
  ArrowRight
} from 'lucide-react';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative pt-32 md:pt-44   px-6 overflow-hidden bg-white">
      {/* 1. Advanced Mesh Gradient & Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Animated Mesh Orbs */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#FF7B00]/10 blur-[120px] rounded-full animate-pulse transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)` }}
        />
        <div 
          className="absolute top-[20%] -right-[15%] w-[60%] h-[60%] bg-purple-100/40 blur-[100px] rounded-full transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[30%] bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Interactive Status Badge */}
        <div className="group cursor-default inline-flex items-center gap-2.5 px-3 py-1.5 md:px-4 bg-zinc-50 border border-zinc-200/50 rounded-full mb-8 md:mb-10 hover:bg-white hover:border-zinc-300 hover:shadow-sm transition-all duration-300">
          <div className="flex -space-x-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-400" />
              </div>
            ))}
          </div>
          <span className="text-[10px] md:text-[11px] font-bold text-zinc-600 tracking-tight">
            Trusted by <span className="text-orange-600">500+</span> organizations
          </span>
          <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        <h1 className="text-5xl sm:text-5xl md:text-7xl font-semibold tracking-tight mb-8 md:mb-10 leading-[1.1] md:leading-[0.85] max-w-5xl mx-auto text-zinc-900">
          <span className="block opacity-90 drop-shadow-sm select-none">Build Campaigns That,</span>
          <span className="flex items-center justify-center gap-x-2 md:gap-x-4 flex-wrap">
            Actually 
            <span className="relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800 drop-shadow-sm">Convert</span>
              <div className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-1 bg-orange-500/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-1/3 animate-[loading_2s_infinite_ease-in-out]" />
              </div>
            </span>
            <span className="relative inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-zinc-900 rounded-xl sm:rounded-3xl md:rounded-[32px] shadow-2xl rotate-[-4deg] transition-all hover:rotate-0 hover:scale-110 duration-500 mx-1 md:mx-2 overflow-hidden group/icon">
              <TrendingUp className="w-[50%] h-[50%] text-white stroke-[3px] relative z-10" />
              <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover/icon:translate-y-0 transition-transform duration-500" />
            </span>
          </span>
        </h1>
        
        <p className="text-zinc-500 text-base sm:text-lg md:text-2xl max-w-2xl mb-10 md:mb-14 leading-relaxed font-medium px-4">
          Build high-converting forms that automate campaigns and capture exactly the data you need.

        </p>
 
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 mb-20 md:mb-24 w-full sm:w-auto px-6">
          <Link
            href="/admin/login"
            className="w-full sm:w-auto group relative px-8 md:px-12 py-4 md:py-5 bg-zinc-900 hover:bg-black rounded-full font-bold text-base md:text-xl transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] active:scale-95 text-white overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Scale Your Business <Zap className="w-5 h-5 fill-current text-orange-400 group-hover:text-white transition-colors" />
            </span>
            <div className="absolute inset-0 bg-orange-600 translate-y-20 group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
          
          <Link
            href="#pricing"
            className="w-full sm:w-auto group px-8 md:px-12 py-4 md:py-5 bg-white/50 backdrop-blur-sm border border-zinc-200 hover:border-zinc-300 rounded-full font-bold text-base md:text-xl transition-all active:scale-95 text-zinc-900 flex items-center justify-center gap-2"
          >
            View Demo <MousePointer2 className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </Link>
        </div>

        
 
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </section>
  );
}
