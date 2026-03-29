'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface Lead {
  _id: string;
  token: string;
  adminId?: { name: string; email: string };
  partnerId?: { name: string; slug: string };
  personId?: { name: string; slug: string };
  formData: Record<string, string>;
  submittedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function GlobalLeadsPage() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchLeads = (page = 1) => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);

    fetch(`/api/superadmin/leads?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setLeads(data.leads || []);
        setPagination(data.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeads(); }, [token]);

  const exportGlobal = async () => {
    const res = await fetch('/api/leads/download', { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `global-leads-${Date.now()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Global Leads Explorer</h1>
          <p className="text-white/30 mt-1 text-sm">{pagination.total.toLocaleString()} leads across all tenants</p>
        </div>
        <button
          onClick={exportGlobal}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/10 border border-orange-500/15 rounded-xl text-orange-400 text-sm font-medium hover:bg-orange-500/20 transition"
        >
          <Download className="w-4 h-4" /> Export All (XLSX)
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-white/30 text-xs font-medium">From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500/30 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-white/30 text-xs font-medium">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500/30 transition"
          />
        </div>
        <button
          onClick={() => fetchLeads()}
          className="px-5 py-2 bg-white/[0.05] border border-white/[0.06] rounded-xl text-white/60 text-sm font-medium hover:bg-white/[0.08] transition"
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : leads.length === 0 ? (
          <p className="text-white/20 text-center py-16 text-sm">No leads found for the selected filters</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                  <th className="text-left text-white/30 text-[11px] font-bold uppercase tracking-wider py-4 px-4">Token</th>
                  <th className="text-left text-white/30 text-[11px] font-bold uppercase tracking-wider py-4 px-4">Tenant</th>
                  <th className="text-left text-white/30 text-[11px] font-bold uppercase tracking-wider py-4 px-4">Partner</th>
                  <th className="text-left text-white/30 text-[11px] font-bold uppercase tracking-wider py-4 px-4">Person</th>
                  <th className="text-left text-white/30 text-[11px] font-bold uppercase tracking-wider py-4 px-4">Form Data</th>
                  <th className="text-left text-white/30 text-[11px] font-bold uppercase tracking-wider py-4 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4"><span className="text-orange-400/60 font-mono text-xs">{lead.token?.substring(0, 10)}...</span></td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-white/60 text-sm">{lead.adminId?.name || '—'}</span>
                        <span className="text-white/20 text-[10px]">{lead.adminId?.email || ''}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/50 text-sm">{lead.partnerId?.name || '—'}</td>
                    <td className="py-3 px-4 text-white/50 text-sm">{lead.personId?.name || '—'}</td>
                    <td className="py-3 px-4 text-white/30 text-xs max-w-[200px] truncate">
                      {Object.entries(lead.formData || {}).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-white/25 text-xs whitespace-nowrap">{new Date(lead.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/[0.04]">
            <span className="text-white/25 text-xs">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} leads total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchLeads(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/40 disabled:opacity-20 hover:bg-white/[0.06] transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchLeads(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/40 disabled:opacity-20 hover:bg-white/[0.06] transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
