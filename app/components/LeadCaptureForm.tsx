"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Check, 
  FilePlus, 
  Loader2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface FormField {
  key: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

export default function LeadCaptureForm() {
  const params = useParams();
  const partnerSlug = params.partnerSlug as string;
  const personSlug = (params.personSlug as string) || undefined;

  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    fetch(`/api/public/form?partnerSlug=${partnerSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if(data.fields) {
          setFields(data.fields);
          const initialData: Record<string, string> = {};
          data.fields.forEach((f: FormField) => { initialData[f.key] = ''; });
          setFormData(initialData);
        } else {
          setError('Form configuration not found');
        }
      })
      .catch(() => setError('Failed to load form'))
      .finally(() => setLoading(false));
  }, [partnerSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerSlug,
          personSlug,
          formData,
          sourceUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Submission failed');
        return;
      }

      setToken(data.token);
      setSubmitted(true);

      if (data.redirectUrl) {
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 3000);
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative w-full max-w-md mx-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-green-500 mb-6 shadow-lg shadow-green-500/20">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Thank You!</h1>
            <p className="text-white/50 mb-4">Your information has been submitted successfully.</p>
            <div className="bg-[#1a1a1a] rounded-xl p-3 inline-block">
              <p className="text-white/30 text-xs">Token: <span className="text-orange-400 font-mono font-bold select-all">{token}</span></p>
            </div>
            <p className="text-white/30 text-xs mt-6 flex items-center justify-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Redirecting you shortly...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 mb-4 shadow-lg shadow-orange-500/20">
              <FilePlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Get Started</h1>
            <p className="text-white/40 mt-1">Fill in your details below</p>
          </div>

          {error && (
            <div className="bg-red-500/15 border border-red-500/20 rounded-lg p-3 text-red-300 text-sm text-center mb-6 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {field.label} {field.required && <span className="text-orange-400">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                )}
              </div>
            ))}

            {fields.length === 0 && !loading && (
              <p className="text-white/30 text-center py-4">No form fields configured yet.</p>
            )}

            <button
              type="submit"
              disabled={submitting || fields.length === 0}
              className="w-full py-3.5 px-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-white/15 text-center text-xs mt-4">Powered by Formile</p>
      </div>
    </div>
  );
}
