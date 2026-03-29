import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import OTP from '@/app/lib/models/OTP';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password, otp } = await request.json();

    if (!name || !email || !password || !otp) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 1. Verify OTP
    const otpDoc = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      type: 'signup',
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // 2. Clear OTP
    await OTP.deleteMany({ email: email.toLowerCase(), type: 'signup' });

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create Admin
    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return NextResponse.json({
      message: 'Signup successful',
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.error('Signup verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
