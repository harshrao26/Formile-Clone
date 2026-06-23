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
    const admin = await Admin.findById(adminId).select('name email phone role plan subscriptionStatus expiryDate createdAt').lean();
    if (!admin) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const filter = { adminId };
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Get all data for this tenant
    const [leads, partners, companies, persons, leadCount, partnerCount, companyCount, personCount, trendsRaw] = await Promise.all([
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
      LeadSubmission.aggregate([
        { 
          $match: { 
            adminId: admin._id,
            submittedAt: { $gte: thirtyDaysAgo }
          } 
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt", timezone: "+05:30" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Partner-wise lead breakdown
    const partnerLeadCounts = await LeadSubmission.aggregate([
      { $match: { adminId: admin._id } },
      { $group: { _id: '$partnerId', count: { $sum: 1 } } },
    ]);

    const partnersWithLeads = partners.map((p: any) => {
      const found = partnerLeadCounts.find(
        (plc: { _id: unknown; count: number }) => plc._id?.toString() === p._id?.toString()
      );
      return { ...p, leadCount: found ? found.count : 0 };
    });

    // Format lead trends with zero padding for missing days
    const leadTrendsMap = new Map<string, number>();
    (trendsRaw || []).forEach((t: any) => {
      if (t._id) {
        leadTrendsMap.set(t._id, t.count);
      }
    });

    const leadTrends = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      leadTrends.push({
        date: dateString,
        count: leadTrendsMap.get(dateString) || 0
      });
    }

    return NextResponse.json({
      admin,
      stats: { leadCount, partnerCount, companyCount, personCount },
      leads,
      partners: partnersWithLeads,
      companies,
      persons,
      leadTrends
    });
  } catch (error) {
    console.error('Superadmin tenant detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
