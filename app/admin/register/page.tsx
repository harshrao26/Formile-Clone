"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePhone = (phone: string): boolean => {
    if (!phone) return false;
    const trimmed = phone.trim();
    const allowedCharsRegex = /^\+?[0-9\s\-()]+$/;
    if (!allowedCharsRegex.test(trimmed)) return false;
    const digits = trimmed.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError('Please accept the Terms and Privacy Policy to continue.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid mobile number (10-15 digits, digits and optional leading + only).');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, phone: formData.phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setStep(2);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      // Success! Redirect to login after 2 seconds
      setStep(2); // Keep step 2 but show success state
      setTimeout(() => router.push('/admin/login'), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
     


     

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradie nt-to-br from-orange-500 to-orange-600 mb-4 shadow-lg shadow ">
             <img src="/logo.png" alt="ZeeOffer" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create   Account</h1>
            <p className="text-foreground/60 mt-1">Start your 10x lead generation journey</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm text-center mb-6">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-5">
              <div>
                <label className="block text-foreground/70 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-foreground/70 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-foreground/70 text-sm font-medium mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div>
                <label className="block text-foreground/70 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-start gap-3 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-border bg-background text-orange-500 focus:ring-orange-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-foreground/70 leading-snug cursor-pointer select-none">
                  I agree to the{' '}
                  <Link href="/terms-conditions" target="_blank" className="text-orange-500 hover:text-orange-400 underline underline-offset-4">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" target="_blank" className="text-orange-500 hover:text-orange-400 underline underline-offset-4">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !acceptedTerms}
                className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Get Verification Code'}
              </button>

              <p className="text-center text-foreground/50 text-sm">
                Already have an account?{' '}
                <Link href="/admin/login" className="text-orange-500 hover:text-orange-400 font-medium">
                  Sign In
                </Link>
              </p>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-foreground/70 mb-2">We&apos;ve sent a 6-digit code to</p>
                <p className="text-orange-500 font-semibold">{formData.email}</p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-4 bg-background border border-border rounded-xl text-foreground text-center text-3xl font-bold tracking-[10px] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="000000"
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify & Create Account'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 text-foreground/60 text-sm hover:text-foreground transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change Email
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
