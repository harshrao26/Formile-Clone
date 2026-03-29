import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';
import Person from '@/app/lib/models/Person';
    // Get the company's original URL and form heading
    await partner.populate(['companyId', 'formId']);
    const redirectUrl = (partner.companyId as unknown as { originalUrl: string })?.originalUrl || '';
    const formHeading = (partner.formId as unknown as { heading: string })?.heading || 'Claim Your Offer';

    // Trigger Email Notifications (Non-blocking or at least error-safe)
    try {
      await sendLeadNotification(partner.email, partner.name, formData);
      
      const userEmail = formData.email || formData.Email;
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
