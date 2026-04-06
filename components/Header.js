'use client'
import { useRouter, usePathname } from 'next/navigation'
import { colors, getInitials, getAvatarGradient, glowEffects } from '../lib/theme'

export default function Header({ user, orderCount = 0, maxOrders = 50, theme, setTheme, onLogout }) {
  const router = useRouter()
  const pathname = usePathname()
  const c = colors[theme]
  
  const progressPercent = Math.min((orderCount / maxOrders) * 100, 100)
  const progressColor = progressPercent > 80 ? '#f5576c' : progressPercent > 60 ? '#f093fb' : '#667eea'
  
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U'
  const userName = user?.email?.split('@')[0] || 'Kullanıcı'

  return (
    <header
      style={{
        background: c.header,
        borderBottom: `1px solid ${c.border}`,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: c.shadow,
      }}
    >
      {/* Left: Logo & Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Home Button */}
        <button
          onClick={() => router.push('/home')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Ana Sayfa"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>📱</span>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: c.text, margin: 0, letterSpacing: '-0.02em' }}>
            SiparişDefterim
          </h1>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: 8, marginLeft: 20 }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
              background: pathname === '/dashboard' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : c.bgCard,
              color: pathname === '/dashboard' ? 'white' : c.text,
              boxShadow: pathname === '/dashboard' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
            }}
          >
            <span>📦</span>
            Siparişler
          </button>

          <button
            onClick={() => router.push('/completed')}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
              background: pathname === '/completed' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : c.bgCard,
              color: pathname === '/completed' ? 'white' : c.text,
              boxShadow: pathname === '/completed' ? '0 4px 12px rgba(67, 233, 123, 0.3)' : 'none',
            }}
          >
            <span>✅</span>
            Tamamlananlar
          </button>
        </nav>
      </div>

      {/* Right: Progress, Theme, User, Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Order Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: c.textSecondary }}>{orderCount}/{maxOrders}</span>
          <div style={{ width: 80, height: 6, background: c.border, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: `linear-gradient(90deg, #667eea, ${progressColor})`, borderRadius: 3, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            width: 40, height: 40, borderRadius: 8, border: `1px solid ${c.border}`, background: c.bgCard,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, transition: 'all 0.2s ease',
          }}
          title={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* User Avatar & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: c.textMuted, margin: 0, fontWeight: 500 }}>Hoş geldin,</p>
            <p style={{ fontSize: 13, color: c.text, margin: 0, fontWeight: 600 }}>{userName}</p>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: getAvatarGradient(user?.email),
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
          }}>
            {userInitials}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            padding: '10px 18px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)', color: 'white',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = glowEffects.danger }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          Çıkış
        </button>
      </div>
    </header>
  )
}