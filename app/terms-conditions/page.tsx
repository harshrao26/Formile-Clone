'use client';

import Navbar from '../homepage/components/Navbar';
import Footer from '../homepage/components/Footer';

export default function TermsConditions() {
  return (
    <div className="dark min-h-screen bg-black text-white selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden font-sans relative">
      {/* Global Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-44 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">Terms & Conditions</h1>
            <p className="text-white/50 text-xl">Last updated: March 30, 2026</p>
          </div>

          <div className="space-y-12 prose prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">1. Agreement to Terms</h2>
              <p className="text-white/70 leading-relaxed">
                By accessing or using Genforge Studio, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">2. User Accounts</h2>
              <p className="text-white/70 leading-relaxed">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
              </p>
              <ul className="list-disc list-inside text-white/70 mt-4 space-y-2">
                <li>You are responsible for safeguarding your password.</li>
                <li>You agree not to disclose your password to any third party.</li>
                <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">3. Lead Generation Compliance</h2>
              <p className="text-white/70 leading-relaxed">
                You are solely responsible for compliance with any laws, rules, and regulations that apply to your use of the lead generation platform, including but not limited to GDPR, CCPA, and CAN-SPAM. You agree to provide your own privacy policy to the individuals who submit data through your custom forms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">4. Prohibited Uses</h2>
              <p className="text-white/70">You agree not to use the Service:</p>
              <ul className="list-disc list-inside text-white/70 mt-4 space-y-2">
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material (spam).</li>
                <li>To impersonate or attempt to impersonate Genforge, a Genforge employee, or another user.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">5. Termination</h2>
              <p className="text-white/70 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section className="pt-8 border-t border-white/5">
              <p className="text-white/50 text-sm">
                For any disputes or inquiries regarding these terms, please contact legal@genforge.studio
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
