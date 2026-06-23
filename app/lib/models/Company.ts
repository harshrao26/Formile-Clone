import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  adminId: mongoose.Types.ObjectId;
  name: string;
  originalUrl: string;
  createdAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models.Company) {
  delete (mongoose.models as any).Company;
}

export default mongoose.model<ICompany>('Company', CompanySchema);
