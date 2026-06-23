import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  submittedAt: Date;
}

const InquirySchema = new Schema<IInquiry>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, default: '' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied'], 
    default: 'new' 
  },
  submittedAt: { type: Date, default: Date.now }
});

InquirySchema.index({ email: 1 });
InquirySchema.index({ status: 1 });
InquirySchema.index({ submittedAt: -1 });

if (mongoose.models.Inquiry) {
  delete (mongoose.models as any).Inquiry;
}

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);
