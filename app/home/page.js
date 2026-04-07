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
  const [theme, setTheme] = useState('light')
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)

  const c = colors[theme]

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  // Check user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!data?.session?.user) {
          router.push('/login')
          return
        }
        setUser(data.session.user)
        
        // Get order count
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', data.session.user.id)
        
        setOrdersCreatedCount(ordersData?.length || 0)
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

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
      <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱</div>
          <p style={{ color: c.textSecondary }}>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'Arial', color: c.text, margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: c.text }}>📱 SiparişDefterim</h1>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: c.textSecondary }}>Siparişler: {ordersCreatedCount}/50</p>
              <div style={{ width: '120px', height: '6px', background: c.bgSecondary, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(ordersCreatedCount / 50) * 100}%`, height: '100%', background: ordersCreatedCount >= 50 ? '#ff6b6b' : '#007bff', transition: 'width 0.3s' }} />
              </div>
            </div>
            <span style={{ color: c.textSecondary, fontSize: '14px' }}>{user?.email}</span>
            <button
              onClick={toggleTheme}
              style={{ padding: '8px 12px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={handleLogout}
              style={{ padding: '8px 15px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Çıkış
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Welcome Message */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', margin: '0 0 10px 0', color: c.text }}>Hoş Geldiniz! 👋</h2>
            <p style={{ fontSize: '16px', color: c.textSecondary, margin: 0 }}>
              Siparişlerinizi kolayca yönetin, müşterilerinizle iletişimde kalın.
            </p>
          </div>

          {/* Action Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Siparişler Card */}
            <div 
              onClick={() => router.push('/dashboard')}
              style={{ 
                background: c.header, 
                padding: '30px', 
                borderRadius: '12px', 
                border: `1px solid ${c.border}`,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: c.text }}>Siparişler</h3>
              <p style={{ margin: 0, fontSize: '14px', color: c.textSecondary }}>
                Yeni sipariş oluştur, mevcut siparişleri yönet ve durumlarını takip et.
              </p>
              <div style={{ marginTop: '15px', padding: '8px 16px', background: '#007bff', color: 'white', borderRadius: '6px', display: 'inline-block', fontWeight: 'bold', fontSize: '14px' }}>
                Siparişlere Git →
              </div>
            </div>

            {/* Tamamlananlar Card */}
            <div 
              onClick={() => router.push('/completed')}
              style={{ 
                background: c.header, 
                padding: '30px', 
                borderRadius: '12px', 
                border: `1px solid ${c.border}`,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(29, 158, 117, 0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: c.text }}>Tamamlananlar</h3>
              <p style={{ margin: 0, fontSize: '14px', color: c.textSecondary }}>
                Teslim edilen siparişlerin geçmişini görüntüle ve gelir raporlarını incele.
              </p>
              <div style={{ marginTop: '15px', padding: '8px 16px', background: '#1D9E75', color: 'white', borderRadius: '6px', display: 'inline-block', fontWeight: 'bold', fontSize: '14px' }}>
                Tamamlananlara Git →
              </div>
            </div>
          </div>

          {/* Pro Upgrade Banner */}
          {ordersCreatedCount >= 40 && (
            <div style={{ 
              marginTop: '30px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              padding: '25px', 
              borderRadius: '12px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>🚀 Pro'ya Yükselt!</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '14px', opacity: 0.9 }}>
                50 sipariş limitine yaklaşıyorsunuz. Pro ile sınırsız sipariş oluşturun!
              </p>
              <button
                onClick={() => router.push('/payment')}
                style={{ 
                  padding: '12px 30px', 
                  background: 'white', 
                  color: '#667eea', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                Pro'ya Geç
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}