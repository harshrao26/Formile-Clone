import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const alreadyExists = await Admin.findOne({ email: 'harsh@genforgestudio.com' });
    if (alreadyExists) {
      return NextResponse.json({ error: 'Superadmin already exists' }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash('12345678', 12);
    const admin = await Admin.create({
      email: 'harsh@genforgestudio.com',
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
