'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import Footer from '../../components/Footer'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    active: 0,
    paymentPending: 0,
    paymentPendingTotal: 0,
    shipped: 0,
    todayAdded: 0
  })
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [theme, setTheme] = useState('light')

  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data?.session?.user) {
          setUser(data.session.user)
          await fetchStats(data.session.user.id)
        } else {
          router.push('/login')
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const fetchStats = async (userId) => {
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)

      if (orders) {
        const activeOrders = orders.filter(o => o.status !== 'completed')
        const paymentPending = activeOrders.filter(o => o.status === 'payment_pending')
        const shipped = activeOrders.filter(o => o.status === 'shipped')
        const today = new Date().toDateString()
        const todayAdded = activeOrders.filter(o => new Date(o.created_at).toDateString() === today)
        const pendingTotal = paymentPending.reduce((sum, o) => sum + parseFloat(o.price || 0), 0)

        setStats({
          active: activeOrders.length,
          paymentPending: paymentPending.length,
          paymentPendingTotal: pendingTotal,
          shipped: shipped.length,
          todayAdded: todayAdded.length
        })
        setOrdersCreatedCount(orders.length)
      }
    } catch (error) {
      console.error('Stats fetch error:', error)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('siparisdefterim-theme', newTheme)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: c.bgGradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(255,255,255,0.2)',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: c.bgGradient, 
      fontFamily: 'Arial', 
      color: c.text,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Main Content */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>
          
          {/* Header */}
          <div style={{ 
            background: c.header, 
            border: `1px solid ${c.border}`, 
            borderRadius: '12px', 
            padding: '12px 16px', 
            marginBottom: '16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: c.text }}>📱 SiparişDefterim</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ 
                background: c.bgSecondary, 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '11px', 
                color: c.textSecondary 
              }}>
                {ordersCreatedCount}/50
              </div>
              <button
                onClick={toggleTheme}
                style={{ 
                  padding: '6px 10px', 
                  background: c.bgSecondary, 
                  border: `1px solid ${c.border}`, 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button
                onClick={handleLogout}
                style={{ 
                  padding: '6px 12px', 
                  background: '#e74c3c', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                Çıkış
              </button>
            </div>
          </div>

          {/* Row 1: Sipariş Oluştur - Primary Action */}
          <div 
            onClick={() => router.push('/dashboard?new=1')}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              borderRadius: '12px', 
              padding: '28px', 
              textAlign: 'center', 
              cursor: 'pointer', 
              marginBottom: '12px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>➕</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Yeni sipariş oluştur</div>
          </div>

          {/* Row 2: Navigation Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div 
              onClick={() => router.push('/dashboard')}
              style={{ 
                background: '#3498db', 
                borderRadius: '12px', 
                padding: '20px 16px', 
                textAlign: 'center', 
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>📋</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>Siparişler</div>
            </div>
            <div 
              onClick={() => router.push('/completed')}
              style={{ 
                background: '#27ae60', 
                borderRadius: '12px', 
                padding: '20px 16px', 
                textAlign: 'center', 
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>✅</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>Tamamlananlar</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: c.border, margin: '20px 0' }} />

          {/* Row 3: Stats - Aktif + Bekleyen */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              background: c.header, 
              border: `1px solid ${c.border}`,
              borderLeft: '4px solid #3498db',
              borderRadius: '10px', 
              padding: '18px 14px', 
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '8px' }}>📦 Aktif sipariş</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: c.text }}>{stats.active}</div>
            </div>
            <div style={{ 
              background: c.header, 
              border: `1px solid ${c.border}`,
              borderLeft: '4px solid #f39c12',
              borderRadius: '10px', 
              padding: '18px 14px', 
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '8px' }}>💰 Bekleyen ödeme</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f39c12' }}>{stats.paymentPending}</div>
              <div style={{ fontSize: '11px', color: c.textSecondary, marginTop: '4px' }}>₺{stats.paymentPendingTotal.toFixed(0)}</div>
            </div>
          </div>

          {/* Row 4: Stats - Kargoda + Bugün */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ 
              background: c.header, 
              border: `1px solid ${c.border}`,
              borderLeft: '4px solid #9b59b6',
              borderRadius: '10px', 
              padding: '18px 14px', 
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '8px' }}>🚚 Kargoda</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9b59b6' }}>{stats.shipped}</div>
            </div>
            <div style={{ 
              background: c.header, 
              border: `1px solid ${c.border}`,
              borderLeft: '4px solid #27ae60',
              borderRadius: '10px', 
              padding: '18px 14px', 
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '8px' }}>📅 Bugün eklenen</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>{stats.todayAdded}</div>
            </div>
          </div>

        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}