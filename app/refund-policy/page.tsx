'use client';

import Navbar from '../homepage/components/Navbar';
import Footer from '../homepage/components/Footer';

export default function RefundPolicy() {
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
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">Refund & Cancellation Policy</h1>
            <p className="text-white/50 text-xl">Last updated: April 14, 2026</p>
          </div>

          <div className="space-y-12 prose prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">1. Cancellation Policy</h2>
              <p className="text-white/70 leading-relaxed">
                We understand that business needs change. You can cancel your ZeeOffer subscription at any time directly through your admin dashboard. 
              </p>
              <ul className="list-disc list-inside text-white/70 mt-4 space-y-2">
                <li>Cancellation will take effect at the end of your current billing cycle.</li>
                <li>You will continue to have full access to the platform until the period you've paid for expires.</li>
                <li>No further charges will be applied to your account after cancellation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">2. Refund Eligibility</h2>
              <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-4">
                <p className="text-white/70">To ensure customer satisfaction, we offer the following refund terms:</p>
                <ul className="list-disc list-inside text-white/70 space-y-3">
                  <li><span className="text-white font-medium">Monthly Plans:</span> Refund requests must be submitted within <span className="text-orange-400">7 days</span> of the initial purchase or renewal.</li>
                  <li><span className="text-white font-medium">Annual Plans:</span> Refund requests must be submitted within <span className="text-orange-400">15 days</span> of the purchase for a full refund. </li>
                  <li><span className="text-white font-bold">Technical Issues:</span> If you experience persistent technical failures that prevent you from using the service, and our support team is unable to resolve them within 5 business days, you may be eligible for a pro-rated refund.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">3. Processing Timeline</h2>
              <p className="text-white/70 leading-relaxed">
                Once a refund is approved by our billing department:
              </p>
              <ul className="list-disc list-inside text-white/70 mt-4 space-y-2">
                <li>The refund will be issued to the original payment method used during purchase.</li>
                <li>Processing usually takes <span className="text-white font-medium">5-10 business days</span>, depending on your financial institution.</li>
                <li>You will receive an email confirmation once the refund has been initiated from our side.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">4. Non-Refundable Items</h2>
              <p className="text-white/70">Certain cases are not eligible for refunds:</p>
              <ul className="list-disc list-inside text-white/70 mt-4 space-y-2">
                <li>Fees for custom one-time set-up or professional services.</li>
                <li>Accounts terminated due to violations of our <a href="/terms-conditions" className="text-orange-400 underline italic">Terms and Conditions</a>.</li>
                <li>Failure to cancel a subscription before the renewal date (outside the 7/15 day grace period).</li>
              </ul>
            </section>

            <section className="pt-8 border-t border-white/5">
              <p className="text-white/50 text-sm italic">
                For any questions regarding billing or to request a refund, please contact our support team at <span className="text-white font-bold">support@zeeoffer.com</span>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
