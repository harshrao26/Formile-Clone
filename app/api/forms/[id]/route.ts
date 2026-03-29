import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import FormTemplate from '@/app/lib/models/FormTemplate';
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
    
    const form = await FormTemplate.findByIdAndUpdate(id, body, { new: true });
    if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    
    return NextResponse.json(form);
  } catch (error) {
    console.error('Update form error:', error);
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
    const form = await FormTemplate.findByIdAndDelete(id);
    if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    return NextResponse.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Delete form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
