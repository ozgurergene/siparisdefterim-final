'use client'

// app/LandingContent.jsx
// Pazarlama/landing içeriği. Mevcut tema renkleri (#667eea / #764ba2) ve
// inline-style yaklaşımıyla uyumlu. İçerik statiktir (SEO-dostu),
// sadece SSS accordion ve mobil tespiti için minimal client state kullanır.
//
// NOT: 'use client' burada SADECE useState (accordion) ve mobil tespiti için.
// İçeriğin tamamı ilk render'da DOM'da bulunur — bot ve crawler görür.

import { useState, useEffect } from 'react'

const SUPPORT_EMAIL = 'destek@deftertut.com'

const FEATURES = [
  {
    icon: '📥',
    title: 'Siparişler Tek Panelde',
    desc: 'Instagram DM\'den gelen tüm siparişleri tek bir yerde toplayın. Hiçbir sipariş mesaj kalabalığında kaybolmasın.',
  },
  {
    icon: '👥',
    title: 'Müşteri Takibi',
    desc: 'Müşteri bilgilerini, adreslerini ve sipariş geçmişini düzenli tutun. Tekrar sipariş veren müşterileri anında tanıyın.',
  },
  {
    icon: '🚚',
    title: 'Kargo Takibi',
    desc: 'Sipariş durumlarını ve kargo bilgilerini takip edin. Hangi sipariş hangi aşamada, tek bakışta görün.',
  },
  {
    icon: '📊',
    title: 'Raporlar ve Analiz',
    desc: 'Gelir grafikleri, en çok satan ürünler ve dönem karşılaştırmaları ile işinizin nasıl gittiğini görün.',
  },
  {
    icon: '📱',
    title: 'Mobilden Tam Erişim',
    desc: 'Ayrı uygulama gerekmez. Telefonunuzun tarayıcısından girin, ana ekrana ekleyin, tek dokunuşla açın.',
  },
  {
    icon: '🔒',
    title: 'Güvenli ve KVKK Uyumlu',
    desc: 'Verileriniz SSL ile şifrelenir, KVKK ve GDPR uyumlu altyapıda saklanır. Bilgileriniz güvende.',
  },
]

const FAQS = [
  {
    q: 'SiparişDefterim nedir?',
    a: 'Instagram üzerinden satış yapan işletmeler için tasarlanmış bir sipariş takip ve yönetim sistemidir. DM\'den gelen siparişleri tek panelde toplar, müşteri ve kargo takibini kolaylaştırır.',
  },
  {
    q: 'Ücretsiz kullanabilir miyim?',
    a: 'Evet. Ücretsiz plan ile 50 siparişe kadar tüm temel özellikleri kullanabilirsiniz. Kredi kartı gerektirmez. İşiniz büyüdükçe Pro plana geçebilirsiniz.',
  },
  {
    q: 'Pro plan ne kadar?',
    a: 'Aylık $2.99 veya yıllık $29.99 (ayda yaklaşık $2.50, 2 ay bedava). Pro ile sınırsız sipariş, tüm raporlar, müşteri analizi ve öncelikli destek elde edersiniz.',
  },
  {
    q: 'Mobil uygulama var mı?',
    a: 'Ayrı bir uygulama indirmenize gerek yok. Site mobil tarayıcıdan tam olarak çalışır. Telefonunuzdan deftertut.com\'a girip ana ekrana ekleyerek (PWA) uygulama gibi kullanabilirsiniz.',
  },
  {
    q: 'Verilerim güvende mi?',
    a: 'Evet. Tüm veriler SSL şifreleme ile aktarılır ve KVKK/GDPR uyumlu altyapıda saklanır. Sipariş ve müşteri bilgileriniz tarafımızca üçüncü kişilerle paylaşılmaz.',
  },
]

// Mevcut temayla uyumlu sabit renkler (server-render güvenli, localStorage'a bağlı değil)
const c = {
  bg: '#0d0d1a',
  bgGradient: 'linear-gradient(180deg, #0d0d1a 0%, #14142b 100%)',
  card: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.08)',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  accent: '#667eea',
}

const gradientText = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const primaryBtn = {
  display: 'inline-block',
  padding: '16px 36px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  textDecoration: 'none',
  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
}

const secondaryBtn = {
  display: 'inline-block',
  padding: '16px 36px',
  background: 'rgba(102, 126, 234, 0.1)',
  color: '#a78bfa',
  border: '1px solid rgba(102, 126, 234, 0.4)',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  textDecoration: 'none',
}

export default function LandingContent() {
  const [openFaq, setOpenFaq] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        background: c.bgGradient,
        fontFamily: 'Arial, sans-serif',
        color: c.text,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px' }}>
        {/* HEADER */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: isMobile ? '20px 0' : '28px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '26px' }}>📱</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', ...gradientText }}>SiparişDefterim</span>
          </div>
          <a href="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            Giriş Yap
          </a>
        </header>

        {/* HERO */}
        <section style={{ textAlign: 'center', padding: isMobile ? '40px 0 50px' : '70px 0 80px' }}>
          <div style={{ fontSize: isMobile ? '56px' : '72px', marginBottom: '20px' }}>📱</div>
          <h1
            style={{
              fontSize: isMobile ? '32px' : '52px',
              fontWeight: '800',
              lineHeight: '1.15',
              margin: '0 0 20px 0',
              ...gradientText,
            }}
          >
            Instagram Siparişlerinizi
            <br />
            Tek Panelde Yönetin
          </h1>
          <p
            style={{
              fontSize: isMobile ? '16px' : '19px',
              color: c.textMuted,
              lineHeight: '1.6',
              maxWidth: '620px',
              margin: '0 auto 36px',
            }}
          >
            DM kalabalığında kaybolan siparişlere son. Müşteri, kargo ve gelir takibini
            tek bir yerden yapın. 50 sipariş tamamen ücretsiz.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/login" style={primaryBtn}>
              Ücretsiz Başla →
            </a>
            <a href="/pricing" style={secondaryBtn}>
              Fiyatları Gör
            </a>
          </div>
          <p style={{ fontSize: '13px', color: c.textMuted, marginTop: '18px' }}>
            Kredi kartı gerekmez · 50 sipariş ücretsiz
          </p>
        </section>

        {/* ÖZELLİKLER */}
        <section style={{ padding: isMobile ? '20px 0' : '40px 0' }}>
          <h2
            style={{
              fontSize: isMobile ? '24px' : '34px',
              fontWeight: '700',
              textAlign: 'center',
              color: c.text,
              margin: '0 0 12px 0',
            }}
          >
            İşinizi Büyütecek Özellikler
          </h2>
          <p style={{ textAlign: 'center', color: c.textMuted, fontSize: '16px', margin: '0 0 40px 0' }}>
            Instagram satıcılarının ihtiyaç duyduğu her şey tek yerde
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '20px',
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  background: c.card,
                  border: `1px solid ${c.cardBorder}`,
                  borderRadius: '16px',
                  padding: '28px 24px',
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: c.text, margin: '0 0 8px 0' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: c.textMuted, lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FİYAT ÖZETİ */}
        <section style={{ padding: isMobile ? '40px 0' : '70px 0' }}>
          <h2
            style={{
              fontSize: isMobile ? '24px' : '34px',
              fontWeight: '700',
              textAlign: 'center',
              color: c.text,
              margin: '0 0 12px 0',
            }}
          >
            Basit ve Şeffaf Fiyatlandırma
          </h2>
          <p style={{ textAlign: 'center', color: c.textMuted, fontSize: '16px', margin: '0 0 40px 0' }}>
            Ücretsiz başlayın, hazır olduğunuzda yükseltin
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '20px',
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >
            {/* Ücretsiz */}
            <div
              style={{
                background: c.card,
                border: `1px solid ${c.cardBorder}`,
                borderRadius: '16px',
                padding: '28px 24px',
              }}
            >
              <p style={{ fontSize: '12px', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', margin: '0 0 8px' }}>
                Ücretsiz
              </p>
              <div style={{ fontSize: '36px', fontWeight: '700', color: c.text, marginBottom: '4px' }}>$0</div>
              <p style={{ fontSize: '13px', color: c.textMuted, margin: '0 0 20px' }}>50 siparişe kadar</p>
              <a href="/login" style={{ ...secondaryBtn, display: 'block', textAlign: 'center', padding: '12px' }}>
                Başla
              </a>
            </div>
            {/* Aylık */}
            <div
              style={{
                background: c.card,
                border: `1px solid ${c.cardBorder}`,
                borderRadius: '16px',
                padding: '28px 24px',
              }}
            >
              <p style={{ fontSize: '12px', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', margin: '0 0 8px' }}>
                Aylık Pro
              </p>
              <div style={{ fontSize: '36px', fontWeight: '700', color: c.text, marginBottom: '4px' }}>
                $2.99<span style={{ fontSize: '14px', color: c.textMuted, fontWeight: '400' }}>/ay</span>
              </div>
              <p style={{ fontSize: '13px', color: c.textMuted, margin: '0 0 20px' }}>Sınırsız sipariş</p>
              <a href="/pricing" style={{ ...secondaryBtn, display: 'block', textAlign: 'center', padding: '12px' }}>
                Detaylar
              </a>
            </div>
            {/* Yıllık */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)',
                border: '2px solid #667eea',
                borderRadius: '16px',
                padding: '28px 24px',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: '#fff',
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontWeight: '700',
                }}
              >
                2 AY BEDAVA
              </span>
              <p style={{ fontSize: '12px', color: '#667eea', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', margin: '0 0 8px' }}>
                Yıllık Pro ⭐
              </p>
              <div style={{ fontSize: '36px', fontWeight: '700', color: c.text, marginBottom: '4px' }}>
                $2.50<span style={{ fontSize: '14px', color: c.textMuted, fontWeight: '400' }}>/ay</span>
              </div>
              <p style={{ fontSize: '13px', color: c.textMuted, margin: '0 0 20px' }}>$29.99 yıllık tek ödeme</p>
              <a href="/pricing" style={{ ...primaryBtn, display: 'block', textAlign: 'center', padding: '12px', fontSize: '15px' }}>
                Detaylar
              </a>
            </div>
          </div>
        </section>

        {/* SSS */}
        <section style={{ padding: isMobile ? '40px 0' : '60px 0', maxWidth: '760px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: isMobile ? '24px' : '34px',
              fontWeight: '700',
              textAlign: 'center',
              color: c.text,
              margin: '0 0 40px 0',
            }}
          >
            Sıkça Sorulan Sorular
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: c.card,
                  borderRadius: '12px',
                  border: `1px solid ${c.cardBorder}`,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: '600', color: c.text }}>{faq.q}</span>
                  <span
                    style={{
                      fontSize: '22px',
                      color: '#667eea',
                      transition: 'transform 0.2s',
                      transform: openFaq === idx ? 'rotate(45deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>
                {/* İçerik HER ZAMAN DOM'da (display ile gizlenir) — SEO için kritik */}
                <div
                  style={{
                    padding: openFaq === idx ? '0 20px 18px 20px' : '0 20px',
                    maxHeight: openFaq === idx ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.25s ease, padding 0.25s ease',
                    fontSize: '14px',
                    color: c.textMuted,
                    lineHeight: '1.7',
                  }}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SON CTA */}
        <section style={{ textAlign: 'center', padding: isMobile ? '40px 0 60px' : '60px 0 90px' }}>
          <h2 style={{ fontSize: isMobile ? '26px' : '38px', fontWeight: '800', margin: '0 0 16px', ...gradientText }}>
            Hemen Başlayın
          </h2>
          <p style={{ fontSize: '16px', color: c.textMuted, margin: '0 0 30px', maxWidth: '480px', marginInline: 'auto' }}>
            Siparişlerinizi düzene sokmak için doğru zaman şimdi. İlk 50 sipariş tamamen ücretsiz.
          </p>
          <a href="/login" style={primaryBtn}>
            Ücretsiz Hesap Oluştur →
          </a>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: `1px solid ${c.cardBorder}`,
            padding: '30px 0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            color: c.textMuted,
          }}
        >
          <span>© {new Date().getFullYear()} SiparişDefterim</span>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <a href="/privacy-policy" style={{ color: c.textMuted, textDecoration: 'none' }}>Gizlilik</a>
            <a href="/terms-of-use" style={{ color: c.textMuted, textDecoration: 'none' }}>Kullanım Koşulları</a>
            <a href="/refund-policy" style={{ color: c.textMuted, textDecoration: 'none' }}>İade Politikası</a>
            <a href="/distance-sales" style={{ color: c.textMuted, textDecoration: 'none' }}>Mesafeli Satış</a>
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: '#667eea', textDecoration: 'none' }}>{SUPPORT_EMAIL}</a>
          </div>
        </footer>
      </div>
    </main>
  )
}
