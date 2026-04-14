'use client';

import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Standard Pro',
    price: '₹599',
    period: '/month',
    description: 'The complete lead generation toolkit for scale.',
    highlight: true,
    badge: 'Flagship Plan',
    features: [
      'Unlimited Partner Links',
      'Unlimited Lead Submissions',
      'Custom Form Templates',
      'Advanced Analytics & Exports',
      'OTP Email Verification',
      'Custom Form Branding',
      'Priority Email Support',
      'All Export Formats (XLSX, CSV)',
    ],
    cta: 'Get Started Now',
  },
];

export default function PricingSection() {
  return (
    <section className="py-40 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Simple Pricing</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.95]">
            Start free. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">Scale when you're ready.</span>
          </h2>
          <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            No hidden fees. Cancel anytime. Every plan includes unlimited admin access.
          </p>
        </div>

        <div className="flex justify-center">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-[32px] p-8 border transition-all duration-500 max-w-md w-full ${
                plan.highlight
                  ? 'bg-white text-black border-white shadow-[0_0_80px_rgba(255,255,255,0.08)] scale-[1.03]'
                  : 'bg-white/[0.03] text-white border-white/5 hover:border-white/10'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    plan.highlight ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white/10 text-white/60 border border-white/10'
                  }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <div className={`text-sm font-bold uppercase tracking-widest mb-3 ${plan.highlight ? 'text-black/50' : 'text-white/40'}`}>
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-5xl font-bold tracking-tighter">{plan.price}</span>
                  <span className={`text-sm font-medium mb-2 ${plan.highlight ? 'text-black/40' : 'text-white/40'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm leading-relaxed ${plan.highlight ? 'text-black/60' : 'text-white/50'}`}>{plan.description}</p>
              </div>

              <ul className="space-y-3.5 flex-1 mb-10">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlight ? 'bg-orange-500' : 'bg-white/10'
                    }`}>
                      <Check className={`w-2.5 h-2.5 font-bold ${plan.highlight ? 'text-white' : 'text-white/70'}`} />
                    </div>
                    <span className={plan.highlight ? 'text-black/80' : 'text-white/60'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/admin/register"
                className={`w-full text-center py-4 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-95 ${
                  plan.highlight
                    ? 'bg-black text-white hover:bg-black/80'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
