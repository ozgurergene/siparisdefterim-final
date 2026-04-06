'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { colors, metricGradients, glowEffects, keyframesCSS, getAvatarGradient, getInitials } from '../lib/theme'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SearchBox from '../components/SearchBox'
import { DashboardSkeleton } from '../components/Loading'

export default function CompletedPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeOrderCount, setActiveOrderCount] = useState(0)
  
  const c = colors[theme]

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.replace('/login')
      return
    }
    setUser(session.user)
    await fetchOrders(session.user.id)
    await fetchActiveCount(session.user.id)
    setLoading(false)
  }

  const fetchOrders = async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrders(data)
    }
  }

  const fetchActiveCount = async (userId) => {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('status', 'completed')
    
    setActiveOrderCount(count || 0)
  }

  const filterOrders = () => {
    let result = [...orders]
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(o => 
        o.customer_name?.toLowerCase().includes(term) ||
        o.phone?.includes(term) ||
        o.products?.some(p => p.name?.toLowerCase().includes(term))
      )
    }
    
    setFilteredOrders(result)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: c.bgGradient,
        padding: 24,
      }}>
        <DashboardSkeleton />
      </div>
    )
  }

  // Calculate revenue stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  
  const today = new Date().toISOString().split('T')[0]
  const todayOrders = orders.filter(o => o.created_at?.startsWith(today))
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  
  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthlyOrders = orders.filter(o => o.created_at?.startsWith(thisMonth))
  const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

  const metricCards = [
    { label: 'Toplam Sipariş', value: orders.length, icon: '✅', gradient: metricGradients.completed, suffix: '' },
    { label: 'Toplam Gelir', value: totalRevenue.toFixed(0), icon: '💰', gradient: metricGradients.revenue, suffix: '₺' },
    { label: 'Bu Ay', value: monthlyRevenue.toFixed(0), icon: '📅', gradient: metricGradients.active, suffix: '₺' },
    { label: 'Ortalama Sipariş', value: avgOrderValue.toFixed(0), icon: '📊', gradient: metricGradients.shipped, suffix: '₺' },
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
        orderCount={activeOrderCount}
        maxOrders={50}
        theme={theme} 
        setTheme={setTheme} 
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: '24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          
          {/* Page Title */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ 
              fontSize: 24, 
              fontWeight: 600, 
              color: c.text,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span>✅</span>
              Tamamlanan Siparişler
            </h1>
            <p style={{ color: c.textSecondary, fontSize: 14, marginTop: 4 }}>
              Teslim edilmiş siparişlerinizi ve gelir istatistiklerinizi görüntüleyin
            </p>
          </div>

          {/* Metric Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 16,
            marginBottom: 24,
          }}>
            {metricCards.map((card, index) => (
              <div
                key={card.label}
                style={{
                  background: c.bgCard,
                  backdropFilter: 'blur(20px)',
                  borderRadius: 16,
                  padding: 20,
                  border: `1px solid ${c.border}`,
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: card.gradient,
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 12, color: c.textMuted, margin: '0 0 4px 0' }}>{card.label}</p>
                    <p style={{ 
                      fontSize: 28, 
                      fontWeight: 700, 
                      margin: 0,
                      background: card.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {card.suffix}{card.value}
                    </p>
                  </div>
                  <span style={{ fontSize: 24 }}>{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <SearchBox
            onSearch={setSearchTerm}
            onStatusFilter={() => {}}
            activeStatus="all"
            statusCounts={{}}
            resultCount={filteredOrders.length}
            theme={theme}
          />

          {/* Orders Table */}
          <div
            style={{
              background: c.bgCard,
              backdropFilter: 'blur(20px)',
              borderRadius: 20,
              overflow: 'hidden',
              border: `1px solid ${c.border}`,
              boxShadow: `0 10px 40px ${c.shadow}`,
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '50px 2fr 1.5fr 120px 120px',
                gap: 16,
                padding: '16px 24px',
                background: 'rgba(67, 233, 123, 0.05)',
                borderBottom: `1px solid ${c.border}`,
              }}
            >
              <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase' }}></span>
              <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Müşteri</span>
              <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Ürünler</span>
              <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Tutar</span>
              <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Tarih</span>
            </div>

            {/* Table Body */}
            {filteredOrders.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📭</span>
                <p style={{ color: c.textSecondary, fontSize: 16 }}>
                  {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz tamamlanan sipariş yok'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 2fr 1.5fr 120px 120px',
                    gap: 16,
                    padding: '16px 24px',
                    borderBottom: `1px solid ${c.borderLight}`,
                    alignItems: 'center',
                    transition: 'background 0.2s ease',
                    animation: `fadeIn 0.3s ease-out ${index * 0.03}s both`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = c.bgCardHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: getAvatarGradient(order.customer_name),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    {getInitials(order.customer_name)}
                  </div>

                  {/* Customer */}
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: c.text }}>
                      {order.customer_name}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: c.textMuted }}>
                      📱 {order.phone}
                    </p>
                  </div>

                  {/* Products */}
                  <div style={{ fontSize: 13, color: c.textSecondary }}>
                    {order.products?.map((p, i) => (
                      <div key={i}>
                        {p.name} x{p.quantity}
                      </div>
                    ))}
                  </div>

                  {/* Amount */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#43e97b' }}>
                      ₺{order.total_amount?.toFixed(0) || '0'}
                    </span>
                  </div>

                  {/* Date */}
                  <div style={{ textAlign: 'right', fontSize: 12, color: c.textMuted }}>
                    {new Date(order.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              ))
            )}
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