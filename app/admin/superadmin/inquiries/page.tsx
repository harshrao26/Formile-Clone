'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { 
  Mail, 
  Search, 
  UserCircle, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Tag,
  Trash2,
  Reply,
  Building2,
  Inbox
} from 'lucide-react';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  submittedAt: string;
}

export default function InquiriesPage() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/superadmin/inquiries', { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then((r) => r.json())
      .then((data) => setInquiries(data.inquiries || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/superadmin/inquiries', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setInquiries(inquiries.map(iq => iq._id === id ? { ...iq, status: status as any } : iq));
        if (selectedInquiry?._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: status as any });
        }
      }
    } catch (err) {
      console.error('Update status failed', err);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/superadmin/inquiries?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setInquiries(inquiries.filter(iq => iq._id !== id));
        if (selectedInquiry?._id === id) setSelectedInquiry(null);
      }
    } catch (err) {
      console.error('Delete inquiry failed', err);
    }
  };

  const filtered = inquiries.filter(
    (iq) => 
      iq.name.toLowerCase().includes(search.toLowerCase()) || 
      iq.email.toLowerCase().includes(search.toLowerCase()) ||
      iq.subject.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'read': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'replied': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  if (loading && inquiries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Platform Inquiries</h1>
        <p className="text-foreground/40 mt-1 text-sm">Manage messages from the Contact Us page</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar: List */}
        <div className="w-full md:w-[400px] flex-shrink-0 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-border rounded-2xl text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-orange-500/30 transition"
            />
          </div>

          <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar">
            {filtered.map((iq) => (
              <button
                key={iq._id}
                onClick={() => {
                  setSelectedInquiry(iq);
                  if (iq.status === 'new') updateStatus(iq._id, 'read');
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group ${
                  selectedInquiry?._id === iq._id
                    ? 'bg-orange-500/10 border-orange-500/20'
                    : 'bg-white/[0.02] border-border hover:border-white/10 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(iq.status)}`}>
                    {iq.status}
                  </span>
                  <span className="text-[10px] text-foreground/30 font-medium">
                    {new Date(iq.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className={`text-sm font-semibold truncate ${selectedInquiry?._id === iq._id ? 'text-orange-400' : 'text-foreground'}`}>
                  {iq.subject}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] flex-shrink-0">
                    {iq.name.charAt(0)}
                  </div>
                  <p className="text-[11px] text-foreground/40 truncate">{iq.email}</p>
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 bg-white/[0.01] border border-dashed border-border rounded-2xl">
                <Mail className="w-8 h-8 text-foreground/10 mx-auto mb-3" />
                <p className="text-sm text-foreground/30 font-medium">No inquiries found</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Details */}
        <div className="flex-1 min-w-0">
          {selectedInquiry ? (
            <div className="bg-white/[0.02] border border-border rounded-[32px] p-8 space-y-8 sticky top-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                    <UserCircle className="w-8 h-8 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedInquiry.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-foreground/40 text-sm font-medium">{selectedInquiry.email}</p>
                      {selectedInquiry.company && (
                        <>
                          <span className="text-foreground/20">•</span>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/5 rounded-md">
                            <Building2 className="w-3 h-3 text-blue-400" />
                            <span className="text-[11px] text-blue-400 font-bold uppercase">{selectedInquiry.company}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateStatus(selectedInquiry._id, 'replied')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition text-xs font-bold uppercase tracking-widest"
                  >
                    <Reply className="w-3 h-3" />
                    Mark Replied
                  </button>
                  <button 
                    onClick={() => deleteInquiry(selectedInquiry._id)}
                    className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                   <div className="flex items-center gap-2 mb-2 text-foreground/40">
                     <Clock className="w-3 h-3" />
                     <span className="text-[11px] font-bold uppercase tracking-widest">Received</span>
                   </div>
                   <p className="text-sm font-medium text-foreground/80">
                     {new Date(selectedInquiry.submittedAt).toLocaleString('en-IN', {
                        dateStyle: 'long',
                        timeStyle: 'short'
                     })}
                   </p>
                </div>

                <div>
                   <div className="flex items-center gap-2 mb-2 text-foreground/40">
                     <Tag className="w-3 h-3" />
                     <span className="text-[11px] font-bold uppercase tracking-widest">Subject</span>
                   </div>
                   <h3 className="text-xl font-bold text-foreground leading-tight">
                     {selectedInquiry.subject}
                   </h3>
                </div>

                <div className="p-8 bg-white/[0.03] border border-border rounded-3xl relative">
                   <div className="flex items-center gap-2 mb-4 text-orange-400/50">
                     <MessageSquare className="w-4 h-4" />
                     <span className="text-[11px] font-bold uppercase tracking-widest">Message</span>
                   </div>
                   <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap font-medium">
                     {selectedInquiry.message}
                   </p>
                </div>
              </div>

              <div className="pt-8 border-t border-border flex justify-end">
                <a 
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                  className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition shadow-xl shadow-orange-500/20"
                >
                  <Reply className="w-4 h-4" />
                  Compose Reply
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white/[0.01] border border-dashed border-border rounded-[40px] flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[28px] flex items-center justify-center mb-6">
                 <Inbox className="w-10 h-10 text-foreground/10" />
               </div>
               <h2 className="text-2xl font-bold text-foreground mb-2">Message Selection</h2>
               <p className="text-foreground/30 max-w-xs font-medium">
                 Select an inquiry from the sidebar to view full details and contact the user.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
