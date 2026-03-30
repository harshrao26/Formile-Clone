import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: 'superadmin' | 'user';
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'expired' | 'trial' | 'inactive';
  expiryDate?: Date;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'user'], default: 'user' },
  plan: { type: String, enum: ['free', 'basic', 'pro', 'enterprise'], default: 'free' },
  subscriptionStatus: { type: String, enum: ['active', 'expired', 'trial', 'inactive'], default: 'inactive' },
  expiryDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
