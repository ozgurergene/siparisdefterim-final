'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { colors, metricGradients, glowEffects, buttonGradients, keyframesCSS } from '../lib/theme'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { PageLoading } from '../components/Loading'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')
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
    // Active orders (not completed)
    const { data: activeOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'completed')

    // Completed orders
    const { data: completedOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')

    const orders = activeOrders || []
    const completed = completedOrders || []
    
    // Calculate stats
    const pending = orders.filter(o => o.status === 'payment_pending' || o.status === 'paid').length
    const shipped = orders.filter(o => o.status === 'preparing' || o.status === 'shipped').length
    
    // Today's revenue
    const today = new Date().toISOString().split('T')[0]
    const todayCompleted = completed.filter(o => o.created_at?.startsWith(today))
    const todayRevenue = todayCompleted.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    
    // Monthly revenue
    const thisMonth = new Date().toISOString().slice(0, 7)
    const monthlyCompleted = completed.filter(o => o.created_at?.startsWith(thisMonth))
    const monthlyRevenue = monthlyCompleted.reduce((sum, o) => sum + (o.total_amount || 0), 0)

    setStats({
      total: orders.length,
      pending,
      shipped,
      completed: completed.length,
      todayRevenue,
      monthlyRevenue
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) return <PageLoading />

  const metricCards = [
    { 
      label: 'Aktif Siparişler', 
      value: stats.total, 
      icon: '📦', 
      gradient: metricGradients.active,
      glow: glowEffects.primary 
    },
    { 
      label: 'Ödeme Bekleyen', 
      value: stats.pending, 
      icon: '💰', 
      gradient: metricGradients.pending,
      glow: glowEffects.danger 
    },
    { 
      label: 'Kargo Sürecinde', 
      value: stats.shipped, 
      icon: '🚚', 
      gradient: metricGradients.shipped,
      glow: glowEffects.info 
    },
    { 
      label: 'Tamamlanan', 
      value: stats.completed, 
      icon: '✅', 
      gradient: metricGradients.completed,
      glow: glowEffects.primary 
    },
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: c.bgGradient,
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header 
        user={user} 
        orderCount={stats.total}
        maxOrders={50}
        theme={theme} 
        setTheme={setTheme} 
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Welcome Section */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 40,
            animation: 'fadeIn 0.5s ease-out',
          }}>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 700, 
              color: c.text,
              marginBottom: 8,
            }}>
              Hoş Geldin! 👋
            </h1>
            <p style={{ color: c.textSecondary, fontSize: 16 }}>
              İşte güncel sipariş durumun
            </p>
          </div>

          {/* Metric Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 20,
            marginBottom: 32,
          }}>
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
                {/* Gradient accent */}
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
                    <p style={{ 
                      fontSize: 13, 
                      color: c.textMuted, 
                      margin: '0 0 8px 0',
                      fontWeight: 500,
                    }}>
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 20,
            marginBottom: 32,
          }}>
            <div
              style={{
                background: c.bgCard,
                backdropFilter: 'blur(20px)',
                borderRadius: 20,
                padding: 28,
                border: `1px solid ${c.border}`,
                animation: 'slideUp 0.5s ease-out 0.4s both',
              }}
            >
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
                  <p style={{ 
                    fontSize: 28, 
                    fontWeight: 700, 
                    margin: 0,
                    color: '#43e97b',
                  }}>
                    ₺{stats.todayRevenue.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: c.bgCard,
                backdropFilter: 'blur(20px)',
                borderRadius: 20,
                padding: 28,
                border: `1px solid ${c.border}`,
                animation: 'slideUp 0.5s ease-out 0.5s both',
              }}
            >
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
            <h2 style={{ 
              fontSize: 18, 
              fontWeight: 600, 
              color: c.text, 
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
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