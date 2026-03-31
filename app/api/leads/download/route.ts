import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';
import Person from '@/app/lib/models/Person';
import { verifyAuth } from '@/app/lib/auth';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const formId = searchParams.get('formId');
    const companyId = searchParams.get('companyId');
    const personId = searchParams.get('personId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'xlsx';

    const filter: Record<string, any> = {};
    if (auth.role !== 'superadmin') filter.adminId = auth.adminId;

    if (formId) filter.formId = formId;

    if (partnerId) {
      filter.partnerId = partnerId;
    } else if (companyId) {
      const partnersFilter: any = { companyId };
      if (auth.role !== 'superadmin') partnersFilter.adminId = auth.adminId;
      const partners = await Partner.find(partnersFilter).select('_id');
      filter.partnerId = { $in: partners.map(p => p._id) };
    }
    
    if (personId) filter.personId = personId;

    if (startDate || endDate) {
      filter.submittedAt = {};
      if (startDate) filter.submittedAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.submittedAt.$lte = end;
      }
    }

    const leads = await LeadSubmission.find(filter)
      .populate('partnerId', 'name slug email')
      .populate('personId', 'name slug')
      .sort({ submittedAt: -1 })
      .lean();

    // Flatten the data for export
    const flatData = leads.map((lead) => {
      const partnerInfo = lead.partnerId as unknown as { name: string; slug: string; email: string } | null;
      const personInfo = lead.personId as unknown as { name: string; slug: string } | null;

      const row: Record<string, string> = {
        'Token': lead.token,
        'Partner Name': partnerInfo?.name || '',
        'Partner Slug': partnerInfo?.slug || '',
        'Partner Email': partnerInfo?.email || '',
        'Person Name': personInfo?.name || '',
        'Person Slug': personInfo?.slug || '',
      };

      // Add dynamic form data columns
      if (lead.formData && typeof lead.formData === 'object') {
        Object.entries(lead.formData).forEach(([key, value]) => {
          row[key] = String(value);
        });
      }

      row['Source URL'] = lead.sourceUrl || '';
      row['IP Address'] = lead.ipAddress || '';
      row['Submitted At'] = lead.submittedAt ? new Date(lead.submittedAt).toLocaleString() : '';

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    let output: Uint8Array;
    let contentType: string;
    let extension: string;

    if (format === 'csv') {
      output = XLSX.write(workbook, { type: 'array', bookType: 'csv' }) as unknown as Uint8Array;
      contentType = 'text/csv';
      extension = 'csv';
    } else {
      output = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as unknown as Uint8Array;
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      extension = 'xlsx';
    }

    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename=leads-${Date.now()}.${extension}`,
      },
    });
  } catch (error) {
    console.error('Download leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
