'use client'
import { useRouter, usePathname } from 'next/navigation'
import { colors, getInitials, getAvatarGradient, glowEffects } from '../lib/theme'

export default function Header({ user, orderCount = 0, maxOrders = 50, theme, setTheme, onLogout }) {
  const router = useRouter()
  const pathname = usePathname()
  const c = colors[theme]
  
  const progressPercent = Math.min((orderCount / maxOrders) * 100, 100)
  const progressColor = progressPercent > 80 ? '#f5576c' : progressPercent > 60 ? '#f093fb' : '#667eea'
  
  // Get user initials from email
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U'
  const userName = user?.email?.split('@')[0] || 'Kullanıcı'

  return (
    <header
      style={{
        background: c.header,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${c.border}`,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: `0 4px 20px ${c.shadow}`,
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
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = glowEffects.primary
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          title="Ana Sayfa"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#homeGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>📱</span>
          <h1 style={{ 
            fontSize: 18, 
            fontWeight: 600, 
            color: c.text,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            SiparişDefterim
          </h1>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: 8, marginLeft: 20 }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
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
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
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
      </div>

      {/* Right: Progress, Theme, User, Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        
        {/* Order Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: c.textSecondary }}>
            {orderCount}/{maxOrders}
          </span>
          <div
            style={{
              width: 80,
              height: 6,
              background: c.borderLight,
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: `linear-gradient(90deg, #667eea, ${progressColor})`,
                borderRadius: 3,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: 'none',
            background: 'rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = theme === 'dark' 
              ? '0 0 20px rgba(250, 204, 21, 0.5)' 
              : '0 0 20px rgba(139, 92, 246, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          title={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* User Avatar & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 12, color: c.textMuted, margin: 0 }}>Hoş geldin,</p>
            <p style={{ fontSize: 13, color: c.text, margin: 0, fontWeight: 500 }}>{userName}</p>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: getAvatarGradient(user?.email),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
              color: 'white',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            }}
          >
            {userInitials}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
            color: 'white',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = glowEffects.danger
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Çıkış
        </button>
      </div>
    </header>
  )
}