'use client';

const testimonials = [
  {
    name: 'Rohan Mehta',
    role: 'Founder, GrowthLabs India',
    avatar: 'RM',
    color: 'from-orange-500 to-red-500',
    text: 'ZeeOffer cut our lead setup time from weeks to hours. The partner URL system is genius — our field team can now capture leads without any IT involvement.',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Sales, PropEdge',
    avatar: 'PS',
    color: 'from-blue-500 to-purple-500',
    text: 'We manage 12 different real estate projects across India, and ZeeOffer keeps all the lead data perfectly separated. The superadmin view is exactly what we needed.',
  },
  {
    name: 'Vikas Agarwal',
    role: 'Digital Marketing, AutoZone',
    avatar: 'VA',
    color: 'from-green-500 to-cyan-500',
    text: 'The OTP verification alone saved us from hundreds of fake submissions per month. Our data quality is now clean enough to run serious email campaigns on.',
  },
  {
    name: 'Sneha Rathore',
    role: 'Operations Manager, EduFirst',
    avatar: 'SR',
    color: 'from-pink-500 to-rose-500',
    text: 'The custom form builder is incredibly easy to use. We created and deployed a new admission inquiry form in under 10 minutes without touching a single line of code.',
  },
  {
    name: 'Karan Bhatia',
    role: 'CEO, FinVest Advisors',
    avatar: 'KB',
    color: 'from-yellow-500 to-orange-500',
    text: 'The Excel export with date range and company filters is exceptional. Our team runs weekly Monday reports directly from ZeeOffer without any manual data wrangling.',
  },
  {
    name: 'Ananya Gupta',
    role: 'Tech Lead, Startupbox',
    avatar: 'AG',
    color: 'from-violet-500 to-purple-500',
    text: 'The role-based access is incredibly well-thought-out. Our admins can only see their own data, and I have full cross-tenant visibility as the superadmin. Exactly as described.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="pt-32 px-6 relative overflow-hidden bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-900 leading-[0.95]">
            Real results, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">real customers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 rounded-[32px] border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:border-zinc-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-500 flex flex-col gap-8 group cursor-default"
            >
              <p className="text-zinc-600 text-base leading-relaxed flex-1 font-medium italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <span className="text-white text-sm font-bold">{t.avatar}</span>
                </div>
                <div>
                  <div className="text-zinc-900 font-bold text-sm tracking-tight">{t.name}</div>
                  <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
