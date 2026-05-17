// lib/checkout-client.js
"use client";

// SINGLETON PATTERN
// Aynı projedeki tüm client-side kod aynı supabase instance'ını kullanmalı.
// Aksi takdirde browser'da çoklu GoTrueClient oluşur → console uyarısı + olası
// race condition (session refresh, logout sırasında garip davranışlar).
//
// lib/supabase.js zaten singleton'u export ediyor, oradan import et.
import { supabase } from "./supabase";

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