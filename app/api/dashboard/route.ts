import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';
import Company from '@/app/lib/models/Company';
import Person from '@/app/lib/models/Person';
import FormField from '@/app/lib/models/FormField';
import Admin from '@/app/lib/models/Admin';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const filter = auth.role === 'superadmin' ? {} : { adminId: auth.adminId };

    // Fetch admin subscription details
    const currentAdmin = await Admin.findById(auth.adminId).select('plan subscriptionStatus expiryDate createdAt').lean();

    const [
      totalLeads,
      totalPartners,
      totalCompanies,
      totalPersons,
      totalFields,
      recentLeadsResults,
    ] = await Promise.all([
      LeadSubmission.countDocuments(filter),
      Partner.countDocuments(filter),
      Company.countDocuments(filter),
      Person.countDocuments(filter),
      FormField.countDocuments(filter),
      LeadSubmission.find(filter)
        .populate('partnerId', 'name slug')
        .populate('personId', 'name slug')
        .populate(auth.role === 'superadmin' ? { path: 'adminId', select: 'name email' } : [])
        .sort({ submittedAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return NextResponse.json({
      stats: {
        totalLeads,
        totalPartners,
        totalCompanies,
        totalPersons,
        totalFields,
      },
      subscription: {
        plan: currentAdmin?.plan || 'free',
        status: currentAdmin?.subscriptionStatus || 'inactive',
        expiryDate: currentAdmin?.expiryDate,
        createdAt: currentAdmin?.createdAt,
      },
      recentLeads: recentLeadsResults,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
