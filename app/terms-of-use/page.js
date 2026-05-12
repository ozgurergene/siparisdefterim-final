'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import Footer from '../../components/Footer'

export default function TermsOfUse() {
  const router = useRouter()
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('siparisdefterim-theme') || 'light'
  })
  const [user, setUser] = useState(null)
  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)

    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) setUser(data.session.user)
    }
    checkUser()

    const handleStorageChange = () => {
      const t = localStorage.getItem('siparisdefterim-theme')
      if (t) setTheme(t)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

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
            href={user ? '/dashboard' : '/login'}
            style={{
              color: '#a78bfa',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {user ? '← Panele Dön' : 'Giriş Yap'}
          </a>
        </div>
      </div>

      {/* Ana Icerik */}
      <div style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: c.bgCard,
          backdropFilter: c.backdropFilter,
          WebkitBackdropFilter: c.backdropFilter,
          padding: '40px',
          borderRadius: '20px',
          border: `1px solid ${c.border}`
        }}>
          <h1 style={{ color: c.text, marginBottom: '30px', fontSize: '28px' }}>Kullanım Koşulları</h1>

          <div style={{ color: c.text, lineHeight: '1.8', fontSize: '15px' }}>
            <h2 style={{ marginTop: '20px', marginBottom: '15px', fontSize: '20px' }}>Mesafeli Sözleşmeler Yönetmeliği Kapsamında Bilgilendirme</h2>

            <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Satıcı Bilgileri</h3>
            <p><strong>Ünvan:</strong> SiparişDefterim</p>
            <p><strong>E-mail:</strong> destek@deftertut.com</p>

            <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Hizmet Özeti</h3>
            <p>Instagram satıcıları için sipariş yönetim, durum takibi ve müşteri bildirimi hizmetleri</p>

            <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Fiyatlandırma</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Ücretsiz Plan:</strong> 50 siparişe kadar</li>
              <li><strong>Pro Plan:</strong> 99 TL/ay veya 999 TL/yıl</li>
            </ul>

            <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Ödeme Yöntemi</h3>
            <p>Kredi kartı, güvenli ödeme altyapısı üzerinden (Lemon Squeezy)</p>

            <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Hizmet Aktivasyonu</h3>
            <p>Hizmet, üyelik onayı ve ödeme sonrası <strong>anında</strong> aktif edilir. Hizmetin ifasına ödeme onayıyla birlikte başlanmış sayılır.</p>

            {/* === GUNCEL: Cayma Hakki - TKHK Madde 15/g feragati === */}
            <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Cayma Hakkı</h3>
            
            <div style={{
              background: theme === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.06)',
              border: `1px solid ${theme === 'dark' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.25)'}`,
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '12px',
              marginTop: '10px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                <strong>⚠️ Önemli:</strong> Pro üyelik dijital bir hizmet olduğu için cayma hakkı kapsamı dışındadır.
              </p>
            </div>

            <p>
              Pro üyelik, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği'nin 
              <strong> 15. maddesinin 1. fıkrasının (ğ) bendi</strong> uyarınca "elektronik ortamda anında ifa edilen 
              hizmetler" kapsamında olup, <strong>cayma hakkı bulunmamaktadır</strong>.
            </p>

            <p style={{ marginTop: '10px' }}>
              Üye, Pro üyelik satın alma işlemini onaylayarak hizmetin satın alma anında ifasına başlanmasına ve 
              <strong> cayma hakkından feragat ettiğini açıkça beyan ve kabul</strong> eder.
            </p>

            <p style={{ marginTop: '10px' }}>
              Üye, dilediği zaman aboneliğini iptal edebilir. İptal sonrasında ödediği dönemin sonuna kadar Pro 
              özelliklerini kullanmaya devam eder ve dönem sonunda otomatik olarak ücretsiz pakete geçer. 
              <strong> Yapılan ödemeler iade edilmez.</strong>
            </p>

            <p style={{ marginTop: '10px' }}>
              Detaylı bilgi için <a href="/refund-policy" style={{ color: '#a78bfa' }}>İade ve İptal Politikası</a> sayfamızı inceleyebilirsiniz.
            </p>

            {/* === YENI: Iptal Yontemi === */}
            <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>İptal Yöntemi</h3>
            <p>
              Aboneliğinizi iptal etmek için <strong>destek@deftertut.com</strong> adresine e-posta gönderebilir 
              veya <a href="/manage-subscription" style={{ color: '#a78bfa' }}>Aboneliği Yönet</a> sayfasındaki butonu kullanabilirsiniz. 
              Talepler 1-2 iş günü içinde işleme alınır.
            </p>
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}