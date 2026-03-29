import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import FormField from '@/app/lib/models/FormField';
import { verifyAuth } from '@/app/lib/auth';

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
    const field = await FormField.findByIdAndUpdate(id, body, { new: true });
    if (!field) return NextResponse.json({ error: 'Field not found' }, { status: 404 });
    return NextResponse.json(field);
  } catch (error) {
    console.error('Update field error:', error);
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
    const field = await FormField.findByIdAndDelete(id);
    if (!field) return NextResponse.json({ error: 'Field not found' }, { status: 404 });
    return NextResponse.json({ message: 'Field deleted' });
  } catch (error) {
    console.error('Delete field error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
