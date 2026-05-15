// app/api/checkout/polar/route.js
import { polar, POLAR_PRODUCTS } from "../../../../lib/polar";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * POST /api/checkout/polar
 *
 * Body: { plan: "monthly" | "yearly" }
 *
 * 1. Kullanıcıyı Supabase auth'tan al
 * 2. Polar'da checkout oluştur (metadata: user_id, plan)
 * 3. Checkout URL'ini frontend'e dön
 *
 * Frontend bu URL'e window.location ile yönlendirecek.
 */
export async function POST(request) {
  try {
    // 1. Body parse et
    const { plan } = await request.json();

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return Response.json(
        { error: "Geçersiz plan. 'monthly' veya 'yearly' olmalı." },
        { status: 400 }
      );
    }

    const productId = POLAR_PRODUCTS[plan];
    if (!productId) {
      return Response.json(
        { error: `Plan için product ID bulunamadı: ${plan}` },
        { status: 500 }
      );
    }

    // 2. Auth header'dan veya cookie'den kullanıcıyı al
    // Supabase'in @supabase/ssr paketi kullanılıyor olabilir — burada anon key ile auth header okuyacağız
    const authHeader = request.headers.get("authorization");
    let user = null;

    if (authHeader?.startsWith("Bearer ")) {
      // Frontend Supabase session token'ı Bearer olarak gönderirse
      const token = authHeader.replace("Bearer ", "");
      const supabaseAuth = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data, error } = await supabaseAuth.auth.getUser(token);
      if (!error && data?.user) {
        user = data.user;
      }
    }

    if (!user) {
      return Response.json(
        { error: "Oturum açmanız gerekiyor." },
        { status: 401 }
      );
    }

    // 3. Polar'da checkout oluştur
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://deftertut.com";

    const checkout = await polar.checkouts.create({
      products: [productId],
      customerEmail: user.email,
      successUrl: `${siteUrl}/dashboard?upgraded=true&plan=${plan}`,
      metadata: {
        user_id: user.id,
        plan: plan,
        source: "deftertut_app",
      },
    });

    console.log(
      `[Checkout] Created for user ${user.id} (${user.email}), plan=${plan}, checkout_id=${checkout.id}`
    );

    // 4. Frontend'e URL dön
    return Response.json({
      url: checkout.url,
      checkout_id: checkout.id,
    });
  } catch (err) {
    console.error("[Checkout] Hata:", err);
    return Response.json(
      {
        error: "Checkout oluşturulamadı. Lütfen tekrar deneyin.",
        details: process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
