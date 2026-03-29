import mongoose, { Schema, Document } from 'mongoose';

// A FormTemplate allows admins to create multiple distinct forms.
// Each template has a name and remembers which standard fields are active,
// along with any custom fields unique to this form.
export interface IFormTemplate extends Document {
  name: string;
  activeFields: string[]; // e.g. ["full_name", "email", "phone", "custom_123"]
  customFields: {
    label: string;
    key: string;
    type: string;
  }[];
  createdAt: Date;
}

const CustomFieldSchema = new Schema({
  label: { type: String, required: true },
  key: { type: String, required: true },
  type: { type: String, default: 'text' },
}, { _id: false });

const FormTemplateSchema = new Schema<IFormTemplate>({
  name: { type: String, required: true },
  activeFields: { type: [String], default: [] },
  customFields: { type: [CustomFieldSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.FormTemplate || mongoose.model<IFormTemplate>('FormTemplate', FormTemplateSchema);
