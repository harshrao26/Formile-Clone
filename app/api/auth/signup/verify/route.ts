import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import OTP from '@/app/lib/models/OTP';
import bcrypt from 'bcryptjs';
import { validatePhone } from '@/app/lib/validation';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password, phone, otp } = await request.json();

    if (!name || !email || !password || !phone || !otp) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Invalid mobile number format' }, { status: 400 });
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
      phone: phone.trim(),
    });

    return NextResponse.json({
      message: 'Signup successful',
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, phone: admin.phone },
    });
  } catch (error) {
    console.error('Signup verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
