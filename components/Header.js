'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { colors, getAvatarGradient, getInitials } from '../lib/theme'
import ProfilePopup from './ProfilePopup'

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

export default function Header({ user, ordersCreatedCount = 0, isPro = false, theme, toggleTheme, handleLogout }) {
  const c = colors[theme]
  const router = useRouter()
  const pathname = usePathname()
  
  // === YENI: Tablet icin ProfilePopup state ===
  const [showProfilePopup, setShowProfilePopup] = useState(false)

  // Yeni Pro tab'ları (renk + path tanımları)
  const proTabs = [
    {
      path: '/customers',
      label: 'Müşteriler',
      icon: '👥',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: 'rgba(240, 147, 251, 0.1)',
      bgHover: 'rgba(240, 147, 251, 0.2)',
      shadow: '0 4px 15px rgba(240, 147, 251, 0.4)'
    },
    {
      path: '/products',
      label: 'Ürünler',
      icon: '📦',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: 'rgba(79, 172, 254, 0.1)',
      bgHover: 'rgba(79, 172, 254, 0.2)',
      shadow: '0 4px 15px rgba(79, 172, 254, 0.4)'
    },
    {
      path: '/reports',
      label: 'Raporlar',
      icon: '📊',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      bgColor: 'rgba(250, 112, 154, 0.1)',
      bgHover: 'rgba(250, 112, 154, 0.2)',
      shadow: '0 4px 15px rgba(250, 112, 154, 0.4)'
    }
  ]

  return (
    <div className="sd-header" style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'relative' }}>
      
      {/* === YENI: Tablet ve awkward viewport'lar (768-1281px) icin Tasarim 3 override === */}
      {/* DEGISIKLIK: max-width 1023px -> 1281px. iPad Pro (1024) ve 1100-1281px laptop pencereleri */}
      {/* artik kompakt tablet modunu kullanir (avatar gosterilir, email/cikis popup'a tasinir). */}
      <style jsx>{`
        /* Avatar varsayilan: gizli (web ve mobile'da gorunmesin) */
        .sd-header-avatar {
          display: none;
        }
        
        @media (min-width: 768px) and (max-width: 1281px) {
          .sd-header {
            padding: 10px 16px !important;
          }
          .sd-header-logo-text {
            font-size: 16px !important;
          }
          .sd-header-logo-emoji {
            font-size: 16px !important;
          }
          .sd-header-home-btn {
            padding: 6px !important;
          }
          .sd-header-nav {
            margin-left: 8px !important;
            gap: 3px !important;
          }
          .sd-nav-btn {
            flex-direction: column !important;
            align-items: center !important;
            gap: 2px !important;
            padding: 6px 8px !important;
            font-size: 9px !important;
            min-width: 56px !important;
            line-height: 1.1 !important;
          }
          .sd-nav-icon {
            font-size: 18px !important;
          }
          .sd-pro-badge {
            position: absolute !important;
            top: 2px !important;
            right: 4px !important;
            font-size: 7px !important;
            padding: 1px 3px !important;
            margin-left: 0 !important;
            letter-spacing: 0 !important;
          }
          .sd-header-right {
            gap: 8px !important;
          }
          .sd-header-counter {
            padding: 5px 9px !important;
          }
          .sd-header-counter-text {
            font-size: 11px !important;
          }
          .sd-header-pro-cta {
            padding: 6px 10px !important;
            font-size: 11px !important;
            font-size: 0 !important;
            gap: 2px !important;
          }
          .sd-header-pro-cta::after {
            content: 'PRO →';
            font-size: 11px !important;
            font-weight: 700;
            letter-spacing: 0.3px;
          }
          .sd-header-pro-cta > span {
            font-size: 13px !important;
          }
          
          /* Tablette gizle: email, tema, cikis (popup'a tasindi) */
          .sd-header-email {
            display: none !important;
          }
          .sd-header-theme {
            display: none !important;
          }
          .sd-header-logout {
            display: none !important;
          }
          
          /* Tablette goster: avatar */
          .sd-header-avatar {
            display: flex !important;
          }
        }
      `}</style>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '10px' }}>

        {/* Logo + Home Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="sd-header-home-btn"
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
            <span className="sd-header-logo-emoji" style={{ fontSize: '20px' }}>📱</span>
            <h1
              className="sd-header-logo-text"
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
        <nav className="sd-header-nav" style={{ display: 'flex', gap: '8px', marginLeft: '20px', flexWrap: 'nowrap' }}>
          {/* Siparişler */}
          <button
            className="sd-nav-btn"
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
              background: pathname === '/dashboard' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(118, 75, 162, 0.25) 100%)',
              color: pathname === '/dashboard' ? 'white' : c.text,
              boxShadow: pathname === '/dashboard' ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/dashboard') { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240, 147, 251, 0.3) 0%, rgba(118, 75, 162, 0.4) 100%)'
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/dashboard') { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(118, 75, 162, 0.25) 100%)'
              }
            }}
          >
            <span className="sd-nav-icon">📦</span>
            Siparişler
          </button>

          {/* Tamamlananlar */}
          <button
            className="sd-nav-btn"
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
              background: pathname === '/completed' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(118, 75, 162, 0.25) 100%)',
              color: pathname === '/completed' ? 'white' : c.text,
              boxShadow: pathname === '/completed' ? '0 4px 15px rgba(67, 233, 123, 0.4)' : 'none',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/completed') { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240, 147, 251, 0.3) 0%, rgba(118, 75, 162, 0.4) 100%)'
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/completed') { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(118, 75, 162, 0.25) 100%)'
              }
            }}
          >
            <span className="sd-nav-icon">✅</span>
            Tamamlananlar
          </button>

          {/* PRO TAB'LARI: Müşteriler, Ürünler, Raporlar */}
          {proTabs.map((tab) => {
            const isActive = pathname === tab.path || pathname?.startsWith(tab.path + '/')
            const locked = !isPro

            return (
              <button
                key={tab.path}
                className="sd-nav-btn"
                onClick={() => router.push(tab.path)}
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
                  background: isActive ? tab.gradient : tab.bgColor,
                  color: isActive ? 'white' : c.text,
                  boxShadow: isActive ? tab.shadow : 'none',
                  position: 'relative',
                  opacity: locked ? 0.85 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = tab.bgHover
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = tab.bgColor
                  }
                }}
              >
                <span className="sd-nav-icon">{tab.icon}</span>
                {tab.label}
                {locked && (
                  <span className="sd-pro-badge" style={{
                    fontSize: '9px',
                    padding: '2px 6px',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#fff',
                    borderRadius: '5px',
                    fontWeight: '700',
                    marginLeft: '2px',
                    letterSpacing: '0.5px'
                  }}>
                    PRO
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="sd-header-right" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'nowrap', position: 'relative' }}>
          {/* Sipariş Sayacı — Pro / Free durumu */}
          {isPro ? (
            // PRO görünümü: rozet + sayı, /50 yok
            <div className="sd-header-counter" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.4)',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)'
            }}>
              <span className="sd-header-counter-text" style={{
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
              <span className="sd-header-counter-text" style={{ fontSize: '13px', color: c.textSecondary }}>
                Siparişler: <strong style={{ color: c.text }}>{ordersCreatedCount}</strong>
              </span>
            </div>
          ) : (
            // FREE görünümü: orijinal /50 progress bar
            <div className="sd-header-counter" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '8px 14px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.4)',
              borderRadius: '14px',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)'
            }}>
              <p className="sd-header-counter-text" style={{ margin: 0, fontSize: '12px', color: c.textSecondary, whiteSpace: 'nowrap' }}>Siparişler: {ordersCreatedCount}/50</p>
              <div style={{ width: '100%', height: '5px', background: c.bgSecondary, borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((ordersCreatedCount / 50) * 100, 100)}%`, height: '100%', background: ordersCreatedCount >= 50 ? '#ff6b6b' : 'linear-gradient(90deg, #667eea, #764ba2)', transition: 'width 0.3s' }} />
              </div>
            </div>
          )}

          {/* Pro'ya Geç Butonu — sadece Free kullanıcılarda */}
          {!isPro && (
            <button
              className="sd-header-pro-cta"
              onClick={() => router.push('/pricing')}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              <span>⭐</span>
              Pro&apos;ya Geç
            </button>
          )}

          {/* Email — Tıklanabilir, /manage-subscription'a gider */}
          {user?.email && (
            <a
              className="sd-header-email"
              href="/manage-subscription"
              title="Hesabım — Aboneliği Yönet"
              style={{
                color: c.textSecondary,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = c.bgSecondary
                e.currentTarget.style.color = '#667eea'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = c.textSecondary
              }}
            >
              <span style={{ fontSize: '14px' }}>👤</span>
              {user.email}
            </a>
          )}

          {/* Theme Toggle Button */}
          <button
            className="sd-header-theme"
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
            className="sd-header-logout"
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

          {/* === YENI: Tablet icin Avatar Button (sadece tablette gorunur) === */}
          {user?.email && (
            <div
              className="sd-header-avatar"
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: getAvatarGradient(user.email),
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'white',
                boxShadow: showProfilePopup ? '0 0 0 3px rgba(34, 197, 94, 0.3)' : 'none',
                transition: 'box-shadow 0.2s',
                flexShrink: 0
              }}
            >
              {getInitials(user.email)}
            </div>
          )}

          {/* === YENI: ProfilePopup (sadece tablet'te kullanilir) === */}
          <ProfilePopup
            user={user}
            isOpen={showProfilePopup}
            onClose={() => setShowProfilePopup(false)}
            onLogout={handleLogout}
            ordersCreatedCount={ordersCreatedCount}
            isPro={isPro}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </div>
      </div>
    </div>
  )
}