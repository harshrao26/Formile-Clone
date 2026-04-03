import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Partner from '@/app/lib/models/Partner';
import FormTemplate from '@/app/lib/models/FormTemplate';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const partnerSlug = searchParams.get('partnerSlug');
    const formId = searchParams.get('formId');

    if (!partnerSlug) {
      return NextResponse.json({ error: 'Missing partnerSlug' }, { status: 400 });
    }

    let adminId = null;
    let companyId = null;
    let partnerId = null;

    const lowerSlug = partnerSlug.toLowerCase();
    if (lowerSlug === 'generic' || lowerSlug === 'platform') {
      if (!formId) return NextResponse.json({ error: 'formId is required for generic links' }, { status: 400 });
      const template = await FormTemplate.findById(formId);
      if (!template) return NextResponse.json({ error: 'Form not found' }, { status: 404 });
      adminId = template.adminId;
    } else {
      const partner = await Partner.findOne({ slug: lowerSlug });
      if (!partner) {
        return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
      }
      // Increment views atomically
      await Partner.updateOne({ _id: partner._id }, { $inc: { views: 1 } });
      adminId = partner.adminId;
      companyId = partner.companyId;
      partnerId = partner._id;
    }

    let activeFields = ['full_name', 'email', 'phone'];
    let customFields: any[] = [];
    let heading = 'Claim Your Offer';
    let theme = 'dark';
    let backgroundImage = null;
    let redirectUrl = null;
    
    // If we have a direct formId, prioritize it. 
    // Otherwise fallback to partner's assigned form if available.
    const targetFormId = formId || (partnerId ? (await Partner.findById(partnerId))?.formId : null);

    if (targetFormId) {
      const template = await FormTemplate.findById(targetFormId);
      if (template) {
        if (template.activeFields) activeFields = template.activeFields;
        if (template.customFields) customFields = template.customFields;
        if (template.heading) heading = template.heading;
        if (template.theme) theme = template.theme;
        if (template.backgroundImage) backgroundImage = template.backgroundImage;
        // This is a target URL for post-submission, not immediate redirect
        redirectUrl = template.redirectUrl;
      }
    } else if (partnerId) {
      // If no formId, but partner has a direct redirect URL, we can skip the form
      const partnerObj = await Partner.findById(partnerId);
      if (partnerObj?.redirectUrl) {
        return NextResponse.json({ 
          redirectUrl: partnerObj.redirectUrl,
          directRedirect: true 
        });
      }
    }

    // Map active fields to UI config
    const PREDEFINED_FIELDS: Record<string, any> = {
      'full_name': { key: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
      'email': { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', required: true },
      'phone': { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', required: true },
      'company': { key: 'company', label: 'Company Name', type: 'text', placeholder: 'Your company', required: false },
      'job_title': { key: 'job_title', label: 'Job Title', type: 'text', placeholder: 'e.g. Marketing Manager', required: false },
      'city': { key: 'city', label: 'City', type: 'text', placeholder: 'Your city', required: false },
      'budget': { key: 'budget', label: 'Estimated Budget', type: 'text', placeholder: 'e.g. $5,000 - $10,000', required: false },
      'notes': { key: 'notes', label: 'Additional Notes', type: 'textarea', placeholder: 'Anything else we should know?', required: false }
    };

    const resolvedFields = activeFields.map(key => {
      if (PREDEFINED_FIELDS[key]) return PREDEFINED_FIELDS[key];
      
      const customField = customFields.find((cf: any) => cf.key === key);
      if (customField) {
        return {
          key: customField.key,
          label: customField.label,
          type: customField.type || 'text',
          placeholder: `Enter ${customField.label.toLowerCase()}`,
          required: false
        };
      }
      return null;
    }).filter(Boolean);

    return NextResponse.json({ 
      fields: resolvedFields, 
      companyId: companyId,
      heading,
      theme,
      backgroundImage,
      redirectUrl, // This is now only for post-submission if targetFormId was present
      directRedirect: false
    });
  } catch (error) {
    console.error('Public fetch form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
