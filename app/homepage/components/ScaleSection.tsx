'use client';

import { Rocket, CheckCircle2, TrendingUp, Layout } from 'lucide-react';

export default function ScaleSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden text-center bg-white">
      {/* Background Accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(244,244,245,0.4)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <h2 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-zinc-900 leading-[0.95]">
          Scale faster, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-700">convert with confidence</span>
        </h2>
        
        <p className="text-zinc-500 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Launch your lead campaigns with a few clicks. <br className="hidden md:block" />
          Monitor performance, manage partner networks, <br className="hidden md:block" />
          and deploy high-conversion forms with complete control.
        </p>

        <div className="pt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[45%] left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent z-0" />

          {/* Card 1: Deployment */}
          <div className="relative z-10 w-full max-w-[320px] aspect-square bg-zinc-50/80 rounded-[32px] border border-zinc-200/50 p-8 flex flex-col justify-between shadow-xl backdrop-blur-sm group hover:border-orange-500/20 transition-all">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-200" />
                <div className="w-2 h-2 rounded-full bg-zinc-200" />
                <div className="w-2 h-2 rounded-full bg-zinc-200" />
              </div>
              <div className="h-2 w-3/4 bg-zinc-200/50 rounded-full" />
              <div className="h-2 w-1/2 bg-zinc-200/50 rounded-full" />
              <div className="h-2 w-2/3 bg-zinc-200/50 rounded-full" />
            </div>
            <div className="flex justify-center">
               <div className="px-8 py-4 bg-orange-500 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-transform group-hover:scale-105 duration-500">
                  <Rocket className="w-8 h-8 text-white fill-white" />
               </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-1/2 bg-zinc-200/50 rounded-full mx-auto" />
              <div className="h-2 w-1/3 bg-zinc-200/50 rounded-full mx-auto" />
            </div>
          </div>

          {/* Card 2: Preview */}
          <div className="relative z-10 w-full max-w-[320px] aspect-square bg-white rounded-[32px] border border-zinc-200 p-8 flex flex-col gap-6 shadow-2xl md:-mx-4 scale-110">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100" />
                <div className="h-2 w-24 bg-zinc-100 rounded-full" />
             </div>
             <div className="flex-1 bg-zinc-50 rounded-2xl border border-zinc-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
             </div>
             <div className="grid grid-cols-3 gap-3">
                <div className="h-10 bg-zinc-50 rounded-xl border border-zinc-100" />
                <div className="h-10 bg-zinc-50 rounded-xl border border-zinc-100" />
                <div className="h-10 bg-zinc-50 rounded-xl border border-zinc-100" />
             </div>
          </div>

          {/* Card 3: Analytics */}
          <div className="relative z-10 w-full max-w-[320px] aspect-square bg-zinc-900 rounded-[32px] border border-zinc-800 p-8 flex flex-col justify-between shadow-2xl group transition-all">
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
