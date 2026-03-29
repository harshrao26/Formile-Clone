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
}

export default function TenantsPage() {
  const { token } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/superadmin/tenants', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setTenants(data.tenants || []))
      .finally(() => setLoading(false));
  }, [token]);

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
          <h1 className="text-3xl font-bold text-white tracking-tight">Tenant Management</h1>
          <p className="text-white/30 mt-1 text-sm">{tenants.length} registered admins on the platform</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          placeholder="Search tenants by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-500/30 transition"
        />
      </div>

      {/* Tenant Grid */}
      {filtered.length === 0 ? (
        <p className="text-white/20 text-center py-16 text-sm">No tenants found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t._id} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/25 text-[11px]">{t.email}</p>
                  </div>
                </div>
                {t.isActive ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-bold text-green-400">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-full">
                    <XCircle className="w-3 h-3 text-white/30" />
                    <span className="text-[10px] font-bold text-white/30">Inactive</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-2 bg-white/[0.02] rounded-xl">
                  <p className="text-white font-bold text-lg">{t.leadCount}</p>
                  <p className="text-white/20 text-[10px] font-medium">Leads</p>
                </div>
                <div className="text-center p-2 bg-white/[0.02] rounded-xl">
                  <p className="text-white font-bold text-lg">{t.partnerCount}</p>
                  <p className="text-white/20 text-[10px] font-medium">Partners</p>
                </div>
                <div className="text-center p-2 bg-white/[0.02] rounded-xl">
                  <p className="text-white font-bold text-lg">{t.companyCount}</p>
                  <p className="text-white/20 text-[10px] font-medium">Companies</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/20 mb-4">
                <span>Joined {new Date(t.createdAt).toLocaleDateString()}</span>
                <span>·</span>
                <span>{t.recentLeadCount} leads (30d)</span>
              </div>

              <Link
                href={`/admin/superadmin/tenants/${t._id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/50 hover:text-orange-400 hover:border-orange-500/20 hover:bg-orange-500/5 transition text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                View Data (Read-Only)
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
