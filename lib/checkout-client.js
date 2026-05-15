// lib/checkout-client.js
"use client";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Client-side'dan Polar checkout başlatır.
 * Kullanıcıyı Polar hosted checkout sayfasına yönlendirir.
 *
 * @param {"monthly" | "yearly"} plan
 * @returns {Promise<void>}
 */
export async function startPolarCheckout(plan) {
  // 1. Mevcut Supabase session'ını al
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Kullanıcı giriş yapmamış → login'e yönlendir
    window.location.href = "/login?redirect=/pricing";
    return;
  }

  // 2. Backend'e istek at, Bearer token gönder
  try {
    const response = await fetch("/api/checkout/polar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ plan }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Checkout oluşturulamadı");
    }

    // 3. Polar checkout URL'ine yönlendir
    window.location.href = data.url;
  } catch (err) {
    console.error("[Checkout Client] Hata:", err);
    alert("Ödeme sayfası açılamadı. Lütfen tekrar deneyin.\n\nHata: " + err.message);
  }
}