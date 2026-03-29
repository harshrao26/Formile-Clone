'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Inbox,
  Users,
  Building2,
  UserCircle,
  Download,
  Lock,
} from 'lucide-react';

type Tab = 'leads' | 'partners' | 'companies' | 'persons';

interface TenantData {
  admin: { name: string; email: string; createdAt: string };
  stats: { leadCount: number; partnerCount: number; companyCount: number; personCount: number };
  leads: Array<{
    _id: string;
    token: string;
    partnerId?: { name: string };
    personId?: { name: string };
    formData: Record<string, string>;
    submittedAt: string;
  }>;
  partners: Array<{ _id: string; name: string; slug: string; leadCount: number; createdAt: string }>;
  companies: Array<{ _id: string; name: string; createdAt: string }>;
  persons: Array<{ _id: string; name: string; slug: string; createdAt: string }>;
}

export default function TenantDetailPage() {
  const { token } = useAuth();
  const params = useParams();
  const adminId = params.adminId as string;
  const [data, setData] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('leads');

  useEffect(() => {
    if (!token || !adminId) return;
    fetch(`/api/superadmin/tenants/${adminId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [token, adminId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data?.admin) {
    return <p className="text-white/30 text-center py-16">Tenant not found</p>;
  }

  const tabs: { key: Tab; label: string; icon: typeof Inbox; count: number }[] = [
    { key: 'leads', label: 'Leads', icon: Inbox, count: data.stats.leadCount },
    { key: 'partners', label: 'Partners', icon: Users, count: data.stats.partnerCount },
    { key: 'companies', label: 'Companies', icon: Building2, count: data.stats.companyCount },
    { key: 'persons', label: 'Persons', icon: UserCircle, count: data.stats.personCount },
  ];

  return (
    <div className="space-y-8">
      {/* Back + Header */}
      <div>
        <Link href="/admin/superadmin/tenants" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-sm mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Tenants
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{data.admin.name}</h1>
            <p className="text-white/30 mt-1 text-sm">{data.admin.email} · Joined {new Date(data.admin.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/15 rounded-full">
            <Lock className="w-3 h-3 text-yellow-400" />
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Read-Only View</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div key={tab.key} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 text-center">
              <Icon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{tab.count}</p>
              <p className="text-white/25 text-xs">{tab.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.02] p-1 rounded-2xl border border-white/[0.04] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/15'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6">
        {activeTab === 'leads' && (
          <>
            {data.leads.length === 0 ? (
              <p className="text-white/20 text-center py-8 text-sm">No leads captured by this tenant</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="text-left text-white/30 text-[11px] font-bold uppercase py-3 px-4">Token</th>
                      <th className="text-left text-white/30 text-[11px] font-bold uppercase py-3 px-4">Partner</th>
                      <th className="text-left text-white/30 text-[11px] font-bold uppercase py-3 px-4">Person</th>
                      <th className="text-left text-white/30 text-[11px] font-bold uppercase py-3 px-4">Data</th>
                      <th className="text-left text-white/30 text-[11px] font-bold uppercase py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.leads.map((lead) => (
                      <tr key={lead._id} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                        <td className="py-3 px-4"><span className="text-orange-400/60 font-mono text-xs">{lead.token?.substring(0, 12)}...</span></td>
                        <td className="py-3 px-4 text-white/50 text-sm">{lead.partnerId?.name || '—'}</td>
                        <td className="py-3 px-4 text-white/50 text-sm">{lead.personId?.name || '—'}</td>
                        <td className="py-3 px-4 text-white/30 text-xs max-w-[200px] truncate">
                          {Object.entries(lead.formData || {}).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </td>
                        <td className="py-3 px-4 text-white/20 text-xs">{new Date(lead.submittedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'partners' && (
          <div className="space-y-2">
            {data.partners.length === 0 ? (
              <p className="text-white/20 text-center py-8 text-sm">No partners created</p>
            ) : (
              data.partners.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] transition">
                  <div>
                    <p className="text-white text-sm font-medium">{p.name}</p>
                    <p className="text-white/25 text-xs">/{p.slug}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-bold text-sm">{p.leadCount}</p>
                    <p className="text-white/20 text-[10px]">leads</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="space-y-2">
            {data.companies.length === 0 ? (
              <p className="text-white/20 text-center py-8 text-sm">No companies created</p>
            ) : (
              data.companies.map((c) => (
                <div key={c._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] transition">
                  <p className="text-white text-sm font-medium">{c.name}</p>
                  <p className="text-white/25 text-xs">{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'persons' && (
          <div className="space-y-2">
            {data.persons.length === 0 ? (
              <p className="text-white/20 text-center py-8 text-sm">No persons created</p>
            ) : (
              data.persons.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] transition">
                  <div>
                    <p className="text-white text-sm font-medium">{p.name}</p>
                    <p className="text-white/25 text-xs">/{p.slug}</p>
                  </div>
                  <p className="text-white/25 text-xs">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
