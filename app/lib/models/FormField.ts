import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFormField extends Document {
  label: string;
  fieldKey: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea';
  placeholder: string;
  required: boolean;
  order: number;
  isActive: boolean;
  options: string[];
  partnerId?: Types.ObjectId;
  createdAt: Date;
}

const FormFieldSchema = new Schema<IFormField>({
  label: { type: String, required: true },
  fieldKey: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'email', 'tel', 'number', 'select', 'textarea'],
    default: 'text',
  },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  options: [{ type: String }],
  partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.FormField || mongoose.model<IFormField>('FormField', FormFieldSchema);
