'use client';

import { Shield, Zap, BarChart3, Download } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    title: 'Real-Time Lead Analytics',
    description: 'Track lead volume, partner performance, and conversion rates at a glance from a single, powerful dashboard.',
  },
  {
    icon: Shield,
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    title: 'Enterprise-Grade Security',
    description: 'Row-level data isolation, OTP-based email verification, and JWT authentication ensure your data is always protected.',
  },
  {
    icon: Download,
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Smart Data Export',
    description: 'Export fully structured lead data with date-range filters, company segmentation, and custom column selects.',
  },
  {
    icon: Zap,
    color: 'bg-orange-50',
    iconColor: 'text-orange-600',
    title: 'Instant Campaign Deployment',
    description: 'Deploy new lead campaigns with a unique partner URL in seconds. No engineering team required.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="pt-40 px-6 bg-white b ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Everything you need to <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-700">close more leads</span>
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            One platform. Every tool your sales and marketing team needs to generate, manage, and convert leads at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 rounded-[32px] border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:border-zinc-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-500 cursor-default"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <f.icon className={`w-7 h-7 ${f.iconColor}`} />
              </div>
              <h3 className="text-zinc-900 font-bold text-xl mb-3 leading-snug">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
