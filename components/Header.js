'use client'

import { useRouter } from 'next/navigation'
import { colors } from '../lib/theme'

export default function Header({ user, ordersCreatedCount, theme, toggleTheme, handleLogout }) {
  const c = colors[theme]
  const router = useRouter()

  return (
    <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '12px 15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Top Row - Logo & Theme/Logout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', color: c.text }}>📱 SiparişDefterim</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={toggleTheme}
              style={{
                padding: '6px 10px',
                background: c.bgSecondary,
                border: `1px solid ${c.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              Çıkış
            </button>
          </div>
        </div>

        {/* Middle Row - Navigation Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <button
            style={{ 
              flex: 1,
              padding: '10px', 
              background: '#007bff', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '13px', 
              color: 'white' 
            }}
          >
            📋 Siparişler
          </button>
          <button
            onClick={() => router.push('/completed')}
            style={{ 
              flex: 1,
              padding: '10px', 
              background: c.bgSecondary, 
              border: `2px solid #1D9E75`, 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '13px', 
              color: '#1D9E75' 
            }}
          >
            ✓ Tamamlananlar
          </button>
        </div>

        {/* Bottom Row - User Info & Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ color: c.textSecondary, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
            {user.email}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: c.textSecondary }}>{ordersCreatedCount}/50</span>
            <div style={{ width: '80px', height: '6px', background: c.bgSecondary, borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${(ordersCreatedCount / 50) * 100}%`, height: '100%', background: ordersCreatedCount >= 50 ? '#ff6b6b' : '#007bff', transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}