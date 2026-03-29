'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Copy, 
  Check, 
  Users, 
  X,
  ExternalLink
} from 'lucide-react';

interface Partner {
  _id: string;
  name: string;
  email: string;
  slug: string;
  companyId: { _id: string; name: string } | null;
  formId?: { _id: string; name: string } | null;
  createdAt: string;
}

interface Company {
  _id: string;
  name: string;
}

export default function PartnersPage() {
  const { token } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [forms, setForms] = useState<{ _id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', slug: '', companyId: '', formId: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchData = async () => {
    const [partnersRes, companiesRes, formsRes] = await Promise.all([
      fetch('/api/partners', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/companies', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/forms', { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    setPartners(await partnersRes.json());
    setCompanies(await companiesRes.json());
    setForms(await formsRes.json());
    setLoading(false);
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editId ? `/api/partners/${editId}` : '/api/partners';
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(formData) });
    setFormData({ name: '', email: '', slug: '', companyId: '', formId: '' });
    setEditId(null);
    setShowForm(false);
    setSaving(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/partners/${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  const handleEdit = (p: Partner) => {
    setFormData({
      name: p.name,
      email: p.email,
      slug: p.slug,
      companyId: (p.companyId as { _id: string })?._id || '',
      formId: (p as any).formId?._id || (p as any).formId || '',
    });
    setEditId(p._id);
    setShowForm(true);
  };

  const copyLink = (slug: string) => {
    const baseUrl = window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}/p/${slug}`);
    setCopyMsg(slug);
    setTimeout(() => setCopyMsg(''), 2000);
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
        <h1 className="text-3xl font-bold text-white">Partners</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setFormData({ name: '', email: '', slug: '', companyId: '', formId: '' }); }}
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
              Add Partner
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editId ? 'Edit' : 'Add'} Partner</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            <input placeholder="Slug (URL identifier)" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} className="px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            
            <select value={formData.companyId} onChange={(e) => setFormData({ ...formData, companyId: e.target.value })} className="px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500" required>
              <option value="" className="bg-[#1a1a1a]">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id} className="bg-[#1a1a1a]">{c.name}</option>
              ))}
            </select>

            <select value={formData.formId} onChange={(e) => setFormData({ ...formData, formId: e.target.value })} className="px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500" required>
              <option value="" className="bg-[#1a1a1a]">Select Form Template</option>
              {forms.map((f) => (
                <option key={f._id} value={f._id} className="bg-[#1a1a1a]">{f.name}</option>
              ))}
            </select>

            <button type="submit" disabled={saving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50">
              {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
        {partners.length === 0 ? (
          <p className="text-white/30 text-center py-12">No partners yet. Add one to get started!</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Name</th>
                <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Email</th>
                <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Slug / Link</th>
                <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Company</th>
                <th className="text-left text-white/50 text-sm font-medium py-3 px-6">Form</th>
                <th className="text-right text-white/50 text-sm font-medium py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 text-white font-medium">{p.name}</td>
                  <td className="py-4 px-6 text-white/60 text-sm">{p.email}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-mono text-sm">/p/{p.slug}</span>
                      <button 
                        onClick={() => copyLink(p.slug)} 
                        className="p-1.5 text-orange-400/70 hover:text-orange-300 hover:bg-orange-500/10 rounded-md transition-colors"
                        title="Copy Public Link"
                      >
                        {copyMsg === p.slug ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white/40 text-sm">{p.companyId?.name || '-'}</td>
                  <td className="py-4 px-6">
                    {p.formId ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-white/70 text-xs border border-white/10">
                        {p.formId.name}
                      </span>
                    ) : (
                      <span className="text-white/20 text-sm">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/partners/${p._id}/persons`} 
                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Manage Persons"
                      >
                        <Users className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleEdit(p)} 
                        className="p-2 text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)} 
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
