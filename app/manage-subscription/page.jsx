'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import Footer from '../../components/Footer'

// Lemon Squeezy Customer Portal URL
const CUSTOMER_PORTAL_URL = 'https://siparisdefterim-final.lemonsqueezy.com/billing'

export default function ManageSubscriptionPage() {
  const router = useRouter()
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!data?.session?.user) {
          router.push('/login')
          return
        }
        setUser(data.session.user)

        const { data: userData } = await supabase
          .from('users')
          .select('is_pro')
          .eq('id', data.session.user.id)
          .single()

        setIsPro(userData?.is_pro || false)
      } catch (error) {
        console.error('Error:', error)
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: c.text }}>Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: c.bg,
      fontFamily: 'Arial, sans-serif',
      color: c.text,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Basit Header */}
      <div style={{
        background: c.header,
        borderBottom: `1px solid ${c.border}`,
        padding: '15px 20px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ color: c.text, textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            📋 SiparişDefterim
          </a>
          <a 
            href="/dashboard" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none', 
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ← Panele Dön
          </a>
        </div>
      </div>

      {/* İçerik */}
      <div style={{ flex: 1, padding: '40px 20px', maxWidth: '900px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px', color: c.text }}>Aboneliği Yönet</h1>
        <p style={{ color: c.textSecondary, fontSize: '14px', marginBottom: '30px' }}>
          Pro üyeliğinizi buradan yönetebilirsiniz
        </p>

        {/* Plan Durumu Kartı */}
        <div style={{
          background: isPro 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
            : c.header,
          border: isPro ? '2px solid #667eea' : `1px solid ${c.border}`,
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '13px', color: c.textSecondary, marginBottom: '4px' }}>
                Mevcut Plan
              </p>
              <h2 style={{ margin: 0, fontSize: '24px', color: c.text }}>
                {isPro ? '✨ Pro Üyelik' : '🆓 Ücretsiz Plan'}
              </h2>
            </div>
            {isPro && (
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: '11px',
                padding: '6px 12px',
                borderRadius: '12px',
                fontWeight: '700',
                letterSpacing: '0.5px'
              }}>AKTİF</span>
            )}
          </div>

          <p style={{ color: c.text, fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            {isPro 
              ? 'Sınırsız sipariş hakkınız aktif. Pro özelliklerin tamamından yararlanabilirsiniz.'
              : 'Ücretsiz plan ile 50 siparişe kadar oluşturabilirsiniz. Sınırsız kullanım için Pro üyeliğe geçin.'}
          </p>
        </div>

        {/* Pro Kullanıcılar İçin: Aboneliği Yönet */}
        {isPro && (
          <div style={{
            background: c.header,
            border: `1px solid ${c.border}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '12px', color: c.text }}>
              🔧 Aboneliğinizi Yönetin
            </h3>
            <p style={{ color: c.text, fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
              Aşağıdaki butona tıklayarak güvenli müşteri portalına ulaşabilirsiniz. Bu portalda yapabilecekleriniz:
            </p>
            <ul style={{ color: c.text, fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '20px' }}>
              <li>Aboneliği iptal et</li>
              <li>Faturaları ve ödeme geçmişini görüntüle</li>
              <li>Kart bilgilerini güncelle</li>
              <li>Plan değiştir (Aylık ↔ Yıllık)</li>
              <li>Adres ve fatura bilgilerini düzenle</li>
            </ul>

            <a 
              href={CUSTOMER_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              🔗 Aboneliği Yönet (Müşteri Portalı)
            </a>

            <p style={{ color: c.textSecondary, fontSize: '12px', marginTop: '12px', marginBottom: 0 }}>
              💡 Müşteri portalına giriş yapmak için size e-posta adresinize bir doğrulama linki gönderilecektir.
            </p>
          </div>
        )}

        {/* Free Kullanıcılar İçin: Pro'ya Yükselt */}
        {!isPro && (
          <div style={{
            background: c.header,
            border: `1px solid ${c.border}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '12px', color: c.text }}>
              ⭐ Pro'ya Yükselt
            </h3>
            <p style={{ color: c.text, fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
              Pro üyelik ile sınırsız sipariş oluşturabilir, gelecek özelliklerden ilk siz yararlanabilirsiniz.
            </p>

            <a 
              href="/pricing"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              Pro Planları İncele
            </a>
          </div>
        )}

        {/* Yardım Kartı */}
        <div style={{
          background: 'rgba(102, 126, 234, 0.05)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '16px', marginTop: 0, marginBottom: '12px', color: c.text }}>
            🤝 Yardıma mı ihtiyacınız var?
          </h3>
          <p style={{ color: c.text, fontSize: '14px', lineHeight: '1.7', marginBottom: '8px' }}>
            Müşteri portalında sorun yaşıyorsanız veya tercih ederseniz, e-posta yoluyla da iptal/iade talebinde bulunabilirsiniz:
          </p>
          <p style={{ margin: '8px 0' }}>
            📧 <a href="mailto:destek@deftertut.com" style={{ color: '#667eea', fontWeight: '600' }}>destek@deftertut.com</a>
          </p>
          <p style={{ color: c.textSecondary, fontSize: '12px', margin: '8px 0 0 0' }}>
            Tüm taleplere 1-2 iş günü içinde dönüş yapılır.
          </p>
        </div>

        {/* İlgili Sayfalar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '30px' }}>
          <a 
            href="/refund-policy" 
            style={{ 
              color: c.textSecondary, 
              textDecoration: 'none', 
              fontSize: '13px',
              padding: '8px 16px',
              border: `1px solid ${c.border}`,
              borderRadius: '6px'
            }}
          >
            📄 İade ve İptal Politikası
          </a>
          <a 
            href="/pricing" 
            style={{ 
              color: c.textSecondary, 
              textDecoration: 'none', 
              fontSize: '13px',
              padding: '8px 16px',
              border: `1px solid ${c.border}`,
              borderRadius: '6px'
            }}
          >
            💰 Fiyatlandırma
          </a>
          <a 
            href="/terms-of-use" 
            style={{ 
              color: c.textSecondary, 
              textDecoration: 'none', 
              fontSize: '13px',
              padding: '8px 16px',
              border: `1px solid ${c.border}`,
              borderRadius: '6px'
            }}
          >
            📋 Kullanım Koşulları
          </a>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}