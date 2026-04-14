'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

import { ThemeToggle } from '@/app/components/ThemeToggle';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="ZeeOffer Logo" className="w-8 h-8 object-contain" />
            <span className="text-zinc-900 font-bold text-lg tracking-tight">ZeeOffer</span>
          </Link>
         
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/login" 
            className="text-zinc-600 hover:text-zinc-900 text-sm font-bold transition-colors"
          >
            Sign In
          </Link>

                      <Link href="/contact" className="text-zinc-600 text-sm font-bold transition-colors">Contact Us</Link>

        </div>
      </div>
    </nav>
  );
}
