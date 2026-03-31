import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    console.log('🔵 Checkout request başladı');
    
    const { plan, price, userEmail } = await request.json();
    console.log('📨 Request data:', { plan, price, userEmail });

    // Plan bilgilerine göre ürün adı belirle
    let productName = '';
    let billingInterval = '';

    if (plan === 'pro_monthly') {
      productName = 'SiparişDefterim Pro - Monthly';
      billingInterval = 'month';
    } else if (plan === 'pro_yearly') {
      productName = 'SiparişDefterim Pro - Yearly';
      billingInterval = 'year';
    } else {
      console.error('❌ Invalid plan:', plan);
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    console.log('✅ Plan verified:', { productName, billingInterval });

    // Checkout session oluştur
    console.log('🔄 Stripe session oluşturuluyor...');
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'try', // Turkish Lira
            product_data: {
              name: productName,
              description: 'SiparişDefterim Subscription',
            },
            unit_amount: price * 100, // Stripe cent cinsinden bekliyor
            recurring: {
              interval: billingInterval,
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
      customer_email: userEmail,
      metadata: {
        plan: plan,
        userId: request.headers.get('x-user-id') || 'unknown',
      },
    });

    console.log('✅ Session created:', session.id);
    console.log('🎉 Checkout URL:', session.url);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('❌ Stripe error:', error.message);
    console.error('Error details:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}