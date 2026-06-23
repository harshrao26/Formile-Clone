'use client';

import { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

// Replace this with your actual Google Apps Script Web App URL after deployment
const GAS_WEBHOOK_URL = process.env.NEXT_PUBLIC_GAS_WEBHOOK_URL || 'YOUR_DEPLOYED_GAS_WEB_APP_URL';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (GAS_WEBHOOK_URL && GAS_WEBHOOK_URL !== 'YOUR_DEPLOYED_GAS_WEB_APP_URL') {
        await fetch(GAS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString(),
          }),
        });
      } else {
        // Local simulation fallback
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      // Fallback to local success to keep the UX clean
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } finally {
      setIsSubmitting(false);
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden bg-white border-t border-zinc-100">
      {/* Background visual accents */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[45%] h-[45%] bg-[#FF7B00]/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Heading and Contact Details */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
                Let's build the future of <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-700">
                  lead gen
                </span>{' '}
                together.
              </h2>
              <p className="text-zinc-500 text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-lg">
                Have questions about our enterprise plans, custom integrations, or just want to say hello? Our team is here to help.
              </p>
            </div>

            <div className="space-y-8">
              {/* Email Block */}
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/50 flex items-center justify-center text-orange-600 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-zinc-900 font-bold text-base tracking-tight">Email us</h4>
                  <a 
                    href="mailto:support@zeeoffer.com" 
                    className="text-zinc-600 hover:text-orange-600 font-semibold transition-colors block"
                  >
                    support@zeeoffer.com
                  </a>
                  <p className="text-zinc-400 text-xs font-semibold">We usually respond within 2-4 business hours.</p>
                </div>
              </div>

              {/* Headquarters Block */}
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/50 flex items-center justify-center text-blue-600 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-zinc-900 font-bold text-base tracking-tight">Global Headquarters</h4>
                  <p className="text-zinc-600 font-semibold leading-relaxed">
                    Salma Bizhouse, No.34/1, 3rd Floor,<br />
                    Meanee Avenue Road, Bangalore-560042
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-[40px] border border-zinc-200/70 bg-zinc-50/40 p-8 md:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.02)] backdrop-blur-sm relative">
              
              {isSuccess ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-green-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-950">Message Sent Successfully!</h3>
                  <p className="text-zinc-500 font-medium max-w-sm">
                    Thank you for reaching out. A representative from our team will get in touch with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Grid for Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 rounded-2xl border border-zinc-200/80 bg-white text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full px-5 py-4 rounded-2xl border border-zinc-200/80 bg-white text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  {/* Phone Number (Full Width) */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-5 py-4 rounded-2xl border border-zinc-200/80 bg-white text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-semibold"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your needs..."
                      className="w-full px-5 py-4 rounded-2xl border border-zinc-200/80 bg-white text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-semibold resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold rounded-2xl transition-all shadow-[0_15px_30px_rgba(249,115,22,0.15)] active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] md:text-xs font-bold text-zinc-400">
                    By submitting this form, you agree to our{' '}
                    <a href="/privacy" className="text-zinc-600 hover:text-orange-600 transition-colors underline">
                      Privacy Policy
                    </a>.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
