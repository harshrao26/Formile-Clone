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
  Download
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

export default function DashboardPage() {
  const { token, admin } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<(RecentLead & { adminId?: { name: string; email: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  const isSuperadmin = admin?.role === 'superadmin';

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
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
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 mt-1">
            {isSuperadmin 
              ? 'Platform-wide overview and global statistics' 
              : 'Overview of your lead generation performance'}
          </p>
        </div>
        {isSuperadmin && (
          <div className="px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="text-orange-500 text-xs font-bold tracking-wider uppercase">Superadmin View</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition group">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 text-white group-hover:text-orange-400 transition-colors`} />
                <div className={`w-8 h-8 rounded-lg ${card.color} opacity-20`} />
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-white/40 text-sm mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Leads</h2>
          <button 
            onClick={exportLeads}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-medium text-white/70 hover:text-white transition"
          >
            <Download className="w-4 h-4" />
            {isSuperadmin ? 'Export Global Data' : 'Export All Leads'}
          </button>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-white/30 text-center py-8">No leads yet. Share your partner links to start capturing leads!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-white/50 text-sm font-medium py-3 px-4">Token</th>
                  {isSuperadmin && <th className="text-left text-white/50 text-sm font-medium py-3 px-4">Admin (Owner)</th>}
                  <th className="text-left text-white/50 text-sm font-medium py-3 px-4">Partner</th>
                  <th className="text-left text-white/50 text-sm font-medium py-3 px-4">Person</th>
                  <th className="text-left text-white/50 text-sm font-medium py-3 px-4">Data</th>
                  <th className="text-left text-white/50 text-sm font-medium py-3 px-4">Time</th>
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
                          <span className="text-white/80 text-sm">{lead.adminId?.name || 'Unknown'}</span>
                          <span className="text-white/30 text-[10px]">{lead.adminId?.email || '-'}</span>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-4 text-white/70 text-sm">{lead.partnerId?.name || '-'}</td>
                    <td className="py-3 px-4 text-white/70 text-sm">{lead.personId?.name || '-'}</td>
                    <td className="py-3 px-4 text-white/50 text-xs text-ellipsis overflow-hidden max-w-[200px] whitespace-nowrap">
                      {Object.entries(lead.formData || {}).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-white/40 text-xs">{new Date(lead.submittedAt).toLocaleString()}</td>
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
