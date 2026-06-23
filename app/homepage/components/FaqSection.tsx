'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'What is ZeeOffer?',
    a: 'ZeeOffer is a multi-tenant SaaS platform for AI-powered lead generation. It lets you create custom forms, manage partner networks, and capture high-quality leads — all secured under enterprise-grade role-based access control.',
  },
  {
    q: 'How does the partner URL system work?',
    a: 'Each partner you add gets a unique slug-based URL (e.g., yourapp.com/p/partner-slug). Sharing this link let them direct prospects to a branded lead form. All submissions are automatically tagged to the partner and stored in your dashboard.',
  },
  {
    q: 'Is my data isolated from other companies on the platform?',
    a: 'Yes, completely. ZeeOffer is built with Row-Level Security (RLS) enforced at every API layer. Company A can never see, access, or interfere with Company B\'s lead data. Each admin account is fully siloed.',
  },
  {
    q: 'How does OTP verification help lead quality?',
    a: 'When a user submits a lead form, they receive a one-time password to their email address via SMTP. Only after verifying the OTP is their data stored in your CRM. This eliminates disposable email submissions and fake leads entirely.',
  },
  {
    q: 'Can I export my leads to Excel?',
    a: 'Yes. From the Leads dashboard you can export your data in CSV/Excel format. You can filter by date range and company before exporting, so you\'re always working with exactly the right dataset.',
  },
  {
    q: 'What is the Superadmin role?',
    a: 'The Superadmin is the platform owner. They have a global dashboard showing cross-tenant statistics: total admins, total leads, platform-wide growth. Standard admins only see data from their own account. This hierarchy is enforced at the API level.',
  },
  {
    q: 'Can I change or cancel my plan anytime?',
    a: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time from your admin settings. There are no lock-in contracts or hidden cancellation fees.',
  },
  {
    q: 'Do you offer a free trial for the Pro plan?',
    a: 'Yes — the Pro plan comes with a 14-day free trial. No credit card required. You\'ll have full access to all Pro features during the trial period.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-10 px-6 bg-white   border-zinc-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 border border-zinc-200/50 rounded-full">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Questions we <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-400 to-zinc-600">hear all the time</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-[24px] border transition-all duration-300 overflow-hidden ${
                open === i 
                  ? 'border-zinc-200 bg-zinc-50/50 shadow-sm' 
                  : 'border-zinc-100 bg-white hover:border-zinc-200 hover:bg-zinc-50/30'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-7 text-left gap-6 group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`font-bold text-lg transition-colors ${open === i ? 'text-zinc-900' : 'text-zinc-700'}`}>
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${
                  open === i ? 'border-orange-500 bg-orange-500 text-white' : 'border-zinc-200 bg-white group-hover:border-zinc-300'
                }`}>
                  {open === i
                    ? <Minus className="w-3.5 h-3.5" />
                    : <Plus className="w-3.5 h-3.5 text-zinc-400" />
                  }
                </div>
              </button>
              {open === i && (
                <div className="px-7 pb-7 -mt-2 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-zinc-500 text-base leading-relaxed font-medium">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
