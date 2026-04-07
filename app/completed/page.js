'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, getAvatarGradient, getInitials } from '../../lib/theme'
import Footer from '../../components/Footer'
import { StatsCardsSkeleton, SearchBoxSkeleton, TableSkeleton } from '../../components/Loading'

// Gradient Home Icon SVG Component
function HomeIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGradientCompleted" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" stroke="url(#homeGradientCompleted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="url(#homeGradientCompleted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Bottom Tab Bar Component
function BottomTabBar({ activeTab, onTabChange, onAddClick }) {
  const tabs = [
    { id: 'orders', icon: '📦', label: 'Sipariş' },
    { id: 'completed', icon: '✅', label: 'Tamam' },
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
      padding: '8px 16px 28px 16px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      zIndex: 1000,
      borderTop: '1px solid rgba(102, 126, 234, 0.2)',
      boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3)'
    }}>
      {tabs.map((tab) => (
        tab.isMain ? (
          <button
            key={tab.id}
            onClick={onAddClick}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '4px solid #0d0d1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              color: '#fff',
              cursor: 'pointer',
              marginTop: '-36px',
              boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
              transition: 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.2s',
              fontWeight: '300'
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
              gap: '4px',
              cursor: 'pointer',
              opacity: activeTab === tab.id ? 1 : 0.4,
              transition: 'opacity 0.3s ease, transform 0.2s ease',
              transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)',
              padding: '8px 12px'
            }}
          >
            <span style={{ fontSize: '22px' }}>{tab.icon}</span>
            <span style={{ 
              fontSize: '11px', 
              color: activeTab === tab.id ? '#22c55e' : '#64748b',
              fontWeight: activeTab === tab.id ? '600' : '400',
              transition: 'color 0.3s ease'
            }}>
              {tab.label}
            </span>
          </button>
        )
      ))}
    </div>
  )
}

// Mobile Completed Order Card
function MobileCompletedCard({ order }) {
  return (
    <div style={{
      background: 'rgba(26, 26, 46, 0.9)',
      borderRadius: '16px',
      padding: '16px 18px',
      borderLeft: '4px solid #22c55e',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#fff' }}>
            {order.customer_name.split(' ')[0]} {order.customer_name.split(' ')[1]?.[0]}.
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>
            {order.product}
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>
          ₺{order.price}
        </p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          📅 {new Date(order.created_at).toLocaleDateString('tr-TR')}
        </span>
        <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>
          ✅ {new Date(order.updated_at).toLocaleDateString('tr-TR')}
        </span>
      </div>
    </div>
  )
}

export default function CompletedPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completedOrders, setCompletedOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [theme, setTheme] = useState('light')
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const c = colors[theme]

  const hasActiveSearch = searchName || searchPhone || searchProduct

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!data?.session?.user) {
          router.push('/login')
          return
        }
        setUser(data.session.user)
        await fetchCompletedOrders(data.session.user.id)
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  useEffect(() => {
    let filtered = completedOrders
    
    if (searchName.trim()) {
      filtered = filtered.filter(order => 
        order.customer_name.toLowerCase().startsWith(searchName.toLowerCase())
      )
    }
    if (searchPhone.trim()) {
      filtered = filtered.filter(order => 
        order.customer_phone.startsWith(searchPhone)
      )
    }
    if (searchProduct.trim()) {
      filtered = filtered.filter(order => {
        const products = order.product.split(', ')
        return products.some(prod => 
          prod.toLowerCase().startsWith(searchProduct.toLowerCase())
        )
      })
    }
    setFilteredOrders(filtered)
  }, [searchName, searchPhone, searchProduct, completedOrders])

  const fetchCompletedOrders = async (userId) => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('updated_at', { ascending: false })
    
    setCompletedOrders(data || [])
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

  const handleTabChange = (tabId) => {
    if (tabId === 'orders') router.push('/dashboard')
    else if (tabId === 'completed') router.push('/completed')
  }

  const totalCompleted = completedOrders.length
  const totalRevenue = completedOrders.reduce((sum, order) => sum + parseFloat(order.price || 0), 0)
  
  const now = new Date()
  const thisMonth = completedOrders.filter(order => {
    const orderDate = new Date(order.updated_at)
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
  }).length

  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = completedOrders.filter(order => {
    const orderDate = new Date(order.updated_at)
    return orderDate >= oneWeekAgo
  }).length

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'Arial', overflowX: 'hidden' }}>
        <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: 180, height: 28, background: c.bgSecondary, borderRadius: 4 }} />
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ width: 100, height: 36, background: c.bgSecondary, borderRadius: 6 }} />
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <StatsCardsSkeleton theme={theme} />
          <SearchBoxSkeleton theme={theme} />
          <TableSkeleton rows={5} theme={theme} />
        </div>
      </div>
    )
  }

  // ========== MOBILE VIEW ==========
  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)',
        fontFamily: 'Arial, sans-serif',
        color: '#fff',
        paddingBottom: '100px'
      }}>
        {/* Mobile Header */}
        <div style={{
          padding: '24px 20px 16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => router.push('/home')}
              style={{
                padding: '10px',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <HomeIcon size={22} />
            </button>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Tamamlananlar</h1>
          </div>
          
          <div
            onClick={handleLogout}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: getAvatarGradient(user.email),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
          >
            {getInitials(user.email)}
          </div>
        </div>

        {/* Stats Cards - 2x2 Grid */}
        <div style={{ 
          padding: '0 20px 16px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          <div style={{
            background: 'rgba(26, 26, 46, 0.8)',
            borderRadius: '16px',
            padding: '16px',
            borderTop: '3px solid #22c55e'
          }}>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px 0' }}>Toplam</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#22c55e' }}>{totalCompleted}</p>
          </div>
          <div style={{
            background: 'rgba(26, 26, 46, 0.8)',
            borderRadius: '16px',
            padding: '16px',
            borderTop: '3px solid #22c55e'
          }}>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px 0' }}>Toplam Gelir</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#22c55e' }}>₺{totalRevenue.toFixed(0)}</p>
          </div>
          <div style={{
            background: 'rgba(26, 26, 46, 0.8)',
            borderRadius: '16px',
            padding: '16px',
            borderTop: '3px solid #667eea'
          }}>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px 0' }}>Bu Ay</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#667eea' }}>{thisMonth}</p>
          </div>
          <div style={{
            background: 'rgba(26, 26, 46, 0.8)',
            borderRadius: '16px',
            padding: '16px',
            borderTop: '3px solid #667eea'
          }}>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px 0' }}>Bu Hafta</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#667eea' }}>{thisWeek}</p>
          </div>
        </div>

        {/* Search Toggle */}
        <div style={{ padding: '0 20px 12px 20px' }}>
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>🔍 Ara ({filteredOrders.length} sonuç)</span>
            <span style={{ 
              transform: mobileSearchOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>▼</span>
          </button>
          
          {mobileSearchOpen && (
            <div style={{
              marginTop: '12px',
              padding: '16px',
              background: 'rgba(26, 26, 46, 0.8)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <input
                type="text"
                placeholder="Müşteri adı..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(13, 13, 26, 0.8)',
                  border: '1px solid #2a2a3e',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <input
                type="text"
                placeholder="Telefon..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(13, 13, 26, 0.8)',
                  border: '1px solid #2a2a3e',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={() => { setSearchName(''); setSearchPhone(''); setSearchProduct('') }}
                style={{
                  padding: '12px',
                  background: '#6c757d',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Temizle
              </button>
            </div>
          )}
        </div>

        {/* Completed Orders List */}
        <div style={{ padding: '0 20px' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#64748b', 
              padding: '60px 20px',
              background: 'rgba(26, 26, 46, 0.4)',
              borderRadius: '20px'
            }}>
              <p style={{ fontSize: '56px', marginBottom: '16px' }}>📭</p>
              <p style={{ fontSize: '16px' }}>Tamamlanan sipariş yok</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <MobileCompletedCard key={order.id} order={order} />
            ))
          )}
        </div>

        {/* Bottom Tab Bar */}
        <BottomTabBar
          activeTab="completed"
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
      background: c.bg, 
      fontFamily: 'Arial', 
      color: c.text, 
      margin: 0, 
      padding: 0, 
      display: 'flex', 
      flexDirection: 'column',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          
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
              onClick={() => router.push('/dashboard')}
              style={{ padding: '8px 16px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: c.text }}
            >
              📋 Siparişler
            </button>
            <button
              style={{ padding: '8px 16px', background: '#95e1d3', border: '2px solid #1D9E75', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: '#085041' }}
            >
              ✓ Tamamlananlar
            </button>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: c.textSecondary, fontSize: '14px' }}>{user.email}</span>
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

      <div style={{ flex: 1, width: '100%', padding: '20px 24px', boxSizing: 'border-box' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>Toplam Tamamlanan</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: c.text }}>{totalCompleted}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>Toplam Gelir</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1D9E75' }}>₺{totalRevenue.toFixed(2)}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>Bu Ay</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: c.text }}>{thisMonth}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>Bu Hafta</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: c.text }}>{thisWeek}</p>
          </div>
        </div>

        {/* Search Box */}
        <div style={{ background: c.header, borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
          <div 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            style={{ 
              padding: '12px 15px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer',
              background: isSearchOpen ? c.bgSecondary : c.header,
              transition: 'background 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: c.text }}>🔍 Tamamlanan Siparişlerde Ara</span>
              {hasActiveSearch && (
                <span style={{ background: '#007bff', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Aktif</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: c.textSecondary }}>{filteredOrders.length} sonuç</span>
              <span style={{ fontSize: '12px', color: c.textSecondary, transform: isSearchOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
            </div>
          </div>

          {isSearchOpen && (
            <div style={{ padding: '15px', borderTop: `1px solid ${c.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı</label>
                  <input type="text" placeholder="Adı ara..." value={searchName} onChange={(e) => setSearchName(e.target.value)} style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
                  <input type="text" placeholder="Telefon ara..." value={searchPhone} onChange={(e) => setSearchPhone(e.target.value.replace(/\D/g, ''))} maxLength="10" style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Ürün</label>
                  <input type="text" placeholder="Ürün ara..." value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button onClick={(e) => { e.stopPropagation(); setSearchName(''); setSearchPhone(''); setSearchProduct('') }} style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', width: '100%' }}>Temizle</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div style={{ background: c.header, borderRadius: '8px', overflow: 'auto', border: `1px solid ${c.border}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Müşteri</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Telefon</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Ürünler</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '100px', color: c.text }}>Fiyat</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '120px', color: c.text }}>Sipariş Tarihi</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', width: '120px', color: c.text }}>Tamamlanma Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order.id} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, color: c.text }}>
                    <div>{order.customer_name}</div>
                    {order.customer_city && order.customer_district && (
                      <div style={{ fontSize: '11px', color: '#667eea', marginTop: '4px' }}>📍 {order.customer_city} / {order.customer_district}</div>
                    )}
                  </td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, fontSize: '14px', color: c.textSecondary }}>📱 {order.customer_phone}</td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, color: c.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {order.product.split(', ').map((prod, idx) => (
                      <div key={idx} style={{ marginBottom: idx < order.product.split(', ').length - 1 ? '6px' : '0' }}>{prod}</div>
                    ))}
                    {order.note && <div style={{ fontSize: '12px', color: c.textSecondary, marginTop: '6px' }}>Not: {order.note}</div>}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}`, fontWeight: 'bold', color: '#1D9E75' }}>₺{order.price}</td>
                  <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}`, fontSize: '12px', color: c.textSecondary }}>📅 {new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#1D9E75', fontWeight: 'bold' }}>✅ {new Date(order.updated_at).toLocaleDateString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', color: c.textSecondary, padding: '50px' }}>
              <p>📭 Tamamlanan sipariş bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}