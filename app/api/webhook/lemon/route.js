import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Service role key gerekli (RLS bypass için).
// Anon key ile is_pro update yapamıyoruz çünkü user kendisi haricini güncelleyemez.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  // 1. Raw body'i string olarak al (signature doğrulaması için lazım)
  const rawBody = await request.text()
  const signature = request.headers.get('x-signature')

  // 2. Signature doğrula
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    console.error('LEMONSQUEEZY_WEBHOOK_SECRET tanımlı değil')
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(rawBody).digest('hex')

  if (!signature || digest !== signature) {
    console.error('❌ Webhook signature doğrulanamadı')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // 3. Body'i parse et
  let payload
  try {
    payload = JSON.parse(rawBody)
  } catch (e) {
    console.error('❌ Geçersiz JSON:', e.message)
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 4. Event bilgilerini çıkar
  const eventName = payload?.meta?.event_name
  const customerEmail = payload?.data?.attributes?.user_email
  const customerName = payload?.data?.attributes?.user_name
  const subscriptionId = payload?.data?.id
  const productName = payload?.data?.attributes?.product_name

  console.log(`📩 Lemon webhook: ${eventName} | ${customerEmail} | ${productName}`)

  if (!customerEmail) {
    console.error('❌ Customer email bulunamadı')
    return NextResponse.json({ error: 'Missing customer email' }, { status: 400 })
  }

  // 5. Event'e göre is_pro değerini belirle
  const PRO_EVENTS = [
    'subscription_created',
    'subscription_resumed',
    'subscription_unpaused',
    'subscription_payment_success',
  ]

  const NOT_PRO_EVENTS = [
    'subscription_cancelled',
    'subscription_expired',
    'subscription_paused',
  ]

  let newIsProValue = null
  if (PRO_EVENTS.includes(eventName)) {
    newIsProValue = true
  } else if (NOT_PRO_EVENTS.includes(eventName)) {
    newIsProValue = false
  }

  // İlgilenmediğimiz event ise sessizce 200 dön (Lemon retry yapmasın)
  if (newIsProValue === null) {
    console.log(`⏭️  Event görmezden gelindi: ${eventName}`)
    return NextResponse.json({ received: true, ignored: true })
  }

  // 6. Email ile user'ı bul (auth.users içinde)
  const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

  if (authError) {
    console.error('❌ Auth users listelenemedi:', authError.message)
    return NextResponse.json({ error: 'Auth lookup failed' }, { status: 500 })
  }

  const matchedUser = authUsers?.users?.find(
    (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
  )

  if (!matchedUser) {
    console.error(`❌ User bulunamadı: ${customerEmail}`)
    // Bu önemli bir durum — log'la, ama 200 dön ki Lemon retry yapmasın.
    // Belki müşteri ödedi ama hesabı yok. Email ile uyarı gönderebilirsin.
    return NextResponse.json({
      received: true,
      warning: 'User not found in database',
      email: customerEmail,
    })
  }

  // 7. users tablosundaki is_pro'yu güncelle
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ is_pro: newIsProValue })
    .eq('id', matchedUser.id)

  if (updateError) {
    console.error('❌ users update hatası:', updateError.message)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  console.log(`✅ ${customerEmail} → is_pro: ${newIsProValue}`)

  return NextResponse.json({
    received: true,
    user_email: customerEmail,
    is_pro: newIsProValue,
    event: eventName,
  })
}