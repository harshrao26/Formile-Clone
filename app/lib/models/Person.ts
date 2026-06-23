import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPerson extends Document {
  adminId: Types.ObjectId;
  name: string;
  slug: string;
  partnerId: Types.ObjectId;
  createdAt: Date;
}

const PersonSchema = new Schema<IPerson>({
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, lowercase: true },
  partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
  createdAt: { type: Date, default: Date.now },
});

PersonSchema.index({ partnerId: 1, slug: 1 }, { unique: true });

if (mongoose.models.Person) {
  delete (mongoose.models as any).Person;
}

export default mongoose.model<IPerson>('Person', PersonSchema);
