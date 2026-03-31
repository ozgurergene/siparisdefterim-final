import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Raw body'i al (webhook signature doğrulaması için gerekli)
async function getRawBody(request) {
  return await request.text();
}

export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const rawBody = await getRawBody(request);

  let event;

  try {
    // Webhook signature'ı doğrula
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Event type'ına göre işle
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;

    case 'checkout.session.expired':
      await handleCheckoutSessionExpired(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Checkout başarılı oldu
async function handleCheckoutSessionCompleted(session) {
  try {
    console.log('✅ Checkout completed:', session.id);

    const { customer_email, metadata } = session;
    const plan = metadata?.plan;
    const userId = metadata?.userId;

    if (!customer_email || !plan) {
      console.error('Missing email or plan in session metadata');
      return;
    }

    // Supabase'de user_profiles'ı güncelle (is_pro = true)
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        is_pro: true,
        subscription_plan: plan,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error updating user_profiles:', profileError);
      return;
    }

    // subscriptions tablosunu güncelle (status = active)
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', session.subscription || session.id);

    if (subError) {
      console.error('Error updating subscriptions:', subError);
      return;
    }

    console.log('✅ User upgraded to Pro successfully');
  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

// Checkout süresi doldu
async function handleCheckoutSessionExpired(session) {
  try {
    console.log('❌ Checkout expired:', session.id);

    const userId = session.metadata?.userId;

    if (!userId) {
      console.error('Missing userId in session metadata');
      return;
    }

    // subscriptions tablosunu güncelle (status = cancelled)
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) {
      console.error('Error updating subscription on expiry:', error);
      return;
    }

    console.log('✅ Subscription cancelled due to checkout expiry');
  } catch (error) {
    console.error('Error handling checkout expired:', error);
  }
}