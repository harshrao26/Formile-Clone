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
    const { name, email, slug, companyId, formId } = await request.json();

    if (!name || !email || !slug || !companyId || !formId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingPartner = await Partner.findOne({ slug: slug.toLowerCase() });
    if (existingPartner) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const partner = await Partner.create({ 
      name, 
      email, 
      slug: slug.toLowerCase(), 
      companyId, 
      formId,
      adminId: auth.adminId
    });
    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Create partner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
