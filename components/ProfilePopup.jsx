'use client'

import { colors, getAvatarGradient, getInitials } from '../lib/theme'

export default function ProfilePopup({ user, isOpen, onClose, onLogout, ordersCreatedCount, isPro, theme, toggleTheme }) {
  if (!isOpen) return null

  const isDark = theme === 'dark'
  const c = colors[theme]

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 998
        }}
      />
      <div style={{
        position: 'absolute',
        top: '60px',
        right: '16px',
        width: '220px',
        background: isDark ? '#1a1a2e' : '#ffffff',
        borderRadius: '14px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(0,0,0,0.1)'}`,
        zIndex: 999,
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px',
          background: isDark
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: getAvatarGradient(user.email),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              {getInitials(user.email)}
            </div>
            <div>
              <p style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                {user.email.split('@')[0]}
              </p>
              <p style={{ color: c.textSecondary, fontSize: '11px', margin: '2px 0 0 0' }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
          {isPro ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.5px'
                }}>✨ PRO ÜYELİK</span>
                <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '11px', fontWeight: '600' }}>{ordersCreatedCount} sipariş</span>
              </div>
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '2px' }} />
              <p style={{ color: c.textSecondary, fontSize: '9px', margin: '6px 0 0 0' }}>Sınırsız sipariş hakkı aktif</p>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: c.textSecondary, fontSize: '11px' }}>Toplam Sipariş</span>
                <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '11px', fontWeight: '600' }}>{ordersCreatedCount} / 50</span>
              </div>
              <div style={{ height: '4px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min((ordersCreatedCount / 50) * 100, 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  borderRadius: '2px'
                }} />
              </div>
              <p style={{ color: c.textSecondary, fontSize: '9px', margin: '6px 0 0 0' }}>Ücretsiz plan - 50 sipariş hakkı</p>
            </>
          )}
        </div>

        <div style={{ padding: '8px' }}>
          <div onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '16px' }}>{isDark ? '🌙' : '☀️'}</span>
            <span style={{ color: isDark ? '#e2e8f0' : '#1a1a2e', fontSize: '13px' }}>Tema: {isDark ? 'Koyu' : 'Açık'}</span>
            <div style={{ marginLeft: 'auto', width: '36px', height: '20px', background: isDark ? '#667eea' : '#cbd5e1', borderRadius: '10px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: isDark ? '18px' : '2px', top: '2px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </div>

          <a href="/settings" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none' }}>
            <span style={{ fontSize: '16px' }}>🏪</span>
            <span style={{ color: isDark ? '#e2e8f0' : '#1a1a2e', fontSize: '13px' }}>İşletme Bilgilerim</span>
          </a>

          {isPro && (
            <a href="/manage-subscription" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none' }}>
              <span style={{ fontSize: '16px' }}>💳</span>
              <span style={{ color: isDark ? '#e2e8f0' : '#1a1a2e', fontSize: '13px' }}>Aboneliği Yönet</span>
            </a>
          )}

          {!isPro && (
            <a href="/pricing" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none' }}>
              <span style={{ fontSize: '16px' }}>⭐</span>
              <span style={{ color: isDark ? '#e2e8f0' : '#1a1a2e', fontSize: '13px' }}>Pro’ya Yükselt</span>
              <span style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#fff', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>YENİ</span>
            </a>
          )}

          <div style={{ height: '1px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', margin: '6px 0' }} />

          <div onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>Çıkış Yap</span>
          </div>
        </div>
      </div>
    </>
  )
}