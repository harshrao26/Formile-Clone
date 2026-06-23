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
  Phone,
  Mail,
  Calendar,
  Zap,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Eye
} from 'lucide-react';

type Tab = 'leads' | 'partners' | 'companies' | 'persons';

interface TenantData {
  admin: { 
    _id: string;
    name: string; 
    email: string; 
    phone?: string; 
    role: string; 
    plan?: string; 
    subscriptionStatus?: string; 
    expiryDate?: string; 
    createdAt: string; 
  };
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
  leadTrends: Array<{ date: string; count: number }>;
}

export default function TenantDetailPage() {
  const { token } = useAuth();
  const params = useParams();
  const adminId = params.adminId as string;
  const [data, setData] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('leads');

  // Plan management modal state
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    plan: 'free',
    subscriptionStatus: 'inactive',
    expiryDate: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // SVG Chart hover state
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const fetchTenantData = () => {
    if (!token || !adminId) return;
    fetch(`/api/superadmin/tenants/${adminId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTenantData();
  }, [token, adminId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data?.admin) {
    return <p className="text-foreground/40 text-center py-16">Tenant not found</p>;
  }

  const tabs: { key: Tab; label: string; icon: typeof Inbox; count: number }[] = [
    { key: 'leads', label: 'Leads', icon: Inbox, count: data.stats.leadCount },
    { key: 'partners', label: 'Partners', icon: Users, count: data.stats.partnerCount },
    { key: 'companies', label: 'Companies', icon: Building2, count: data.stats.companyCount },
    { key: 'persons', label: 'Persons', icon: UserCircle, count: data.stats.personCount },
  ];

  // Subscription calculation
  const plan = data.admin.plan || 'free';
  const status = data.admin.subscriptionStatus || 'inactive';
  const expiryDate = data.admin.expiryDate;
  
  let daysLeft = 0;
  let progressPercent = 0;
  let totalDaysInCycle = 30; // default to monthly
  
  if (plan === 'yearly') totalDaysInCycle = 365;
  if (plan === 'trial') totalDaysInCycle = 14;

  if (expiryDate) {
    const expiry = new Date(expiryDate).getTime();
    const now = Date.now();
    daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    if (daysLeft > 0) {
      progressPercent = Math.min(100, Math.max(0, (daysLeft / totalDaysInCycle) * 100));
    }
  }

  // Leads Trend Chart Logic
  const trends = data.leadTrends || [];
  const totalLeads30Days = trends.reduce((sum, t) => sum + t.count, 0);
  const maxCount = Math.max(...trends.map((t) => t.count), 5);

  // SVG dimensions
  const svgWidth = 500;
  const svgHeight = 150;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;
  
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const points = trends.map((t, i) => {
    const x = paddingLeft + (i / (trends.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (t.count / maxCount) * chartHeight;
    return { x, y, date: t.date, count: t.count };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const gridLines = [
    { y: paddingTop, value: maxCount },
    { y: paddingTop + chartHeight / 2, value: Math.round(maxCount / 2) },
    { y: paddingTop + chartHeight, value: 0 }
  ];

  // Trigger editing modal
  const handleEditClick = () => {
    setEditingTenant(data.admin);
    setEditForm({
      plan: data.admin.plan || 'free',
      subscriptionStatus: data.admin.subscriptionStatus || 'inactive',
      expiryDate: data.admin.expiryDate ? new Date(data.admin.expiryDate).toISOString().split('T')[0] : ''
    });
  };

  const handleUpdatePlan = async () => {
    if (!token) return;
    setUpdateLoading(true);
    try {
      const res = await fetch('/api/superadmin/tenants/update-plan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          adminId: data.admin._id,
          ...editForm
        })
      });
      if (res.ok) {
        setEditingTenant(null);
        fetchTenantData();
      } else {
        const errorData = await res.json();
        alert(`Failed to update plan: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setUpdateLoading(true);
      setTimeout(() => setUpdateLoading(false), 500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back + Header */}
      <div>
        <Link href="/admin/superadmin/tenants" className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground/60 text-sm mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Tenants
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{data.admin.name}</h1>
            <p className="text-foreground/40 mt-1 text-sm">Joined {new Date(data.admin.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/15 rounded-full">
            <Lock className="w-3 h-3 text-yellow-400" />
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Read-Only View</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Trends + Stats + Tabs Table) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SVG Leads Trend Chart */}
          <div className="bg-card border border-border rounded-3xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-foreground/80">Leads Capture Trend</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-foreground/45">Total (Last 30 Days)</span>
                <p className="text-lg font-bold text-foreground">{totalLeads30Days}</p>
              </div>
            </div>
            
            <div className="relative w-full h-[150px]">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%" className="overflow-visible">
                <defs>
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {gridLines.map((line, idx) => (
                  <g key={idx}>
                    <line
                      x1={paddingLeft}
                      y1={line.y}
                      x2={svgWidth - paddingRight}
                      y2={line.y}
                      className="stroke-border"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={line.y + 3}
                      textAnchor="end"
                      className="fill-foreground/40 text-[9px] font-mono"
                    >
                      {line.value}
                    </text>
                  </g>
                ))}

                {/* X Axis Labels */}
                <text
                  x={paddingLeft}
                  y={svgHeight - 6}
                  textAnchor="start"
                  className="fill-foreground/35 text-[9px]"
                >
                  {new Date(trends[0]?.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </text>
                <text
                  x={svgWidth - paddingRight}
                  y={svgHeight - 6}
                  textAnchor="end"
                  className="fill-foreground/35 text-[9px]"
                >
                  {new Date(trends[trends.length - 1]?.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </text>

                {/* Area Gradient */}
                {areaD && (
                  <path
                    d={areaD}
                    fill="url(#chart-gradient)"
                  />
                )}

                {/* Line Path */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    className="stroke-orange-500"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive Points / Hover Targets */}
                {points.map((p, i) => {
                  const rectWidth = chartWidth / (trends.length - 1);
                  const rectX = p.x - rectWidth / 2;
                  return (
                    <g key={i}>
                      <rect
                        x={rectX}
                        y={paddingTop}
                        width={rectWidth}
                        height={chartHeight}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(p)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {hoveredPoint && hoveredPoint.date === p.date && (
                        <>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="5"
                            className="fill-orange-500 stroke-background stroke-[2px]"
                          />
                          <line
                            x1={p.x}
                            y1={p.y}
                            x2={p.x}
                            y2={paddingTop + chartHeight}
                            className="stroke-orange-500/25 stroke-dashed"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <div 
                  className="absolute bg-card border border-border px-3 py-1.5 rounded-xl shadow-2xl text-[11px] font-semibold pointer-events-none z-10 text-foreground animate-in fade-in zoom-in-95 duration-150"
                  style={{ 
                    left: `${(hoveredPoint.x / svgWidth) * 100}%`, 
                    top: `${(hoveredPoint.y / svgHeight) * 100 - 45}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="text-foreground/45 text-[9px] mb-0.5">
                    {new Date(hoveredPoint.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-orange-500 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block"></span>
                    {hoveredPoint.count} Leads
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <div key={tab.key} className="bg-white/[0.015] border border-border/80 rounded-2xl p-4 text-center">
                  <Icon className="w-4 h-4 text-orange-500/80 mx-auto mb-1.5" />
                  <p className="text-xl font-extrabold text-foreground">{tab.count}</p>
                  <p className="text-foreground/35 text-[10px] font-semibold uppercase tracking-wider">{tab.label}</p>
                </div>
              );
            })}
          </div>

          {/* Entity Tab selection buttons */}
          <div className="flex gap-1 bg-white/[0.015] p-1 rounded-2xl border border-border w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab.key
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/15'
                    : 'text-foreground/40 hover:text-foreground/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Table/List */}
          <div className="bg-white/[0.01] border border-border rounded-3xl p-6">
            {activeTab === 'leads' && (
              <>
                {data.leads.length === 0 ? (
                  <p className="text-foreground/30 text-center py-8 text-sm">No leads captured by this tenant</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left text-foreground/40 text-[10px] font-bold uppercase tracking-wider py-3 px-4">Token</th>
                          <th className="text-left text-foreground/40 text-[10px] font-bold uppercase tracking-wider py-3 px-4">Partner</th>
                          <th className="text-left text-foreground/40 text-[10px] font-bold uppercase tracking-wider py-3 px-4">Person</th>
                          <th className="text-left text-foreground/40 text-[10px] font-bold uppercase tracking-wider py-3 px-4">Data</th>
                          <th className="text-left text-foreground/40 text-[10px] font-bold uppercase tracking-wider py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.leads.map((lead) => (
                          <tr key={lead._id} className="border-b border-white/[0.01] hover:bg-white/[0.005]">
                            <td className="py-3 px-4"><span className="text-orange-500/60 font-mono text-[11px]">{lead.token?.substring(0, 12)}...</span></td>
                            <td className="py-3 px-4 text-foreground/75 text-sm">{lead.partnerId?.name || '—'}</td>
                            <td className="py-3 px-4 text-foreground/75 text-sm">{lead.personId?.name || '—'}</td>
                            <td className="py-3 px-4 text-foreground/50 text-xs max-w-[200px] truncate">
                              {Object.entries(lead.formData || {}).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </td>
                            <td className="py-3 px-4 text-foreground/35 text-xs">{new Date(lead.submittedAt).toLocaleDateString()}</td>
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
                  <p className="text-foreground/30 text-center py-8 text-sm">No partners created</p>
                ) : (
                  data.partners.map((p) => (
                    <div key={p._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.015] transition border border-transparent hover:border-border/30">
                      <div>
                        <p className="text-foreground text-sm font-semibold">{p.name}</p>
                        <p className="text-foreground/35 text-xs">/p/{p.slug}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-500 font-extrabold text-sm">{p.leadCount}</p>
                        <p className="text-foreground/30 text-[9px] uppercase tracking-wider font-bold">leads</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'companies' && (
              <div className="space-y-2">
                {data.companies.length === 0 ? (
                  <p className="text-foreground/30 text-center py-8 text-sm">No companies created</p>
                ) : (
                  data.companies.map((c) => (
                    <div key={c._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.015] transition border border-transparent hover:border-border/30">
                      <p className="text-foreground text-sm font-semibold">{c.name}</p>
                      <p className="text-foreground/30 text-xs">{new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'persons' && (
              <div className="space-y-2">
                {data.persons.length === 0 ? (
                  <p className="text-foreground/30 text-center py-8 text-sm">No persons created</p>
                ) : (
                  data.persons.map((p) => (
                    <div key={p._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.015] transition border border-transparent hover:border-border/30">
                      <div>
                        <p className="text-foreground text-sm font-semibold">{p.name}</p>
                        <p className="text-foreground/35 text-xs">/{p.slug}</p>
                      </div>
                      <p className="text-foreground/30 text-xs">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Client Profile Info Sidebar */}
        <div className="space-y-6">
          
          {/* Identity/Profile Card */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Client Profile</h3>
                <p className="text-foreground/45 text-[10px] uppercase tracking-wider font-bold">Details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-foreground/45 font-bold mb-1">Email Address</span>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Mail className="w-4 h-4 text-foreground/30 shrink-0" />
                  <span className="text-sm truncate font-medium">{data.admin.email}</span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider text-foreground/45 font-bold mb-1">Mobile Number</span>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Phone className="w-4 h-4 text-foreground/30 shrink-0" />
                  {data.admin.phone ? (
                    <span className="text-sm font-medium">{data.admin.phone}</span>
                  ) : (
                    <span className="text-sm italic text-foreground/30 font-medium">Not provided</span>
                  )}
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider text-foreground/45 font-bold mb-1">Account Role</span>
                <div className="flex items-center gap-2 text-foreground/80">
                  <UserCircle className="w-4 h-4 text-foreground/30 shrink-0" />
                  <span className="text-sm font-semibold text-orange-500/80 capitalize">{data.admin.role}</span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider text-foreground/45 font-bold mb-1">Registered Since</span>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Calendar className="w-4 h-4 text-foreground/30 shrink-0" />
                  <span className="text-sm font-medium">{new Date(data.admin.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Usage Card */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Subscription</h3>
                <p className="text-foreground/45 text-[10px] uppercase tracking-wider font-bold">Usage Status</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-foreground/45 font-bold mb-0.5">Plan Level</span>
                  <span className="text-sm font-bold text-foreground capitalize">{plan} Plan</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-foreground/45 font-bold mb-1 text-right">Status</span>
                  {status === 'active' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 text-green-400" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3 text-red-400" /> Expired
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-foreground/60 mb-2">
                  <span>Usage Duration</span>
                  {expiryDate ? (
                    <span className="text-orange-400 font-bold">{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</span>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-border/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      daysLeft <= 0 
                        ? 'bg-red-500' 
                        : daysLeft <= 7 
                          ? 'bg-yellow-500' 
                          : 'bg-orange-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                
                {expiryDate && (
                  <div className="flex items-center gap-1 text-[10px] text-foreground/45 mt-2">
                    <Clock className="w-3 h-3" />
                    <span>Expires on {new Date(expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleEditClick}
                className="w-full py-3 bg-orange-500/10 hover:bg-orange-500 hover:text-white border border-orange-500/20 rounded-xl text-orange-400 transition text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Manage Subscription Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reused Edit Modal from Tenants List */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-foreground mb-2">Manage Plan</h2>
            <p className="text-foreground/50 text-sm mb-6">Update subscription for {editingTenant.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-foreground/45 font-bold mb-1.5 ml-1">Plan Level</label>
                <select 
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent transition text-sm"
                >
                  <option value="free">Free</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-foreground/45 font-bold mb-1.5 ml-1">Subscription Status</label>
                <select 
                  value={editForm.subscriptionStatus}
                  onChange={(e) => setEditForm({ ...editForm, subscriptionStatus: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent transition text-sm"
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="inactive">Inactive</option>
                  <option value="trial">Trial</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-foreground/45 font-bold mb-1.5 ml-1">Expiry Date</label>
                <input 
                  type="date"
                  value={editForm.expiryDate}
                  onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent transition text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="flex-1 py-3 border border-border hover:bg-white/[0.02] text-foreground font-semibold rounded-xl transition text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdatePlan}
                  disabled={updateLoading}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
