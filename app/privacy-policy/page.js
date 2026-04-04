'use client'

import { useEffect, useState } from 'react'
import { colors } from '../../lib/theme'

export default function PrivacyPolicy() {
  const [theme, setTheme] = useState('light')
  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: '40px 20px', fontFamily: 'Arial' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: c.header, padding: '40px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
        <h1 style={{ color: c.text, marginBottom: '30px', fontSize: '28px' }}>Gizlilik ve Çerez Politikası</h1>
        
        <div style={{ color: c.text, lineHeight: '1.8', fontSize: '15px' }}>
          <h2 style={{ marginTop: '20px', marginBottom: '15px', fontSize: '20px' }}>1. Çerezler Nedir?</h2>
          <p>Çerezler, internet sitesini ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>2. Çerez Türleri</h2>
          
          <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>a) Teknik Çerezler</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Oturum yönetimi</li>
            <li>Platform güvenliği</li>
            <li>Hata giderme</li>
          </ul>

          <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>b) Analitik Çerezler</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Ziyaretçi davranışı analizi</li>
            <li>Sayfa performansı takibi</li>
          </ul>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>3. Veri Güvenliği</h2>
          <p>Kişisel verileriniz, endüstri standartlarında güvenlik önlemleri ile korunmaktadır. SSL şifreleme kullanılmaktadır.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>4. Üçüncü Taraf Hizmetler</h2>
          <p>Platform, hizmet kalitesini artırmak için üçüncü taraf hizmetler (ödeme sistemleri, analitik araçları) kullanabilir. Bu hizmetlerin kendi gizlilik politikaları bulunmaktadır.</p>
        </div>

        <a href="/login" style={{ display: 'inline-block', marginTop: '30px', color: '#007bff', textDecoration: 'underline' }}>← Geri Dön</a>
      </div>
    </div>
  )
}