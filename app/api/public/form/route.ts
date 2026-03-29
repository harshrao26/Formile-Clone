import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Partner from '@/app/lib/models/Partner';
import FormTemplate from '@/app/lib/models/FormTemplate';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const partnerSlug = searchParams.get('partnerSlug');

    if (!partnerSlug) {
      return NextResponse.json({ error: 'Missing partnerSlug' }, { status: 400 });
    }

    const partner = await Partner.findOne({ slug: partnerSlug.toLowerCase() });
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    let activeFields = ['full_name', 'email', 'phone'];
    let customFields: any[] = [];
    let heading = 'Claim Your Offer';
    let theme = 'dark';
    let backgroundImage = null;
    
    if (partner.formId) {
      const template = await FormTemplate.findById(partner.formId);
      if (template) {
        if (template.activeFields) activeFields = template.activeFields;
        if (template.customFields) customFields = template.customFields;
        if (template.heading) heading = template.heading;
        if (template.theme) theme = template.theme;
        if (template.backgroundImage) backgroundImage = template.backgroundImage;
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
      companyId: partner.companyId,
      heading,
      theme,
      backgroundImage
    });
  } catch (error) {
    console.error('Public fetch form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
