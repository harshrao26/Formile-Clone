import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  originalUrl: string;
  createdAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
