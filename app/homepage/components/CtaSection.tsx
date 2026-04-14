'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-white border-t border-zinc-100">
      {/* Soft Light Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-orange-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <div className="rounded-[48px] border border-zinc-200 bg-zinc-50 p-16 md:p-24 text-center space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.02)]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 border border-orange-500/10 rounded-full">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Start Today — Free</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-900 leading-[0.9]">
              Your next lead is <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-700">one click away</span>
            </h2>
            <p className="text-zinc-500 text-lg md:text-2xl max-w-xl mx-auto font-medium leading-relaxed">
              Join thousands of sales teams closing more deals with ZeeOffer. No credit card required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/admin/register"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-zinc-900 hover:bg-black rounded-full font-bold text-lg transition-all shadow-xl active:scale-95 text-white"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-orange-400" />
            </Link>
            <Link
              href="/admin/login"
              className="w-full sm:w-auto px-12 py-5 rounded-full font-bold text-lg border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all text-center"
            >
              Sign In
            </Link>
          </div>

          <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest">
            14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
