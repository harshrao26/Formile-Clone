'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  CreditCard, 
  Zap, 
  Calendar, 
  Clock,
  ShieldCheck,
  Package,
  ArrowRight
} from 'lucide-react';
import Script from 'next/script';

// Pricing data
const PLANS = [
  {
    id: 'trial',
    name: 'Starter Trial',
    price: 1,
    period: '3 days',
    features: [
      '3 Days Pro Access',
      'Unlimited Links',
      'Full Analytics',
      'Email Support'
    ],
    recommended: false
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 599,
    period: 'month',
    features: [
      'Unlimited Lead Capture',
      'Advanced Tracking Parameters',
      'Partner Management',
      'Email Notifications',
      'CSV Reports'
    ],
    recommended: false
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    price: 5750,
    period: 'year',
    features: [
      'Everything in Monthly',
      '20% Discount (Save ₹1,438)',
      'Priority Email Support',
      'Custom Form Styling',
      'Whitelabel Lead Routing'
    ],
    recommended: true
  }
];

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function BillingPage() {
  const { admin, token, login, admin: authAdmin } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdFromUrl = searchParams.get('order_id');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);

  useEffect(() => {
    // If we have an order_id in the URL, verify it
    if (orderIdFromUrl) {
      verifyPayment(orderIdFromUrl);
    }
  }, [orderIdFromUrl]);

  const verifyPayment = async (orderId: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/billing/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order_id: orderId })
      });
      const data = await res.json();
      if (data.success) {
        // Update local auth state with new subscription info
        if (admin) {
          login(token!, {
            ...admin,
            subscriptionStatus: data.admin.subscriptionStatus,
            expiryDate: data.admin.expiryDate
          });
        }
        // Redirect to dashboard after success
        router.push('/admin/dashboard');
      } else {
        alert(data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verification failed', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCheckout = async (planType: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Create order on backend
      const res = await fetch('/api/billing/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planType })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Initialize Cashfree Checkout
      if (!window.Cashfree) {
        throw new Error('Cashfree SDK not loaded');
      }

      const cf = new window.Cashfree({ mode: "production" });
      
      await cf.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self", // Or "_modal"
      });

    } catch (error: any) {
      alert(error.message || 'Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const isExpired = authAdmin?.subscriptionStatus === 'expired' || 
                    (authAdmin?.expiryDate && new Date(authAdmin.expiryDate) < new Date());

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <Script 
        src="https://sdk.cashfree.com/js/v3/cashfree.js" 
        onLoad={() => console.log('Cashfree loaded')}
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Choose Your Plan</h1>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Scale your lead generation with ZeeOffer. Select a plan that fits your business needs.
        </p>
      </div>

      {isVerifying && (
        <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3 animate-pulse">
          <Clock className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-medium">Verifying your payment... please wait.</span>
        </div>
      )}

      {isExpired && (
        <div className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-center md:text-left animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="p-3 bg-red-500 rounded-full text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-500">Plan Expired</h3>
            <p className="text-sm text-foreground/60">Your subscription has ended. Please renew to continue using ZeeOffer services.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-8 rounded-3xl border transition-all duration-300 ${
              plan.recommended 
                ? 'bg-card border-orange-500 shadow-xl shadow-orange-500/10 scale-105 z-10' 
                : 'bg-card/50 border-border hover:border-foreground/20'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                <Zap className="w-3 h-3 fill-current" /> BEST VALUE (20% OFF)
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold  ">₹{plan.price}</span>
                <span className="text-foreground/40 font-medium">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-foreground/70">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={isProcessing}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all ${
                plan.recommended
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25 active:scale-[0.98]'
                  : 'bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Get Started Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center text-foreground/40 text-xs">
        <p className="mb-2">Payments secured by Cashfree.</p>
        <p>By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
}
