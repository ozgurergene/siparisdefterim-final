'use client'

import { colors } from '../lib/theme'

export default function Footer({ theme = 'light' }) {
  const c = colors[theme]
  
  const linkStyle = {
    color: c.textSecondary,
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'color 0.2s'
  }

  return (
    <footer style={{
      background: c.header,
      borderTop: `1px solid ${c.border}`,
      padding: '20px',
      marginTop: 'auto'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ color: c.textSecondary, fontSize: '13px' }}>
          © 2025 Deftertut.com - Tüm hakları saklıdır.
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <a href="/privacy-policy" target="_blank" style={linkStyle}>Gizlilik Politikası</a>
          <a href="/terms-of-use" target="_blank" style={linkStyle}>Kullanım Koşulları</a>
          <a href="/gdpr-disclosure" target="_blank" style={linkStyle}>KVKK</a>
          <a href="mailto:destek@deftertut.com" style={linkStyle}>İletişim</a>
        </div>
      </div>
    </footer>
  )
}