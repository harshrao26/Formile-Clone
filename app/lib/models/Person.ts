import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPerson extends Document {
  name: string;
  slug: string;
  partnerId: Types.ObjectId;
  createdAt: Date;
}

const PersonSchema = new Schema<IPerson>({
  name: { type: String, required: true },
  slug: { type: String, required: true, lowercase: true },
  partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
  createdAt: { type: Date, default: Date.now },
});

PersonSchema.index({ partnerId: 1, slug: 1 }, { unique: true });

export default mongoose.models.Person || mongoose.model<IPerson>('Person', PersonSchema);
