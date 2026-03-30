import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import { verifyAuth } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth || auth.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();
    const { adminId, plan, subscriptionStatus, expiryDate } = await request.json();

    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 });
    }

    const updateData: any = { 
      plan, 
      subscriptionStatus 
    };

    if (expiryDate) {
      updateData.expiryDate = new Date(expiryDate);
    } else {
      updateData.$unset = { expiryDate: 1 };
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      admin: {
        id: updatedAdmin._id,
        name: updatedAdmin.name,
        plan: updatedAdmin.plan,
        subscriptionStatus: updatedAdmin.subscriptionStatus,
        expiryDate: updatedAdmin.expiryDate
      } 
    });
  } catch (error) {
    console.error('Update plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
