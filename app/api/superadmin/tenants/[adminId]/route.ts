import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';
import Company from '@/app/lib/models/Company';
import Person from '@/app/lib/models/Person';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ adminId: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth || auth.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();
    const { adminId } = await params;

    // Get admin info
    const admin = await Admin.findById(adminId).select('name email createdAt role').lean();
    if (!admin) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const filter = { adminId };

    // Get all data for this tenant
    const [leads, partners, companies, persons, leadCount, partnerCount, companyCount, personCount] = await Promise.all([
      LeadSubmission.find(filter)
        .populate('partnerId', 'name slug')
        .populate('personId', 'name slug')
        .sort({ submittedAt: -1 })
        .limit(100)
        .lean(),
      Partner.find(filter).select('name slug createdAt').lean(),
      Company.find(filter).select('name createdAt').lean(),
      Person.find(filter).select('name slug createdAt').lean(),
      LeadSubmission.countDocuments(filter),
      Partner.countDocuments(filter),
      Company.countDocuments(filter),
      Person.countDocuments(filter),
    ]);

    // Partner-wise lead breakdown
    const partnerLeadCounts = await LeadSubmission.aggregate([
      { $match: { adminId: admin._id } },
      { $group: { _id: '$partnerId', count: { $sum: 1 } } },
    ]);

    const partnersWithLeads = partners.map((p: Record<string, unknown>) => {
      const found = partnerLeadCounts.find(
        (plc: { _id: unknown; count: number }) => plc._id?.toString() === (p._id as { toString(): string })?.toString()
      );
      return { ...p, leadCount: found ? found.count : 0 };
    });

    return NextResponse.json({
      admin,
      stats: { leadCount, partnerCount, companyCount, personCount },
      leads,
      partners: partnersWithLeads,
      companies,
      persons,
    });
  } catch (error) {
    console.error('Superadmin tenant detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
