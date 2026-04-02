import mongoose from 'mongoose';
import dbConnect from '../app/lib/mongodb';
import FormTemplate from '../app/lib/models/FormTemplate';
import LeadSubmission from '../app/lib/models/LeadSubmission';
import crypto from 'crypto';

async function testAffiliateTracking() {
  try {
    await dbConnect();
    console.log('Connected to DB');

    // 1. Find a form template or create a mock one
    let template = await FormTemplate.findOne().lean();
    if (!template) {
      console.log('No template found, creating one...');
      const mockAdminId = new mongoose.Types.ObjectId();
      template = await FormTemplate.create({
        adminId: mockAdminId,
        name: 'Test Form',
        activeFields: ['email'],
        redirectUrl: 'https://example.com?click={replace_it}'
      });
    }

    console.log('Template Data:', JSON.stringify(template, null, 2));

    const formId = template._id;
    const adminId = template.adminId || new mongoose.Types.ObjectId();
    console.log('Using Form ID:', formId);
    console.log('Using Admin ID:', adminId);

    // 2. Mock submission via direct function call logic (simulating the API)
    const sourceUrl = `https://yourdomain.com/form?f=${formId}&aff_sub1=TRACK_12345`;
    const urlObj = new URL(sourceUrl);
    
    // Extract tracking token logic (copied from route.ts)
    const trackingParams = ['aff_sub1', 'token', 's1', 'click_id', 'aff_id', 'subid'];
    let trackingToken = '';
    for (const param of trackingParams) {
      const val = urlObj.searchParams.get(param);
      if (val) {
        trackingToken = val;
        break;
      }
    }

    console.log('Extracted Tracking Token:', trackingToken);

    // Create lead
    const leadToken = crypto.randomBytes(16).toString('hex');
    const lead = await LeadSubmission.create({
      token: leadToken,
      adminId: adminId,
      formId: formId,
      formData: { email: 'test@example.com' },
      sourceUrl: sourceUrl,
      trackingToken: trackingToken,
      ipAddress: '127.0.0.1'
    });

    console.log('Lead created with Tracking Token:', lead.trackingToken);

    // Test Redirect Replacement
    let redirectUrl = template.redirectUrl || 'https://default.com?token={replace_it}';
    if (redirectUrl.includes('{replace_it}')) {
      redirectUrl = redirectUrl.replace('{replace_it}', lead.trackingToken || 'default');
    }

    console.log('Final Redirect URL:', redirectUrl);

    if (lead.trackingToken === 'TRACK_12345' && redirectUrl.includes('TRACK_12345')) {
      console.log('✅ TEST PASSED');
    } else {
      console.log('❌ TEST FAILED');
    }

    process.exit(0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

testAffiliateTracking();
