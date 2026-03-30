'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  X, 
  CheckCircle2, 
  XCircle,
  GripVertical
} from 'lucide-react';

interface Field {
  _id: string;
  label: string;
  fieldKey: string;
  type: string;
  placeholder: string;
  required: boolean;
  order: number;
  isActive: boolean;
  options: string[];
  createdAt: string;
}

const fieldTypes = ['text', 'email', 'tel', 'number', 'select', 'textarea'];

export default function FieldsPage() {
  const { token } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: '', fieldKey: '', type: 'text', placeholder: '', required: false, order: 0, isActive: true, options: '',
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchData = async () => {
    const res = await fetch('/api/fields', { headers: { Authorization: `Bearer ${token}` } });
    setFields(await res.json());
    setLoading(false);
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      options: formData.type === 'select' ? formData.options.split(',').map((o) => o.trim()).filter(Boolean) : [],
    };
    const url = editId ? `/api/fields/${editId}` : '/api/fields';
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(payload) });
    setFormData({ label: '', fieldKey: '', type: 'text', placeholder: '', required: false, order: 0, isActive: true, options: '' });
    setEditId(null);
    setShowForm(false);
    setSaving(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/fields/${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  const handleEdit = (f: Field) => {
    setFormData({
      label: f.label,
      fieldKey: f.fieldKey,
      type: f.type,
      placeholder: f.placeholder,
      required: f.required,
      order: f.order,
      isActive: f.isActive,
      options: f.options?.join(', ') || '',
    });
    setEditId(f._id);
    setShowForm(true);
  };

  const toggleActive = async (f: Field) => {
    await fetch(`/api/fields/${f._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ isActive: !f.isActive }),
    });
    fetchData();
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
          <h1 className="text-3xl font-bold text-foreground">Form Fields</h1>
          <p className="text-foreground/50 mt-1">Manage the fields that appear on lead capture forms</p>
        </div>

      </div>

      {showForm && (
        <div className="max-w-xl mx-auto bg-card border border-border rounded-2xl p-6 mb-6 shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
            <input 
              placeholder="Field Name (e.g. City, Budget)" 
              value={formData.label} 
              onChange={(e) => setFormData({ 
                ...formData, 
                label: e.target.value,
                fieldKey: formData.fieldKey || e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                type: 'text'
              })} 
              className="w-full sm:flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-inner" 
              required 
              autoFocus
            />
            <div className="flex w-full sm:w-auto gap-3">
              <button 
                type="submit" 
                disabled={saving || !formData.label.trim()} 
                className="flex-1 sm:flex-none px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowForm(false); setEditId(null); setFormData({ label: '', fieldKey: '', type: 'text', placeholder: '', required: false, order: 0, isActive: true, options: '' }); }}
                className="flex-1 sm:flex-none px-6 py-3 bg-transparent border border-border text-foreground rounded-xl font-medium hover:bg-white/5 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="max-w-xl bg-card border border-border rounded-2xl p-6 lg:p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Active Form Fields</h2>
          {fields.length === 0 ? (
            <p className="text-foreground/40 text-center py-6">No form fields yet.</p>
          ) : (
            <div className="space-y-4">
              {fields.sort((a, b) => a.order - b.order).map(f => (
                <div key={f._id} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.03] bg-white/[0.01]">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-medium text-lg">{f.label}</span>
                      {f.required && (
                        <span className="text-[10px] uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full font-bold">Required</span>
                      )}
                    </div>
                    <span className="text-xs text-foreground/40 mt-1 font-mono">{f.fieldKey}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 hover:opacity-100 transition-opacity delay-75 group-hover:opacity-100">
                      <button onClick={() => handleDelete(f._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <label className="relative flex items-center cursor-pointer group">
                      <input type="checkbox" checked={f.isActive} onChange={() => toggleActive(f)} className="sr-only peer" />
                      <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-orange-500 peer-focus:ring-2 peer-focus:ring-orange-500/50 transition-colors duration-300"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <button 
              onClick={() => { setShowForm(true); setEditId(null); setFormData({ label: '', fieldKey: '', type: 'text', placeholder: '', required: false, order: 0, isActive: true, options: '' }); }}
              className="px-6 py-4 border border-white/20 text-foreground rounded-xl font-medium hover:bg-white/5 transition flex items-center gap-2 justify-center w-full shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              Create Field
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
