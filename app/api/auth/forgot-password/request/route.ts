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

    // 1. Check if admin exists
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      // Security: Don't reveal if user doesn't exist? 
      // User says 'forgot password ko bhi bnao', so let's keep it simple for now.
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Generate Reset OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Save OTP
    await OTP.deleteMany({ email: email.toLowerCase(), type: 'reset' });
    await OTP.create({
      email: email.toLowerCase(),
      otp: otpCode,
      type: 'reset',
      expiresAt,
    });

    // 4. Send Email
    const emailRes = await sendOTPEmail(email, otpCode, 'reset');
    if (!emailRes.success) {
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Reset code sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
