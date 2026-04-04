'use client'

import { useEffect, useState } from 'react'
import { colors } from '../../lib/theme'

export default function GDPRDisclosure() {
  const [theme, setTheme] = useState('light')
  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: '40px 20px', fontFamily: 'Arial' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: c.header, padding: '40px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
        <h1 style={{ color: c.text, marginBottom: '30px', fontSize: '28px' }}>KVKK Aydınlatma Metni</h1>
        
        <div style={{ color: c.text, lineHeight: '1.8', fontSize: '15px' }}>
          <p><strong>Veri Sorumlusu:</strong> SiparişDefterim</p>
          
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
        </div>

        <a href="/login" style={{ display: 'inline-block', marginTop: '30px', color: '#007bff', textDecoration: 'underline' }}>← Geri Dön</a>
      </div>
    </div>
  )
}