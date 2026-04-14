import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const alreadyExists = await Admin.findOne({ email: 'support@zeeoffer.com' });
    if (alreadyExists) {
      return NextResponse.json({ message: 'Default admin already exists' });
    }

    const hashedPassword = await bcryptjs.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'ZeeOffer@2024', 12);
    const admin = await Admin.create({
      email: 'support@zeeoffer.com',
      password: hashedPassword,
      name: 'Harsh Admin',
      role: 'superadmin',
    });

    return NextResponse.json({ message: 'Admin created', admin: { email: admin.email, name: admin.name } });
  } catch (error) {
    console.error('Seed admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
