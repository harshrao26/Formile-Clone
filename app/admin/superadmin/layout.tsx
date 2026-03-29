'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Brain,
  Inbox,
  LogOut,
  ArrowLeft,
} from 'lucide-react';

const navItems = [
  { href: '/admin/superadmin/overview', label: 'Platform Overview', icon: LayoutDashboard },
  { href: '/admin/superadmin/tenants', label: 'Tenant Management', icon: Building2 },
  { href: '/admin/superadmin/leads', label: 'Global Leads', icon: Inbox },
  { href: '/admin/superadmin/ai-insights', label: 'AI Insights', icon: Brain },
];

export default function SuperadminLayout({ children }: { children: ReactNode }) {
  const { token, admin, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/admin/login');
    }
    if (!isLoading && admin && admin.role !== 'superadmin') {
      router.push('/admin/dashboard');
    }
  }, [token, admin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!token || admin?.role !== 'superadmin') return null;

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0a0a0a] border-r border-white/[0.04] flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <img src="/logo.png" alt="Genforge" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">Genforge Studio</span>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Superadmin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/15 shadow-lg shadow-orange-500/5'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-white/30'}`} />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-white/[0.04] mt-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-white/25 hover:text-white/60 hover:bg-white/[0.03] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Regular Dashboard
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {admin?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin?.name}</p>
              <p className="text-white/25 text-[11px] truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/admin/login'); }}
            className="w-full px-4 py-2.5 text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-auto">
        <div className="p-8 max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
