import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import OTP from '@/app/lib/models/OTP';
import { sendOTPEmail } from '@/app/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 2. Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Save OTP (Delete existing for this email/type first)
    await OTP.deleteMany({ email: email.toLowerCase(), type: 'signup' });
    await OTP.create({
      email: email.toLowerCase(),
      otp: otpCode,
      type: 'signup',
      expiresAt,
    });

    // 4. Send Email
    const emailRes = await sendOTPEmail(email, otpCode, 'signup');
    if (!emailRes.success) {
      return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Signup request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
