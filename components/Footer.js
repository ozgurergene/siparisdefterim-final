'use client'
import Link from 'next/link'
import { colors } from '../lib/theme'

export default function Footer({ theme }) {
  const c = colors[theme]
  
  const linkStyle = {
    color: c.textMuted,
    textDecoration: 'none',
    fontSize: 12,
    transition: 'color 0.2s ease',
  }

  return (
    <footer
      style={{
        borderTop: `1px solid ${c.border}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: c.header,
        backdropFilter: 'blur(10px)',
      }}
    >
      <p style={{ fontSize: 12, color: c.textMuted, margin: 0 }}>
        © 2026 Deftertut.com - Tüm hakları saklıdır
      </p>
      
      <nav style={{ display: 'flex', gap: 20 }}>
        <Link 
          href="/privacy-policy" 
          style={linkStyle}
          onMouseEnter={(e) => e.currentTarget.style.color = c.text}
          onMouseLeave={(e) => e.currentTarget.style.color = c.textMuted}
        >
          Gizlilik Politikası
        </Link>
        <Link 
          href="/terms-of-use" 
          style={linkStyle}
          onMouseEnter={(e) => e.currentTarget.style.color = c.text}
          onMouseLeave={(e) => e.currentTarget.style.color = c.textMuted}
        >
          Kullanım Koşulları
        </Link>
        <Link 
          href="/gdpr-disclosure" 
          style={linkStyle}
          onMouseEnter={(e) => e.currentTarget.style.color = c.text}
          onMouseLeave={(e) => e.currentTarget.style.color = c.textMuted}
        >
          KVKK
        </Link>
        <Link 
          href="/disclaimer" 
          style={linkStyle}
          onMouseEnter={(e) => e.currentTarget.style.color = c.text}
          onMouseLeave={(e) => e.currentTarget.style.color = c.textMuted}
        >
          İletişim
        </Link>
      </nav>
    </footer>
  )
}