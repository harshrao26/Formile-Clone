import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Partner from '@/app/lib/models/Partner';
import { verifyAuth } from '@/app/lib/auth';
import { Types } from 'mongoose';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const matchStage = auth.role === 'superadmin' ? {} : { adminId: new Types.ObjectId(auth.adminId) };
    
    const partners = await Partner.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'leadsubmissions', // collection name in mongodb
          localField: '_id',
          foreignField: 'partnerId',
          as: 'leads'
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyId'
        }
      },
      {
        $unwind: { path: '$companyId', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'formtemplates',
          localField: 'formId',
          foreignField: '_id',
          as: 'formId'
        }
      },
      {
        $unwind: { path: '$formId', preserveNullAndEmptyArrays: true }
      },
      {
        $addFields: {
          leadsCount: { $size: '$leads' }
        }
      },
      {
        $project: { leads: 0 }
      }
    ]);
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Get partners error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    let { name, email, slug, companyId, formId, companyName, redirectUrl } = await request.json();

    if (!name || !slug || !formId) {
      return NextResponse.json({ error: 'Name, Slug, and Form ID are required' }, { status: 400 });
    }

    if (!companyId && companyName) {
      const Company = (await import('@/app/lib/models/Company')).default;
      let company = await Company.findOne({ name: companyName, adminId: auth.adminId });
      if (!company) {
        company = await Company.create({ 
          name: companyName, 
          adminId: auth.adminId,
          originalUrl: redirectUrl || 'https://zeeoffer.com' // Use provided redirect or platform home
        });
      }
      companyId = company._id;
    }

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID or Company Name is required' }, { status: 400 });
    }

    const existingPartner = await Partner.findOne({ slug: slug.toLowerCase() });
    if (!name || !slug || (!formId && !redirectUrl)) {
      return NextResponse.json({ error: 'Name, Slug, and either Form ID or Redirect URL are required' }, { status: 400 });
    }
    if (existingPartner) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const partner = await Partner.create({ 
      name, 
      email: email || '', 
      slug: slug.toLowerCase(), 
      companyId, 
      formId: formId || null,
      redirectUrl: redirectUrl || null,
      adminId: auth.adminId
    });
    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Create partner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
