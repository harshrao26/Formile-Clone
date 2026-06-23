'use client';

import { useState } from 'react';
import { Building2, GraduationCap, Car, Coins, ArrowRight, CheckCircle2 } from 'lucide-react';

const industries = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: Building2,
    color: 'from-orange-500/10 to-amber-500/10 border-orange-500/20 text-orange-600',
    dotColor: 'bg-orange-500',
    title: 'High-Intent Property Lead Capture',
    description: 'Capture prospective buyers and renters at the peak of their interest. Filter by budget and property type before routing to property coordinators.',
    bullets: [
      'Pre-qualify by budget & location',
      'Redirect instantly to 3D Virtual Tours',
      'OTP validation to filter fake brokers'
    ],
  },
  {
    id: 'fintech',
    name: 'Fintech & Wealth',
    icon: Coins,
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600',
    dotColor: 'bg-emerald-500',
    title: 'Secure Client Onboarding Forms',
    description: 'Collect risk profiles and financial interest forms securely under strict data isolation. Automatically append partner tracking parameters to final quote pages.',
    bullets: [
      'Enterprise-grade RLS data separation',
      'Track affiliate referral performance',
      'Instant redirection to premium pricing calculator'
    ],
  },
  {
    id: 'education',
    name: 'Education & EdTech',
    icon: GraduationCap,
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600',
    dotColor: 'bg-blue-500',
    title: 'Course Enrollment Pre-Landers',
    description: 'Boost student trial signups. Create lightweight forms that collect contact info and direct users to calendar booking schedules without losing tracking data.',
    bullets: [
      'Seamless Calendly redirect integrations',
      'Tag leads by representative slug',
      'Smart export for admission follow-ups'
    ],
  },
  {
    id: 'auto',
    name: 'Auto & Dealerships',
    icon: Car,
    color: 'from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-600',
    dotColor: 'bg-rose-500',
    title: 'Test Drive & Inquiry Automation',
    description: 'Capture active vehicle buyer leads. Collect specific model interest and redirect prospects directly to active WhatsApp sales agents with custom pre-filled texts.',
    bullets: [
      'Collect model & budget preferences',
      'Smart WhatsApp referral API handoff',
      'Track sales representative conversions'
    ],
  },
];

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(industries[0].id);
  const selected = industries.find((ind) => ind.id === activeTab) || industries[0];
  const SelectedIcon = selected.icon;

  return (
    <section className="py-32 px-6 bg-zinc-50/50 border-t border-zinc-100 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-to-tr from-orange-100/30 to-purple-100/30 blur-[130px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-zinc-200 rounded-full shadow-sm">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Industry Solutions</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Built for industries that <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-700">depend on trust</span>
          </h2>
          <p className="text-zinc-500 text-base md:text-xl max-w-xl mx-auto leading-relaxed font-medium">
            Generic forms fail. ZeeOffer offers tailored lead capture workflows optimized for your specific vertical.
          </p>
        </div>

        {/* Tab Switcher Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isActive = activeTab === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveTab(ind.id)}
                className={`flex items-center gap-3 p-5 rounded-2xl border text-left transition-all duration-300 ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-900/5 scale-[1.02]'
                    : 'bg-white text-zinc-700 border-zinc-200/80 hover:border-zinc-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm md:text-base leading-tight">{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Card */}
        <div className="bg-white border border-zinc-200/80 rounded-[32px] p-8 md:p-12 shadow-xl shadow-zinc-100/50 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${selected.color} border`}>
                <span className={`w-2 h-2 rounded-full ${selected.dotColor} animate-ping`} />
                {selected.name} Vertical
              </span>
            </div>
            
            <h3 className="text-3xl font-extrabold text-zinc-900 leading-tight">
              {selected.title}
            </h3>
            
            <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-medium">
              {selected.description}
            </p>

            <ul className="space-y-4">
              {selected.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-zinc-700 text-sm font-semibold">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 w-full flex items-center justify-center relative">
            {/* Visual Box / Mock Layout */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-zinc-100/20 rounded-[24px] -z-10" />
            <div className="w-full max-w-[400px] border border-zinc-200/60 rounded-3xl p-6 bg-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <SelectedIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-zinc-900">{selected.name} Campaign</h4>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wide">Dynamic Form Template</p>
                </div>
              </div>

              {/* Simulated Form Fields */}
              <div className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Customer Name</label>
                  <div className="w-full h-10 rounded-xl border border-zinc-100 bg-zinc-50/50 flex items-center px-3 text-xs text-zinc-400">e.g. John Doe</div>
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Verification OTP</label>
                  <div className="w-full h-10 rounded-xl border border-zinc-100 bg-zinc-50/50 flex items-center px-3 text-xs text-zinc-400">Enter code sent to email</div>
                </div>
                
                <div className="w-full py-3 bg-zinc-900 rounded-xl text-white font-bold text-xs text-center flex items-center justify-center gap-2 group-hover:bg-orange-500 transition-colors duration-300">
                  Submit & Redirect <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
