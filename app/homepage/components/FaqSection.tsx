'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'What is Genforge Studio?',
    a: 'Genforge Studio is a multi-tenant SaaS platform for AI-powered lead generation. It lets you create custom forms, manage partner networks, and capture high-quality leads — all secured under enterprise-grade role-based access control.',
  },
  {
    q: 'How does the partner URL system work?',
    a: 'Each partner you add gets a unique slug-based URL (e.g., yourapp.com/p/partner-slug). Sharing this link let them direct prospects to a branded lead form. All submissions are automatically tagged to the partner and stored in your dashboard.',
  },
  {
    q: 'Is my data isolated from other companies on the platform?',
    a: 'Yes, completely. Genforge Studio is built with Row-Level Security (RLS) enforced at every API layer. Company A can never see, access, or interfere with Company B\'s lead data. Each admin account is fully siloed.',
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
    <section className="py-40 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">FAQ</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-[0.95]">
            Questions we <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/60 to-white/20">hear all the time</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i ? 'border-border bg-white/[0.04]' : 'border-white/5 bg-white/[0.02]'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-7 text-left gap-6"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`font-semibold text-base transition-colors ${open === i ? 'text-white' : 'text-white/70'}`}>
                  {faq.q}
                </span>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${
                  open === i ? 'border-white/20 bg-white/10' : 'border-white/5'
                }`}>
                  {open === i
                    ? <Minus className="w-3 h-3 text-white/70" />
                    : <Plus className="w-3 h-3 text-white/50" />
                  }
                </div>
              </button>
              {open === i && (
                <div className="px-7 pb-7">
                  <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
