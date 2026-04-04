'use client'

import { useEffect, useState } from 'react'
import { colors } from '../../lib/theme'

export default function Disclaimer() {
  const [theme, setTheme] = useState('light')
  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: '40px 20px', fontFamily: 'Arial' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: c.header, padding: '40px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
        <h1 style={{ color: c.text, marginBottom: '30px', fontSize: '28px' }}>Sorumluluk Reddi (Disclaimer)</h1>
        
        <div style={{ color: c.text, lineHeight: '1.8', fontSize: '15px' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>
            SiparişDefterim Platformu "OLDUĞU GİBİ" sunulmaktadır.
          </p>

          <p>Platform aşağıdakilerden sorumlu DEĞİLDİR:</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>1. Veri Doğruluğu</h2>
          <p>Platform, kullanıcılar tarafından girilen verilerin doğruluğu konusunda sorumluluk almaz. Sipariş bilgileri, müşteri verileri ve diğer içerikler kullanıcının sorumluluğundadır.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>2. Hizmet Kesintileri</h2>
          <p>Sunucu arızaları, ağ sorunları veya diğer teknik nedenlerle ortaya çıkan kesintilerden platform sorumlu değildir. Planlı bakım çalışmaları önceden duyurulacaktır.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>3. Üçüncü Taraf Hizmetler</h2>
          <p>WhatsApp, Instagram ve diğer üçüncü taraf hizmetlerdeki değişiklikler veya kesintilerden platform sorumlu tutulamaz.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>4. Maddi Kayıplar</h2>
          <p>Platform kullanımından kaynaklanan doğrudan veya dolaylı maddi kayıplardan sorumluluk kabul edilmez.</p>
        </div>

        <a href="/login" style={{ display: 'inline-block', marginTop: '30px', color: '#007bff', textDecoration: 'underline' }}>← Geri Dön</a>
      </div>
    </div>
  )
}