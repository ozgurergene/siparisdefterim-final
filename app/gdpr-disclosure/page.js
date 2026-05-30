'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import Footer from '../../components/Footer'

export default function GDPRDisclosure() {
  const router = useRouter()
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState(null)
  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'dark'
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
          <h1 style={{ color: c.text, marginBottom: '30px', fontSize: '28px' }}>KVKK Aydınlatma Metni</h1>

          <div style={{ color: c.text, lineHeight: '1.8', fontSize: '15px' }}>
            <p><strong>Veri Sorumlusu:</strong> Deftertut (deftertut.com)</p>

            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>İşlenen Kişisel Veriler</h2>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Ad ve soyad</li>
              <li>E-mail adresi</li>
              <li>Telefon numarası</li>
              <li>Instagram hesap bilgileri</li>
              <li>Sipariş ve müşteri verileri</li>
              <li>Sistem logları (IP, cihaz, erişim saatleri)</li>
              <li>Çerez verileri</li>
            </ul>

            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>İşleme Amacı</h2>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Platform hizmetinin sunulması</li>
              <li>Üyelik ve hesap yönetimi</li>
              <li>Sipariş yönetim hizmetinin sağlanması</li>
              <li>WhatsApp bildirimleri gönderimi</li>
              <li>Müşteri destek hizmetleri</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Platform güvenliği</li>
              <li>Hizmet ve ürünlerin iyileştirilmesi</li>
            </ul>

            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>Hukuki Dayanak</h2>
            <p>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca işlenmektedir.</p>

            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>Haklarınız</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen verilerinize erişim talep etme</li>
              <li>Verilerinizin düzeltilmesini isteme</li>
              <li>Verilerinizin silinmesini isteme</li>
              <li>Verilerinizin işlenmesine itiraz etme</li>
              <li>Verilerinizin yurt dışına aktarımı hakkında bilgi alma</li>
            </ul>

            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>İletişim</h2>
            <p>
              KVKK kapsamındaki haklarınızı kullanmak için <a href="mailto:destek@deftertut.com" style={{ color: '#a78bfa', fontWeight: '600' }}>destek@deftertut.com</a> adresine yazabilirsiniz.
              Talepleriniz 30 gün içinde yanıtlanır.
            </p>
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}
