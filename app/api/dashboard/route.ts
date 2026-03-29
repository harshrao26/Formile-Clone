import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';
import Company from '@/app/lib/models/Company';
import Person from '@/app/lib/models/Person';
import FormField from '@/app/lib/models/FormField';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();

    const [
      totalLeads,
      totalPartners,
      totalCompanies,
      totalPersons,
      totalFields,
      recentLeads,
    ] = await Promise.all([
      LeadSubmission.countDocuments(),
      Partner.countDocuments(),
      Company.countDocuments(),
      Person.countDocuments(),
      FormField.countDocuments(),
      LeadSubmission.find({})
        .populate('partnerId', 'name slug')
        .populate('personId', 'name slug')
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
      recentLeads,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
