import mongoose, { Schema, Document } from 'mongoose';

// A FormTemplate allows admins to create multiple distinct forms.
// Each template has a name and remembers which standard fields are active,
// along with any custom fields unique to this form.
export interface IFormTemplate extends Document {
  adminId: mongoose.Types.ObjectId;
  name: string;
  activeFields: string[]; // e.g. ["full_name", "email", "phone", "custom_123"]
  requiredFields: string[]; // e.g. ["full_name", "email", "phone"]
  customFields: {
    label: string;
    key: string;
    type: string;
  }[];
  heading: string;
  theme: string;
  backgroundImage: string | null;
  redirectUrl: string | null;
  partnerId: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

const CustomFieldSchema = new Schema({
  label: { type: String, required: true },
  key: { type: String, required: true },
  type: { type: String, default: 'text' },
}, { _id: false });

const FormTemplateSchema = new Schema<IFormTemplate>({
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  activeFields: { type: [String], default: [] },
  requiredFields: { type: [String], default: ['full_name', 'email', 'phone'] },
  customFields: { type: [CustomFieldSchema], default: [] },
  heading: { type: String, default: 'Claim Your Offer' },
  theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
  backgroundImage: { type: String, default: null },
  redirectUrl: { type: String, default: null },
  partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', default: null },
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models.FormTemplate) {
  delete (mongoose.models as any).FormTemplate;
}

export default mongoose.model<IFormTemplate>('FormTemplate', FormTemplateSchema);
