import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';
import Company from '@/app/lib/models/Company';
import Person from '@/app/lib/models/Person';
import FormField from '@/app/lib/models/FormField';
import FormTemplate from '@/app/lib/models/FormTemplate';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth || auth.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();

    // Current date calculations
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Core KPIs
    const [
      totalAdmins,
      totalLeads,
      leadsToday,
      leadsThisMonth,
      totalPartners,
      totalCompanies,
      totalPersons,
      totalForms,
      totalFields,
      recentLeads,
    ] = await Promise.all([
      Admin.countDocuments({ role: { $ne: 'superadmin' } }),
      LeadSubmission.countDocuments({}),
      LeadSubmission.countDocuments({ submittedAt: { $gte: startOfToday } }),
      LeadSubmission.countDocuments({ submittedAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } }),
      Partner.countDocuments({}),
      Company.countDocuments({}),
      Person.countDocuments({}),
      FormTemplate.countDocuments({}),
      FormField.countDocuments({}),
      LeadSubmission.find({})
        .populate('partnerId', 'name slug')
        .populate('personId', 'name slug')
        .populate('adminId', 'name email')
        .sort({ submittedAt: -1 })
        .limit(20)
        .lean(),
    ]);

    // Active tenants (admins with leads in last 30 days)
    const activeAdminIds = await LeadSubmission.distinct('adminId', {
      submittedAt: { $gte: thirtyDaysAgo },
    });
    const activeTenants = activeAdminIds.length;

    // Monthly lead chart (last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyData = await LeadSubmission.aggregate([
      { $match: { submittedAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$submittedAt' },
            month: { $month: '$submittedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const found = monthlyData.find(
        (m: { _id: { year: number; month: number }; count: number }) => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1
      );
      chartData.push({
        month: monthNames[d.getMonth()],
        leads: found ? found.count : 0,
      });
    }

    // Top tenants by lead count
    const topTenants = await LeadSubmission.aggregate([
      { $group: { _id: '$adminId', leadCount: { $sum: 1 } } },
      { $sort: { leadCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'admins',
          localField: '_id',
          foreignField: '_id',
          as: 'admin',
        },
      },
      { $unwind: '$admin' },
      {
        $project: {
          _id: 1,
          leadCount: 1,
          name: '$admin.name',
          email: '$admin.email',
          createdAt: '$admin.createdAt',
        },
      },
    ]);

    return NextResponse.json({
      stats: {
        totalAdmins,
        activeTenants,
        totalLeads,
        leadsToday,
        leadsThisMonth,
        totalPartners,
        totalCompanies,
        totalPersons,
        totalForms,
        totalFields,
      },
      chartData,
      topTenants,
      recentLeads,
    });
  } catch (error) {
    console.error('Superadmin overview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
