import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Person from '@/app/lib/models/Person';
import { verifyAuth } from '@/app/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ personId: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { personId } = await params;
    
    const filter: any = { _id: personId };
    if (auth.role !== 'superadmin') filter.adminId = auth.adminId;

    const person = await Person.findOneAndDelete(filter);
    if (!person) return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    return NextResponse.json({ message: 'Person deleted' });
  } catch (error) {
    console.error('Delete person error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
