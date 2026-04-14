'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { 
  BarChart3, 
  Building2, 
  Users, 
  FileText, 
  Inbox, 
  LogOut, 
  Zap,
  LayoutDashboard,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/forms', label: 'Forms', icon: FileText },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/generator', label: 'Generator', icon: Zap },
  { href: '/admin/billing', label: 'Billing', icon: CreditCard },
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!token) return null;

  // Subscription Logic
  const isBillingPage = pathname === '/admin/billing';
  const isSuperAdmin = admin?.role === 'superadmin';
  const isExpired = admin?.subscriptionStatus === 'expired' || 
                    (admin?.expiryDate && new Date(admin.expiryDate) < new Date()) || 
                    admin?.subscriptionStatus === 'inactive' || 
                    admin?.subscriptionStatus === 'trial' && (admin?.expiryDate && new Date(admin.expiryDate) < new Date());

  // If expired and not on billing page and not superadmin, show blocked UI
  const showBlockedUI = isExpired && !isBillingPage && !isSuperAdmin;

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border">
              <img src="/logo.png" alt="ZeeOffer" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground block">ZEEOFFER</span>
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
                    ? 'bg-orange-500/15 text-orange-500 border border-orange-500/20'
                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-foreground/50'}`} />
                {item.label}
              </Link>
            );
          })}

          {admin?.role === 'superadmin' && (
            <Link
              href="/admin/superadmin/overview"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 mt-4 hover:bg-orange-500/20 transition-all animate-pulse"
            >
              <Zap className="w-5 h-5" />
              Superadmin Panel
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{admin?.name}</p>
                <p className="text-foreground/50 text-xs truncate">{admin?.email}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {showBlockedUI ? (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold mb-3">Your Plan has Expired</h2>
              <p className="text-foreground/60 max-w-md mx-auto mb-8">
                Your subscription to ZeeOffer has ended. All features are currently locked until you renew your plan.
              </p>
              <Link 
                href="/admin/billing"
                className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/25 active:scale-95"
              >
                Renew Subscription
              </Link>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
