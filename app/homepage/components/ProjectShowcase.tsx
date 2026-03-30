'use client';

import { Layout, Zap } from 'lucide-react';

export default function ProjectShowcase() {
  return (
    <div className="mt-44 relative w-full max-w-6xl mx-auto px-6">
      {/* Extremely Vibrant Background Glow + bg2.avif */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff0000]/40 via-[#ff7b00]/20 to-[#8a2be2]/40 blur-[150px] opacity-80 -z-10" />
      <img 
          src="/bg2.avif" 
          alt="glow-texture" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen -z-10 blur-xl"
      />
      
      <div className="relative rounded-[48px] overflow-hidden border border-border shadow-2xl bg-background">
        {/* Fake Browser Top Bar */}
        <div className="h-14 bg-[#151515] border-b border-white/5 flex items-center px-6 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div className="ml-6 w-80 h-7 bg-black/50 rounded-xl border border-white/5 flex items-center px-4">
              <span className="text-[11px] text-white/40 truncate">studio.genforge.studio/my-campaign</span>
            </div>
        </div>

        {/* Browser Content Mockup */}
        <div className="aspect-[16/10] flex relative">
            {/* Sidebar (Explorer) */}
            <div className="w-72 bg-background border-r border-white/5 p-8 space-y-8 hidden lg:block">
              <div className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase">
                  <Layout className="w-4 h-4" /> Explorer
              </div>
              <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/60">
                    <img src="/logo.png" alt="Genforge" className="w-4 h-4 object-contain" /> <span className="text-sm font-medium">MY-APP</span>
                  </div>
                  <div className="pl-6 space-y-4 text-sm text-white/50 font-medium">
                    <div className="flex items-center gap-3"><span className="text-white/30">›</span> .idx</div>
                    <div className="flex items-center gap-3"><span className="text-white/30">›</span> dist</div>
                    <div className="flex items-center gap-3"><span className="text-white/30">›</span> node_modules</div>
                    <div className="flex items-center gap-3 text-white/80"><span className="text-white/30">⌄</span> scripts</div>
                  </div>
              </div>
            </div>

            {/* Main Editor Content */}
            <div className="flex-1 p-10 bg-[#0d0d0d] font-mono text-[14px] leading-relaxed text-white/50 overflow-hidden">
              <div className="flex items-center gap-4 mb-10 text-xs">
                  <div className="px-4 py-2 bg-white/5 rounded-lg border border-border text-white font-bold flex items-center gap-2">
                    <span className="text-blue-400">⚛</span> Home.tsx
                  </div>
                  <div className="px-4 py-2 text-white/30 font-medium">package.json</div>
              </div>
              <div className="space-y-1">
                  <pre><span className="text-purple-400">export default function</span> <span className="text-yellow-400">Home</span>() {"{"}</pre>
                  <pre className="pl-6"><span className="text-purple-400">const</span> [leads, setLeads] = <span className="text-blue-400">useState</span>([]);</pre>
                  <pre className="pl-6"><span className="text-purple-400">useEffect</span>(() =&gt; {"{"}</pre>
                  <pre className="pl-12 text-blue-300">fetchLeads().then(<span className="text-yellow-200">leads</span> =&gt; setLeads(leads));</pre>
                  <pre className="pl-6">{"}"}, []);</pre>
                  <pre className="pl-6"><span className="text-purple-400">return</span> (</pre>
                  <pre className="pl-12 font-bold text-white/60">&lt;div className="vibrant-grid"&gt;</pre>
                  <pre className="pl-6">  );</pre>
                  <pre>{"}"}</pre>
              </div>
            </div>

            {/* Floating "Gemini/AI" Assistant */}
            <div className="absolute left-10 bottom-10 w-[340px] glass-card rounded-3xl p-8 border-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-background/90 backdrop-blur-2xl animate-float">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <img src="/logo.png" alt="Genforge" className="w-6 h-6 object-contain" />
                </div>
                <span className="text-sm font-bold text-white/80">Gemini</span>
              </div>
              <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white leading-tight">Hello, Jane <br /> How can I help?</h3>
                  <p className="text-white/50 text-sm font-medium leading-relaxed">Build an app that lets me turn images into receipts.</p>
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-white/50 uppercase mb-4">
                        <span>Bootstrap the app</span>
                        <span className="text-blue-400 underline">Current</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/70 flex items-center gap-2"><span className="text-blue-400">⚛</span> src/pages/Home.tsx</span>
                          <span className="text-green-500 font-bold">+122</span>
                        </div>
                    </div>
                  </div>
              </div>
            </div>

            {/* Floating "Mobile" Preview */}
            <div className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-[300px] aspect-[9/18.5] bg-black rounded-[56px] border-[8px] border-[#1a1a1a] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden hidden xl:block animate-float-delayed">
              <div className="absolute top-0 inset-x-0 h-12 bg-background flex items-center px-6 gap-4">
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/50 uppercase">Android</div>
                  <div className="text-[10px] font-bold text-white/30 uppercase">Web</div>
              </div>
              <div className="h-full pt-12 flex flex-col items-center justify-center relative bg-gradient-to-br from-[#ff0000] via-[#ff7b00] to-[#ffcc00] p-10">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-[32px] flex items-center justify-center shadow-2xl rotate-[10deg] mb-8">
                    <img src="/logo.png" alt="Genforge" className="w-16 h-16 object-contain" />
                  </div>
                  <div className="w-full space-y-4">
                    <div className="w-full h-14 bg-black/10 backdrop-blur-md rounded-2xl border border-border" />
                    <div className="w-full h-14 bg-black/10 backdrop-blur-md rounded-2xl border border-border" />
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
