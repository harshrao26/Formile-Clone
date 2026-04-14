import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Inquiry from '@/app/lib/models/Inquiry';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const inquiry = await Inquiry.create({
      name,
      email,
      company,
      subject,
      message,
      status: 'new'
    });

    return NextResponse.json({
      message: 'Inquiry submitted successfully',
      id: inquiry._id
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
