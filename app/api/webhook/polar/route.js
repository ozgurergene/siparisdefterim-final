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
 * Güvenlik: user_id metadata'dan gelmiyorsa loglayıp çık.
 * Çünkü:
 *   - Checkout route'u login zorunlu — metadata.user_id HER ZAMAN dolmalı
 *   - user_id yoksa: ya kod hatası, ya da Polar dashboard'tan manuel oluşturulmuş bir checkout
 *   - Email fallback'i KASTEN kaldırıldı: başkasının email'ine ödeme yapan
 *     bir saldırgan, gerçek user'ı Pro yapabilirdi. Güvenli değil.
 */
function requireUserId(subscriptionOrOrder, eventName) {
  const userId = subscriptionOrOrder.metadata?.user_id;
  if (!userId) {
    console.error(
      `[Polar Webhook] GÜVENLİK UYARISI: ${eventName} event'inde metadata.user_id yok.`,
      {
        id: subscriptionOrOrder.id,
        customerEmail: subscriptionOrOrder.customer?.email,
        metadata: subscriptionOrOrder.metadata,
      }
    );
    return null;
  }
  return userId;
}

/**
 * UPSERT helper — public.users tablosunda satır yoksa oluştur, varsa güncelle.
 *
 * Niye UPSERT?
 *   - Supabase'de bir trigger var: auth.users'a yeni satır → public.users'a otomatik satır
 *   - Ama trigger fail olursa veya race condition olursa (Polar webhook trigger'dan
 *     önce gelirse), UPDATE 0 row affected döner ve kullanıcı Pro olamaz
 *   - UPSERT iki katmanlı güvenlik sağlar: satır yoksa INSERT, varsa UPDATE
 *   - id zaten auth.users'a foreign key (Supabase pattern), o yüzden user_id olarak
 *     auth user id'yi kullanmak güvenli
 */
async function upsertUser(userId, updates) {
  const { error } = await supabase
    .from("users")
    .upsert(
      {
        id: userId,
        ...updates,
      },
      {
        onConflict: "id",
        ignoreDuplicates: false, // mevcut satır varsa güncelle
      }
    );

  if (error) {
    console.error("[Polar] UPSERT hatası:", error);
    throw error;
  }
}

/**
 * Subscription aktif olunca user'ı Pro yap.
 * subscription.created ve subscription.active için çağrılır.
 */
async function handleSubscriptionActive(subscription) {
  const userId = requireUserId(subscription, "subscription.active");
  if (!userId) return; // güvenlik: user_id yoksa Pro vermiyoruz

  const plan = subscription.metadata?.plan || "unknown";

  await upsertUser(userId, {
    is_pro: true,
    polar_customer_id: subscription.customer?.id,
    polar_subscription_id: subscription.id,
    subscription_plan: plan,
    subscription_status: "active",
    subscription_current_period_end: subscription.currentPeriodEnd,
  });

  console.log(`[Polar] User ${userId} → is_pro=true (${plan})`);
}

/**
 * Subscription güncellendi (plan değişikliği, vs).
 */
async function handleSubscriptionUpdated(subscription) {
  const userId = requireUserId(subscription, "subscription.updated");
  if (!userId) return;

  const newStatus = subscription.status; // "active", "canceled", "past_due", etc.
  const is_pro = newStatus === "active";

  await upsertUser(userId, {
    is_pro,
    subscription_status: newStatus,
    subscription_current_period_end: subscription.currentPeriodEnd,
  });
}

/**
 * Kullanıcı iptal etti ama dönem sonuna kadar Pro kalır.
 * is_pro=true olarak bırakıyoruz, sadece status güncelle.
 */
async function handleSubscriptionCanceled(subscription) {
  const userId = requireUserId(subscription, "subscription.canceled");
  if (!userId) return;

  await upsertUser(userId, {
    subscription_status: "canceled",
    // is_pro hala true — period_end gelince webhook revoked tetiklenir
  });
}

/**
 * Subscription anında iptal edildi (refund, admin override, vs).
 * is_pro hemen false yap.
 */
async function handleSubscriptionRevoked(subscription) {
  const userId = requireUserId(subscription, "subscription.revoked");
  if (!userId) return;

  await upsertUser(userId, {
    is_pro: false,
    subscription_status: "revoked",
  });
}

/**
 * Order iade edildi — Pro'yu kaldır.
 *
 * NOT: Order refund için BURAYA özel olarak email fallback bıraktım.
 * Çünkü:
 *  - Bu negatif bir aksiyon (Pro'yu kaldırıyoruz, vermiyoruz)
 *  - Tehlikeli senaryo: birinin Pro'sunu yanlışlıkla kaldırmak — düşük risk
 *  - Pozitif aksiyon (Pro vermek) ise yüksek risk, fallback'i kaldırdık
 *
 *  Email fallback'inde UPSERT YERİNE UPDATE kullanıyoruz çünkü:
 *  - User'ın id'sini bilmiyoruz (sadece email var)
 *  - Yanlışlıkla yeni satır oluşturmasın
 *  - Email eşleşmesi yoksa: sessizce atla, logla
 */
async function handleOrderRefunded(order) {
  const userId = order.metadata?.user_id;
  const customerEmail = order.customer?.email;

  if (!userId && !customerEmail) {
    console.error("[Polar] order.refunded'da ne user_id ne email yok:", order.id);
    return;
  }

  if (userId) {
    // En güvenli yol: user_id ile UPSERT
    await upsertUser(userId, {
      is_pro: false,
      subscription_status: "refunded",
    });
    console.log(`[Polar] Order refunded — Pro kaldırıldı (user_id): ${userId}`);
  } else {
    // Email fallback: yeni satır oluşturmaz, sadece var olanı güncellemeye çalışır
    const { data, error } = await supabase
      .from("users")
      .update({
        is_pro: false,
        subscription_status: "refunded",
      })
      .eq("email", customerEmail)
      .select();

    if (error) {
      console.error("[Polar] handleOrderRefunded email fallback hatası:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn(
        `[Polar] Order refunded — email ${customerEmail} için users satırı yok, atlandı.`
      );
    } else {
      console.log(`[Polar] Order refunded — Pro kaldırıldı (email): ${customerEmail}`);
    }
  }
}