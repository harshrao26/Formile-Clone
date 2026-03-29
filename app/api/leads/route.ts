import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';
import Person from '@/app/lib/models/Person';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const personId = searchParams.get('personId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filter: Record<string, unknown> = {};
    if (partnerId) filter.partnerId = partnerId;
    if (personId) filter.personId = personId;

    const total = await LeadSubmission.countDocuments(filter);
    const leads = await LeadSubmission.find(filter)
      .populate('partnerId', 'name slug')
      .populate('personId', 'name slug')
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
