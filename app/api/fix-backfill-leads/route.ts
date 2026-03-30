import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';

// One-time migration: backfills adminId on LeadSubmissions that are missing it  
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Find all leads without adminId
    const leadsWithout = await LeadSubmission.find({
      $or: [{ adminId: { $exists: false } }, { adminId: null }]
    }).lean();

    let fixed = 0;
    let skipped = 0;

    for (const lead of leadsWithout) {
      if (!lead.partnerId) { skipped++; continue; }

      // Find the partner for this lead to get its adminId
      const partner = await Partner.findById(lead.partnerId).select('adminId').lean();
      if (!partner || !partner.adminId) { skipped++; continue; }

      await LeadSubmission.findByIdAndUpdate(lead._id, { adminId: partner.adminId });
      fixed++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Backfilled ${fixed} leads. Skipped ${skipped}.`,
      fixed,
      skipped,
    });
  } catch (error) {
    console.error('Backfill error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
