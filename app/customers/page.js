'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, getAvatarGradient, getInitials, buttonGradients, glowEffects } from '../../lib/theme'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProUpgradePrompt from '../../components/ProUpgradePrompt'
import ProfilePopup from '../../components/ProfilePopup'
import { StatsCardsSkeleton, SearchBoxSkeleton, SkeletonBox } from '../../components/Loading'

// Home Icon (mobile header için)
function HomeIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGradCustomers" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
        stroke="url(#homeGradCustomers)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  )
}

export default function CustomersPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState([])
  const [theme, setTheme] = useState('dark')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('last_order')
  const [isMobile, setIsMobile] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [activeTab, setActiveTab] = useState('customers')
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)

  // Theme detection
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

  // Mobile detection (ayri useEffect, return cakismasin)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auth + Pro check + data load
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
        await loadCustomers(authUser.id)
      }

      setLoading(false)
    }
    init()
  }, [router])

  const loadCustomers = async (userId) => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .order('last_order_at', { ascending: false, nullsFirst: false })

    if (!error && data) {
      setCustomers(data)
    }
  }

  // Tab change handler (mobile bottom bar)
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'orders') router.push('/dashboard')
    else if (tabId === 'completed') router.push('/completed')
    else if (tabId === 'customers') router.push('/customers')
    else if (tabId === 'reports') router.push('/reports')
    else if (tabId === 'home') router.push('/home')
  }

  // Filtered & sorted customers
  const filteredCustomers = useMemo(() => {
    let list = [...customers]

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q) ||
        (c.district || '').toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case 'name':
        list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'tr'))
        break
      case 'total_spent':
        list.sort((a, b) => parseFloat(b.total_spent || 0) - parseFloat(a.total_spent || 0))
        break
      case 'total_orders':
        list.sort((a, b) => (b.total_orders || 0) - (a.total_orders || 0))
        break
      case 'last_order':
      default:
        list.sort((a, b) => {
          const ad = a.last_order_at ? new Date(a.last_order_at).getTime() : 0
          const bd = b.last_order_at ? new Date(b.last_order_at).getTime() : 0
          return bd - ad
        })
    }

    return list
  }, [customers, search, sortBy])

  // Stats
  const stats = useMemo(() => {
    const totalCustomers = customers.length
    const totalRevenue = customers.reduce((sum, c) => sum + parseFloat(c.total_spent || 0), 0)
    const totalOrders = customers.reduce((sum, c) => sum + (c.total_orders || 0), 0)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    return { totalCustomers, totalRevenue, totalOrders, avgOrderValue }
  }, [customers])

  // Tarih formatı
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Hiç sipariş yok'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Bugün'
    if (diffDays === 1) return 'Dün'
    if (diffDays < 7) return `${diffDays} gün önce`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`
    return date.toLocaleDateString('tr-TR')
  }

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
          <StatsCardsSkeleton theme={theme} />
          <SearchBoxSkeleton theme={theme} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background: c.header, padding: '16px', borderRadius: '16px', border: '1px solid ' + c.border }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <SkeletonBox width="48px" height="48px" borderRadius={24} theme={theme} />
                  <div style={{ flex: 1 }}>
                    <SkeletonBox width="120px" height="16px" theme={theme} />
                  </div>
                </div>
                <SkeletonBox width="100%" height="60px" borderRadius={10} theme={theme} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ===== PRO DEGILSE =====
  if (!isPro) {
    return (
      <div style={{
        minHeight: '100vh',
        background: c.bgGradient,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header user={user} ordersCreatedCount={ordersCreatedCount} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} isPro={isPro} />
        <ProUpgradePrompt
          theme={theme}
          feature="Müşteri Yönetimi"
          description="Müşterilerini takip et, sipariş geçmişini gör, toplam harcamayı analiz et. Pro plan ile sınırsız müşteri kaydı."
          icon="👥"
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
              <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '18px', fontWeight: '600' }}>Müşteriler</span>
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
              <span style={{
                background: isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.15)',
                color: '#667eea',
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '10px',
                fontWeight: '500'
              }}>{filteredCustomers.length}</span>
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
                color: '#fff'
              }}
            >
              {getInitials(user?.email || 'U')}
            </div>
          </div>

          {/* Stats Row - 4 mini kart */}
          <div style={{ padding: '0 16px 10px 16px', display: 'flex', gap: '6px' }}>
            <div style={{ flex: 1, background: isDark ? 'rgba(102, 126, 234, 0.12)' : 'rgba(102, 126, 234, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#667eea', fontSize: '17px', fontWeight: '700', margin: 0 }}>{stats.totalCustomers}</p>
              <span style={{ color: c.textSecondary, fontSize: '8px', textTransform: 'uppercase' }}>Müşteri</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: '700', margin: 0 }}>₺{stats.totalRevenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</p>
              <span style={{ color: c.textSecondary, fontSize: '8px', textTransform: 'uppercase' }}>Gelir</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(67, 233, 123, 0.12)' : 'rgba(67, 233, 123, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#43e97b', fontSize: '17px', fontWeight: '700', margin: 0 }}>{stats.totalOrders}</p>
              <span style={{ color: c.textSecondary, fontSize: '8px', textTransform: 'uppercase' }}>Sipariş</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(79, 172, 254, 0.12)' : 'rgba(79, 172, 254, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#4facfe', fontSize: '13px', fontWeight: '700', margin: 0 }}>₺{stats.avgOrderValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</p>
              <span style={{ color: c.textSecondary, fontSize: '8px', textTransform: 'uppercase' }}>Ort.</span>
            </div>
          </div>

          {/* Search */}
          <div style={{ padding: '0 16px 10px 16px', display: 'flex', gap: '8px' }}>
            <div style={{
              flex: 1,
              background: c.bgCard,
              borderRadius: '10px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="İsim, telefon, şehir ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: isDark ? '#fff' : '#1a1a2e',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: c.bgCard,
                borderRadius: '10px',
                padding: '10px 8px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                color: isDark ? '#fff' : '#1a1a2e',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <option value="last_order">📅 Son</option>
              <option value="name">🔤 İsim</option>
              <option value="total_spent">💰 Harcama</option>
              <option value="total_orders">📦 Sipariş</option>
            </select>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 16px',
          paddingBottom: '100px'
        }}>
          {filteredCustomers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: c.textSecondary,
              padding: '60px 20px',
              background: c.bgCard,
              borderRadius: '20px',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <p style={{ fontSize: '56px', marginBottom: '16px' }}>{search.trim() ? '🔍' : '👥'}</p>
              <p style={{ fontSize: '16px', color: isDark ? '#64748b' : '#4a5568' }}>
                {search.trim() ? 'Müşteri bulunamadı' : 'Henüz müşterin yok'}
              </p>
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#4a5568' }}>
                {search.trim() ? 'Arama kriterlerini değiştir' : 'İlk siparişinde müşteri otomatik eklenir'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredCustomers.map(customer => (
                <MobileCustomerCard
                  key={customer.id}
                  customer={customer}
                  isDark={isDark}
                  formatDate={formatDate}
                  onClick={() => router.push(`/customers/${customer.id}`)}
          theme={theme}
                />
              ))}
            </div>
          )}
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
          activeTab={activeTab}
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

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '20px 16px 100px' : '32px 24px',
        boxSizing: 'border-box',
        flex: 1,
        width: '100%'
      }}>
        {/* Page Title */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '28px' }}>👥</span>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: c.text,
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              Müşterilerim
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
            Toplam {stats.totalCustomers} müşteri kayıtlı
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <StatCard
            icon="👥"
            label="Toplam Müşteri"
            value={stats.totalCustomers}
            theme={theme}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
          <StatCard
            icon="💰"
            label="Toplam Gelir"
            value={`₺${stats.totalRevenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
            theme={theme}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          />
          <StatCard
            icon="📦"
            label="Toplam Sipariş"
            value={stats.totalOrders}
            theme={theme}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          />
          <StatCard
            icon="📊"
            label="Ort. Sipariş"
            value={`₺${stats.avgOrderValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
            theme={theme}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </div>

        {/* Search + Sort */}
        <div style={{
          background: c.bgCard,
          backdropFilter: c.backdropFilter,
          WebkitBackdropFilter: c.backdropFilter,
          border: `1px solid ${c.border}`,
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            placeholder="🔍 İsim, telefon, şehir veya ilçe ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: c.input,
              color: c.text,
              border: `1px solid ${c.inputBorder}`,
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '12px 16px',
              background: c.input,
              color: c.text,
              border: `1px solid ${c.inputBorder}`,
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '180px'
            }}
          >
            <option value="last_order">📅 Son Sipariş</option>
            <option value="name">🔤 İsme Göre</option>
            <option value="total_spent">💰 En Çok Harcayan</option>
            <option value="total_orders">📦 En Çok Sipariş Veren</option>
          </select>
        </div>

        {/* Customers List */}
        {filteredCustomers.length === 0 ? (
          <EmptyState
            theme={theme}
            hasSearch={!!search.trim()}
            hasCustomers={customers.length > 0}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '12px'
          }}>
            {filteredCustomers.map(customer => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                theme={theme}
                formatDate={formatDate}
                onClick={() => router.push(`/customers/${customer.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer theme={theme} />
    </div>
  )
}

// === MOBILE CUSTOMER CARD ===
function MobileCustomerCard({ customer, isDark, formatDate, onClick, theme }) {
  const c = colors[theme]
  const initials = getInitials(customer.name || 'M')
  const avatarGradient = getAvatarGradient(customer.name || 'M')

  return (
    <div
      onClick={onClick}
      style={{
        background: c.bgCard,
        borderRadius: '14px',
        padding: '14px',
        cursor: 'pointer',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: '42px', height: '42px',
          borderRadius: '50%',
          background: avatarGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: '700',
          fontSize: '15px',
          flexShrink: 0
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: isDark ? '#fff' : '#1a1a2e',
            marginBottom: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {customer.name || 'İsimsiz'}
          </div>
          <div style={{ fontSize: '11px', color: c.textSecondary }}>
            {customer.phone || 'Telefon yok'}
          </div>
        </div>
        {(customer.total_orders || 0) >= 5 && (
          <div style={{
            padding: '2px 6px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '9px',
            fontWeight: '700'
          }}>
            ⭐ VIP
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        padding: '8px',
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: c.textSecondary, marginBottom: '2px' }}>SİPARİŞ</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#fff' : '#1a1a2e' }}>
            {customer.total_orders || 0}
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`
        }}>
          <div style={{ fontSize: '9px', color: c.textSecondary, marginBottom: '2px' }}>TOPLAM</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e' }}>
            ₺{parseFloat(customer.total_spent || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: c.textSecondary, marginBottom: '2px' }}>SON</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: isDark ? '#fff' : '#1a1a2e', lineHeight: 1.2 }}>
            {formatDate(customer.last_order_at)}
          </div>
        </div>
      </div>
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

// === STAT CARD (desktop) ===
function StatCard({ icon, label, value, theme, gradient }) {
  const c = colors[theme]
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
      <div style={{ fontSize: '20px', fontWeight: '700', color: c.text, lineHeight: 1.2 }}>
        {value}
      </div>
    </div>
  )
}

// === CUSTOMER CARD (desktop) ===
function CustomerCard({ customer, theme, formatDate, onClick }) {
  const c = colors[theme]
  const initials = getInitials(customer.name)
  const avatarGradient = getAvatarGradient(customer.name)

  return (
    <div
      onClick={onClick}
      style={{
        background: c.bgCard,
        backdropFilter: c.backdropFilter,
        WebkitBackdropFilter: c.backdropFilter,
        border: `1px solid ${c.border}`,
        borderRadius: '16px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: `0 4px 12px ${c.shadow}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 8px 24px ${c.shadow}`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = `0 4px 12px ${c.shadow}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '48px', height: '48px',
          borderRadius: '50%',
          background: avatarGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: '700',
          fontSize: '18px',
          flexShrink: 0
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '15px',
            fontWeight: '600',
            color: c.text,
            marginBottom: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {customer.name || 'İsimsiz Müşteri'}
          </div>
          <div style={{ fontSize: '12px', color: c.textSecondary }}>
            {customer.phone || 'Telefon yok'}
          </div>
        </div>
        {(customer.total_orders || 0) >= 5 && (
          <div style={{
            padding: '3px 8px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: '700'
          }}>
            ⭐ VIP
          </div>
        )}
      </div>

      {(customer.city || customer.district) && (
        <div style={{
          fontSize: '12px',
          color: c.textSecondary,
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          📍 {[customer.district, customer.city].filter(Boolean).join(', ')}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        padding: '10px',
        background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderRadius: '10px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: c.textMuted, marginBottom: '2px' }}>Sipariş</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: c.text }}>
            {customer.total_orders || 0}
          </div>
        </div>
        <div style={{ textAlign: 'center', borderLeft: `1px solid ${c.borderLight}`, borderRight: `1px solid ${c.borderLight}` }}>
          <div style={{ fontSize: '11px', color: c.textMuted, marginBottom: '2px' }}>Toplam</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#22c55e' }}>
            ₺{parseFloat(customer.total_spent || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: c.textMuted, marginBottom: '2px' }}>Son</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: c.text, lineHeight: 1.3 }}>
            {formatDate(customer.last_order_at)}
          </div>
        </div>
      </div>
    </div>
  )
}

// === EMPTY STATE ===
function EmptyState({ theme, hasSearch, hasCustomers }) {
  const c = colors[theme]

  if (hasSearch) {
    return (
      <div style={{
        background: c.bgCard,
        border: `1px solid ${c.border}`,
        borderRadius: '16px',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
        <h3 style={{ color: c.text, margin: '0 0 8px 0' }}>Müşteri bulunamadı</h3>
        <p style={{ color: c.textSecondary, margin: 0, fontSize: '14px' }}>
          Arama kriterlerini değiştirip tekrar dene
        </p>
      </div>
    )
  }

  return (
    <div style={{
      background: c.bgCard,
      border: `1px solid ${c.border}`,
      borderRadius: '16px',
      padding: '60px 20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
      <h3 style={{ color: c.text, margin: '0 0 8px 0', fontSize: '20px' }}>
        Henüz müşterin yok
      </h3>
      <p style={{ color: c.textSecondary, margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
        İlk siparişini oluşturduğunda müşteri otomatik olarak buraya eklenecek.
        <br />Müşteriler sipariş telefonuna göre otomatik gruplanır.
      </p>
    </div>
  )
}