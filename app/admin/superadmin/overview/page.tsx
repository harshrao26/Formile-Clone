'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import {
  Users,
  Inbox,
  Building2,
  UserCircle,
  FileText,
  TrendingUp,
  Activity,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface Stats {
  totalAdmins: number;
  activeTenants: number;
  totalLeads: number;
  leadsToday: number;
  leadsThisMonth: number;
  totalPartners: number;
  totalCompanies: number;
  totalPersons: number;
  totalForms: number;
  totalFields: number;
}

interface ChartItem {
  month: string;
  leads: number;
}

interface TopTenant {
  _id: string;
  name: string;
  email: string;
  leadCount: number;
}

interface RecentLead {
  _id: string;
  token: string;
  adminId?: { name: string; email: string };
  partnerId?: { name: string; slug: string };
  personId?: { name: string; slug: string };
  formData: Record<string, string>;
  submittedAt: string;
}

export default function SuperadminOverview() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [topTenants, setTopTenants] = useState<TopTenant[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/superadmin/overview', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setChartData(data.chartData || []);
        setTopTenants(data.topTenants || []);
        setRecentLeads(data.recentLeads || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const kpiCards = [
    { label: 'Total Tenants', value: stats?.totalAdmins || 0, icon: Users, accent: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active Tenants', value: stats?.activeTenants || 0, icon: Activity, accent: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Inbox, accent: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Leads Today', value: stats?.leadsToday || 0, icon: Calendar, accent: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'This Month', value: stats?.leadsThisMonth || 0, icon: TrendingUp, accent: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Partners', value: stats?.totalPartners || 0, icon: UserCircle, accent: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Companies', value: stats?.totalCompanies || 0, icon: Building2, accent: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Forms', value: stats?.totalForms || 0, icon: FileText, accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const maxChartValue = Math.max(...chartData.map((d) => d.leads), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Platform Overview</h1>
        <p className="text-foreground/40 mt-1 text-sm">Global statistics across all tenants</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white/[0.02] border border-border rounded-2xl p-5 hover:border-white/[0.08] transition group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.accent}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground tracking-tight">{card.value.toLocaleString()}</p>
              <p className="text-foreground/40 text-xs mt-1 font-medium">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Chart */}
        <div className="bg-white/[0.02] border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-foreground">Leads Over Time</h2>
          </div>
          <div className="flex items-end gap-3 h-48">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-foreground/50 font-bold">{d.leads}</span>
                <div
                  className="w-full bg-gradient-to-t from-orange-500/30 to-orange-500 rounded-t-lg transition-all duration-1000 min-h-[4px]"
                  style={{ height: `${Math.max((d.leads / maxChartValue) * 100, 3)}%` }}
                />
                <span className="text-[10px] text-foreground/40 font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tenants */}
        <div className="bg-white/[0.02] border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-foreground">Top Tenants</h2>
          </div>
          {topTenants.length === 0 ? (
            <p className="text-foreground/30 text-center py-8 text-sm">No tenant data yet</p>
          ) : (
            <div className="space-y-3">
              {topTenants.map((t, i) => (
                <div key={t._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-orange-500 text-white' : 'bg-white/5 text-foreground/60'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">{t.name}</p>
                    <p className="text-foreground/25 text-[11px] truncate">{t.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-bold text-sm">{t.leadCount}</p>
                    <p className="text-foreground/30 text-[10px]">leads</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Lead Feed */}
      <div className="bg-white/[0.02] border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <h2 className="text-lg font-semibold text-foreground">Live Feed — Recent Leads</h2>
          <span className="text-foreground/30 text-xs ml-auto">Last 20 across all tenants</span>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-foreground/30 text-center py-8 text-sm">No leads captured yet across the platform</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-foreground/40 text-[11px] font-bold uppercase tracking-wider py-3 px-4">Token</th>
                  <th className="text-left text-foreground/40 text-[11px] font-bold uppercase tracking-wider py-3 px-4">Tenant</th>
                  <th className="text-left text-foreground/40 text-[11px] font-bold uppercase tracking-wider py-3 px-4">Partner</th>
                  <th className="text-left text-foreground/40 text-[11px] font-bold uppercase tracking-wider py-3 px-4">Data</th>
                  <th className="text-left text-foreground/40 text-[11px] font-bold uppercase tracking-wider py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4">
                      <span className="text-orange-400/70 font-mono text-xs">{lead.token?.substring(0, 10)}...</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-foreground/60 text-sm">{lead.adminId?.name || '—'}</span>
                        <span className="text-foreground/30 text-[10px]">{lead.adminId?.email || ''}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground/60 text-sm">{lead.partnerId?.name || '—'}</td>
                    <td className="py-3 px-4 text-foreground/40 text-xs max-w-[200px] truncate">
                      {Object.entries(lead.formData || {}).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-foreground/25 text-xs">{new Date(lead.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
