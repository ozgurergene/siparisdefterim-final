'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, statusColors, buttonGradients, getAvatarGradient, getInitials } from '../../lib/theme'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProUpgradePrompt from '../../components/ProUpgradePrompt'
import ProfilePopup from '../../components/ProfilePopup'
import { StatsCardsSkeleton, SkeletonBox } from '../../components/Loading'

const periodLabels = {
  week: 'Bu Hafta',
  month: 'Bu Ay',
  year: 'Bu Yıl',
  all: 'Tüm Zamanlar'
}

const periodLabelsShort = {
  week: 'Hafta',
  month: 'Ay',
  year: 'Yıl',
  all: 'Tümü'
}

const statusLabels = {
  payment_pending: 'Ödeme Bekliyor',
  paid: 'Ödendi',
  preparing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  completed: 'Tamamlandı'
}

// Home Icon (mobile header için)
function HomeIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGradReports" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
        stroke="url(#homeGradReports)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  )
}

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [theme, setTheme] = useState('dark')
  const [period, setPeriod] = useState('month')
  const [isMobile, setIsMobile] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)

  // Theme detection (ayri useEffect)
  // === YENI: Realtime subscription - users tablosu degisikliklerini dinle ===
  useEffect(() => {
    if (!user?.id) return
    const channel = supabase
      .channel(`user-changes-tier5-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new || {}
          if (typeof updated.orders_created_count === 'number') {
            setOrdersCreatedCount(updated.orders_created_count)
          }
          if (typeof updated.is_pro === 'boolean') {
            setIsPro(updated.is_pro)
          }
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

    useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('siparisdefterim-theme') : null
    if (savedTheme) setTheme(savedTheme)

    const handleStorageChange = () => {
      const t = localStorage.getItem('siparisdefterim-theme')
      if (t) setTheme(t)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Mobile detection (ayri useEffect)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }
      setUser(authUser)

      const { data: userData } = await supabase
        .from('users')
        .select('is_pro, orders_created_count')
        .eq('id', authUser.id)
        .single()

      const userIsPro = userData?.is_pro === true
      setIsPro(userIsPro)
      setOrdersCreatedCount(userData?.orders_created_count || 0)

      if (userIsPro) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })

        if (data) setOrders(data)
      }
      setLoading(false)
    }
    init()
  }, [router])

  // Tab change handler (mobile bottom bar)
  const handleTabChange = (tabId) => {
    if (tabId === 'orders') router.push('/dashboard')
    else if (tabId === 'completed') router.push('/completed')
    else if (tabId === 'customers') router.push('/customers')
    else if (tabId === 'reports') router.push('/reports')
    else if (tabId === 'home') router.push('/home')
  }

  // Filter orders by period
  const periodOrders = useMemo(() => {
    if (period === 'all') return orders
    const now = new Date()
    let cutoff = new Date()
    if (period === 'week') cutoff.setDate(now.getDate() - 7)
    else if (period === 'month') cutoff.setMonth(now.getMonth() - 1)
    else if (period === 'year') cutoff.setFullYear(now.getFullYear() - 1)
    return orders.filter(o => new Date(o.created_at) >= cutoff)
  }, [orders, period])

  // Previous period for comparison
  const previousPeriodOrders = useMemo(() => {
    if (period === 'all') return []
    const now = new Date()
    let start = new Date()
    let end = new Date()
    if (period === 'week') {
      start.setDate(now.getDate() - 14)
      end.setDate(now.getDate() - 7)
    } else if (period === 'month') {
      start.setMonth(now.getMonth() - 2)
      end.setMonth(now.getMonth() - 1)
    } else if (period === 'year') {
      start.setFullYear(now.getFullYear() - 2)
      end.setFullYear(now.getFullYear() - 1)
    }
    return orders.filter(o => {
      const d = new Date(o.created_at)
      return d >= start && d < end
    })
  }, [orders, period])

  // KPIs
  const kpis = useMemo(() => {
    const sumOrders = (list) => list.reduce((sum, o) => sum + parseFloat(o.price || 0), 0)
    const currentRevenue = sumOrders(periodOrders)
    const previousRevenue = sumOrders(previousPeriodOrders)
    const revenueChange = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0

    const orderCount = periodOrders.length
    const previousOrderCount = previousPeriodOrders.length
    const orderCountChange = previousOrderCount > 0
      ? ((orderCount - previousOrderCount) / previousOrderCount) * 100
      : 0

    const avgOrderValue = orderCount > 0 ? currentRevenue / orderCount : 0
    const previousAvg = previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0
    const avgChange = previousAvg > 0 ? ((avgOrderValue - previousAvg) / previousAvg) * 100 : 0

    const uniqueCustomers = new Set(
      periodOrders.map(o => o.customer_phone).filter(Boolean)
    ).size

    return {
      currentRevenue,
      revenueChange,
      orderCount,
      orderCountChange,
      avgOrderValue,
      avgChange,
      uniqueCustomers
    }
  }, [periodOrders, previousPeriodOrders])

  // Chart data: Hafta (son 7 gun) veya Ay (bu ayin gunleri)
  const chartData = useMemo(() => {
    const now = new Date()
    const result = []

    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(now.getDate() - i)
        const matched = orders.filter(o => {
          const od = new Date(o.created_at)
          return od.toDateString() === date.toDateString()
        })
        const total = matched.reduce((sum, o) => sum + parseFloat(o.grand_total || o.price || 0), 0)
        result.push({
          label: date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
          value: total,
          count: matched.length
        })
      }
    } else if (period === 'month') {
      const year = now.getFullYear()
      const month = now.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const matched = orders.filter(o => {
          const od = new Date(o.created_at)
          return od.getFullYear() === year && od.getMonth() === month && od.getDate() === day
        })
        const total = matched.reduce((sum, o) => sum + parseFloat(o.grand_total || o.price || 0), 0)
        result.push({
          label: String(day),
          value: total,
          count: matched.length
        })
      }
    }
    return result
  }, [orders, period])

  // Top products
  const topProducts = useMemo(() => {
    const productMap = {}
    periodOrders.forEach(o => {
      if (!o.product) return
      const items = o.product.split(',').map(s => s.trim()).filter(Boolean)
      items.forEach(name => {
        if (!productMap[name]) {
          productMap[name] = { name, count: 0, revenue: 0 }
        }
        productMap[name].count += 1
        productMap[name].revenue += parseFloat(o.grand_total || o.price || 0) / items.length
      })
    })
    return Object.values(productMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [periodOrders])

  // Status distribution
  const statusDistribution = useMemo(() => {
    const dist = {}
    periodOrders.forEach(o => {
      const s = o.status || 'payment_pending'
      dist[s] = (dist[s] || 0) + 1
    })
    return Object.entries(dist).map(([status, count]) => ({
      status,
      count,
      percent: periodOrders.length > 0 ? (count / periodOrders.length) * 100 : 0
    })).sort((a, b) => b.count - a.count)
  }, [periodOrders])

  const c = colors[theme]
  const isDark = theme === 'dark'

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    if (typeof window !== 'undefined') localStorage.setItem('siparisdefterim-theme', newTheme)
    if (typeof window !== 'undefined') document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // ===== LOADING =====
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: c.bgGradient, fontFamily: 'Arial', overflowX: 'hidden' }}>
        <div style={{ background: c.header, borderBottom: '1px solid ' + c.border, padding: '15px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SkeletonBox width="180px" height="28px" theme={theme} />
            <SkeletonBox width="100px" height="36px" borderRadius={6} theme={theme} />
          </div>
        </div>
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', flex: 1, width: '100%' }}>
          <div style={{ marginBottom: '20px' }}>
            <SkeletonBox width="100%" height="48px" borderRadius={14} theme={theme} />
          </div>
          <StatsCardsSkeleton theme={theme} />
          <div style={{ background: c.header, borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid ' + c.border }}>
            <SkeletonBox width="140px" height="20px" theme={theme} />
            <div style={{ marginTop: '16px' }}>
              <SkeletonBox width="100%" height="200px" borderRadius={8} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ===== PRO DEGILSE =====
  if (!isPro) {
    return (
      <div style={{ minHeight: '100vh', background: c.bgGradient, display: 'flex', flexDirection: 'column' }}>
        <Header user={user} ordersCreatedCount={ordersCreatedCount} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} isPro={isPro} />
        <ProUpgradePrompt
          theme={theme}
          feature="Detaylı Raporlar"
          description="Gelir grafikleri, en çok satan ürünler, müşteri analizi ve dönem karşılaştırma. İşini büyütmek için ihtiyacın olan tüm veriler."
          icon="📊"
        />
      </div>
    )
  }

  // ========== MOBILE VIEW ==========
  if (isMobile) {
    return (
      <div style={{
        height: '100vh',
        background: c.bgGradient,
        fontFamily: 'Arial, sans-serif',
        color: isDark ? '#fff' : '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* STICKY HEADER SECTION */}
        <div style={{
          flexShrink: 0,
          background: c.bgGradient
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
                onClick={() => router.push('/home')}
                style={{
                  padding: '8px',
                  background: c.bgCard,
                  border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <HomeIcon size={18} />
              </button>
              <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '18px', fontWeight: '600' }}>Raporlar</span>
              <span style={{
                background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.2) 0%, rgba(245, 87, 108, 0.2) 100%)',
                color: '#f093fb',
                fontSize: '10px',
                padding: '3px 8px',
                borderRadius: '10px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                border: '1px solid rgba(240, 147, 251, 0.3)'
              }}>✨ PRO</span>
            </div>

            <div
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: getAvatarGradient(user?.email || ''),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: '#fff',
                boxShadow: showProfilePopup ? '0 0 0 3px rgba(34, 197, 94, 0.3)' : 'none'
              }}
            >
              {getInitials(user?.email || 'U')}
            </div>
          </div>

          {/* Period Selector - Segment Control */}
          <div style={{ padding: '0 16px 10px 16px' }}>
            <div style={{
              background: c.bgCard,
              borderRadius: '12px',
              padding: '4px',
              display: 'flex',
              gap: '2px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              {['week', 'month'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    background: period === p ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                    color: period === p ? '#fff' : (isDark ? '#fff' : '#1a1a2e'),
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: period === p ? '0 2px 6px rgba(102, 126, 234, 0.3)' : 'none'
                  }}
                >
                  {periodLabelsShort[p]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 16px',
          paddingBottom: '100px'
        }}>
          {/* KPI Cards 2x2 Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '14px'
          }}>
            <MobileKPICard
              icon="💰"
              label="Toplam Gelir"
              value={`₺${kpis.currentRevenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
              change={kpis.revenueChange}
              isDark={isDark}
              gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              showChange={period !== 'all'} theme={theme}
            />
            <MobileKPICard
              icon="📦"
              label="Sipariş"
              value={kpis.orderCount}
              change={kpis.orderCountChange}
              isDark={isDark}
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
              showChange={period !== 'all'} theme={theme}
            />
            <MobileKPICard
              icon="📊"
              label="Ort. Tutar"
              value={`₺${kpis.avgOrderValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
              change={kpis.avgChange}
              isDark={isDark}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              showChange={period !== 'all'} theme={theme}
            />
            <MobileKPICard
              icon="👥"
              label="Müşteri"
              value={kpis.uniqueCustomers}
              isDark={isDark}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              showChange={false} theme={theme}
            />
          </div>

          {/* Revenue Chart */}
          <div style={{
            background: c.bgCard,
            borderRadius: '14px',
            padding: '14px',
            marginBottom: '14px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: isDark ? '#fff' : '#1a1a2e',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              📈 Gelir Trendi
            </h3>
            <RevenueChart data={chartData} theme={theme} isMobile={true} />
          </div>

          {/* Top Products */}
          <div style={{
            background: c.bgCard,
            borderRadius: '14px',
            padding: '14px',
            marginBottom: '14px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: isDark ? '#fff' : '#1a1a2e',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🏆 En Çok Satan Ürünler
            </h3>
            {topProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: c.textSecondary, fontSize: '12px' }}>
                Bu dönemde henüz satış yok
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {topProducts.slice(0, 5).map((p, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: i === 0
                        ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                        : i === 1
                        ? 'linear-gradient(135deg, #cbd5e1, #94a3b8)'
                        : i === 2
                        ? 'linear-gradient(135deg, #f97316, #c2410c)'
                        : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                      color: i < 3 ? '#fff' : (isDark ? '#fff' : '#1a1a2e'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isDark ? '#fff' : '#1a1a2e',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '10px', color: c.textSecondary }}>
                        {p.count}x satıldı
                      </div>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#22c55e',
                      flexShrink: 0
                    }}>
                      ₺{p.revenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Distribution */}
          <div style={{
            background: c.bgCard,
            borderRadius: '14px',
            padding: '14px',
            marginBottom: '14px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: isDark ? '#fff' : '#1a1a2e',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🎯 Durum Dağılımı
            </h3>
            {statusDistribution.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: c.textSecondary, fontSize: '12px' }}>
                Bu dönemde sipariş yok
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {statusDistribution.map(item => (
                  <div key={item.status}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '12px', color: isDark ? '#fff' : '#1a1a2e', fontWeight: '600' }}>
                        {statusLabels[item.status]}
                      </span>
                      <span style={{ fontSize: '11px', color: c.textSecondary }}>
                        {item.count} ({item.percent.toFixed(0)}%)
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${item.percent}%`,
                        height: '100%',
                        background: statusColors[item.status],
                        borderRadius: '3px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM TAB BAR */}
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

                <BottomTabBar
          activeTab="reports"
          onTabChange={handleTabChange}
          onAddClick={() => router.push('/dashboard?add=1')}
          onLockedClick={() => setShowUpgradeModal(true)}
          isDark={isDark}
          isPro={isPro}
        />
      </div>
    )
  }

  // ========== DESKTOP VIEW ==========
  return (
    <div style={{ minHeight: '100vh', background: c.bgGradient, display: 'flex', flexDirection: 'column' }}>
      <Header user={user} ordersCreatedCount={ordersCreatedCount} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} isPro={isPro} /> 

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', boxSizing: 'border-box', flex: 1, width: '100%' }}>
        {/* Page header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '28px' }}>📊</span>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: c.text,
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              Raporlar
            </h1>
            <span style={{
              padding: '4px 10px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '700'
            }}>
              PRO
            </span>
          </div>
          <p style={{ color: c.textSecondary, margin: 0, fontSize: '14px' }}>
            İşletmenin performansını görsel grafiklerle analiz et
          </p>
        </div>

        {/* Period selector */}
        <div style={{
          background: c.bgCard,
          backdropFilter: c.backdropFilter,
          WebkitBackdropFilter: c.backdropFilter,
          border: `1px solid ${c.border}`,
          borderRadius: '14px',
          padding: '6px',
          marginBottom: '20px',
          display: 'flex',
          gap: '4px',
          overflowX: 'auto'
        }}>
          {['week', 'month'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: period === p ? buttonGradients.primary : 'transparent',
                color: period === p ? '#fff' : c.text,
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>

        {/* KPIs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <KPICard
            icon="💰"
            label="Toplam Gelir"
            value={`₺${kpis.currentRevenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
            change={kpis.revenueChange}
            theme={theme}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            showChange={period !== 'all'}
          />
          <KPICard
            icon="📦"
            label="Sipariş Sayısı"
            value={kpis.orderCount}
            change={kpis.orderCountChange}
            theme={theme}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            showChange={period !== 'all'}
          />
          <KPICard
            icon="📊"
            label="Ort. Sipariş Tutarı"
            value={`₺${kpis.avgOrderValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
            change={kpis.avgChange}
            theme={theme}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            showChange={period !== 'all'}
          />
          <KPICard
            icon="👥"
            label="Müşteri Sayısı"
            value={kpis.uniqueCustomers}
            theme={theme}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            showChange={false}
          />
        </div>

        {/* Revenue Chart */}
        <div style={{
          background: c.bgCard,
          backdropFilter: c.backdropFilter,
          WebkitBackdropFilter: c.backdropFilter,
          border: `1px solid ${c.border}`,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: c.text,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📈 Gelir Trendi
          </h2>
          <RevenueChart data={chartData} theme={theme} isMobile={false} />
        </div>

        {/* Two column: Top Products + Status Distribution */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Top Products */}
          <div style={{
            background: c.bgCard,
            backdropFilter: c.backdropFilter,
            WebkitBackdropFilter: c.backdropFilter,
            border: `1px solid ${c.border}`,
            borderRadius: '16px',
            padding: '20px'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: c.text,
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🏆 En Çok Satan Ürünler
            </h2>
            {topProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: c.textSecondary }}>
                Bu dönemde henüz satış yok
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topProducts.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '10px'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: i === 0
                        ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                        : i === 1
                        ? 'linear-gradient(135deg, #cbd5e1, #94a3b8)'
                        : i === 2
                        ? 'linear-gradient(135deg, #f97316, #c2410c)'
                        : c.bgSecondary,
                      color: i < 3 ? '#fff' : c.text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: c.text,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: c.textSecondary }}>
                        {p.count}x satıldı
                      </div>
                    </div>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#22c55e',
                      flexShrink: 0
                    }}>
                      ₺{p.revenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Distribution */}
          <div style={{
            background: c.bgCard,
            backdropFilter: c.backdropFilter,
            WebkitBackdropFilter: c.backdropFilter,
            border: `1px solid ${c.border}`,
            borderRadius: '16px',
            padding: '20px'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: c.text,
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🎯 Durum Dağılımı
            </h2>
            {statusDistribution.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: c.textSecondary }}>
                Bu dönemde sipariş yok
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {statusDistribution.map(item => (
                  <div key={item.status}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '13px', color: c.text, fontWeight: '600' }}>
                        {statusLabels[item.status]}
                      </span>
                      <span style={{ fontSize: '12px', color: c.textSecondary }}>
                        {item.count} ({item.percent.toFixed(0)}%)
                      </span>
                    </div>
                    <div style={{
                      height: '8px',
                      background: c.bgSecondary,
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${item.percent}%`,
                        height: '100%',
                        background: statusColors[item.status],
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}

// === MOBILE KPI CARD ===
function MobileKPICard({ icon, label, value, change, isDark, gradient, showChange, theme }) {
  const c = colors[theme]
  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <div style={{
      background: c.bgCard,
      borderRadius: '12px',
      padding: '12px',
      position: 'relative',
      overflow: 'hidden',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '50px', height: '50px',
        background: gradient,
        opacity: 0.1,
        borderRadius: '0 12px 0 100%'
      }} />
      <div style={{
        display: 'inline-flex',
        width: '28px', height: '28px',
        borderRadius: '8px',
        background: gradient,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        marginBottom: '6px'
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '10px', color: c.textSecondary, marginBottom: '2px', fontWeight: '500' }}>
        {label}
      </div>
      <div style={{
        fontSize: '15px',
        fontWeight: '700',
        color: isDark ? '#fff' : '#1a1a2e',
        lineHeight: 1.2,
        marginBottom: '2px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {value}
      </div>
      {showChange && Math.abs(change) > 0.1 && (
        <div style={{
          fontSize: '9px',
          fontWeight: '600',
          color: isPositive ? '#22c55e' : isNegative ? '#ef4444' : '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}>
          {isPositive ? '▲' : isNegative ? '▼' : '–'} {Math.abs(change).toFixed(0)}%
        </div>
      )}
    </div>
  )
}

// === BOTTOM TAB BAR (mobile) ===
function BottomTabBar({ activeTab, onTabChange, onAddClick, onLockedClick, isDark = true, isPro = false }) {
  const tabs = [
    { id: 'orders', icon: '📦', label: 'Sipariş' },
    { id: 'completed', icon: '✅', label: 'Tamamlanan' },
    { id: 'add', icon: '+', label: '', isMain: true },
    { id: 'customers', icon: '👥', label: 'Müşteri', locked: !isPro },
    { id: 'reports', icon: '📊', label: 'Rapor', locked: !isPro }
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: isDark ? 'rgba(13, 13, 26, 0.85)' : 'rgba(248, 232, 250, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '8px 0 24px 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      zIndex: 1000,
      borderTop: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
      boxShadow: isDark ? '0 -4px 30px rgba(0, 0, 0, 0.3)' : '0 -4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: '400px'
      }}>
        {tabs.map((tab) => (
          tab.isMain ? (
            <div
              key={tab.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px'
              }}
            >
              <button
                onClick={onAddClick}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: `3px solid ${isDark ? '#0d0d1a' : '#ffffff'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  color: '#fff',
                  cursor: 'pointer',
                  marginTop: '-28px',
                  boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
                  fontWeight: '300'
                }}
              >
                +
              </button>
            </div>
          ) : (
            <button
              key={tab.id}
              onClick={() => tab.locked ? onLockedClick && onLockedClick() : onTabChange(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: 'pointer',
                opacity: tab.locked ? 0.4 : (activeTab === tab.id ? 1 : 0.5),
                padding: '4px 0',
                width: '60px',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '20px' }}>{tab.icon}</span>
              <span style={{
                fontSize: '9px',
                color: isDark ? '#fff' : '#1a1a2e',
                fontWeight: activeTab === tab.id ? '700' : '500'
              }}>{tab.label}</span>
              {tab.locked && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '8px',
                  fontSize: '11px'
                }}>🔒</span>
              )}
            </button>
          )
        ))}
      </div>
    </div>
  )
}

// === DESKTOP KPI CARD ===
function KPICard({ icon, label, value, change, theme, gradient, showChange }) {
  const c = colors[theme]
  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <div style={{
      background: c.bgCard,
      backdropFilter: c.backdropFilter,
      WebkitBackdropFilter: c.backdropFilter,
      border: `1px solid ${c.border}`,
      borderRadius: '16px',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '60px', height: '60px',
        background: gradient,
        opacity: 0.1,
        borderRadius: '0 16px 0 100%'
      }} />
      <div style={{
        display: 'inline-flex',
        width: '36px', height: '36px',
        borderRadius: '10px',
        background: gradient,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        marginBottom: '8px'
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: c.text, lineHeight: 1.2, marginBottom: '4px' }}>
        {value}
      </div>
      {showChange && Math.abs(change) > 0.1 && (
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: isPositive ? '#22c55e' : isNegative ? '#ef4444' : c.textMuted,
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}>
          {isPositive ? '▲' : isNegative ? '▼' : '–'} {Math.abs(change).toFixed(1)}%
          <span style={{ color: c.textMuted, fontWeight: '500', marginLeft: '4px' }}>
            önceki döneme göre
          </span>
        </div>
      )}
    </div>
  )
}

// === REVENUE CHART (Native SVG, no external deps) ===
function RevenueChart({ data, theme, isMobile }) {
  const c = colors[theme]
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: c.textSecondary }}>
        Bu dönemde veri yok
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.value), 1)
  const chartHeight = isMobile ? 140 : 200
  const barCount = data.length
  const gap = isMobile ? 2 : 3

  const showLabels = true
  // Akilli aralik: cok bar varsa her N'inciyi goster
  const labelInterval = isMobile
    ? (barCount <= 10 ? 1 : barCount <= 15 ? 2 : barCount <= 25 ? 4 : Math.ceil(barCount / 7))
    : (barCount <= 30 ? 1 : Math.ceil(barCount / 15))

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: `${chartHeight}px`,
        display: 'flex',
        alignItems: 'flex-end',
        gap: `${gap}%`
      }}>
        {data.map((d, i) => {
          const heightPercent = (d.value / maxValue) * 100
          const isHighest = d.value === maxValue && d.value > 0
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                position: 'relative',
                cursor: 'pointer'
              }}
              title={`${d.label}: ₺${d.value.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} (${d.count} sipariş)`}
            >
              <div style={{
                width: '100%',
                height: `${heightPercent}%`,
                minHeight: d.value > 0 ? '4px' : '2px',
                background: isHighest
                  ? 'linear-gradient(180deg, #f59e0b, #ef4444)'
                  : 'linear-gradient(180deg, #667eea, #764ba2)',
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.5s ease',
                opacity: d.value > 0 ? 1 : 0.2
              }} />
            </div>
          )
        })}
      </div>

      {showLabels && (
        <div style={{
          display: 'flex',
          gap: `${gap}%`,
          marginTop: '8px'
        }}>
          {data.map((d, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                fontSize: isMobile ? '8px' : '10px',
                color: c.textSecondary,
                fontWeight: '600',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                position: 'relative'
              }}
            >
              {(i % labelInterval === 0 || i === data.length - 1) ? d.label : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}