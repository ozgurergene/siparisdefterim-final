'use client'
import Link from 'next/link'
import { colors } from '../lib/theme'

export default function Footer({ theme }) {
  const c = colors[theme]

  return (
    <footer
      style={{
        borderTop: `1px solid ${c.border}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: c.header,
      }}
    >
      <p style={{ fontSize: 12, color: c.textMuted, margin: 0 }}>
        © 2026 Deftertut.com - Tüm hakları saklıdır
      </p>
      
      <nav style={{ display: 'flex', gap: 20 }}>
        <Link href="/privacy-policy" style={{ color: c.textMuted, textDecoration: 'none', fontSize: 12 }}>Gizlilik Politikası</Link>
        <Link href="/terms-of-use" style={{ color: c.textMuted, textDecoration: 'none', fontSize: 12 }}>Kullanım Koşulları</Link>
        <Link href="/gdpr-disclosure" style={{ color: c.textMuted, textDecoration: 'none', fontSize: 12 }}>KVKK</Link>
        <Link href="/disclaimer" style={{ color: c.textMuted, textDecoration: 'none', fontSize: 12 }}>İletişim</Link>
      </nav>
    </footer>
  )
}