'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Lead {
  _id: string;
  token: string;
  partnerId: { name: string; slug: string } | null;
  personId: { name: string; slug: string } | null;
  formData: Record<string, string>;
  sourceUrl: string;
  ipAddress: string;
  submittedAt: string;
}

interface Partner {
  _id: string;
  name: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function LeadsPage() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [filterPartner, setFilterPartner] = useState('');
  const [downloading, setDownloading] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchLeads = async (page = 1) => {
    let url = `/api/leads?page=${page}&limit=20`;
    if (filterPartner) url += `&partnerId=${filterPartner}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setLeads(data.leads);
    setPagination(data.pagination);
    setLoading(false);
  };

  const fetchPartners = async () => {
    const res = await fetch('/api/partners', { headers: { Authorization: `Bearer ${token}` } });
    setPartners(await res.json());
  };

  useEffect(() => {
    if (token) {
      fetchPartners();
      fetchLeads();
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchLeads(1);
  }, [filterPartner]);

  const handleDownload = async (format: string) => {
    setDownloading(true);
    let url = `/api/leads/download?format=${format}`;
    if (filterPartner) url += `&partnerId=${filterPartner}`;
    
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `leads-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Leads</h1>
          <p className="text-white/40 mt-1">{pagination.total} total captures</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownload('xlsx')}
            disabled={downloading}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {downloading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            Download Excel
          </button>
          <button
            onClick={() => handleDownload('csv')}
            disabled={downloading}
            className="px-4 py-2 bg-[#1a1a1a] text-white/70 border border-white/[0.06] rounded-xl text-sm font-medium hover:bg-[#222] transition disabled:opacity-50 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Download CSV
          </button>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-white/40" />
          <label className="text-white/50 text-sm">Filter by Partner:</label>
          <select
            value={filterPartner}
            onChange={(e) => setFilterPartner(e.target.value)}
            className="px-4 py-2 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="" className="bg-[#1a1a1a]">All Partners</option>
            {partners.map((p) => (
              <option key={p._id} value={p._id} className="bg-[#1a1a1a]">{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
        {leads.length === 0 ? (
          <p className="text-white/30 text-center py-12">No leads captured yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Token</th>
                    <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Partner</th>
                    <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Person</th>
                    <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Form Data</th>
                    <th className="text-left text-white/50 text-sm font-medium py-3 px-6">IP</th>
                    <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                      <td className="py-4 px-6">
                        <span className="text-orange-400 font-mono text-xs">{lead.token.substring(0, 12)}...</span>
                      </td>
                      <td className="py-4 px-6 text-white/70 text-sm">{lead.partnerId?.name || '-'}</td>
                      <td className="py-4 px-6 text-white/70 text-sm">{lead.personId?.name || '-'}</td>
                      <td className="py-4 px-6 text-white/50 text-xs max-w-xs">
                        <div className="space-y-1">
                          {Object.entries(lead.formData || {}).map(([k, v]) => (
                            <div key={k}><span className="text-white/30">{k}:</span> {v}</div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white/40 text-xs font-mono">{lead.ipAddress}</td>
                      <td className="py-4 px-6 text-white/40 text-xs">{new Date(lead.submittedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-white/[0.06]">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchLeads(page)}
                    className={`w-8 h-8 rounded-lg text-sm transition ${
                      page === pagination.page
                        ? 'bg-orange-500 text-white'
                        : 'text-white/40 hover:bg-white/[0.05]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
