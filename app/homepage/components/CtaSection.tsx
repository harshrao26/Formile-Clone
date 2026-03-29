'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-orange-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <div className="rounded-[48px] border border-white/5 bg-white/[0.02] backdrop-blur-xl p-16 md:p-24 text-center space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Start Today — Free</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9]">
              Your next lead is <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">one click away</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Join thousands of sales teams using Genforge Studio to close more deals. No credit card required for the Pro trial.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admin/register"
              className="group flex items-center gap-3 px-10 py-5 bg-[#ff7b00] hover:bg-[#ff8c00] rounded-full font-bold text-lg transition-all shadow-2xl shadow-orange-500/30 active:scale-95 text-black"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin/login"
              className="px-10 py-5 rounded-full font-bold text-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all"
            >
              Sign In
            </Link>
          </div>

          <p className="text-white/20 text-xs">
            14-day free trial on Pro plan · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
