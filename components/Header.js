'use client'

import { useRouter } from 'next/navigation'
import { colors } from '../lib/theme'

export default function Header({ user, ordersCreatedCount, theme, toggleTheme, handleLogout }) {
  const c = colors[theme]
  const router = useRouter()

  return (
    <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', minWidth: '150px', color: c.text }}>📱 SiparişDefterim</h1>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{ padding: '8px 16px', background: '#007bff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: 'white' }}
          >
            📋 Siparişler
          </button>
          <button
            onClick={() => router.push('/completed')}
            style={{ padding: '8px 16px', background: c.bgSecondary, border: `2px solid #1D9E75`, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: '#1D9E75' }}
          >
            ✓ Tamamlananlar
          </button>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '16px', color: c.textSecondary }}>Siparişler: {ordersCreatedCount}/50</p>
            <div style={{ width: '150px', height: '8px', background: c.bgSecondary, borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(ordersCreatedCount / 50) * 100}%`, height: '100%', background: ordersCreatedCount >= 50 ? '#ff6b6b' : '#007bff', transition: 'width 0.3s' }} />
            </div>
          </div>
          <span style={{ color: c.textSecondary, fontSize: '16px', minWidth: '120px' }}>{user.email}</span>
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 12px',
              background: c.bgSecondary,
              border: `1px solid ${c.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 15px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Çıkış
          </button>
        </div>
      </div>
    </div>
  )
}