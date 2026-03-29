import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Company from '@/app/lib/models/Company';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const companies = await Company.find({}).sort({ createdAt: -1 });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { name, originalUrl } = await request.json();

    if (!name || !originalUrl) {
      return NextResponse.json({ error: 'Name and original URL are required' }, { status: 400 });
    }

    const company = await Company.create({ name, originalUrl });
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Create company error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
