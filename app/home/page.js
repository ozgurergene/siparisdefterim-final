'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, metricGradients, glowEffects, buttonGradients, keyframesCSS, getAvatarGradient, getInitials } from '../../lib/theme'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

// Gradient Home Icon SVG Component
function HomeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGradientHome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" stroke="url(#homeGradientHome)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="url(#homeGradientHome)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Profile Popup Component
function ProfilePopup({ user, isOpen, onClose, onLogout, ordersCreatedCount }) {
  if (!isOpen) return null

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
        background: '#1a1a2e',
        borderRadius: '14px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        zIndex: 999,
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease'
      }}>
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
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
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                {user.email.split('@')[0]}
              </p>
              <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0 0' }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px' }}>Toplam Sipariş</span>
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600' }}>{ordersCreatedCount} / 50</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min((ordersCreatedCount / 50) * 100, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: '2px'
            }} />
          </div>
          <p style={{ color: '#64748b', fontSize: '9px', margin: '6px 0 0 0' }}>Ücretsiz plan - 50 sipariş hakkı</p>
        </div>

        <div style={{ padding: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.03)'
          }}>
            <span style={{ fontSize: '16px' }}>🌙</span>
            <span style={{ color: '#e2e8f0', fontSize: '13px' }}>Tema: Koyu</span>
            <div style={{
              marginLeft: 'auto',
              width: '32px',
              height: '18px',
              background: '#667eea',
              borderRadius: '9px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                right: '2px',
                top: '2px',
                width: '14px',
                height: '14px',
                background: '#fff',
                borderRadius: '50%'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>✏️</span>
            <span style={{ color: '#e2e8f0', fontSize: '13px' }}>Profili Düzenle</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>⭐</span>
            <span style={{ color: '#e2e8f0', fontSize: '13px' }}>Pro'ya Yükselt</span>
            <span style={{
              marginLeft: 'auto',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: '#fff',
              fontSize: '8px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '600'
            }}>YENİ</span>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '6px 0' }} />

          <div onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>Çıkış Yap</span>
          </div>
        </div>
      </div>
    </>
  )
}

// Bottom Tab Bar Component
function BottomTabBar({ activeTab, onTabChange, onAddClick }) {
  const tabs = [
    { id: 'orders', icon: '📦', label: 'Sipariş' },
    { id: 'completed', icon: '✅', label: 'Tamamlanan' },
    { id: 'add', icon: '+', label: '', isMain: true },
    { id: 'customers', icon: '👥', label: 'Müşteri' },
    { id: 'reports', icon: '📊', label: 'Rapor' }
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(13, 13, 26, 0.98)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '8px 0 24px 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      zIndex: 1000,
      borderTop: '1px solid rgba(102, 126, 234, 0.2)',
      boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '400px',
        padding: '0 20px'
      }}>
        {tabs.map((tab) => (
          tab.isMain ? (
            <button
              key={tab.id}
              onClick={onAddClick}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '3px solid #0d0d1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                color: '#fff',
                cursor: 'pointer',
                marginTop: '-28px',
                boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
                fontWeight: '300',
                flexShrink: 0
              }}
            >
              +
            </button>
          ) : (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                opacity: activeTab === tab.id ? 1 : 0.5,
                padding: '4px 8px',
                minWidth: '50px'
              }}
            >
              <span style={{ fontSize: '20px' }}>{tab.icon}</span>
              <span style={{ 
                fontSize: '10px', 
                color: activeTab === tab.id ? '#22c55e' : '#64748b',
                fontWeight: activeTab === tab.id ? '600' : '400'
              }}>
                {tab.label}
              </span>
            </button>
          )
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shipped: 0,
    completed: 0,
    todayRevenue: 0,
    monthlyRevenue: 0
  })
  
  const c = colors[theme]

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.replace('/login')
      return
    }
    setUser(session.user)
    await fetchStats(session.user.id)
    setLoading(false)
  }

  const fetchStats = async (userId) => {
    const { data: allOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)

    const orders = allOrders || []
    setOrdersCreatedCount(orders.length)

    const activeOrders = orders.filter(o => o.status !== 'completed')
    const completedOrders = orders.filter(o => o.status === 'completed')
    
    const pending = activeOrders.filter(o => o.status === 'payment_pending' || o.status === 'paid').length
    const shipped = activeOrders.filter(o => o.status === 'preparing' || o.status === 'shipped').length
    
    const today = new Date().toISOString().split('T')[0]
    const todayCompleted = completedOrders.filter(o => o.created_at?.startsWith(today))
    const todayRevenue = todayCompleted.reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0)
    
    const thisMonth = new Date().toISOString().slice(0, 7)
    const monthlyCompleted = completedOrders.filter(o => o.created_at?.startsWith(thisMonth))
    const monthlyRevenue = monthlyCompleted.reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0)

    setStats({
      total: activeOrders.length,
      pending,
      shipped,
      completed: completedOrders.length,
      todayRevenue,
      monthlyRevenue
    })
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('siparisdefterim-theme', newTheme)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const handleTabChange = (tabId) => {
    if (tabId === 'orders') router.push('/dashboard')
    else if (tabId === 'completed') router.push('/completed')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📱</div>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const metricCards = [
    { label: 'Aktif Siparişler', value: stats.total, icon: '📦', gradient: metricGradients.active, glow: glowEffects.primary },
    { label: 'Ödeme Bekleyen', value: stats.pending, icon: '💰', gradient: metricGradients.pending, glow: glowEffects.danger },
    { label: 'Kargo Sürecinde', value: stats.shipped, icon: '🚚', gradient: metricGradients.shipped, glow: glowEffects.info },
    { label: 'Tamamlanan', value: stats.completed, icon: '✅', gradient: metricGradients.completed, glow: glowEffects.primary },
  ]

  // ========== MOBILE VIEW ==========
  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)',
        fontFamily: 'Arial, sans-serif',
        color: '#fff',
        paddingBottom: '100px',
        position: 'relative'
      }}>
        {/* Mobile Header */}
        <div style={{
          padding: '16px 16px 10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              style={{
                padding: '8px',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HomeIcon size={18} />
            </button>
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>Ana Sayfa</span>
          </div>
          
          <div
            onClick={() => setShowProfilePopup(!showProfilePopup)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: getAvatarGradient(user.email),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: showProfilePopup ? '0 0 0 3px rgba(34, 197, 94, 0.3)' : 'none'
            }}
          >
            {getInitials(user.email)}
          </div>
        </div>

        {/* Profile Popup */}
        <ProfilePopup
          user={user}
          isOpen={showProfilePopup}
          onClose={() => setShowProfilePopup(false)}
          onLogout={handleLogout}
          ordersCreatedCount={ordersCreatedCount}
        />

        {/* Welcome Section */}
        <div style={{ textAlign: 'center', padding: '20px 20px 30px 20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            Hoş Geldin! 👋
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>
            İşte güncel sipariş durumun
          </p>
        </div>

        {/* Metric Cards - 2x2 Grid */}
        <div style={{ 
          padding: '0 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {metricCards.map((card) => (
            <div
              key={card.label}
              onClick={() => router.push('/dashboard')}
              style={{
                background: 'rgba(26, 26, 46, 0.8)',
                borderRadius: '16px',
                padding: '16px',
                borderTop: `3px solid transparent`,
                borderImage: `${card.gradient} 1`,
                cursor: 'pointer'
              }}
            >
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px 0' }}>{card.label}</p>
              <p style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                margin: 0,
                background: card.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Revenue Cards */}
        <div style={{ 
          padding: '0 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'rgba(26, 26, 46, 0.8)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(67, 233, 123, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              💵
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Bugünün Geliri</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#43e97b' }}>
                ₺{stats.todayRevenue.toFixed(0)}
              </p>
            </div>
          </div>

          <div style={{
            background: 'rgba(26, 26, 46, 0.8)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(102, 126, 234, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              📊
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Bu Ayki Gelir</p>
              <p style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                margin: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ₺{stats.monthlyRevenue.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '0 20px' }}>
          <div style={{
            background: 'rgba(26, 26, 46, 0.6)',
            borderRadius: '20px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span> Hızlı İşlemler
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '16px 8px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '24px' }}>➕</span>
                <span style={{ lineHeight: '1.3', textAlign: 'center' }}>Yeni<br/>Sipariş Ekle</span>
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '16px 8px',
                  borderRadius: '14px',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '24px' }}>📦</span>
                <span style={{ lineHeight: '1.3', textAlign: 'center' }}>Siparişleri<br/>Görüntüle</span>
              </button>

              <button
                onClick={() => router.push('/completed')}
                style={{
                  padding: '16px 8px',
                  borderRadius: '14px',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '24px' }}>✅</span>
                <span style={{ lineHeight: '1.3', textAlign: 'center' }}>Tamamlananları<br/>Gör</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Tab Bar */}
        <BottomTabBar
          activeTab="home"
          onTabChange={handleTabChange}
          onAddClick={() => router.push('/dashboard')}
        />

        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  // ========== DESKTOP VIEW (unchanged) ==========
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: c.bgGradient,
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
    }}>
      <Header 
        user={user} 
        ordersCreatedCount={ordersCreatedCount}
        theme={theme} 
        toggleTheme={toggleTheme} 
        handleLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: '32px 24px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Welcome Section */}
          <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeIn 0.5s ease-out' }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: c.text, marginBottom: 8 }}>
              Hoş Geldin! 👋
            </h1>
            <p style={{ color: c.textSecondary, fontSize: 16 }}>
              İşte güncel sipariş durumun
            </p>
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
            {metricCards.map((card, index) => (
              <div
                key={card.label}
                style={{
                  background: c.bgCard,
                  backdropFilter: 'blur(20px)',
                  borderRadius: 20,
                  padding: 24,
                  border: `1px solid ${c.border}`,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = card.glow
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onClick={() => router.push('/dashboard')}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: card.gradient,
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 13, color: c.textMuted, margin: '0 0 8px 0', fontWeight: 500 }}>
                      {card.label}
                    </p>
                    <p style={{ 
                      fontSize: 36, 
                      fontWeight: 700, 
                      margin: 0,
                      background: card.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {card.value}
                    </p>
                  </div>
                  <span style={{ fontSize: 32 }}>{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            <div style={{
              background: c.bgCard,
              backdropFilter: 'blur(20px)',
              borderRadius: 20,
              padding: 28,
              border: `1px solid ${c.border}`,
              animation: 'slideUp 0.5s ease-out 0.4s both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'rgba(67, 233, 123, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}>
                  💵
                </div>
                <div>
                  <p style={{ fontSize: 13, color: c.textMuted, margin: 0 }}>Bugünün Geliri</p>
                  <p style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#43e97b' }}>
                    ₺{stats.todayRevenue.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: c.bgCard,
              backdropFilter: 'blur(20px)',
              borderRadius: 20,
              padding: 28,
              border: `1px solid ${c.border}`,
              animation: 'slideUp 0.5s ease-out 0.5s both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'rgba(102, 126, 234, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}>
                  📊
                </div>
                <div>
                  <p style={{ fontSize: 13, color: c.textMuted, margin: 0 }}>Bu Ayki Gelir</p>
                  <p style={{ 
                    fontSize: 28, 
                    fontWeight: 700, 
                    margin: 0,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    ₺{stats.monthlyRevenue.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: c.bgCard,
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            padding: 28,
            border: `1px solid ${c.border}`,
            animation: 'slideUp 0.5s ease-out 0.6s both',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: c.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>⚡</span>
              Hızlı İşlemler
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  border: 'none',
                  background: buttonGradients.primary,
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)'
                  e.currentTarget.style.boxShadow = glowEffects.primary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{ fontSize: 28 }}>➕</span>
                Yeni Sipariş Ekle
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  border: `1px solid ${c.border}`,
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: c.text,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = '#667eea'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                  e.currentTarget.style.borderColor = c.border
                }}
              >
                <span style={{ fontSize: 28 }}>📦</span>
                Siparişleri Görüntüle
              </button>

              <button
                onClick={() => router.push('/completed')}
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  border: `1px solid ${c.border}`,
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: c.text,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = '#43e97b'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                  e.currentTarget.style.borderColor = c.border
                }}
              >
                <span style={{ fontSize: 28 }}>✅</span>
                Tamamlananları Gör
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer theme={theme} />

      <style jsx global>{`
        ${keyframesCSS}
      `}</style>
    </div>
  )
}