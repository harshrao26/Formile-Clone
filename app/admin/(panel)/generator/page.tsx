'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useState, useEffect } from 'react';
import { 
  Zap, 
  Link as LinkIcon, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCcw, 
  AlertCircle,
  TrendingUp,
  Save,
  Loader2
} from 'lucide-react';

interface Partner {
  _id: string;
  name: string;
  slug: string;
  views: number;
}

export default function GeneratorPage() {
  const { token, admin } = useAuth();
  const [sourceLink, setSourceLink] = useState('');
  const [slug, setSlug] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [isExternal, setIsExternal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<{
    initialHits: number;
    currentHits: number;
    checked: boolean;
    checking: boolean;
  }>({
    initialHits: 0,
    currentHits: 0,
    checked: false,
    checking: false
  });

  useEffect(() => {
    if (token) {
      fetchPartners();
    }
  }, [token]);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/partners', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPartners(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPartners(false);
    }
  };

  useEffect(() => {
    if (!sourceLink) {
      setIsExternal(false);
      return;
    }
    
    try {
      const url = new URL(sourceLink);
      const isInternal = url.hostname === window.location.hostname || url.searchParams.has('f');
      setIsExternal(!isInternal);
    } catch (e) {
      // If not a valid URL, check if it has ?f=
      setIsExternal(!sourceLink.includes('f='));
    }
  }, [sourceLink]);

  const handleGenerate = async () => {
    if (!sourceLink || !slug) return;

    // Check if partner already exists
    const existingPartner = partners.find(p => p.slug === slug);
    
    if (isExternal) {
      // For external links, we MUST save/update the partner to store the redirectUrl
      setIsSaving(true);
      try {
        const res = await fetch('/api/partners', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            name: `Generator: ${slug}`,
            slug: slug,
            redirectUrl: sourceLink,
            companyName: 'External Tracker', // fallback
            formId: null
          })
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.error !== 'Slug already exists') {
            alert(data.error || 'Failed to save partner');
            setIsSaving(false);
            return;
          }
          // If slug exists, we should ideally update it, but for now we'll assume it's correct
        }
        
        // Refresh partners list to get latest hit count
        await fetchPartners();
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }

    const baseUrl = window.location.origin;
    let newUrl = '';
    
    if (isExternal) {
      // Redirection link doesn't need ?f=
      newUrl = `${baseUrl}/p/${slug}`;
    } else {
      const urlParams = new URLSearchParams(sourceLink.split('?')[1] || '');
      const formId = urlParams.get('f');
      newUrl = `${baseUrl}/p/${slug}?f=${formId || ''}&aff_sub1=${slug}`;
    }

    setGeneratedLink(newUrl);
    
    // Reset tracking status for new link
    const partner = partners.find(p => p.slug === slug);
    setTrackingStatus({
      initialHits: partner?.views || 0,
      currentHits: partner?.views || 0,
      checked: false,
      checking: false
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const checkTracking = async () => {
    if (!slug) return;
    setTrackingStatus(prev => ({ ...prev, checking: true }));
    
    try {
      const res = await fetch('/api/partners', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const allPartners: Partner[] = await res.json();
        const partner = allPartners.find(p => p.slug === slug);
        if (partner) {
          setTrackingStatus(prev => ({
            ...prev,
            currentHits: partner.views,
            checked: true,
            checking: false
          }));
        }
      }
    } catch (err) {
      console.error(err);
      setTrackingStatus(prev => ({ ...prev, checking: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Zap className="w-8 h-8 text-orange-500 fill-orange-500/20" />
          Link Generator & Tester
        </h1>
        <p className="text-foreground/50 mt-2">
          Transform generic form links or external URLs into trackable partner links.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Step 1: Input */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-orange-500 font-bold uppercase text-[10px] tracking-widest">
            <span className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">1</span>
            Configure Source
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Company Link / Offer URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input 
                  value={sourceLink}
                  onChange={(e) => setSourceLink(e.target.value)}
                  placeholder="Paste internal form link OR external URL (Huntlead, etc.)"
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                />
              </div>
              {isExternal && sourceLink && (
                <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  <p className="text-xs text-blue-500 font-medium">
                    External link detected. System will track the click and then redirect the visitor.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Partner Slug (for tracking)</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="e.g. facebook-ads, test-partner"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all font-mono"
                  />
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={!sourceLink || !slug || isSaving}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none whitespace-nowrap flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isExternal ? 'Save & Generate' : 'Generate Link'}
                </button>
              </div>
              <p className="text-[10px] text-foreground/40 mt-1.5 px-1">
                This slug will replace <code className="text-orange-500">{'{aff_sub1}'}</code> or <code className="text-orange-500">{'{replace_it}'}</code> in external URLs.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Result */}
        {generatedLink && (
          <div className="bg-card border border-orange-500/20 rounded-2xl p-6 shadow-xl border-t-2 border-t-orange-500">
            <div className="flex items-center gap-2 mb-6 text-orange-500 font-bold uppercase text-[10px] tracking-widest">
              <span className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">2</span>
              Generated Tracking Link
            </div>

            <div className="bg-background/50 border border-border p-4 rounded-xl mb-6 font-mono text-sm break-all">
              {generatedLink}
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-border rounded-xl font-medium hover:bg-white/10 transition"
              >
                {isCopied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-foreground/50" />}
                {isCopied ? 'Copied!' : 'Copy Link'}
              </button>
              <a 
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
              >
                <ExternalLink className="w-5 h-5" />
                Open & Test
              </a>
            </div>
          </div>
        )}

        {/* Step 3: Test Check */}
        {generatedLink && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden relative">
            <div className="flex items-center gap-2 mb-6 text-orange-500 font-bold uppercase text-[10px] tracking-widest">
              <span className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">3</span>
              Live Tracking Verification
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-background rounded-xl border border-border">
                <div className="text-[10px] uppercase tracking-tighter text-foreground/40 font-bold mb-1">Initial Hits</div>
                <div className="text-2xl font-bold text-foreground">{trackingStatus.initialHits}</div>
              </div>
              <div className={`p-4 bg-background rounded-xl border ${trackingStatus.currentHits > trackingStatus.initialHits ? 'border-green-500/50 bg-green-500/5' : 'border-border'}`}>
                <div className="text-[10px] uppercase tracking-tighter text-foreground/40 font-bold mb-1">Current Hits</div>
                <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                  {trackingStatus.currentHits}
                  {trackingStatus.currentHits > trackingStatus.initialHits && (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={checkTracking}
              disabled={trackingStatus.checking}
              className="w-full py-4 bg-foreground/5 border border-border rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-foreground/10 transition disabled:opacity-50"
            >
              <RefreshCcw className={`w-5 h-5 ${trackingStatus.checking ? 'animate-spin' : ''}`} />
              {trackingStatus.checking ? 'Checking Database...' : 'Verify Tracking Hit'}
            </button>

            {trackingStatus.checked && (
              <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${trackingStatus.currentHits > trackingStatus.initialHits ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                {trackingStatus.currentHits > trackingStatus.initialHits ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-semibold">Success! The hit was recorded correctly. Tracking is active.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-semibold">No new hit detected yet. Make sure you opened the link and it loaded successfully.</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-12 bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <Zap className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Pro Tip: Redirection Macros</h3>
          <p className="text-sm text-foreground/60 mt-1 leading-relaxed">
            For external URLs, use <code className="bg-background px-1.5 py-0.5 rounded border">{'{aff_sub1}'}</code> in the link. Our system will automatically swap it with the partner's slug when they hit the redirect page.
          </p>
        </div>
      </div>
    </div>
  );
}
