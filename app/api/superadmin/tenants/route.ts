import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';
import Company from '@/app/lib/models/Company';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth || auth.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get all non-superadmin admins
    const admins = await Admin.find({ role: { $ne: 'superadmin' } })
      .select('name email createdAt plan subscriptionStatus expiryDate')
      .sort({ createdAt: -1 })
      .lean();

    // For each admin, get their metrics
    const tenantsWithMetrics = await Promise.all(
      admins.map(async (admin) => {
        const [leadCount, partnerCount, companyCount, recentLeadCount] = await Promise.all([
          LeadSubmission.countDocuments({ adminId: admin._id }),
          Partner.countDocuments({ adminId: admin._id }),
          Company.countDocuments({ adminId: admin._id }),
          LeadSubmission.countDocuments({
            adminId: admin._id,
            submittedAt: { $gte: thirtyDaysAgo },
          }),
        ]);

        return {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          createdAt: admin.createdAt,
          leadCount,
          partnerCount,
          companyCount,
          isActive: recentLeadCount > 0,
          recentLeadCount,
          plan: admin.plan || 'free',
          subscriptionStatus: admin.subscriptionStatus || 'inactive',
          expiryDate: admin.expiryDate,
        };
      })
    );

    return NextResponse.json({ tenants: tenantsWithMetrics });
  } catch (error) {
    console.error('Superadmin tenants error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
