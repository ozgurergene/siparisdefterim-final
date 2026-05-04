'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'

// Lemon Squeezy Checkout URLs (TEST MODE - Live mode'a geçince değiştir)
const CHECKOUT_URLS = {
  monthly: 'https://siparisdefterim-final.lemonsqueezy.com/checkout/buy/c2ec9f39-40ec-4f7a-a0eb-f6a6f5ce2461',
  yearly: 'https://siparisdefterim-final.lemonsqueezy.com/checkout/buy/a4c6b3d5-dc9b-4375-babf-69ab15ca4999'
}

const SUPPORT_EMAIL = 'destek@deftertut.com'

// FAQ Verileri
const FAQS = [
  {
    q: 'İptal edebilir miyim?',
    a: 'Evet, istediğiniz zaman iptal edebilirsiniz. İptal sonrasında mevcut dönem sonuna kadar Pro özelliklerini kullanmaya devam edersiniz.'
  },
  {
    q: 'Para iadesi var mı?',
    a: '14 gün içinde memnun kalmazsanız tam iade alırsınız. destek@deftertut.com adresine yazın, hemen iade işlemi başlatılır.'
  },
  {
    q: 'Hangi ödeme yöntemleri kabul ediliyor?',
    a: 'Tüm kredi kartları (Visa, Mastercard, American Express), Apple Pay ve Google Pay kabul ediyoruz. Ödeme altyapısı uluslararası standartlara uygun ve güvenlidir.'
  },
  {
    q: 'Faturamı nasıl alırım?',
    a: 'Ödemenin ardından otomatik olarak e-posta adresinize fatura gönderilir.'
  }
]

function PricingContent() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('light')
  const [isPro, setIsPro] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  const c = colors[theme]
  const isDark = theme === 'dark'

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data?.session?.user) {
          setUser(data.session.user)
          const { data: userData } = await supabase
            .from('users')
            .select('is_pro')
            .eq('id', data.session.user.id)
            .single()
          setIsPro(userData?.is_pro || false)
        }
      } catch (error) {
        console.error('Auth error:', error)
      }
      setLoading(false)
    }
    checkUser()
  }, [])

  // Realtime subscription — Pro'ya geçince sayfa otomatik güncellensin
  useEffect(() => {
    if (!user?.id) return
    const channel = supabase
      .channel(`user-changes-pricing-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new?.is_pro !== undefined) {
            setIsPro(payload.new.is_pro)
          }
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const handleMonthly = () => {
    if (!user) {
      router.push('/login?redirect=/pricing')
      return
    }
    window.open(CHECKOUT_URLS.monthly, '_blank')
  }

  const handleYearly = () => {
    if (!user) {
      router.push('/login?redirect=/pricing')
      return
    }
    window.open(CHECKOUT_URLS.yearly, '_blank')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: c.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: 50,
          height: 50,
          border: '3px solid rgba(102, 126, 234, 0.1)',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark
        ? 'linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)'
        : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'Arial, sans-serif',
      color: c.text,
      padding: isMobile ? '20px 16px 60px 16px' : '40px 24px 80px 24px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Geri dön linki */}
        <button
          onClick={() => router.push(user ? '/home' : '/')}
          style={{
            background: 'transparent',
            border: 'none',
            color: c.textSecondary,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px 12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← Geri Dön
        </button>

        {/* PRO Kullanıcı Görünümü */}
        {isPro ? (
          <div style={{
            background: c.header,
            borderRadius: '20px',
            padding: isMobile ? '32px 24px' : '50px 40px',
            textAlign: 'center',
            border: `1px solid ${c.border}`,
            boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.06)',
            marginTop: '40px'
          }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>✨</div>
            <h1 style={{
              fontSize: isMobile ? '26px' : '32px',
              fontWeight: '700',
              margin: '0 0 12px 0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Sen zaten Pro üyesisin!
            </h1>
            <p style={{
              fontSize: '16px',
              color: c.textSecondary,
              margin: '0 0 30px 0',
              lineHeight: '1.6'
            }}>
              Tüm Pro özelliklerine erişimin var. Sınırsız sipariş, tüm raporlar ve öncelikli destek aktif.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              Dashboard'a Git →
            </button>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div style={{
              textAlign: 'center',
              marginBottom: isMobile ? '32px' : '50px',
              marginTop: '20px'
            }}>
              <div style={{ fontSize: isMobile ? '56px' : '72px', marginBottom: '16px' }}>🚀</div>
              <h1 style={{
                fontSize: isMobile ? '28px' : '40px',
                fontWeight: '700',
                margin: '0 0 12px 0',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Pro'ya Yükselt
              </h1>
              <p style={{
                fontSize: isMobile ? '15px' : '17px',
                color: c.textSecondary,
                margin: 0,
                lineHeight: '1.6',
                maxWidth: '500px',
                marginInline: 'auto'
              }}>
                Sınırsız sipariş, gelişmiş raporlar ve öncelikli destek ile işini büyüt
              </p>
            </div>

            {/* Login değil uyarısı */}
            {!user && (
              <div style={{
                background: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '20px' }}>🔐</span>
                <span style={{ flex: 1, fontSize: '13px', color: c.text, minWidth: '200px' }}>
                  Pro üye olmak için önce giriş yapmanız gerekiyor
                </span>
                <button
                  onClick={() => router.push('/login?redirect=/pricing')}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Giriş Yap
                </button>
              </div>
            )}

            {/* Plan Kartları */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '16px' : '20px',
              marginBottom: '40px'
            }}>
              {/* AYLIK */}
              <div style={{
                background: c.header,
                borderRadius: '16px',
                padding: isMobile ? '24px 20px' : '32px 28px',
                border: `1px solid ${c.border}`,
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.06)'
              }}>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '12px',
                  color: c.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600'
                }}>
                  Aylık
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '20px' }}>
                  <span style={{ fontSize: isMobile ? '36px' : '44px', fontWeight: '700', color: c.text }}>
                    ₺99
                  </span>
                  <span style={{ fontSize: '14px', color: c.textSecondary }}>/ay</span>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <FeatureLine isDark={isDark} text="Sınırsız sipariş oluşturma" />
                  <FeatureLine isDark={isDark} text="Tüm raporlara erişim" />
                  <FeatureLine isDark={isDark} text="Müşteri analizi" />
                  <FeatureLine isDark={isDark} text="Öncelikli destek" />
                </div>

                <button
                  onClick={handleMonthly}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: isDark ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '1px solid rgba(102, 126, 234, 0.4)',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.25)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Aylık Pro'ya Geç
                </button>
              </div>

              {/* YILLIK - vurgulu */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)',
                borderRadius: '16px',
                padding: isMobile ? '24px 20px' : '32px 28px',
                border: '2px solid #667eea',
                position: 'relative',
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.2)'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: '#fff',
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                }}>
                  %16 İNDİRİM
                </span>

                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '12px',
                  color: '#667eea',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '700'
                }}>
                  Yıllık ⭐ Önerilen
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: isMobile ? '36px' : '44px', fontWeight: '700', color: c.text }}>
                    ₺83
                  </span>
                  <span style={{ fontSize: '14px', color: c.textSecondary }}>/ay</span>
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: c.textSecondary }}>
                  ₺999 yıllık tek ödeme
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <FeatureLine isDark={isDark} text="Sınırsız sipariş oluşturma" />
                  <FeatureLine isDark={isDark} text="Tüm raporlara erişim" />
                  <FeatureLine isDark={isDark} text="Müşteri analizi" />
                  <FeatureLine isDark={isDark} text="Öncelikli destek" />
                  <FeatureLine isDark={isDark} text="2 ay bedava 🎁" highlighted />
                </div>

                <button
                  onClick={handleYearly}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  Yıllık Pro'ya Geç →
                </button>
              </div>
            </div>

            {/* Güvenlik Bilgisi */}
            <div style={{
              textAlign: 'center',
              marginBottom: '50px',
              padding: '20px',
              background: isDark ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.06)',
              borderRadius: '12px',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <p style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                color: '#22c55e',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                🔒 Güvenli Ödeme
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: c.textSecondary, lineHeight: '1.6' }}>
                Tüm ödemeler şifreli ve güvenlidir. Kart bilgileriniz tarafımızda saklanmaz.
              </p>
            </div>

            {/* FAQ */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: isMobile ? '22px' : '28px',
                fontWeight: '700',
                color: c.text,
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                Sıkça Sorulan Sorular
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: c.header,
                      borderRadius: '12px',
                      border: `1px solid ${c.border}`,
                      overflow: 'hidden',
                      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left',
                        gap: '12px'
                      }}
                    >
                      <span style={{ fontSize: '15px', fontWeight: '600', color: c.text }}>
                        {faq.q}
                      </span>
                      <span style={{
                        fontSize: '20px',
                        color: '#667eea',
                        transition: 'transform 0.2s',
                        transform: openFaq === idx ? 'rotate(45deg)' : 'rotate(0deg)',
                        flexShrink: 0
                      }}>
                        +
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div style={{
                        padding: '0 20px 16px 20px',
                        fontSize: '14px',
                        color: c.textSecondary,
                        lineHeight: '1.7'
                      }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div style={{
              textAlign: 'center',
              padding: '24px',
              background: c.header,
              borderRadius: '12px',
              border: `1px solid ${c.border}`
            }}>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '14px',
                color: c.text,
                fontWeight: '600'
              }}>
                Sorunuz mu var?
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: c.textSecondary }}>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  {SUPPORT_EMAIL}
                </a>
                {' '}adresinden bize ulaşabilirsiniz
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Feature line component
function FeatureLine({ text, highlighted, isDark }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    }}>
      <span style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: highlighted
          ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
          : 'rgba(34, 197, 94, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <span style={{
          color: highlighted ? '#fff' : '#22c55e',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>✓</span>
      </span>
      <span style={{
        fontSize: '14px',
        color: isDark ? '#e2e8f0' : '#1a1a2e',
        fontWeight: highlighted ? '600' : '400'
      }}>
        {text}
      </span>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: '#0d0d1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Yükleniyor...</p>
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}