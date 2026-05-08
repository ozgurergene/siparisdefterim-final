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
  // ÖNEMLİ AYRIM:
  // - cancelled = "iptal etti AMA dönem sonuna kadar Pro hakkı devam eder" → SADECE LOGLA
  // - expired = "dönem bitti, gerçekten Pro değil" → is_pro=false
  // - paused = "abonelik askıya alındı" → is_pro=false (bu farklı, hemen durdur)
  
  const PRO_EVENTS = [
    'subscription_created',          // İlk kayıt
    'subscription_resumed',          // İptal sonrası "vazgeçtim" deyince
    'subscription_unpaused',         // Pause kaldırıldı
    'subscription_payment_success',  // Aylık yenileme başarılı
  ]

  const NOT_PRO_EVENTS = [
    'subscription_expired',  // Dönem bitti, yenileme yok → ARTIK Pro değil
    'subscription_paused',   // Lemon tarafında askıya alındı → hemen durdur
  ]

  const LOG_ONLY_EVENTS = [
    'subscription_cancelled',         // İptal etti AMA dönem sonuna kadar Pro
    'subscription_payment_failed',    // Ödeme başarısız (kart limiti vs.)
    'subscription_payment_refunded',  // İade yapıldı (Lemon iade verdi)
    'subscription_plan_changed',      // Plan değişimi (aylık → yıllık)
    'subscription_updated',           // Genel güncelleme
  ]

  let newIsProValue = null
  if (PRO_EVENTS.includes(eventName)) {
    newIsProValue = true
  } else if (NOT_PRO_EVENTS.includes(eventName)) {
    newIsProValue = false
  }

  // LOG_ONLY events: sadece logla, is_pro değiştirme
  if (LOG_ONLY_EVENTS.includes(eventName)) {
    console.log(`📝 Log-only event: ${eventName} for ${customerEmail}`)
    
    // Özel durumlar için ek log:
    if (eventName === 'subscription_cancelled') {
      console.log(`ℹ️  ${customerEmail} aboneliği iptal etti. Dönem sonuna kadar Pro hakkı devam ediyor.`)
    }
    if (eventName === 'subscription_payment_failed') {
      console.log(`⚠️  ${customerEmail} ödeme başarısız. Müşteriye email gönderilebilir.`)
    }
    if (eventName === 'subscription_payment_refunded') {
      console.log(`💰 ${customerEmail} iade yapıldı. Pro durumu expired event'inde düşecek.`)
    }
    
    return NextResponse.json({ 
      received: true, 
      logged: true,
      event: eventName,
      email: customerEmail
    })
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

  console.log(`✅ ${customerEmail} → is_pro: ${newIsProValue} (${eventName})`)

  return NextResponse.json({
    received: true,
    user_email: customerEmail,
    is_pro: newIsProValue,
    event: eventName,
  })
}