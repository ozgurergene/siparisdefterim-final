'use client'

import { useEffect, useState } from 'react'
import { colors } from '../../lib/theme'

export default function Consent() {
  const [theme, setTheme] = useState('light')
  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: '40px 20px', fontFamily: 'Arial' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: c.header, padding: '40px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
        <h1 style={{ color: c.text, marginBottom: '30px', fontSize: '28px' }}>Kişisel Verilere İlişkin Açık Rıza Beyanı</h1>
        
        <div style={{ color: c.text, lineHeight: '1.8', fontSize: '15px' }}>
          <p>Yukarıda belirtilen kişisel verilerinizin SiparişDefterim tarafından işlenmesine ve aşağıdaki amaçlar doğrultusunda kullanılmasına özgür irademle rıza gösteriyorum:</p>

          <ol style={{ paddingLeft: '20px', marginTop: '20px' }}>
            <li style={{ marginBottom: '10px' }}>Platform hizmetinin sunulması</li>
            <li style={{ marginBottom: '10px' }}>Kişiselleştirilmiş deneyim sağlanması</li>
            <li style={{ marginBottom: '10px' }}>İstatistiksel analiz yapılması</li>
            <li style={{ marginBottom: '10px' }}>Yasal zorunluluklara uyum sağlanması</li>
            <li style={{ marginBottom: '10px' }}>İş ortaklığı ve pazarlama faaliyetleri</li>
          </ol>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>Haklarınız</h2>
          <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '15px' }}>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
            <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
            <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
            <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
          </ul>
        </div>

        <a href="/login" style={{ display: 'inline-block', marginTop: '30px', color: '#007bff', textDecoration: 'underline' }}>← Geri Dön</a>
      </div>
    </div>
  )
}