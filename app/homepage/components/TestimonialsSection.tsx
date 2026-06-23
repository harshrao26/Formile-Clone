'use client';

const testimonials = [
  {
    name: 'Rohan Mehta',
    role: 'Founder, GrowthLabs India',
    image: '/avatar_rohan.png',
    text: 'ZeeOffer cut our lead setup time from weeks to hours. The partner URL system is genius — our field team can now capture leads without any IT involvement.',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Sales, PropEdge',
    image: '/avatar_priya.png',
    text: 'We manage 12 different real estate projects across India, and ZeeOffer keeps all the lead data perfectly separated. The superadmin view is exactly what we needed.',
  },
  {
    name: 'Vikas Agarwal',
    role: 'Digital Marketing, AutoZone',
    image: '/avatar_vikas.png',
    text: 'The OTP verification alone saved us from hundreds of fake submissions per month. Our data quality is now clean enough to run serious email campaigns on.',
  },
  {
    name: 'Sneha Rathore',
    role: 'Operations Manager, EduFirst',
    image: '/avatar_sneha.png',
    text: 'The custom form builder is incredibly easy to use. We created and deployed a new admission inquiry form in under 10 minutes without touching a single line of code.',
  },
  {
    name: 'Karan Bhatia',
    role: 'CEO, FinVest Advisors',
    image: '/avatar_karan.png',
    text: 'The Excel export with date range and company filters is exceptional. Our team runs weekly Monday reports directly from ZeeOffer without any manual data wrangling.',
  },
  {
    name: 'Ananya Gupta',
    role: 'Tech Lead, Startupbox',
    image: '/avatar_ananya.png',
    text: 'The role-based access is incredibly well-thought-out. Our admins can only see their own data, and I have full cross-tenant visibility as the superadmin. Exactly as described.',
  },
];

// Duplicate arrays to create seamless infinite scrolling marquee rows
const row1 = [...testimonials.slice(0, 3), ...testimonials.slice(0, 3)];
const row2 = [...testimonials.slice(3, 6), ...testimonials.slice(3, 6)];

export default function TestimonialsSection() {
  return (
    <section className="pt-32 pb-24 relative overflow-hidden bg-white border-t border-zinc-100">
      {/* Aligned Header Section */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
          Real results, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">real customers</span>
        </h2>
      </div>

      {/* Marquee Rows Container */}
      <div className="space-y-8 overflow-hidden w-full relative">
        {/* Soft edge blur masks */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-44 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-44 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Row 1: Left-to-Right Scrolling */}
        <div className="flex gap-6 w-full marquee-container overflow-hidden">
          <div className="flex gap-6 shrink-0 marquee-track animate-marquee-ltr">
            {row1.map((t, i) => (
              <div
                key={`r1-track1-${i}`}
                className="w-[360px] md:w-[420px] p-8 rounded-[32px] border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:border-zinc-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-500 flex flex-col gap-6 group cursor-default shrink-0"
              >
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed flex-1 font-medium italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full object-cover border border-zinc-200 shadow-md group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div>
                    <div className="text-zinc-900 font-bold text-sm tracking-tight">{t.name}</div>
                    <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-6 shrink-0 marquee-track animate-marquee-ltr">
            {row1.map((t, i) => (
              <div
                key={`r1-track2-${i}`}
                className="w-[360px] md:w-[420px] p-8 rounded-[32px] border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:border-zinc-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-500 flex flex-col gap-6 group cursor-default shrink-0"
              >
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed flex-1 font-medium italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full object-cover border border-zinc-200 shadow-md group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div>
                    <div className="text-zinc-900 font-bold text-sm tracking-tight">{t.name}</div>
                    <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right-to-Left Scrolling */}
        <div className="flex gap-6 w-full marquee-container overflow-hidden">
          <div className="flex gap-6 shrink-0 marquee-track animate-marquee-rtl">
            {row2.map((t, i) => (
              <div
                key={`r2-track1-${i}`}
                className="w-[360px] md:w-[420px] p-8 rounded-[32px] border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:border-zinc-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-500 flex flex-col gap-6 group cursor-default shrink-0"
              >
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed flex-1 font-medium italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full object-cover border border-zinc-200 shadow-md group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div>
                    <div className="text-zinc-900 font-bold text-sm tracking-tight">{t.name}</div>
                    <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-6 shrink-0 marquee-track animate-marquee-rtl">
            {row2.map((t, i) => (
              <div
                key={`r2-track2-${i}`}
                className="w-[360px] md:w-[420px] p-8 rounded-[32px] border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:border-zinc-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-500 flex flex-col gap-6 group cursor-default shrink-0"
              >
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed flex-1 font-medium italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full object-cover border border-zinc-200 shadow-md group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div>
                    <div className="text-zinc-900 font-bold text-sm tracking-tight">{t.name}</div>
                    <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Animations CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-ltr {
          0% { transform: translateX(calc(-100% - 24px)); }
          100% { transform: translateX(0); }
        }
        @keyframes marquee-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% - 24px)); }
        }
        .animate-marquee-ltr {
          animation: marquee-ltr 45s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 45s linear infinite;
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}
