import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import OTP from '@/app/lib/models/OTP';
import { sendOTPEmail } from '@/app/lib/mailer';
import { validatePhone } from '@/app/lib/validation';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, phone } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }
    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Invalid mobile number format' }, { status: 400 });
    }

    // 1. Check if user already exists by email
    const existingAdminByEmail = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdminByEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Check if phone number is already registered (check last 10 digits to prevent prefix bypass)
    const digits = phone.replace(/\D/g, '');
    const suffix = digits.substring(digits.length - 10);
    const existingAdminByPhone = await Admin.findOne({
      phone: { $regex: new RegExp(suffix + '$') }
    });
    if (existingAdminByPhone) {
      return NextResponse.json({ error: 'Mobile number already registered' }, { status: 400 });
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
