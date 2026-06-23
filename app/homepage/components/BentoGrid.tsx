'use client';

import { Key, Download, Mail, ArrowRight, MousePointer2 } from 'lucide-react';

export default function BentoGrid() {
  return (
    <section className="py-24 px-6 bg-white border-t border-zinc-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Platform Power</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Build campaigns designed to scale
          </h2>
          <p className="text-zinc-500 text-base md:text-lg max-w-xl mx-auto">
            Everything your agency needs to manage affiliate traffic and verify lead quality under one interface.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Large Card (Top Left) - Scale Partner Operations */}
          <div className="lg:col-span-2 rounded-[32px] bg-zinc-50/50 text-zinc-900 border border-zinc-200/80 relative overflow-hidden flex flex-col justify-between min-h-[420px] p-8 md:p-12 group">
            {/* Ambient Purple Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] -z-0 pointer-events-none" />
            
            <div className="max-w-md z-10 space-y-4">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Scale your partner campaigns
              </h3>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
                Empower your affiliates with dynamic lead forms. Customize fields, collect first-party contact info, and keep clean attribution logs.
              </p>
            </div>

            {/* Indian Marketer Image & Floating UI Mockup */}
            <div className="relative mt-8 lg:mt-0 lg:absolute lg:right-4 lg:bottom-0 w-full lg:w-[48%] h-72 lg:h-[90%] flex items-end justify-center">
              <img 
                src="/indian_marketer.png" 
                alt="Partner Marketer" 
                className="w-full h-full scale-129 object-contain object-bottom select-none mix-blend-  pointer-events-none filter brightness-110" 
              />
              
              {/* Floating Lead Status Badge */}
            
            </div>
          </div>

          {/* Card 2: Small Card (Top Right) - Parameter Injection */}
          <div className="rounded-[32px] bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border border-zinc-800 p-8 md:p-10 flex flex-col justify-between min-h-[420px] relative overflow-hidden group">
            {/* Ambient Blue Glow */}
            <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Dynamic parameter injection
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Redirect leads instantly. Inject tracking tokens like <code className="text-orange-400 font-mono text-xs font-bold">{`{token}`}</code> and <code className="text-orange-400 font-mono text-xs font-bold">{`{click_id}`}</code> seamlessly.
              </p>
            </div>

            {/* Floating Parameters Visual */}
            <div className="relative h-44 w-full bg-zinc-900/50 rounded-2xl border border-zinc-800/80 p-5 flex flex-col justify-center gap-3 overflow-hidden mt-6">
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-mono flex items-center gap-1.5">
                  <Key className="w-3 h-3" /> token
                </span>
                <span className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded-lg text-xs font-mono flex items-center gap-1.5">
                  <Key className="w-3 h-3" /> click_id
                </span>
              </div>
              <div className="flex gap-2 pl-4">
                <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-xs font-mono flex items-center gap-1.5">
                  <Key className="w-3 h-3" /> aff_sub1
                </span>
                <div className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 rounded-lg text-xs font-mono flex items-center gap-1.5 relative">
                  <Key className="w-3 h-3" /> subid
                  <MousePointer2 className="absolute -bottom-2 -right-2 w-4 h-4 text-orange-500 fill-orange-500 rotate-[90deg] animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Small Card (Bottom Left) - Excel / CSV Export */}
          <div className="rounded-[32px] bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border border-zinc-800 p-8 md:p-10 flex flex-col justify-between min-h-[420px] relative overflow-hidden group">
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Segmented list exports
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Download campaign data instantly. Export lead logs as Excel or CSV files sorted by partner, company, or date ranges.
              </p>
            </div>

            {/* Export Mockup Visual */}
            <div className="relative h-44 w-full bg-zinc-900/50 rounded-2xl border border-zinc-800/80 p-6 flex flex-col justify-between mt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-zinc-800/60 pb-2">
                  <span className="text-white/70">leads-growthlabs-xlsx</span>
                  <span className="text-emerald-400 font-bold">Ready</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-zinc-800/60 pb-2">
                  <span className="text-white/40">leads-propedge-csv</span>
                  <span className="text-white/30">12.4 KB</span>
                </div>
              </div>
              <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-zinc-700/50 transition-colors">
                <Download className="w-3.5 h-3.5" /> Download Lead Package
              </button>
            </div>
          </div>

          {/* Card 4: Large Card (Bottom Right) - Lead Notifications */}
          <div className="lg:col-span-2 rounded-[32px] bg-zinc-50/50 text-zinc-900 border border-zinc-200/80 relative overflow-hidden flex flex-col justify-between min-h-[420px] p-8 md:p-12 group">
            {/* Ambient Orange Glow */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/[0.02] rounded-full blur-[80px] -z-0" />
            
            <div className="max-w-md z-10 space-y-4">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Instant lead notifications
              </h3>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
                Connect SMTP and receive real-time email alerts when a form is submitted. Route leads instantly to your sales agents without missing a second of interest.
              </p>
            </div>

            {/* Email Notification Mockup */}
            <div className="relative mt-8 lg:mt-0 w-full lg:max-w-md bg-white border border-zinc-200 shadow-2xl rounded-2xl p-5 text-zinc-900 space-y-4 animate-float self-center lg:self-end">
              <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-xs text-zinc-900">ZeeOffer Lead Dispatcher</h4>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase">SMTP Delivery</p>
                </div>
                <span className="text-[9px] text-zinc-400 font-medium ml-auto">Just Now</span>
              </div>
              <div className="space-y-2 text-left">
                <p className="text-xs font-bold text-zinc-800">New lead captured for PropEdge campaign:</p>
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 font-mono text-[10px] space-y-1 text-zinc-600">
                  <div>Name: Rohan Mehta</div>
                  <div>Email: rohan@propedge.com</div>
                  <div>Phone: +91 98765 43210</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Floating Animations CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 5s ease-in-out infinite;
          animation-delay: 2.5s;
        }
      `}} />
    </section>
  );
}
