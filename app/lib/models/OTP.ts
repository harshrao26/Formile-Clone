import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  type: 'signup' | 'reset';
  expiresAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  type: { type: String, enum: ['signup', 'reset'], required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

// Compound index for unique OTP per email and type? 
// No, just allow multiple, we check the latest or match exactly.
OTPSchema.index({ email: 1, type: 1 });

export default mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);
