'use client';

export default function SecondarySection() {
  return (
    <section className="py-44 px-6 text-center bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-10 tracking-tight leading-[0.95] text-zinc-900">
          Get to work quickly <br /> wherever you are
        </h2>
        <p className="text-zinc-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
          Import your existing campaigns, use our AI generation agents to launch <br className="hidden md:block" />
          in minutes, and monitor performance at a glance. ZeeOffer is <br className="hidden md:block" />
          the unified engine for your entire revenue team.
        </p>
        <p className="text-zinc-400 text-sm font-medium">
          Currently available in preview with 3 workspaces at no cost.
        </p>
      </div>
    </section>
  );
}
