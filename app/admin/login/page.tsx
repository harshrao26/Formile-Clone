"use client";

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      login(data.token, data.admin);
      if (data.admin.role === 'superadmin') {
        router.push('/admin/superadmin/overview');
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Image */}
       

      <div className="relative w-full max-w-md mx-4 z-10">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-border rounded-[32px] p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl mb-4 group hover:border-orange-500/30 transition-all duration-500">
            <img src="/logo.png" alt="ZeeOffer" className="w-10 h-10 object-contain" />
          </div>
            <h1 className="text-2xl font-bold text-foreground">ZeeOffer</h1>
            <p className="text-foreground/60 mt-1">Sign in to your admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-foreground/70 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="yourname@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-foreground/70 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/admin/forgot-password"
                className="text-sm font-medium text-orange-500 hover:text-orange-400 transition"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="text-center text-foreground/50 text-sm">
              Don't have an account?{' '}
              <Link href="/admin/register" className="text-orange-500 hover:text-orange-400 font-medium">
                Create Account
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
