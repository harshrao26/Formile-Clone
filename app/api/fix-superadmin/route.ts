import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import bcryptjs from 'bcryptjs';

// One-time fix route: forcefully sets harsh@genforgestudio.com as superadmin
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const hashedPassword = await bcryptjs.hash('12345678', 12);

    const admin = await Admin.findOneAndUpdate(
      { email: 'harsh@email.com' },
      { 
        $set: { 
          role: 'superadmin',
          password: hashedPassword,
          name: 'Harsh Admin',
        } 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      admin: { email: admin.email, role: admin.role, name: admin.name } 
    });
  } catch (error) {
    console.error('Fix error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
