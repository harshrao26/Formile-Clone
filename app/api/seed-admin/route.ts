import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash('Abid@9721@Khan', 12);
    const admin = await Admin.create({
      email: 'admin@formile.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'superadmin',
    });

    return NextResponse.json({ message: 'Admin created', admin: { email: admin.email, name: admin.name } });
  } catch (error) {
    console.error('Seed admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
