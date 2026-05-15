// app/api/webhook/polar/route.js
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { createClient } from "@supabase/supabase-js";

// Service role key kullanıyoruz çünkü RLS bypass etmek lazım
// (webhook user context'i olmadan çalışıyor)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Polar webhook timeout 10 saniye, ideal cevap 2 saniye altı.
// Bu yüzden işlemleri olabildiğince hızlı yap, fail durumunda yine 200 dön.
export async function POST(request) {
  // 1. Raw body al (signature doğrulaması için raw text gerekiyor, JSON.parse ETME)
  const rawBody = await request.text();

  // 2. Headers'ı objeye çevir
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  // 3. Signature doğrula
  let event;
  try {
    event = validateEvent(rawBody, headers, process.env.POLAR_WEBHOOK_SECRET);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      console.error("[Polar Webhook] Signature doğrulama başarısız:", err.message);
      return new Response("Invalid signature", { status: 403 });
    }
    console.error("[Polar Webhook] Beklenmeyen hata:", err);
    return new Response("Server error", { status: 500 });
  }

  console.log(`[Polar Webhook] Event alındı: ${event.type}`);

  // 4. Event tipine göre işle
  try {
    switch (event.type) {
      // ---- SUBSCRIPTION EVENTS ----
      case "subscription.created":
      case "subscription.active":
        await handleSubscriptionActive(event.data);
        break;

      case "subscription.updated":
        await handleSubscriptionUpdated(event.data);
        break;

      case "subscription.canceled":
        // Kullanıcı iptal etti ama period sonuna kadar Pro kalır
        await handleSubscriptionCanceled(event.data);
        break;

      case "subscription.revoked":
        // Anında iptal (refund veya admin tarafından) — Pro'yu hemen kaldır
        await handleSubscriptionRevoked(event.data);
        break;

      case "subscription.past_due":
        // Ödeme başarısız - kullanıcıya bildirim atılabilir ileride
        console.log(`[Polar Webhook] Past due: ${event.data.id}`);
        break;

      // ---- ORDER EVENTS ----
      case "order.paid":
        // Yenileme ödemesi alındı, abone Pro kalıyor — loglama yeterli
        console.log(`[Polar Webhook] Order paid: ${event.data.id}`);
        break;

      case "order.refunded":
        await handleOrderRefunded(event.data);
        break;

      // ---- CUSTOMER EVENTS ----
      case "customer.created":
        // İlk satın alma anında customer oluşur, log için iyi
        console.log(`[Polar Webhook] Customer created: ${event.data.id} / ${event.data.email}`);
        break;

      default:
        console.log(`[Polar Webhook] İşlenmeyen event tipi: ${event.type}`);
    }

    // Polar 2xx bekliyor, başarılı işlem sonrası 200 dön
    return new Response("OK", { status: 200 });
  } catch (err) {
    // İşlem sırasında hata olsa bile 200 dön — Polar retry yapmasın
    // Hatayı kendi loglarımızda görelim, manuel çözeriz
    console.error("[Polar Webhook] İşleme hatası:", err);
    return new Response("OK", { status: 200 });
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Subscription aktif olunca user'ı Pro yap.
 * subscription.created ve subscription.active için çağrılır.
 */
async function handleSubscriptionActive(subscription) {
  const userId = subscription.metadata?.user_id;
  const customerEmail = subscription.customer?.email;
  const plan = subscription.metadata?.plan || "unknown";

  if (!userId && !customerEmail) {
    console.error("[Polar] Subscription'da user_id veya email yok:", subscription.id);
    return;
  }

  // Önce user_id ile dene, yoksa email fallback
  const query = userId
    ? supabase.from("users").update({
        is_pro: true,
        polar_customer_id: subscription.customer?.id,
        polar_subscription_id: subscription.id,
        subscription_plan: plan,
        subscription_status: "active",
        subscription_current_period_end: subscription.currentPeriodEnd,
      }).eq("id", userId)
    : supabase.from("users").update({
        is_pro: true,
        polar_customer_id: subscription.customer?.id,
        polar_subscription_id: subscription.id,
        subscription_plan: plan,
        subscription_status: "active",
        subscription_current_period_end: subscription.currentPeriodEnd,
      }).eq("email", customerEmail);

  const { error } = await query;
  if (error) {
    console.error("[Polar] handleSubscriptionActive update hatası:", error);
    throw error;
  }

  console.log(`[Polar] User ${userId || customerEmail} → is_pro=true (${plan})`);
}

/**
 * Subscription güncellendi (plan değişikliği, vs).
 */
async function handleSubscriptionUpdated(subscription) {
  const userId = subscription.metadata?.user_id;
  const customerEmail = subscription.customer?.email;
  const newStatus = subscription.status; // "active", "canceled", "past_due", etc.

  // Status active değilse Pro olarak işaretleme
  const is_pro = newStatus === "active";

  const query = userId
    ? supabase.from("users").update({
        is_pro,
        subscription_status: newStatus,
        subscription_current_period_end: subscription.currentPeriodEnd,
      }).eq("id", userId)
    : supabase.from("users").update({
        is_pro,
        subscription_status: newStatus,
        subscription_current_period_end: subscription.currentPeriodEnd,
      }).eq("email", customerEmail);

  const { error } = await query;
  if (error) {
    console.error("[Polar] handleSubscriptionUpdated hatası:", error);
    throw error;
  }
}

/**
 * Kullanıcı iptal etti ama dönem sonuna kadar Pro kalır.
 * is_pro=true olarak bırakıyoruz, sadece status güncelle.
 */
async function handleSubscriptionCanceled(subscription) {
  const userId = subscription.metadata?.user_id;
  const customerEmail = subscription.customer?.email;

  const query = userId
    ? supabase.from("users").update({
        subscription_status: "canceled",
        // is_pro hala true — period_end gelince webhook revoked tetiklenir
      }).eq("id", userId)
    : supabase.from("users").update({
        subscription_status: "canceled",
      }).eq("email", customerEmail);

  const { error } = await query;
  if (error) {
    console.error("[Polar] handleSubscriptionCanceled hatası:", error);
    throw error;
  }
}

/**
 * Subscription anında iptal edildi (refund, admin override, vs).
 * is_pro hemen false yap.
 */
async function handleSubscriptionRevoked(subscription) {
  const userId = subscription.metadata?.user_id;
  const customerEmail = subscription.customer?.email;

  const query = userId
    ? supabase.from("users").update({
        is_pro: false,
        subscription_status: "revoked",
      }).eq("id", userId)
    : supabase.from("users").update({
        is_pro: false,
        subscription_status: "revoked",
      }).eq("email", customerEmail);

  const { error } = await query;
  if (error) {
    console.error("[Polar] handleSubscriptionRevoked hatası:", error);
    throw error;
  }
}

/**
 * Order iade edildi — Pro'yu kaldır.
 */
async function handleOrderRefunded(order) {
  const userId = order.metadata?.user_id;
  const customerEmail = order.customer?.email;

  const query = userId
    ? supabase.from("users").update({
        is_pro: false,
        subscription_status: "refunded",
      }).eq("id", userId)
    : supabase.from("users").update({
        is_pro: false,
        subscription_status: "refunded",
      }).eq("email", customerEmail);

  const { error } = await query;
  if (error) {
    console.error("[Polar] handleOrderRefunded hatası:", error);
    throw error;
  }
}