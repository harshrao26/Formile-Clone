import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import FormField from '@/app/lib/models/FormField';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const activeOnly = searchParams.get('active');

    const filter: Record<string, unknown> = {};
    if (partnerId) {
      filter.$or = [{ partnerId }, { partnerId: null }];
    }
    if (activeOnly === 'true') {
      filter.isActive = true;
    }

    const fields = await FormField.find(filter).sort({ order: 1 });
    return NextResponse.json(fields);
  } catch (error) {
    console.error('Get fields error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();

    if (!body.label || !body.fieldKey) {
      return NextResponse.json({ error: 'Label and fieldKey are required' }, { status: 400 });
    }

    const field = await FormField.create(body);
    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    console.error('Create field error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
