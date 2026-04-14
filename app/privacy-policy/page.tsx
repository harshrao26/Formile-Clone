'use client';

import Navbar from '../homepage/components/Navbar';
import Footer from '../homepage/components/Footer';

export default function PrivacyPolicy() {
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
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">Privacy Policy</h1>
            <p className="text-white/50 text-xl">Last updated: March 30, 2026</p>
          </div>

          <div className="space-y-12 prose prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">1. Introduction</h2>
              <p className="text-white/70 leading-relaxed">
                Welcome to ZeeOffer. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">2. Information We Collect</h2>
              <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-4">
                <p className="text-white/70">As a lead capture platform, we collect information in two main ways:</p>
                <ul className="list-disc list-inside text-white/70 space-y-2">
                  <li><span className="text-white font-medium">Account Information:</span> When you sign up, we collect your name, email address, and password for authentication and account management.</li>
                  <li><span className="text-white font-medium">Platform Usage:</span> We collect data regarding how you use the platform to improve our services and monitor for security threats.</li>
                  <li><span className="text-white font-medium">Collected Leads:</span> We store the data submitted through your custom forms. This data belongs to you, and we only process it according to your instructions.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">3. How We Use Your Information</h2>
              <p className="text-white/70 leading-relaxed">
                We use personal information collected via our platform for a variety of business purposes, including:
              </p>
              <ul className="list-disc list-inside text-white/70 mt-4 space-y-2">
                <li>To facilitate account creation and logon process.</li>
                <li>To send administrative information to you (updates, verification codes).</li>
                <li>To protect our Services from security threats and fraudulent activities.</li>
                <li>To provide technical support and respond to user inquiries.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">4. Data Sharing and Security</h2>
              <p className="text-white/70 leading-relaxed">
                We do not sell, rent, or lease our customer lists to third parties. Every tenant's data is strictly isolated at the database level using modern row-level isolation protocols. We use industry-standard encryption (JWT, TLS) to protect your data in transit and at rest.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">5. Your Rights</h2>
              <p className="text-white/70 leading-relaxed">
                You have the right to access, update, or delete your account information at any time. If you wish to close your account or have your data removed, please contact our support team.
              </p>
            </section>

            <section className="pt-8 border-t border-white/5">
              <p className="text-white/50 text-sm">
                If you have questions or comments about this policy, you may email us at support@zeeoffer.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
