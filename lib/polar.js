// lib/polar.js
import { Polar } from "@polar-sh/sdk";

/**
 * Polar SDK Client
 *
 * Sandbox: test mode, sahte ödeme akışları için
 * Production: gerçek ödemeler için (Go Live sonrası)
 *
 * Server-side only - bu modülü client component'lerden import etme!
 */
export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
});

/**
 * Product ID'leri merkezi yerden çekmek için yardımcı.
 * Hem server hem client'tan erişilebilir (NEXT_PUBLIC_).
 */
export const POLAR_PRODUCTS = {
  monthly: process.env.NEXT_PUBLIC_POLAR_PRODUCT_MONTHLY,
  yearly: process.env.NEXT_PUBLIC_POLAR_PRODUCT_YEARLY,
};

/**
 * Polar'ın hosted checkout URL'i oluşturur.
 * Custom domain (checkout.deftertut.com) gelecekte burada switch yapılabilir.
 *
 * @param {"monthly" | "yearly"} plan
 * @param {string} customerEmail - Supabase'den gelen kullanıcı email'i
 * @param {string} userId - Supabase user.id (metadata olarak gidecek)
 * @returns {Promise<string>} - Polar checkout URL'i
 */
export async function createPolarCheckout(plan, customerEmail, userId) {
  const productId = POLAR_PRODUCTS[plan];

  if (!productId) {
    throw new Error(`Geçersiz plan: ${plan}`);
  }

  const checkout = await polar.checkouts.create({
    products: [productId],
    customerEmail: customerEmail,
    successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://deftertut.com"}/dashboard?upgraded=true`,
    metadata: {
      user_id: userId,
      plan: plan,
      source: "deftertut_app",
    },
  });

  return checkout.url;
}