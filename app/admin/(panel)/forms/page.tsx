'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { PlusCircle, Trash2, ArrowLeft, FileText } from 'lucide-react';

interface FormTemplate {
  _id: string;
  name: string;
  activeFields: string[];
  customFields?: { label: string; key: string; type: string }[];
}

const PREDEFINED_FIELDS = [
  { key: 'full_name', label: 'Full Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'company', label: 'Company Name' },
  { key: 'job_title', label: 'Job Title' },
  { key: 'city', label: 'City' },
  { key: 'budget', label: 'Estimated Budget' },
  { key: 'notes', label: 'Additional Notes' }
];

export default function FormsPage() {
  const { token } = useAuth();
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // List View State
  const [showCreateData, setShowCreateData] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [saving, setSaving] = useState(false);

  // Editor View State
  const [editingForm, setEditingForm] = useState<FormTemplate | null>(null);
  const [newCustomFieldName, setNewCustomFieldName] = useState('');
  const [addingField, setAddingField] = useState(false);

  const fetchForms = async () => {
    const res = await fetch('/api/forms', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if(res.ok) {
      setForms(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchForms();
  }, [token]);

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newFormName.trim()) return;
    setSaving(true);
    
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newFormName, activeFields: ['full_name', 'email', 'phone'] }) // default active fields
    });
    
    if(res.ok) {
      const newForm = await res.json();
      setForms([newForm, ...forms]);
      setNewFormName('');
      setShowCreateData(false);
    }
    setSaving(false);
  };

  const handleDeleteForm = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(!confirm('Are you sure you want to delete this form?')) return;
    await fetch(`/api/forms/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if(editingForm && editingForm._id === id) setEditingForm(null);
    fetchForms();
  };

  const toggleField = async (fieldKey: string) => {
    if (!editingForm) return;
    
    const currentActive = editingForm.activeFields || [];
    const isCurrentlyActive = currentActive.includes(fieldKey);
    
    const newActiveFields = isCurrentlyActive 
      ? currentActive.filter(k => k !== fieldKey)
      : [...currentActive, fieldKey];
      
    // Optimistic UI update
    setEditingForm({ ...editingForm, activeFields: newActiveFields });
    
    // API update
    await fetch(`/api/forms/${editingForm._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ activeFields: newActiveFields })
    });
    
    fetchForms(); // sync list in background
  };

  const handleAddCustomField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomFieldName.trim() || !editingForm) return;
    setAddingField(true);

    const fieldKey = `custom_${Date.now()}_${newCustomFieldName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const newField = { label: newCustomFieldName, key: fieldKey, type: 'text' };
    
    const updatedCustomFields = [...(editingForm.customFields || []), newField];
    const newActiveFields = [...(editingForm.activeFields || []), fieldKey];

    setEditingForm({ ...editingForm, customFields: updatedCustomFields, activeFields: newActiveFields });
    
    await fetch(`/api/forms/${editingForm._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ customFields: updatedCustomFields, activeFields: newActiveFields })
    });

    setNewCustomFieldName('');
    setAddingField(false);
    fetchForms();
  };

  const deleteCustomField = async (fieldKey: string) => {
    if (!editingForm) return;
    if (!confirm('Delete this custom field?')) return;
    
    const updatedCustomFields = (editingForm.customFields || []).filter(cf => cf.key !== fieldKey);
    const updatedActiveFields = (editingForm.activeFields || []).filter(k => k !== fieldKey);
    
    setEditingForm({ ...editingForm, customFields: updatedCustomFields, activeFields: updatedActiveFields });
    
    await fetch(`/api/forms/${editingForm._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ customFields: updatedCustomFields, activeFields: updatedActiveFields })
    });
    
    fetchForms();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // EDITOR VIEW
  if (editingForm) {
    return (
      <div className="  mx-auto">
        <button 
          onClick={() => setEditingForm(null)}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Forms
        </button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{editingForm.name}</h1>
          <p className="text-white/40">Toggle the fields you want to collect for this specific form.</p>
        </div>

        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 lg:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6">Available Fields</h2>
          
          <div className="space-y-4">
            {[...PREDEFINED_FIELDS, ...(editingForm.customFields || [])].map(field => {
              const isActive = (editingForm.activeFields || []).includes(field.key);
              const isCustom = field.key.startsWith('custom_');
              
              return (
                <div key={field.key} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.03] bg-white/[0.01] group">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-lg">{field.label}</span>
                      {isCustom && <span className="text-[10px] uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full font-bold ml-2">Custom</span>}
                    </div>
                    <span className="text-xs text-white/30 mt-1 font-mono">{field.key}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {isCustom && (
                      <button 
                        onClick={() => deleteCustomField(field.key)} 
                        className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Custom Field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <label className="relative flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isActive} 
                        onChange={() => toggleField(field.key)} 
                        className="sr-only peer" 
                      />
                      <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-orange-500 peer-focus:ring-2 peer-focus:ring-orange-500/50 transition-colors duration-300"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <form onSubmit={handleAddCustomField} className="flex flex-col sm:flex-row gap-4 items-center">
              <input 
                placeholder="New Custom Field (e.g. Car Model)" 
                value={newCustomFieldName} 
                onChange={(e) => setNewCustomFieldName(e.target.value)} 
                className="w-full sm:flex-1 px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-inner" 
              />
              <button 
                type="submit" 
                disabled={addingField || !newCustomFieldName.trim()} 
                className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                {addingField ? 'Adding...' : 'Add Field'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Forms</h1>
          <p className="text-white/40 mt-1">Manage multiple form templates for your campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateData(!showCreateData)}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Create Form
        </button>
      </div>

      {showCreateData && (
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 mb-8 shadow-xl">
          <form onSubmit={handleCreateForm} className="flex flex-col sm:flex-row gap-4 items-center">
            <input 
              placeholder="Form Name (e.g. Car Sales Campaign)" 
              value={newFormName} 
              onChange={(e) => setNewFormName(e.target.value)} 
              className="w-full sm:flex-1 px-4 py-3 bg-[#1a1a1a] border border-white/[0.06] rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-inner" 
              required 
              autoFocus
            />
            <div className="flex w-full sm:w-auto gap-3">
              <button 
                type="submit" 
                disabled={saving || !newFormName.trim()} 
                className="flex-1 sm:flex-none px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowCreateData(false); setNewFormName(''); }}
                className="flex-1 sm:flex-none px-6 py-3 bg-transparent border border-white/10 text-white rounded-xl font-medium hover:bg-white/5 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
        {forms.length === 0 ? (
          <p className="text-white/30 text-center py-12">No forms yet. Create one to capture leads.</p>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {forms.map(form => (
              <div 
                key={form._id} 
                className="p-6 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition group"
                onClick={() => setEditingForm(form)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <FileText className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white group-hover:text-orange-400 transition">{form.name}</h3>
                    <p className="text-sm text-white/40 mt-0.5">
                      {form.activeFields?.length || 0} Active Fields
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-white/30 group-hover:text-orange-500 transition hidden sm:block">
                    Click to configure fields
                  </span>
                  <button 
                    onClick={(e) => handleDeleteForm(form._id, e)} 
                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Form"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
