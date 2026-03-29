import Link from 'next/link';
import { 
  Zap, 
  Link2, 
  FileEdit, 
  BarChart3, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-orange-600/8 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-white font-bold text-xl">Formile</span>
        </div>
        <Link
          href="/admin/login"
          className="px-5 py-2.5 text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-xl text-sm font-medium transition-all"
        >
          Admin Login
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8">
            <CheckCircle2 className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">Lead Capture & Referral System</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Capture Leads.
            <br />
            <span className="text-orange-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Track Everything.
            </span>
          </h1>

          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create partner links, capture lead data with dynamic forms, and download everything in spreadsheet format. Simple, powerful, and ready to go.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admin/login"
              className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-lg shadow-orange-500/20 text-lg flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          {[
            {
              icon: Link2,
              title: 'Smart Link Hierarchy',
              desc: 'Company → Partner → Person. Create unique referral chains with trackable links.',
            },
            {
              icon: FileEdit,
              title: 'Dynamic Forms',
              desc: 'Admin-managed fields. Add Name, Email, Phone — whatever you need to track.',
            },
            {
              icon: BarChart3,
              title: 'Sheet Downloads',
              desc: 'Export all captured leads as Excel or CSV. Filter by partner or campaign.',
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 text-left hover:border-orange-500/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                  <Icon className="w-6 h-6 text-orange-500 group-hover:text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-white/20 text-sm">
        © {new Date().getFullYear()} Formile. Built for lead capture excellence.
      </footer>
    </div>
  );
}
