import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import OTP from '@/app/lib/models/OTP';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, password, otp } = await request.json();

    if (!email || !password || !otp) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 1. Verify Reset OTP
    const otpDoc = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      type: 'reset',
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 });
    }

    // 2. Clear OTP
    await OTP.deleteMany({ email: email.toLowerCase(), type: 'reset' });

    // 3. Update Admin Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashedPassword },
      { new: true }
    );

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
