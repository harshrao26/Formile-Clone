'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Building2, 
  Users, 
  FileText, 
  Inbox, 
  LogOut, 
  Zap,
  LayoutDashboard
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/companies', label: 'Companies', icon: Building2 },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/forms', label: 'Forms', icon: FileText },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { token, admin, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/admin/login');
    }
    // Redirect superadmins to their dedicated control center
    if (!isLoading && admin?.role === 'superadmin') {
      router.push('/admin/superadmin/overview');
    }
  }, [token, admin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-white/[0.06] flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] flex items-center justify-center border border-white/5">
              <img src="/logo.png" alt="Genforge" className="w-5 h-5 object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white uppercase">Genforge Studio</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-white/50'}`} />
                {item.label}
              </Link>
            );
          })}

          {admin?.role === 'superadmin' && (
            <Link
              href="/admin/superadmin/overview"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 mt-4 hover:bg-orange-500/20 transition-all animate-pulse"
            >
              <Zap className="w-5 h-5" />
              Superadmin Panel
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin?.name}</p>
              <p className="text-white/30 text-xs truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/admin/login'); }}
            className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
