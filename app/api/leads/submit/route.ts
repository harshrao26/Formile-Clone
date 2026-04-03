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

    let adminId = null;
    let partnerId = null;
    let partnerEmail = '';
    let partnerName = 'Generic';

    const lowerSlug = (partnerSlug || 'generic').toLowerCase();
    
    if (lowerSlug === 'generic' || lowerSlug === 'platform') {
      const FormTemplate = (await import('@/app/lib/models/FormTemplate')).default;
      const fId = new URL(sourceUrl || '', 'http://local').searchParams.get('f');

      if (!fId) return NextResponse.json({ error: 'formId not found in source URL' }, { status: 400 });
      
      const template = await FormTemplate.findById(fId);
      if (!template) return NextResponse.json({ error: 'Form template not found' }, { status: 404 });
      
      adminId = template.adminId;
      partnerEmail = 'support@genforgestudio.com'; // Default admin contact
    } else {
      const partner = await Partner.findOne({ slug: lowerSlug });
      if (!partner) {
        return NextResponse.json({ error: 'Invalid partner link' }, { status: 404 });
      }
      adminId = partner.adminId;
      partnerId = partner._id;
      partnerEmail = partner.email;
      partnerName = partner.name;
    }

    let person = null;
    if (personSlug && partnerId) {
      person = await Person.findOne({ partnerId: partnerId, slug: personSlug.toLowerCase() });
    }

    const token = crypto.randomBytes(6).toString('hex');

    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const urlObj = new URL(sourceUrl || '', 'http://local');
    const fId = urlObj.searchParams.get('f');

    // Extract tracking token from common parameters
    const trackingParams = ['aff_sub1', 'token', 's1', 'click_id', 'aff_id', 'subid'];
    let trackingToken = '';
    for (const param of trackingParams) {
      const val = urlObj.searchParams.get(param);
      if (val) {
        trackingToken = val;
        break;
      }
    }

    const lead = await LeadSubmission.create({
      token,
      adminId: adminId,
      partnerId: partnerId,
      formId: fId || null,
      personId: person?._id || null,
      formData,
      sourceUrl: sourceUrl || '',
      trackingToken,
      ipAddress,
    });

    // Get the redirect URL and form heading
    let redirectUrl = '';
    let formHeading = 'Claim Your Offer';

    if (fId) {
      const FormTemplate = (await import('@/app/lib/models/FormTemplate')).default;
      const template = await FormTemplate.findById(fId);
      if (template) {
        formHeading = template.heading || 'Claim Your Offer';
        
        // Final Redirect Decision: 
        // 1. Form Specific Redirect 
        // 2. Company Original URL (if partner exists)
        // 3. Platform Default
        if (template.redirectUrl) {
          redirectUrl = template.redirectUrl;
        } else if (partnerId) {
          const PartnerModel = (await import('@/app/lib/models/Partner')).default;
          const fullPartner = await PartnerModel.findById(partnerId).populate('companyId');
          redirectUrl = (fullPartner?.companyId as any)?.originalUrl || 'https://genforgestudio.com';
        } else {
          redirectUrl = 'https://genforgestudio.com';
        }
      }
    }

    // Legacy scrub: replace formile.com with genforgestudio.com
    if (redirectUrl.includes('formile.com')) {
      redirectUrl = 'https://genforgestudio.com';
    }

    // === Affiliate Token Replacement ===
    // The lead's unique token serves as the Click ID / Sub-Affiliate ID
    const leadToken = lead.token;
    
    // 1. Replace {token} placeholder (e.g., sub_aff_id={token})
    if (redirectUrl.includes('{token}')) {
      redirectUrl = redirectUrl.replace(/\{token\}/g, leadToken);
    }
    // 2. Replace {click_id} placeholder
    if (redirectUrl.includes('{click_id}')) {
      redirectUrl = redirectUrl.replace(/\{click_id\}/g, leadToken);
    }
    // 3. Legacy: Replace {replace_it} placeholder (old format)
    if (redirectUrl.includes('{replace_it}')) {
      redirectUrl = redirectUrl.replace(/\{replace_it\}/g, lead.trackingToken || leadToken);
    }
    // 4. Auto-append: If URL ends with '=' (e.g., &sub_aff_id=), automatically append token
    // This handles the pattern: https://network.com/c?o=123&sub_aff_id=
    if (redirectUrl.endsWith('=')) {
      redirectUrl = redirectUrl + leadToken;
    }

    // Trigger Email Notifications (Non-blocking or at least error-safe)
    try {
      if (partnerEmail) {
        await sendLeadNotification(partnerEmail, partnerName, formData);
      }
      
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
