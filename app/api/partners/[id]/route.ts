import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Partner from '@/app/lib/models/Partner';
import { verifyAuth } from '@/app/lib/auth';
import FormTemplate from '@/app/lib/models/FormTemplate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { id } = await params;
    const filter: any = { _id: id };
    if (auth.role !== 'superadmin') filter.adminId = auth.adminId;

    const partner = await Partner.findOne(filter).populate('companyId', 'name').populate('formId', 'name');
    if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    return NextResponse.json(partner);
  } catch (error) {
    console.error('Get partner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const filter: any = { _id: id };
    if (auth.role !== 'superadmin') filter.adminId = auth.adminId;

    if (body.slug) {
      const existingPartner = await Partner.findOne({ slug: body.slug.toLowerCase(), _id: { $ne: id } });
      if (existingPartner) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }
      body.slug = body.slug.toLowerCase();
    }

    const partner = await Partner.findOneAndUpdate(filter, body, { new: true });
    if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    return NextResponse.json(partner);
  } catch (error) {
    console.error('Update partner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { id } = await params;
    
    const filter: any = { _id: id };
    if (auth.role !== 'superadmin') filter.adminId = auth.adminId;

    const partner = await Partner.findOneAndDelete(filter);
    if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    return NextResponse.json({ message: 'Partner deleted' });
  } catch (error) {
    console.error('Delete partner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
