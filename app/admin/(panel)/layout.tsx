'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';
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
  AlertTriangle,
  Phone,
  Loader2
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
  const { token, admin, updateAdmin, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [phoneInput, setPhoneInput] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

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

  // Show phone input modal if tenant is logged in, not a superadmin, and hasn't registered a phone number yet
  const showPhoneModal = !!token && !!admin && admin.role !== 'superadmin' && !admin.phone;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    
    // Frontend validation
    const trimmed = phoneInput.trim();
    const allowedCharsRegex = /^\+?[0-9\s\-()]+$/;
    if (!allowedCharsRegex.test(trimmed)) {
      setModalError('Invalid characters. Use digits, spaces, dashes, parentheses and optional starting + only.');
      return;
    }
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setModalError('Mobile number must be between 10 and 15 digits long.');
      return;
    }

    setModalLoading(true);
    try {
      const res = await fetch('/api/auth/update-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone: trimmed })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update phone number.');
      }
      updateAdmin({ phone: data.admin.phone });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setModalError(message);
    } finally {
      setModalLoading(false);
    }
  };

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

      {/* Mandatory Phone Verification Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-[32px] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden text-foreground">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-4 text-orange-500">
                <Phone className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Mobile Number Required</h2>
              <p className="text-foreground/60 text-sm mt-2">
                Please provide your mobile number to complete your account setup. This is mandatory for all tenants.
              </p>
            </div>

            {modalError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 text-center mb-4">
                {modalError}
              </div>
            )}

            <form onSubmit={handlePhoneSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-foreground/70 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3.5 bg-background border border-border rounded-xl text-foreground placeholder-foreground/45 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/15"
              >
                {modalLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Submit & Continue'
                )}
              </button>

              <button
                type="button"
                onClick={() => { logout(); router.push('/'); }}
                className="w-full text-center text-foreground/40 hover:text-foreground/60 text-xs font-medium pt-2 transition"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
