import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Person from '@/app/lib/models/Person';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { id } = await params;
    const persons = await Person.find({ partnerId: id }).sort({ createdAt: -1 });
    return NextResponse.json(persons);
  } catch (error) {
    console.error('Get persons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { id } = await params;
    const { name, slug } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const existingPerson = await Person.findOne({ partnerId: id, slug: slug.toLowerCase() });
    if (existingPerson) {
      return NextResponse.json({ error: 'Slug already exists for this partner' }, { status: 400 });
    }

    const person = await Person.create({ name, slug: slug.toLowerCase(), partnerId: id });
    return NextResponse.json(person, { status: 201 });
  } catch (error) {
    console.error('Create person error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
