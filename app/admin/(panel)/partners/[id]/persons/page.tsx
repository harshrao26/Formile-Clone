'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Trash2, 
  Copy, 
  Check, 
  ChevronLeft, 
  X,
  UserPlus
} from 'lucide-react';

interface Person {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function PersonsPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const partnerId = params.id as string;

  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [saving, setSaving] = useState(false);
  const [partnerSlug, setPartnerSlug] = useState('');
  const [copyMsg, setCopyMsg] = useState('');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchData = async () => {
    const [personsRes, partnerRes] = await Promise.all([
      fetch(`/api/partners/${partnerId}/persons`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`/api/partners/${partnerId}`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    setPersons(await personsRes.json());
    const partnerData = await partnerRes.json();
    setPartnerSlug(partnerData.slug || '');
    setLoading(false);
  };

  useEffect(() => { if (token && partnerId) fetchData(); }, [token, partnerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/partners/${partnerId}/persons`, {
      method: 'POST',
      headers,
      body: JSON.stringify(formData),
    });
    setFormData({ name: '', slug: '' });
    setShowForm(false);
    setSaving(false);
    fetchData();
  };

  const handleDelete = async (personId: string) => {
    if (!confirm('Are you sure you want to delete this person?')) return;
    await fetch(`/api/persons/${personId}`, {
      method: 'DELETE',
      headers,
    });
    fetchData();
  };

  const copyLink = (personSlug: string) => {
    const baseUrl = window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}/p/${partnerSlug}/${personSlug}`);
    setCopyMsg(personSlug);
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
        <div>
          <button 
            onClick={() => router.push('/admin/partners')} 
            className="text-foreground/50 hover:text-foreground text-sm mb-2 flex items-center gap-1 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Partners
          </button>
          <h1 className="text-3xl font-bold text-foreground">Persons</h1>
          <p className="text-foreground/50 mt-1">Under partner: <span className="text-orange-400 font-mono">/p/{partnerSlug}</span></p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setFormData({ name: '', slug: '' }); }}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition flex items-center gap-2"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Add Person
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Person Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            <input placeholder="Slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} className="px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            <button type="submit" disabled={saving} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {persons.length === 0 ? (
          <p className="text-foreground/40 text-center py-12">No persons under this partner yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-foreground/60 text-sm font-medium py-3 px-6">Name</th>
                <th className="text-left text-foreground/60 text-sm font-medium py-3 px-6">Link</th>
                <th className="text-left text-foreground/60 text-sm font-medium py-3 px-6">Created</th>
                <th className="text-right text-foreground/60 text-sm font-medium py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((p) => (
                <tr key={p._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 text-foreground font-medium">{p.name}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-mono text-sm">/p/{partnerSlug}/{p.slug}</span>
                      <button 
                        onClick={() => copyLink(p.slug)} 
                        className="p-1.5 text-orange-400/70 hover:text-orange-300 hover:bg-orange-500/10 rounded-md transition-colors"
                        title="Copy Public Link"
                      >
                        {copyMsg === p.slug ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-foreground/50 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleDelete(p._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
