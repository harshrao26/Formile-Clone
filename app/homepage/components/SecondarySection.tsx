'use client';

export default function SecondarySection() {
  return (
    <section className="py-44 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight leading-[0.95]">
          Get to work quickly <br /> wherever you are
        </h2>
        <p className="text-white/40 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
          Import your existing campaigns, use our AI generation agents to launch <br className="hidden md:block" />
          in minutes, and monitor performance at a glance. Genforge Studio is <br className="hidden md:block" />
          built for speed and total control over your deployment approach.
        </p>
        <p className="text-white/40 text-sm italic">
          Currently available in preview with 3 workspaces at no cost.
        </p>
      </div>
    </section>
  );
}
