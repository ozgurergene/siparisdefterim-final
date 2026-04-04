'use client'

import { useEffect, useState } from 'react'
import { colors } from '../../lib/theme'

export default function DistanceSales() {
  const [theme, setTheme] = useState('light')
  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: '40px 20px', fontFamily: 'Arial' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: c.header, padding: '40px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
        <h1 style={{ color: c.text, marginBottom: '30px', fontSize: '28px' }}>Mesafeli Satış Sözleşmesi</h1>
        
        <div style={{ color: c.text, lineHeight: '1.8', fontSize: '15px' }}>
          <h2 style={{ marginTop: '20px', marginBottom: '15px', fontSize: '20px' }}>1. Taraflar</h2>
          <p><strong>Satıcı:</strong> SiparişDefterim</p>
          <p><strong>Alıcı:</strong> Platformu kullanan üye</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>2. Sözleşmenin Konusu</h2>
          <p>Bu sözleşme, alıcının satıcıya ait SiparişDefterim platformu üzerinden sunulan hizmetleri satın almasına ilişkin tarafların hak ve yükümlülüklerini düzenler.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>3. Hizmet Bilgileri</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Hizmet:</strong> Sipariş yönetim platformu</li>
            <li><strong>Ücretsiz Plan:</strong> 50 siparişe kadar ücretsiz</li>
            <li><strong>Pro Plan:</strong> Aylık 99 TL veya Yıllık 999 TL</li>
          </ul>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>4. Ödeme Şekli</h2>
          <p>Kredi kartı ile güvenli ödeme altyapısı üzerinden tahsil edilir.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>5. Teslimat</h2>
          <p>Dijital hizmet olup, ödeme onayından sonra 24 saat içinde hesabınız aktif edilir.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>6. Cayma Hakkı</h2>
          <p>Tüketici, sözleşmenin kurulduğu tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.</p>
          <p style={{ marginTop: '10px' }}>Cayma hakkını kullanmak için <strong>support@siparisdefterim.com</strong> adresine e-posta gönderebilirsiniz.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>7. Uyuşmazlık Çözümü</h2>
          <p>Bu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti mahkemeleri ve icra daireleri yetkilidir.</p>
        </div>

        <a href="/login" style={{ display: 'inline-block', marginTop: '30px', color: '#007bff', textDecoration: 'underline' }}>← Geri Dön</a>
      </div>
    </div>
  )
}