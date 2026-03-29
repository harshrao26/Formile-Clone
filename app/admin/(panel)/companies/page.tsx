'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  X,
  PlusCircle,
  Download
} from 'lucide-react';

interface Company {
  _id: string;
  name: string;
  originalUrl: string;
  createdAt: string;
}

export default function CompaniesPage() {
  const { token } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', originalUrl: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchData = async () => {
    const res = await fetch('/api/companies', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setCompanies(data);
    setLoading(false);
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editId ? `/api/companies/${editId}` : '/api/companies';
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(formData) });
    setFormData({ name: '', originalUrl: '' });
    setEditId(null);
    setShowForm(false);
    setSaving(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/companies/${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  const handleEdit = (company: Company) => {
    setFormData({ name: company.name, originalUrl: company.originalUrl });
    setEditId(company._id);
    setShowForm(true);
  };

  const exportCompanyLeads = async (companyId: string, companyName: string) => {
    const res = await fetch(`/api/leads/download?companyId=${companyId}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `leads-${companyName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.xlsx`;
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Companies</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setFormData({ name: '', originalUrl: '' }); }}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition flex items-center gap-2"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Add Company
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editId ? 'Edit' : 'Add'} Company</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Company Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              placeholder="Original URL (https://...)"
              value={formData.originalUrl}
              onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
              className="px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
        {companies.length === 0 ? (
          <p className="text-white/30 text-center py-12">No companies yet. Add one to get started!</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Name</th>
                <th className="text-left text-white/50 text-sm font-medium py-3 px-6">URL</th>
                <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Created</th>
                <th className="text-right text-white/50 text-sm font-medium py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 text-white font-medium">{company.name}</td>
                  <td className="py-4 px-6">
                    <a href={company.originalUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 text-sm">
                      {company.originalUrl}
                    </a>
                  </td>
                  <td className="py-4 px-6 text-white/40 text-sm">{new Date(company.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => exportCompanyLeads(company._id, company.name)} 
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Download Company Leads"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(company)} 
                        className="p-2 text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(company._id)} 
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
