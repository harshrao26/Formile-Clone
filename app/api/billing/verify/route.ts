import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/app/lib/auth';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import { sendSubscriptionActivationEmail } from '@/app/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { order_id } = await req.json();
    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const response = await fetch(`https://api.cashfree.com/pg/orders/${order_id}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
      },
    });

    const data = await response.json();

    if (data.order_status === 'PAID') {
      await dbConnect();
      
      const adminId = auth.adminId;
      const orderAmount = data.order_amount;
      
      // Determine plan based on amount (1 vs 599 vs 5750)
      let planType = 'monthly';
      let daysToAdd = 30;

      if (orderAmount === 1) {
        planType = 'trial';
        daysToAdd = 3;
      } else if (orderAmount >= 5750) {
        planType = 'yearly';
        daysToAdd = 365;
      }
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysToAdd);

      const updatedAdmin = await Admin.findByIdAndUpdate(adminId, {
        plan: planType,
        subscriptionStatus: 'active',
        expiryDate: expiryDate,
        lastPaymentId: order_id
      }, { new: true });

      // Send Activation Email
      if (updatedAdmin) {
        await sendSubscriptionActivationEmail(updatedAdmin.email, planType, expiryDate);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified and plan activated',
        admin: {
          plan: updatedAdmin.plan,
          subscriptionStatus: updatedAdmin.subscriptionStatus,
          expiryDate: updatedAdmin.expiryDate
        }
      });
    }

    return NextResponse.json({ 
      success: false, 
      status: data.order_status,
      message: 'Payment not completed' 
    });

  } catch (error) {
    console.error('Billing Verification API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
