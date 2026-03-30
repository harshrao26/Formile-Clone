'use client';

import { Rocket, CheckCircle2, TrendingUp, Layout } from 'lucide-react';

export default function ScaleSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden text-center z-0">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/bg3.avif" 
          alt="background" 
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black opacity-90" />
      </div>

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-white leading-[0.95]">
          Scale faster, <br />
          convert with confidence
        </h2>
        
        <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          Launch your lead campaigns to Genforge Studio with a few clicks. <br className="hidden md:block" />
          Monitor real-time performance, manage multi-tenant partner networks, <br className="hidden md:block" />
          and deploy high-conversion forms with complete control.
        </p>

        <div className="pt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[45%] left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

          {/* Card 1: Deployment */}
          <div className="relative z-10 w-full max-w-[320px] aspect-square bg-[#1a1010]/90 rounded-[32px] border border-white/5 p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl group hover:border-orange-500/20 transition-colors">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
              </div>
              <div className="h-2 w-3/4 bg-white/5 rounded-full" />
              <div className="h-2 w-1/2 bg-white/5 rounded-full" />
              <div className="h-2 w-2/3 bg-white/5 rounded-full" />
            </div>
            <div className="flex justify-center">
               <div className="px-8 py-4 bg-blue-600 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-transform group-hover:scale-105 duration-500">
                  <Rocket className="w-8 h-8 text-white fill-white" />
               </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-1/2 bg-white/5 rounded-full mx-auto" />
              <div className="h-2 w-1/3 bg-white/5 rounded-full mx-auto" />
            </div>
          </div>

          {/* Card 2: Preview */}
          <div className="relative z-10 w-full max-w-[320px] aspect-square bg-[#101010]/90 rounded-[32px] border border-white/5 p-8 flex flex-col gap-6 shadow-2xl backdrop-blur-xl md:-mx-4 scale-110 border-white/10">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="h-2 w-24 bg-white/10 rounded-full" />
             </div>
             <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
             </div>
             <div className="grid grid-cols-3 gap-3">
                <div className="h-10 bg-white/5 rounded-xl border border-white/5" />
                <div className="h-10 bg-white/5 rounded-xl border border-white/5" />
                <div className="h-10 bg-white/5 rounded-xl border border-white/5" />
             </div>
          </div>

          {/* Card 3: Analytics */}
          <div className="relative z-10 w-full max-w-[320px] aspect-square bg-[#10151a]/90 rounded-[32px] border border-white/5 p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl group hover:border-green-500/20 transition-colors">
             <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> Deployed
             </div>
             <div className="flex-1 flex items-end gap-1 px-2 mb-4">
                {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-orange-500/20 to-orange-500 rounded-t-sm transition-all duration-1000"
                    style={{ height: `${h}%`, opacity: 0.3 + (i * 0.1) }}
                  />
                ))}
             </div>
             <div className="flex items-center justify-between">
                <div className="space-y-2 text-left">
                   <div className="text-white font-bold text-xl">12.4k</div>
                   <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Leads this week</div>
                </div>
                <TrendingUp className="w-6 h-6 text-green-400" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
