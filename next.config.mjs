// next.config.mjs
// ============================================================
// Next.js Configuration — Security Headers (CSP'siz versiyon)
// ============================================================
// Bu versiyon CSP içermez — hiçbir şeyi bozma riski yok.
// Launch sonrası test edip CSP'yi de ekleyeceğiz.
// ============================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Clickjacking koruması — sadece kendi iframe'imizde gösterilir
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },

          // MIME sniffing koruması — browser dosya tipini tahmin etmesin
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // Referrer politikası — outbound link'lerde sadece origin
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // Tarayıcı izinleri — kamera, mic, geolocation kapalı
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
          },

          // HSTS — Vercel zaten ekliyor, açık tutalım
          // 2 yıl boyunca bu domain'e sadece HTTPS git
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
