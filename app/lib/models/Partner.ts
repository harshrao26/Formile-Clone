import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPartner extends Document {
  adminId: Types.ObjectId;
  name: string;
  email: string;
  slug: string;
  companyId: Types.ObjectId;
  formId: Types.ObjectId;
  redirectUrl?: string;
  views: number;
  createdAt: Date;
}

const PartnerSchema = new Schema<IPartner>({
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  email: { type: String, required: false, default: '' },
  slug: { type: String, required: true, unique: true, lowercase: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  formId: { type: Schema.Types.ObjectId, ref: 'FormTemplate' },
  redirectUrl: { type: String, required: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

PartnerSchema.index({ slug: 1 });

if (mongoose.models.Partner) {
  delete (mongoose.models as any).Partner;
}

export default mongoose.model<IPartner>('Partner', PartnerSchema);
