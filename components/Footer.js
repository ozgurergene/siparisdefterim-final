'use client'

import { colors } from '../lib/theme'

export default function Footer({ theme }) {
  const c = colors[theme]

  return (
    <div style={{ 
      background: c.header, 
      borderTop: `1px solid ${c.border}`, 
      padding: '15px 20px', 
      marginTop: 'auto',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <a href="/privacy-policy" style={{ color: c.textSecondary, textDecoration: 'none', fontSize: '13px' }}>Gizlilik Politikası</a>
          <a href="/terms-of-use" style={{ color: c.textSecondary, textDecoration: 'none', fontSize: '13px' }}>Kullanım Koşulları</a>
          <a href="/gdpr-disclosure" style={{ color: c.textSecondary, textDecoration: 'none', fontSize: '13px' }}>KVKK Aydınlatma</a>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: c.textSecondary }}>
          © 2026 Deftertut.com - Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  )
}