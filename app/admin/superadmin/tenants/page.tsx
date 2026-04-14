'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Download, Search, UserCircle, CheckCircle2, XCircle } from 'lucide-react';

interface Tenant {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  leadCount: number;
  partnerCount: number;
  companyCount: number;
  isActive: boolean;
  recentLeadCount: number;
  plan: string;
  subscriptionStatus: string;
  expiryDate?: string;
}

export default function TenantsPage() {
  const { token } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    plan: 'free',
    subscriptionStatus: 'inactive',
    expiryDate: ''
  });

  const fetchTenants = () => {
    if (!token) return;
    fetch('/api/superadmin/tenants', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setTenants(data.tenants || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTenants();
  }, [token]);

  const handleEditClick = (t: Tenant) => {
    setEditingTenant(t);
    setEditForm({
      plan: t.plan || 'free',
      subscriptionStatus: t.subscriptionStatus || 'inactive',
      expiryDate: t.expiryDate ? new Date(t.expiryDate).toISOString().split('T')[0] : ''
    });
  };

  const handleUpdatePlan = async () => {
    if (!editingTenant || !token) return;
    setUpdateLoading(true);
    try {
      const res = await fetch('/api/superadmin/tenants/update-plan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          adminId: editingTenant._id,
          ...editForm
        })
      });
      if (res.ok) {
        setEditingTenant(null);
        fetchTenants();
      } else {
        const errorData = await res.json();
        alert(`Failed to update plan: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setUpdateLoading(true);
      // Small hack to ensure UI feels responsive
      setTimeout(() => setUpdateLoading(false), 500);
    }
  };

  const filtered = tenants.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Tenant Management</h1>
          <p className="text-foreground/40 mt-1 text-sm">{tenants.length} registered admins on the platform</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
        <input
          type="text"
          placeholder="Search tenants by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-border rounded-2xl text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-orange-500/30 transition"
        />
      </div>

      {/* Tenant Grid */}
      {filtered.length === 0 ? (
        <p className="text-foreground/30 text-center py-16 text-sm">No tenants found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t._id} className="bg-white/[0.02] border border-border rounded-2xl p-6 hover:border-white/[0.08] transition group flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold text-sm">{t.name}</p>
                    <p className="text-foreground/25 text-[11px]">{t.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {t.subscriptionStatus === 'active' ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">{t.plan}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-full">
                      <XCircle className="w-3 h-3 text-foreground/40" />
                      <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">{t.subscriptionStatus}</span>
                    </div>
                  )}
                  {t.expiryDate && (
                    <span className="text-[9px] text-foreground/30 font-medium  ">
                      Expires: {new Date(t.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-2 bg-white/[0.02] rounded-xl">
                  <p className="text-foreground font-bold text-lg">{t.leadCount}</p>
                  <p className="text-foreground/30 text-[10px] font-medium">Leads</p>
                </div>
                <div className="text-center p-2 bg-white/[0.02] rounded-xl">
                  <p className="text-foreground font-bold text-lg">{t.partnerCount}</p>
                  <p className="text-foreground/30 text-[10px] font-medium">Partners</p>
                </div>
                <div className="text-center p-2 bg-white/[0.02] rounded-xl">
                  <p className="text-foreground font-bold text-lg">{t.companyCount}</p>
                  <p className="text-foreground/30 text-[10px] font-medium">Companies</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium mb-6">
                <div className="flex items-center gap-1.5 text-foreground/40">
                  <span>Joined {new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
                {t.expiryDate && (
                  <div className={`px-2 py-0.5 rounded-md ${
                    Math.ceil((new Date(t.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) < 7
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-green-500/10 text-green-400'
                  }`}>
                    {Math.ceil((new Date(t.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                  </div>
                )}
              </div>

              <div className="mt-auto space-y-2">
                <Link
                  href={`/admin/superadmin/tenants/${t._id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/[0.03] border border-border rounded-xl text-foreground/60 hover:text-orange-400 hover:border-orange-500/20 hover:bg-orange-500/5 transition text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Data
                </Link>
                <button
                  onClick={() => handleEditClick(t)}
                  className="w-full py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 hover:bg-orange-500 hover:text-white transition text-xs font-bold uppercase tracking-widest"
                >
                  Manage Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-foreground mb-2">Manage Plan</h2>
            <p className="text-foreground/50 text-sm mb-6">Update subscription for {editingTenant.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-foreground/40 font-bold mb-1.5 ml-1">Plan Level</label>
                <select 
                  value={editForm.plan}
                  onChange={e => setEditForm({...editForm, plan: e.target.value})}
                  className="w-full bg-white/[0.03] border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-orange-500/50"
                >
                  <option value="free" className="bg-card">Free</option>
                  <option value="basic" className="bg-card">Basic</option>
                  <option value="pro" className="bg-card">Pro</option>
                  <option value="enterprise" className="bg-card">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-foreground/40 font-bold mb-1.5 ml-1">Status</label>
                <select 
                  value={editForm.subscriptionStatus}
                  onChange={e => setEditForm({...editForm, subscriptionStatus: e.target.value})}
                  className="w-full bg-white/[0.03] border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-orange-500/50"
                >
                  <option value="inactive" className="bg-card">Inactive</option>
                  <option value="trial" className="bg-card">Trial</option>
                  <option value="active" className="bg-card">Active</option>
                  <option value="expired" className="bg-card">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-foreground/40 font-bold mb-1.5 ml-1">Expiry Date</label>
                <input 
                  type="date"
                  value={editForm.expiryDate}
                  onChange={e => setEditForm({...editForm, expiryDate: e.target.value})}
                  className="w-full bg-white/[0.03] border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setEditingTenant(null)}
                className="flex-1 py-3 px-4 bg-white/5 border border-border rounded-xl text-foreground/60 text-sm font-semibold hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdatePlan}
                disabled={updateLoading}
                className="flex-1 py-3 px-4 bg-orange-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50"
              >
                {updateLoading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
