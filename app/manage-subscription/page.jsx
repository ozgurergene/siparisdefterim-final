'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import Footer from '../../components/Footer'

// NOT: Polar.sh Customer Portal aktif. Musteri "Aboneligi Yonet" butonu ile
// https://polar.sh/deftertut/portal adresine yonlendirilir; orada email + OTP
// ile giris yapip iptal/odeme/fatura islemlerini kendisi yapar.
// Webhook tarafi (subscription.canceled, order.refunded) zaten DB'yi senkronize ediyor.

export default function ManageSubscriptionPage() {
  const router = useRouter()
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'dark'
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

  // === Polar Customer Portal'a yonlendir (yeni sekmede) ===
  const handleManagePortal = () => {
    window.open('https://polar.sh/deftertut/portal', '_blank', 'noopener,noreferrer')
  }

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
      background: c.bgGradient,
      fontFamily: 'Arial, sans-serif',
      color: c.text,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Basit Header */}
      <div style={{
        background: c.header,
        backdropFilter: c.backdropFilter,
        WebkitBackdropFilter: c.backdropFilter,
        borderBottom: `1px solid ${c.border}`,
        padding: '15px 20px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '26px' }}>📱</span>
            <span style={{
              fontSize: '20px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>SiparişDefterim</span>
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

        {/* Pro Kullanicilar Icin - Polar Customer Portal */}
        {isPro && (
          <div style={{
            background: c.header,
            border: `1px solid ${c.border}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '12px', color: c.text }}>
              ⚙️ Aboneliği İptal Et
            </h3>
            <p style={{ color: c.text, fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
              Pro aboneliğinizi iptal etmek, ödeme yönteminizi güncellemek veya faturalarınızı indirmek için
              Polar Customer Portal'ı kullanabilirsiniz. İşlemlerinizi anında ve kendiniz yapabilirsiniz.
            </p>

            {/* İade Politikası Notu */}
            <div style={{
              background: theme === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.06)',
              border: `1px solid ${theme === 'dark' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.2)'}`,
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '16px'
            }}>
              <p style={{ color: c.text, fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                <strong>⚠️ Önemli Bilgi:</strong> İptal sonrasında <strong>ödediğiniz dönemin (aylık/yıllık) sonuna kadar</strong> Pro
                özelliklerini kullanmaya devam edersiniz. Dönem sonunda otomatik olarak ücretsiz pakete geçersiniz.
                <strong> Yapılan ödemeler iade edilmez.</strong>
              </p>
            </div>

            <button
              onClick={handleManagePortal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              ⚙️ Aboneliği Yönet
            </button>

            <p style={{ color: c.textSecondary, fontSize: '12px', marginTop: '12px', marginBottom: 0, lineHeight: '1.6' }}>
              💡 Butona tıkladığınızda <strong>Polar Customer Portal</strong> yeni sekmede açılır. Burada aboneliğinizi
              iptal edebilir, ödeme yönteminizi güncelleyebilir ve faturalarınızı indirebilirsiniz.
              <br /><br />
              <strong>Giriş Nasıl Yapılır:</strong> Polar size e-posta adresinize bir doğrulama kodu (OTP) gönderir.
              Bu kodu portal sayfasına yazarak giriş yapabilirsiniz.
              <br /><br />
              <strong>Dikkat:</strong> Doğrulama kodu birkaç dakika içinde gelmezse <strong>Spam / Gereksiz</strong> klasörünüzü
              kontrol edin. Polar'a kayıtlı e-posta adresinizi (ödeme sırasında kullandığınız adres) kullanmanız
              gerekir; e-posta adresinizi değiştirdiyseniz veya farklı bir adresle ödeme yaptıysanız doğru adresi
              kullandığınızdan emin olun.
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

        {/* Yardim Karti */}
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
            Üyelik, fatura veya hesabınızla ilgili her türlü sorunuzda bize ulaşabilirsiniz:
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