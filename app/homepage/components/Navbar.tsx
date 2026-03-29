'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <img src="/logo.png" alt="Genforge Studio Logo" className="w-8 h-8 object-contain" />
            <span className="text-white font-bold text-lg tracking-tight uppercase">Genforge Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/50">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/login" 
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
