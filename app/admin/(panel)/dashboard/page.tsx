'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { 
  Inbox, 
  Users, 
  Building2, 
  UserCircle, 
  FileText,
  ArrowUpRight,
  Download,
  CheckCircle2
} from 'lucide-react';

interface Stats {
  totalLeads: number;
  totalPartners: number;
  totalCompanies: number;
  totalPersons: number;
  totalFields: number;
}

interface RecentLead {
  _id: string;
  token: string;
  partnerId: { name: string; slug: string } | null;
  personId: { name: string; slug: string } | null;
  formData: Record<string, string>;
  submittedAt: string;
}

interface Subscription {
  plan: string;
  status: string;
  expiryDate?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { token, admin } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [recentLeads, setRecentLeads] = useState<(RecentLead & { adminId?: { name: string; email: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  const isSuperadmin = admin?.role === 'superadmin';

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setSubscription(data.subscription);
        setRecentLeads(data.recentLeads || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const exportLeads = async () => {
    const res = await fetch('/api/leads/download', { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `leads-${isSuperadmin ? 'global' : 'tenant'}-${Date.now()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Inbox, color: 'bg-orange-500' },
    { label: 'Partners', value: stats?.totalPartners || 0, icon: Users, color: 'bg-orange-600' },
    { label: 'Companies', value: stats?.totalCompanies || 0, icon: Building2, color: 'bg-amber-600' },
    { label: 'Persons', value: stats?.totalPersons || 0, icon: UserCircle, color: 'bg-orange-700' },
    { label: 'Form Fields', value: stats?.totalFields || 0, icon: FileText, color: 'bg-amber-500' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-foreground/50 mt-1">
            {isSuperadmin 
              ? 'Platform-wide overview and global statistics' 
              : 'Overview of your lead generation performance'}
          </p>
        </div>
        {isSuperadmin ? (
          <div className="px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="text-orange-500 text-xs font-bold tracking-wider uppercase">Superadmin View</span>
          </div>
        ) : subscription && (
          <div className={`px-4 py-2 rounded-2xl border flex items-center gap-4 ${
            subscription.status === 'active' 
              ? 'bg-green-500/5 border-green-500/10' 
              : 'bg-red-500/5 border-red-500/10'
          }`}>
            <div className="flex flex-col items-end">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                subscription.status === 'active' ? 'text-green-400' : 'text-red-400'
              }`}>
                {subscription.plan} Plan · {subscription.status}
              </span>
              <span className="text-foreground/40 text-[11px]">
                {subscription.expiryDate 
                  ? `Valid until ${new Date(subscription.expiryDate).toLocaleDateString()}`
                  : `Started ${new Date(subscription.createdAt).toLocaleDateString()}`}
              </span>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              subscription.status === 'active' ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
               <CheckCircle2 className={`w-5 h-5 ${subscription.status === 'active' ? 'text-green-400' : 'text-red-400'}`} />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-card border border-border rounded-2xl p-5 hover:border-border transition group">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 text-foreground group-hover:text-orange-400 transition-colors`} />
                <div className={`w-8 h-8 rounded-lg ${card.color} opacity-20`} />
              </div>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
              <p className="text-foreground/50 text-sm mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Leads</h2>
          <button 
            onClick={exportLeads}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-border hover:bg-white/10 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground transition"
          >
            <Download className="w-4 h-4" />
            {isSuperadmin ? 'Export Global Data' : 'Export All Leads'}
          </button>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-foreground/40 text-center py-8">No leads yet. Share your partner links to start capturing leads!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-foreground/60 text-sm font-medium py-3 px-4">Token</th>
                  {isSuperadmin && <th className="text-left text-foreground/60 text-sm font-medium py-3 px-4">Admin (Owner)</th>}
                  <th className="text-left text-foreground/60 text-sm font-medium py-3 px-4">Partner</th>
                  <th className="text-left text-foreground/60 text-sm font-medium py-3 px-4">Person</th>
                  <th className="text-left text-foreground/60 text-sm font-medium py-3 px-4">Data</th>
                  <th className="text-left text-foreground/60 text-sm font-medium py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4">
                      <span className="text-orange-400 font-mono text-xs">{lead.token.substring(0, 12)}...</span>
                    </td>
                    {isSuperadmin && (
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-foreground/80 text-sm">{lead.adminId?.name || 'Unknown'}</span>
                          <span className="text-foreground/40 text-[10px]">{lead.adminId?.email || '-'}</span>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-4 text-foreground/70 text-sm">{lead.partnerId?.name || '-'}</td>
                    <td className="py-3 px-4 text-foreground/70 text-sm">{lead.personId?.name || '-'}</td>
                    <td className="py-3 px-4 text-foreground/60 text-xs text-ellipsis overflow-hidden max-w-[200px] whitespace-nowrap">
                      {Object.entries(lead.formData || {}).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-foreground/50 text-xs">{new Date(lead.submittedAt).toLocaleString()}</td>
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
