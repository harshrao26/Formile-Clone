import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import { verifyAuth } from '@/app/lib/auth';
import { validatePhone } from '@/app/lib/validation';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format. Must be a valid 10-15 digit phone number.' }, { status: 400 });
    }

    // Check if phone number is already registered (check last 10 digits to prevent prefix bypass)
    const digits = phone.replace(/\D/g, '');
    const suffix = digits.substring(digits.length - 10);
    
    // Check if another admin has this phone number
    const existingAdminByPhone = await Admin.findOne({
      _id: { $ne: auth.adminId },
      phone: { $regex: new RegExp(suffix + '$') }
    });
    
    if (existingAdminByPhone) {
      return NextResponse.json({ error: 'Mobile number already registered by another account.' }, { status: 400 });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      auth.adminId,
      { phone: phone.trim() },
      { new: true }
    );

    if (!updatedAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        adminId: updatedAdmin._id.toString(),
        subscriptionStatus: updatedAdmin.subscriptionStatus,
        expiryDate: updatedAdmin.expiryDate,
        phone: updatedAdmin.phone
      }
    });
  } catch (error) {
    console.error('Update phone error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
