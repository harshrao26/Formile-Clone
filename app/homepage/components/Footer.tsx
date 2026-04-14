'use client';

import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-32 px-6 border-t border-zinc-100 bg-zinc-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
        <div className="flex flex-col items-center md:items-start gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ZeeOffer" className="w-8 h-8 object-contain" />
            <span className="text-zinc-900 font-bold text-lg tracking-tight">ZeeOffer</span>
          </div>
          <p className="text-zinc-400 text-sm font-medium text-center md:text-left">
Automate your campaigns with powerful forms designed to capture the right data, every time.          </p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-12 md:gap-20 text-zinc-500 text-sm font-bold tracking-tight">
          
          
          <div className="flex   gap-5">
             <a href="/privacy-policy" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
            <a href="/terms-conditions" className="hover:text-zinc-900 transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-zinc-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">© 2026 ZeeOffer Inc.</p>
        <div className="flex gap-6 text-zinc-400">
           {/* Social Icons Placeholder */}
        </div>
      </div>
    </footer>
  );
}
