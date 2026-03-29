import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth || auth.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const adminFilter = searchParams.get('adminId');
    const partnerFilter = searchParams.get('partnerId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build filter
    const filter: Record<string, unknown> = {};
    if (adminFilter) filter.adminId = adminFilter;
    if (partnerFilter) filter.partnerId = partnerFilter;
    if (dateFrom || dateTo) {
      filter.submittedAt = {};
      if (dateFrom) (filter.submittedAt as Record<string, unknown>).$gte = new Date(dateFrom);
      if (dateTo) (filter.submittedAt as Record<string, unknown>).$lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      LeadSubmission.find(filter)
        .populate('partnerId', 'name slug')
        .populate('personId', 'name slug')
        .populate('adminId', 'name email')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LeadSubmission.countDocuments(filter),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Superadmin leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
