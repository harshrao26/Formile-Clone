import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILeadSubmission extends Document {
  adminId: Types.ObjectId;
  token: string;
  partnerId: Types.ObjectId;
  personId?: Types.ObjectId;
  formData: Record<string, string>;
  sourceUrl: string;
  ipAddress: string;
  submittedAt: Date;
}

const LeadSubmissionSchema = new Schema<ILeadSubmission>({
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  token: { type: String, required: true, unique: true },
  partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
  personId: { type: Schema.Types.ObjectId, ref: 'Person', default: null },
  formData: { type: Schema.Types.Mixed, required: true },
  sourceUrl: { type: String, default: '' },
  ipAddress: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
});

LeadSubmissionSchema.index({ partnerId: 1 });
LeadSubmissionSchema.index({ token: 1 });

export default mongoose.models.LeadSubmission || mongoose.model<ILeadSubmission>('LeadSubmission', LeadSubmissionSchema);
