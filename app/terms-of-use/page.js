'use client'

import { useEffect, useState } from 'react'
import { colors } from '../../lib/theme'

export default function TermsOfUse() {
  const [theme, setTheme] = useState('light')
  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: '40px 20px', fontFamily: 'Arial' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: c.header, padding: '40px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
        <h1 style={{ color: c.text, marginBottom: '30px', fontSize: '28px' }}>Kullanım Koşulları</h1>
        
        <div style={{ color: c.text, lineHeight: '1.8', fontSize: '15px' }}>
          <h2 style={{ marginTop: '20px', marginBottom: '15px', fontSize: '20px' }}>Mesafeli Sözleşmeler Yönetmeliği Kapsamında Bilgilendirme</h2>

          <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Satıcı Bilgileri</h3>
          <p><strong>Şirket:</strong> SiparişDefterim</p>
          <p><strong>E-mail:</strong> support@siparisdefterim.com</p>

          <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Hizmet Özeti</h3>
          <p>Instagram satıcıları için sipariş yönetim, durum takibi ve müşteri bildirimi hizmetleri</p>

          <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Fiyatlandırma</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Ücretsiz Plan:</strong> 50 siparişe kadar</li>
            <li><strong>Pro Plan:</strong> 99 TL/ay veya 999 TL/yıl</li>
          </ul>

          <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Ödeme Yöntemi</h3>
          <p>Kredi kartı, güvenli ödeme altyapısı üzerinden</p>

          <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Hizmet Aktivasyonu</h3>
          <p>Hizmet, üyelik onayı ve ödeme sonrası 24 saat içinde aktif edilir.</p>

          <h3 style={{ marginTop: '25px', marginBottom: '10px', fontSize: '17px' }}>Cayma Hakkı</h3>
          <p>Sözleşmenin imzalanmasından itibaren 14 (on dört) gün içinde cayma hakkınız bulunmaktadır.</p>
        </div>

        <a href="/login" style={{ display: 'inline-block', marginTop: '30px', color: '#007bff', textDecoration: 'underline' }}>← Geri Dön</a>
      </div>
    </div>
  )
}