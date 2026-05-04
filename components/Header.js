'use client'

import { useRouter, usePathname } from 'next/navigation'
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

export default function Header({ user, ordersCreatedCount, isPro = false, theme, toggleTheme, handleLogout }) {
  const c = colors[theme]
  const router = useRouter()
  const pathname = usePathname()

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
          
          {/* Logo with gradient text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📱</span>
            <h1 
              onClick={() => router.push('/home')}
              style={{ 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              SiparişDefterim
            </h1>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              background: pathname === '/dashboard' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'rgba(102, 126, 234, 0.1)',
              color: pathname === '/dashboard' ? 'white' : c.text,
              boxShadow: pathname === '/dashboard' ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/dashboard') {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/dashboard') {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'
              }
            }}
          >
            <span>📦</span>
            Siparişler
          </button>

          <button
            onClick={() => router.push('/completed')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              background: pathname === '/completed' 
                ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' 
                : 'rgba(67, 233, 123, 0.1)',
              color: pathname === '/completed' ? 'white' : c.text,
              boxShadow: pathname === '/completed' ? '0 4px 15px rgba(67, 233, 123, 0.4)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/completed') {
                e.currentTarget.style.background = 'rgba(67, 233, 123, 0.2)'
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/completed') {
                e.currentTarget.style.background = 'rgba(67, 233, 123, 0.1)'
              }
            }}
          >
            <span>✅</span>
            Tamamlananlar
          </button>
        </nav>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Sipariş Sayacı — Pro / Free durumu */}
          {isPro ? (
            // PRO görünümü: rozet + sayı, /50 yok
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.4)',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.5px'
              }}>
                ✨ PRO
              </span>
              <span style={{ width: '1px', height: '14px', background: c.border }} />
              <span style={{ fontSize: '13px', color: c.textSecondary }}>
                Siparişler: <strong style={{ color: c.text }}>{ordersCreatedCount}</strong>
              </span>
            </div>
          ) : (
            // FREE görünümü: orijinal /50 progress bar
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: c.textSecondary }}>Siparişler: {ordersCreatedCount}/50</p>
              <div style={{ width: '100px', height: '6px', background: c.bgSecondary, borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((ordersCreatedCount / 50) * 100, 100)}%`, height: '100%', background: ordersCreatedCount >= 50 ? '#ff6b6b' : 'linear-gradient(90deg, #667eea, #764ba2)', transition: 'width 0.3s' }} />
              </div>
            </div>
          )}

          <span style={{ color: c.textSecondary, fontSize: '14px' }}>{user.email}</span>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 12px',
              background: c.bgSecondary,
              border: `1px solid ${c.border}`,
              borderRadius: '8px',
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
          
          {/* Logout Button */}
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