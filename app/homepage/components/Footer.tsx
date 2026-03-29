'use client';

import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-32 px-6 border-t border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Genforge Studio" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-lg tracking-tight uppercase">Genforge Studio</span>
        </div>
        <div className="flex gap-12 text-white/30 text-sm font-medium">
          <div className="flex flex-col gap-4">
            <span className="text-white">Learn</span>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">API Reference</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white">Support</span>
            <a href="#" className="hover:text-white transition-colors">Help Center</a>
            <a href="#" className="hover:text-white transition-colors">Community</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
