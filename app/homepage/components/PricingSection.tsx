'use client';

import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Standard Pro',
    price: '₹499',
    period: '/month',
    description: 'The complete lead generation toolkit for scale.',
    highlight: true,
    badge: 'Popular Choice',
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
    <section className="pt-40 pb-20 px-6 relative bg-white  ">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-900 leading-[0.95]">
            Start free. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-700">Scale when you're ready.</span>
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-medium">
            No hidden fees. Cancel anytime. Every plan includes unlimited admin access.
          </p>
        </div>

        <div className="flex justify-center">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-[32px] p-8 border transition-all duration-500 max-w-md w-full ${
                plan.highlight
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-[0_40px_80px_rgba(0,0,0,0.15)] scale-[1.03]'
                  : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    plan.highlight ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                  }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <div className={`text-sm font-bold uppercase tracking-widest mb-3 ${plan.highlight ? 'text-white/50' : 'text-zinc-400'}`}>
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-5xl font-extrabold tracking-tighter">{plan.price}</span>
                  <span className={`text-sm font-medium mb-2 ${plan.highlight ? 'text-white/40' : 'text-zinc-400'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm leading-relaxed ${plan.highlight ? 'text-white/60' : 'text-zinc-500'}`}>{plan.description}</p>
              </div>

              <ul className="space-y-3.5 flex-1 mb-10">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlight ? 'bg-orange-500' : 'bg-zinc-100'
                    }`}>
                      <Check className={`w-2.5 h-2.5 font-bold ${plan.highlight ? 'text-white' : 'text-zinc-600'}`} />
                    </div>
                    <span className={plan.highlight ? 'text-white/80' : 'text-zinc-600 font-medium'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/admin/register"
                className={`w-full text-center py-4 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-95 ${
                  plan.highlight
                    ? 'bg-white text-black hover:bg-zinc-100'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
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
