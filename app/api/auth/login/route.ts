import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import bcryptjs from 'bcryptjs';
import { createToken } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcryptjs.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createToken({ adminId: admin._id.toString(), email: admin.email, role: admin.role });

    return NextResponse.json({
      token,
      admin: { 
        name: admin.name, 
        email: admin.email, 
        role: admin.role,
        adminId: admin._id.toString(),
        subscriptionStatus: admin.subscriptionStatus,
        expiryDate: admin.expiryDate,
        phone: admin.phone
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
