import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'superadmin' | 'user';
  plan: 'free' | 'monthly' | 'yearly';
  subscriptionStatus: 'active' | 'expired' | 'trial' | 'inactive';
  expiryDate?: Date;
  lastPaymentId?: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: false },
  role: { type: String, enum: ['superadmin', 'user'], default: 'user' },
  plan: { type: String, enum: ['free', 'monthly', 'yearly'], default: 'free' },
  subscriptionStatus: { type: String, enum: ['active', 'expired', 'trial', 'inactive'], default: 'inactive' },
  expiryDate: { type: Date },
  lastPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models.Admin) {
  delete (mongoose.models as any).Admin;
}

export default mongoose.model<IAdmin>('Admin', AdminSchema);
