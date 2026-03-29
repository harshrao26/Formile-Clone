import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import FormTemplate from '@/app/lib/models/FormTemplate';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const forms = await FormTemplate.find({}).sort({ createdAt: -1 });
    return NextResponse.json(forms);
  } catch (error) {
    console.error('Fetch forms error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { name, activeFields } = await request.json();
    if (!name) return NextResponse.json({ error: 'Form name is required' }, { status: 400 });

    const newForm = await FormTemplate.create({
      name,
      activeFields: activeFields || [],
      customFields: [],
    });

    return NextResponse.json(newForm, { status: 201 });
  } catch (error) {
    console.error('Create form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
