import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/app/lib/auth';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';

export async function POST(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType } = await req.json();
    if (!['monthly', 'yearly', 'trial'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const amount = planType === 'yearly' ? 5750 : planType === 'monthly' ? 599 : 1;
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const response = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: auth.adminId,
          customer_email: auth.email,
          customer_phone: '9999999999', // Placeholder since phone isn't in Admin model yet
        },
        order_meta: {
          // Cashfree Production requires an HTTPS return_url. 
          // Ensure NEXT_PUBLIC_APP_URL is set to your production domain (e.g., https://yourdomain.com)
          return_url: `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://localhost:3000'}/admin/billing?order_id=${orderId}`,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree Order Error:', data);
      return NextResponse.json({ error: data.message || 'Payment gateway error' }, { status: 500 });
    }

    return NextResponse.json({ 
      payment_session_id: data.payment_session_id,
      order_id: orderId 
    });
  } catch (error) {
    console.error('Billing Order API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
