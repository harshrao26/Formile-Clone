"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { PlusCircle, Trash2, ArrowLeft, FileText, Moon, Sun, Upload } from "lucide-react";

interface FormTemplate {
  _id: string;
  name: string;
  activeFields: string[];
  customFields?: { label: string; key: string; type: string }[];
  heading?: string;
  theme?: string;
  backgroundImage?: string | null;
}

const PREDEFINED_FIELDS = [
  { key: "full_name", label: "Full Name", type: "text" },
  { key: "email", label: "Email Address", type: "email" },
  { key: "phone", label: "Phone Number", type: "tel" },
  { key: "company", label: "Company Name", type: "text" },
  { key: "job_title", label: "Job Title", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "budget", label: "Estimated Budget", type: "text" },
  { key: "notes", label: "Additional Notes", type: "textarea" },
];

export default function FormsPage() {
  const { token } = useAuth();
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // List View State
  const [showCreateData, setShowCreateData] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [saving, setSaving] = useState(false);

  // Editor View State
  const [editingForm, setEditingForm] = useState<FormTemplate | null>(null);
  const [newCustomFieldName, setNewCustomFieldName] = useState("");
  const [newCustomFieldType, setNewCustomFieldType] = useState("text");
  const [addingField, setAddingField] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchForms = async () => {
    const res = await fetch("/api/forms", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setForms(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchForms();
  }, [token]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormName.trim()) return;
    setSaving(true);

    const res = await fetch("/api/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newFormName,
        activeFields: ["full_name", "email", "phone"],
      }), // default active fields
    });

    if (res.ok) {
      const newForm = await res.json();
      setForms([newForm, ...forms]);
      setNewFormName("");
      setShowCreateData(false);
    }
    setSaving(false);
  };

  const handleDeleteForm = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this form?")) return;
    await fetch(`/api/forms/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (editingForm && editingForm._id === id) setEditingForm(null);
    fetchForms();
  };

  const toggleField = async (fieldKey: string) => {
    if (!editingForm) return;

    const currentActive = editingForm.activeFields || [];
    const isCurrentlyActive = currentActive.includes(fieldKey);

    const newActiveFields = isCurrentlyActive
      ? currentActive.filter((k) => k !== fieldKey)
      : [...currentActive, fieldKey];

    // Local UI update
    setEditingForm({ ...editingForm, activeFields: newActiveFields });
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!editingForm || !isDirty) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/forms/${editingForm._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingForm),
      });

      if (res.ok) {
        setIsDirty(false);
        fetchForms();
      } else {
        alert("Failed to save changes");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCustomField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomFieldName.trim() || !editingForm) return;
    setAddingField(true);

    const fieldKey = `custom_${Date.now()}_${newCustomFieldName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const newField = {
      label: newCustomFieldName,
      key: fieldKey,
      type: newCustomFieldType,
    };

    const updatedCustomFields = [...(editingForm.customFields || []), newField];
    const newActiveFields = [...(editingForm.activeFields || []), fieldKey];

    setEditingForm({
      ...editingForm,
      customFields: updatedCustomFields,
      activeFields: newActiveFields,
    });
    setIsDirty(true);

    setNewCustomFieldName("");
    setNewCustomFieldType("text");
    setAddingField(false);
  };

  const deleteCustomField = async (fieldKey: string) => {
    if (!editingForm) return;
    if (!confirm("Delete this custom field?")) return;

    const updatedCustomFields = (editingForm.customFields || []).filter(
      (cf) => cf.key !== fieldKey,
    );
    const updatedActiveFields = (editingForm.activeFields || []).filter(
      (k) => k !== fieldKey,
    );

    setEditingForm({
      ...editingForm,
      customFields: updatedCustomFields,
      activeFields: updatedActiveFields,
    });
    setIsDirty(true);
  };

  const updateAppearance = (key: string, value: string | null) => {
    if (!editingForm) return;
    setEditingForm({ ...editingForm, [key]: value || "" });
    setIsDirty(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingForm) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.secure_url) {
        updateAppearance('backgroundImage', data.secure_url);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload failed', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
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
    const activeFieldsRaw = [
      ...PREDEFINED_FIELDS,
      ...(editingForm.customFields || []),
    ].filter((f) => (editingForm.activeFields || []).includes(f.key));

    return (
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              if (isDirty && !confirm("You have unsaved changes. Are you sure you want to go back?")) return;
              setEditingForm(null);
              setIsDirty(false);
            }}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forms
          </button>

          {isDirty && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              Save Changes
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Builder */}
          <div>
            <div className="mb-8">
              <input 
                value={editingForm.name}
                onChange={(e) => updateAppearance('name', e.target.value)}
                className="w-full text-3xl font-bold bg-transparent border-0 text-foreground mb-2 p-0 focus:ring-0 focus:outline-none placeholder-white/20"
                placeholder="Form Name"
              />
              <p className="text-foreground/50">
                Customize branding and select the fields you want to collect for this form.
              </p>
            </div>

            {/* NEW APPEARANCE SECTION */}
            <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-xl mb-8">
              <h2 className="text-lg font-bold text-foreground mb-6">Appearance & Branding</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-foreground/70 text-sm font-medium mb-2">Form Heading</label>
                  <input 
                    value={editingForm.heading || ''} 
                    placeholder="Claim Your Offer"
                    onChange={(e) => updateAppearance('heading', e.target.value)} 
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-foreground/70 text-sm font-medium mb-2">Theme</label>
                    <div className="flex bg-background border border-border rounded-xl p-1">
                      <button 
                        onClick={() => updateAppearance('theme', 'dark')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${editingForm.theme !== 'light' ? 'bg-orange-500/20 text-orange-500' : 'text-foreground/50 hover:text-foreground/70'}`}
                      >
                        <Moon className="w-4 h-4" /> Dark
                      </button>
                      <button 
                        onClick={() => updateAppearance('theme', 'light')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${editingForm.theme === 'light' ? 'bg-orange-500/20 text-orange-500' : 'text-foreground/50 hover:text-foreground/70'}`}
                      >
                        <Sun className="w-4 h-4" /> Light
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-foreground/70 text-sm font-medium mb-2">Background Image</label>
                    {editingForm.backgroundImage ? (
                      <div className="relative w-full h-12 bg-background rounded-xl border border-border overflow-hidden group">
                        <img src={editingForm.backgroundImage} alt="Background" className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-between px-4">
                          <span className="text-xs text-foreground uppercase tracking-wider font-semibold">Image Set</span>
                          <button 
                            onClick={() => updateAppearance('backgroundImage', null)}
                            className="p-1.5 bg-red-500/20 text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className={`flex items-center justify-center w-full h-12 px-4 border-2 border-dashed rounded-xl cursor-pointer transition ${isUploading ? 'border-orange-500 bg-orange-500/5' : 'border-border hover:border-white/30 bg-background'}`}>
                        <div className="flex items-center gap-2">
                          <Upload className={`w-4 h-4 ${isUploading ? 'text-orange-500 animate-bounce' : 'text-foreground/50'}`} />
                          <span className="text-sm font-medium text-foreground/60">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl  shadow-xl">
              <h2 className="text-lg bg-orange-500/10 p-4 font-bold text-white mb-6">
                Available Fields
              </h2>

              <div className="space-y-4">
                {[
                  ...PREDEFINED_FIELDS,
                  ...(editingForm.customFields || []),
                ].map((field) => {
                  const isActive = (editingForm.activeFields || []).includes(
                    field.key,
                  );
                  const isCustom = field.key.startsWith("custom_");

                  return (
                    <div
                      key={field.key}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/[0.02] group"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-medium text-lg">
                            {field.label}
                          </span>
                          {isCustom && (
                            <span className="text-[10px] uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full font-bold ml-2">
                              Custom
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-foreground/40 mt-1 font-mono">
                          {field.key}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        {isCustom && (
                          <button
                            onClick={() => deleteCustomField(field.key)}
                            className="p-2 text-foreground/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <form
                  onSubmit={handleAddCustomField}
                  className="flex flex-col xl:flex-row gap-4 items-center"
                >
                  <input
                    placeholder="New Custom Field..."
                    value={newCustomFieldName}
                    onChange={(e) => setNewCustomFieldName(e.target.value)}
                    className="w-full xl:flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-inner"
                  />
                  <select
                    value={newCustomFieldType}
                    onChange={(e) => setNewCustomFieldType(e.target.value)}
                    className="w-full xl:w-auto px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-inner"
                  >
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="date">Date</option>
                    <option value="number">Number</option>
                  </select>
                  <button
                    type="submit"
                    disabled={addingField || !newCustomFieldName.trim()}
                    className="w-full xl:w-auto px-6 py-3 bg-white/5 border border-border text-foreground rounded-xl font-medium hover:bg-white/10 transition disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {addingField ? "Adding..." : "Add Field"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="hidden lg:block relative">
            <div className="sticky top-8">
              <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-widest mb-4">
                Live Interface Preview
              </h2>
              <div className={`border border-border rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden ring-8 ring-white/[0.02] ${editingForm.theme === 'light' ? 'bg-[#f4f4f5]' : 'bg-[#0a0a0a]'}`}>
                {editingForm.backgroundImage && (
                  <div className="absolute inset-0 z-0">
                    <img src={editingForm.backgroundImage} alt="Background Preview" className="w-full h-full object-cover opacity-30" />
                    <div className={`absolute inset-0 ${editingForm.theme === 'light' ? 'bg-white/60' : 'bg-black/60'}`}></div>
                  </div>
                )}
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -mx-20 -my-20 z-0"></div>
                
                <div className="relative z-10 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                  <h3 className={`text-3xl font-bold mb-2 ${editingForm.theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {editingForm.heading || 'Claim Your Offer'}
                  </h3>
                  <p className={`text-base mb-8 ${editingForm.theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
                    Please fill out the details below to complete your
                    registration.
                  </p>

                  <div className="space-y-5">
                    {activeFieldsRaw.map((field) => (
                      <div
                        key={field.key}
                        className="transition-all duration-300"
                      >
                        <label className={`block text-sm font-medium mb-2 ${editingForm.theme === 'light' ? 'text-gray-700' : 'text-white/70'}`}>
                          {field.label}{" "}
                          {field.key.match(/name|email|phone/) && (
                            <span className="text-orange-500">*</span>
                          )}
                        </label>

                        {field.type === "textarea" || field.key === "notes" ? (
                          <div className={`w-full h-28 border rounded-xl flex items-start p-4 ${editingForm.theme === 'light' ? 'bg-white border-gray-200 shadow-sm' : 'bg-[#141414] border-white/10'}`}>
                            <span className={`text-sm ${editingForm.theme === 'light' ? 'text-gray-400' : 'text-white/30'}`}>
                              Type your message here...
                            </span>
                          </div>
                        ) : (
                          <div className={`w-full h-12 border rounded-xl flex items-center px-4 ${editingForm.theme === 'light' ? 'bg-white border-gray-200 shadow-sm' : 'bg-[#141414] border-white/10'}`}>
                            <span className={`text-sm ${editingForm.theme === 'light' ? 'text-gray-400' : 'text-white/30'}`}>
                              Enter {field.label.toLowerCase()}...
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    {activeFieldsRaw.length === 0 && (
                      <div className={`py-8 text-center border-2 border-dashed rounded-2xl ${editingForm.theme === 'light' ? 'border-gray-300 bg-white/50' : 'border-border bg-white/[0.01]'}`}>
                        <p className={`text-sm font-medium ${editingForm.theme === 'light' ? 'text-gray-400' : 'text-foreground/40'}`}>
                          Turn on fields to see preview
                        </p>
                      </div>
                    )}

                    <div className="pt-6 pb-2">
                      <div className="w-full py-4 bg-orange-500 border border-orange-500 shadow-lg rounded-xl flex items-center justify-center">
                        <span className="text-foreground font-semibold flex items-center gap-2">
                          Submit Application
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="  mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Forms</h1>
          <p className="text-foreground/50 mt-1">
            Manage multiple form templates for your campaigns
          </p>
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
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-xl">
          <form
            onSubmit={handleCreateForm}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <input
              placeholder="Form Name (e.g. Car Sales Campaign)"
              value={newFormName}
              onChange={(e) => setNewFormName(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-inner"
              required
              autoFocus
            />
            <div className="flex w-full sm:w-auto gap-3">
              <button
                type="submit"
                disabled={saving || !newFormName.trim()}
                className="flex-1 sm:flex-none px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateData(false);
                  setNewFormName("");
                }}
                className="flex-1 sm:flex-none px-6 py-3 bg-transparent border border-border text-foreground rounded-xl font-medium hover:bg-white/5 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {forms.length === 0 ? (
          <p className="text-foreground/40 text-center py-12">
            No forms yet. Create one to capture leads.
          </p>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {forms.map((form) => (
              <div
                key={form._id}
                className="p-6 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition group"
                onClick={() => {
                  setEditingForm(form);
                  setIsDirty(false);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <FileText className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground group-hover:text-orange-400 transition">
                      {form.name}
                    </h3>
                    <p className="text-sm text-foreground/50 mt-0.5">
                      {form.activeFields?.length || 0} Active Fields
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground/40 group-hover:text-orange-500 transition hidden sm:block">
                    Click to configure fields
                  </span>
                  <button
                    onClick={(e) => handleDeleteForm(form._id, e)}
                    className="p-2 text-foreground/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
