'use client'

import { useRouter } from 'next/navigation'
import { colors } from '../lib/theme'

// Gradient Home Icon SVG Component
function HomeIcon({ size = 24 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path 
        d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" 
        stroke="url(#homeGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M9 22V12H15V22" 
        stroke="url(#homeGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Header({ user, ordersCreatedCount, theme, toggleTheme, handleLogout }) {
  const c = colors[theme]
  const router = useRouter()

  return (
    <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        
        {/* Logo + Home Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.push('/home')}
            style={{
              padding: '8px',
              background: c.bgSecondary,
              border: `1px solid ${c.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            title="Ana Sayfa"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <HomeIcon size={22} />
          </button>
          <h1 
            onClick={() => router.push('/home')}
            style={{ 
              margin: 0, 
              fontSize: '24px', 
              color: c.text,
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            📱 SiparişDefterim
          </h1>
        </div>
        
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
          
          {/* Theme Toggle Button with Yellow/Orange glow */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 12px',
              background: c.bgSecondary,
              border: `1px solid ${c.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = theme === 'light' ? '0 4px 15px rgba(102, 126, 234, 0.4)' : '0 4px 15px rgba(255, 193, 7, 0.5)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {/* Logout Button with Red glow */}
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
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.5)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Çıkış
          </button>
        </div>
      </div>
    </div>
  )
}