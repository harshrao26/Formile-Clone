import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';
import Person from '@/app/lib/models/Person';
import crypto from 'crypto';
import { sendLeadNotification, sendUserConfirmation } from '@/app/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { partnerSlug, personSlug, formData, sourceUrl } = await request.json();

    if (!partnerSlug || !formData) {
      return NextResponse.json({ error: 'partnerSlug and formData are required' }, { status: 400 });
    }

    const partner = await Partner.findOne({ slug: partnerSlug.toLowerCase() });
    if (!partner) {
      return NextResponse.json({ error: 'Invalid partner link' }, { status: 404 });
    }

    let person = null;
    if (personSlug) {
      person = await Person.findOne({ partnerId: partner._id, slug: personSlug.toLowerCase() });
    }

    const token = crypto.randomBytes(16).toString('hex');

    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const lead = await LeadSubmission.create({
      token,
      partnerId: partner._id,
      personId: person?._id || null,
      formData,
      sourceUrl: sourceUrl || '',
      ipAddress,
    });

    // Get the company's original URL and form heading
    await partner.populate(['companyId', 'formId']);
    const redirectUrl = (partner.companyId as unknown as { originalUrl: string })?.originalUrl || '';
    const formHeading = (partner.formId as unknown as { heading: string })?.heading || 'Claim Your Offer';

    // Trigger Email Notifications (Non-blocking or at least error-safe)
    try {
      await sendLeadNotification(partner.email, partner.name, formData);
      
      const userEmail = formData.email || formData.Email || formData['Email'] || formData['email'];
      if (userEmail) {
        await sendUserConfirmation(userEmail, formHeading);
      }
    } catch (emailError) {
      console.error('Notification failed but lead was saved:', emailError);
    }

    return NextResponse.json({
      success: true,
      token: lead.token,
      redirectUrl,
    }, { status: 201 });
  } catch (error) {
    console.error('Submit lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
