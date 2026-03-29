'use client';

import { Zap } from 'lucide-react';

export default function AiSection() {
  return (
    <section className="py-44 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto glass-card rounded-[48px] p-16 md:p-24 flex flex-col lg:flex-row items-center gap-16 border-white/5 relative bg-[#050505] overflow-hidden">
        <img 
          src="/bg3.avif" 
          alt="ai-texture" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-color-dodge z-0 pointer-events-none"
        />
        <div className="flex-1 space-y-10 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">AI Powered</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold   tracking-tighter mb-12">
            Build with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Gemini</span> <br />
            in Genforge
          </h2>
          <p className="text-white/40 text-lg md:text-xl leading-relaxed max-w-lg font-medium">
            Work quickly and efficiently with Gemini in Genforge Studio. Optimize 
            your lead capture funnels, automate validation, and analyze partner 
            performance with AI assistance that understands your CRM data.
          </p>
        </div>
        
        <div className="flex-1 relative w-full">
          {/* Vibrant Blue Glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-600/20 blur-[130px] rounded-full -z-10" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex justify-end items-center gap-4">
              <div className="bg-[#1a1a1a] rounded-2xl p-4 text-sm font-medium border border-white/5 text-white/80 max-w-[80%] shadow-2xl">
                the real estate form conversion is low, can you optimize it?
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 overflow-hidden flex-shrink-0">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="glass-card rounded-[32px] p-10 border-white/10 shadow-2xl space-y-8 bg-[#0a0a0a]/90 backdrop-blur-3xl relative">
              {/* Blue Star Decor */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 z-20">
                 <div className="w-12 h-12 bg-blue-500 rounded-full blur-[20px] opacity-50 absolute inset-0" />
                 <span className="text-4xl text-blue-400 relative animate-pulse">✦</span>
              </div>

              <div className="space-y-6">
                <p className="text-white/90 font-medium text-lg leading-relaxed">
                   Analysis complete. I'll add smart field validation and adjust the sequence for better mobile engagement.
                </p>
                
                <div className="p-5 bg-black/50 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-white/80 shrink-0">Optimize conversion logic</span>
                    <span className="text-green-400 flex items-center gap-2">
                       <span className="w-4 h-4 rounded-full border border-green-400 flex items-center justify-center text-[8px]">✓</span> Current
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-blue-400">⚛ src/forms/RealEstateForm.tsx</span>
                    <span className="text-green-500 font-bold ml-auto">+24, -8</span>
                  </div>
                </div>
                
                <p className="text-white/40 text-sm font-medium">
                   Changes applied. Would you like me to also enable A/B testing for this form?
                </p>
              </div>
            </div>
          </div>
          
          {/* Starry Icon */}
          <div className="absolute top-1/2 left-[-40px] w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/40 rotate-12">
            <span className="text-3xl text-white">✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}
