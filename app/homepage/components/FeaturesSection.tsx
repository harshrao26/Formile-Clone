'use client';

import { Shield, Users, Zap, BarChart3, FormInput, Mail, Download, Lock } from 'lucide-react';

const features = [
  {
    icon: FormInput,
    color: 'from-orange-500/20 to-orange-500/5',
    iconColor: 'text-orange-400',
    title: 'AI-Powered Form Builder',
    description: 'Build high-conversion lead capture forms with dynamic fields, custom themes, and background images — in minutes.',
  },
  {
    icon: Users,
    color: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-400',
    title: 'Multi-Tenant Partner Network',
    description: 'Invite unlimited partners with unique slugs. Each partner gets a dedicated lead pipeline, fully isolated and secure.',
  },
  {
    icon: BarChart3,
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-400',
    title: 'Real-Time Lead Analytics',
    description: 'Track lead volume, partner performance, and conversion rates at a glance from a single, powerful dashboard.',
  },
  {
    icon: Shield,
    color: 'from-green-500/20 to-green-500/5',
    iconColor: 'text-green-400',
    title: 'Enterprise-Grade Security',
    description: 'Row-level data isolation, OTP-based email verification, and JWT authentication ensure your data is always protected.',
  },
  {
    icon: Mail,
    color: 'from-pink-500/20 to-pink-500/5',
    iconColor: 'text-pink-400',
    title: 'Automated OTP Verification',
    description: 'Stop fake leads instantly. Every signup is verified via SMTP-powered OTP before being stored in your CRM.',
  },
  {
    icon: Download,
    color: 'from-yellow-500/20 to-yellow-500/5',
    iconColor: 'text-yellow-400',
    title: 'Smart Data Export',
    description: 'Export fully structured lead data with date-range filters, company segmentation, and custom column selects.',
  },
  {
    icon: Lock,
    color: 'from-red-500/20 to-red-500/5',
    iconColor: 'text-red-400',
    title: 'Role-Based Access Control',
    description: 'Superadmin sees everything. Tenant admins see only their own leads. Zero data leakage, by architecture.',
  },
  {
    icon: Zap,
    color: 'from-cyan-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-400',
    title: 'Instant Campaign Deployment',
    description: 'Deploy new lead campaigns with a unique partner URL in seconds. No engineering team required.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Why Genforge Studio</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.95]">
            Everything you need to <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500">close more leads</span>
          </h2>
          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            One platform. Every tool your sales and marketing team needs to generate, manage, and convert leads at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-7 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 cursor-default"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3 leading-snug">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
