'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useState } from 'react';
import {
  Brain,
  Loader2,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Activity,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface Report {
  platformSummary: string;
  growthOpportunities: Array<{ title: string; description: string; priority: string }>;
  anomalyAlerts: Array<{ title: string; description: string; severity: string }>;
  actionableDecisions: Array<{ decision: string; reasoning: string; impact: string }>;
  tenantInsights: string;
}

interface DataSnapshot {
  totalAdmins: number;
  totalLeads: number;
  leadsThisMonth: number;
  leadsLastMonth: number;
  growthRate: string;
  totalPartners: number;
  totalCompanies: number;
}

export default function AiInsightsPage() {
  const { token } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [snapshot, setSnapshot] = useState<DataSnapshot | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/superadmin/ai-insights', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Failed to generate report');
      } else {
        setReport(data.report);
        setSnapshot(data.dataSnapshot);
        setGeneratedAt(data.generatedAt);
      }
    } catch (err: any) {
      setError('Connection error: ' + (err.message || 'unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const priorityColors: Record<string, string> = {
    high: 'text-red-400 bg-red-500/10 border-red-500/15',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/15',
    low: 'text-green-400 bg-green-500/10 border-green-500/15',
    critical: 'text-red-400 bg-red-500/10 border-red-500/15',
    warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/15',
    info: 'text-blue-400 bg-blue-500/10 border-blue-500/15',
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Insights</h1>
          <p className="text-white/30 mt-1 text-sm">Powered by Gemini · Analyzes live platform data</p>
        </div>
        <button
          onClick={generateReport}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl text-white font-bold text-sm disabled:opacity-50 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> {report ? 'Regenerate Report' : 'Generate Intelligence Report'}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm">{error}</div>
      )}

      {/* Status: No report yet */}
      {!report && !loading && (
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-20 text-center">
          <Brain className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-white/30 mb-2">No intelligence report generated</h2>
          <p className="text-white/15 text-sm max-w-md mx-auto mb-8">
            Click the button above to analyze your platform data using Gemini AI. 
            The report will provide growth opportunities, anomaly alerts, and actionable decisions.
          </p>
        </div>
      )}

      {/* Report Generated */}
      {report && (
        <div className="space-y-6">
          {/* Data Snapshot */}
          {snapshot && (
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Data Snapshot Used</h3>
                {generatedAt && (
                  <span className="text-[10px] text-white/20">Generated {new Date(generatedAt).toLocaleString()}</span>
                )}
              </div>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                {[
                  { l: 'Tenants', v: snapshot.totalAdmins },
                  { l: 'Total Leads', v: snapshot.totalLeads },
                  { l: 'This Month', v: snapshot.leadsThisMonth },
                  { l: 'Last Month', v: snapshot.leadsLastMonth },
                  { l: 'Growth', v: `${snapshot.growthRate}%` },
                  { l: 'Partners', v: snapshot.totalPartners },
                  { l: 'Companies', v: snapshot.totalCompanies },
                ].map((s) => (
                  <div key={s.l} className="text-center p-3 bg-white/[0.02] rounded-xl">
                    <p className="text-white font-bold text-lg">{s.v}</p>
                    <p className="text-white/20 text-[10px]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Summary */}
          <div className="bg-gradient-to-r from-orange-500/5 to-transparent border border-orange-500/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Platform Summary</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">{report.platformSummary}</p>
          </div>

          {/* Growth Opportunities */}
          {report.growthOpportunities?.length > 0 && (
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Growth Opportunities</h3>
              </div>
              <div className="space-y-3">
                {report.growthOpportunities.map((g, i) => (
                  <div key={i} className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{g.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${priorityColors[g.priority] || 'text-white/30 bg-white/5'}`}>
                        {g.priority}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">{g.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anomaly Alerts */}
          {report.anomalyAlerts?.length > 0 && (
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Anomaly Alerts</h3>
              </div>
              <div className="space-y-3">
                {report.anomalyAlerts.map((a, i) => (
                  <div key={i} className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{a.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${priorityColors[a.severity] || 'text-white/30 bg-white/5'}`}>
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Decisions */}
          {report.actionableDecisions?.length > 0 && (
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Actionable Decisions</h3>
              </div>
              <div className="space-y-3">
                {report.actionableDecisions.map((d, i) => (
                  <div key={i} className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{d.decision}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${priorityColors[d.impact] || 'text-white/30 bg-white/5'}`}>
                        {d.impact} impact
                      </span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">{d.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tenant Insights */}
          {report.tenantInsights && (
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Tenant Behavior Insights</h3>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{report.tenantInsights}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
