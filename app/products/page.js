'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, getAvatarGradient, getInitials, buttonGradients, glowEffects } from '../../lib/theme'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProUpgradePrompt from '../../components/ProUpgradePrompt'
import ProfilePopup from '../../components/ProfilePopup'
import { SearchBoxSkeleton, SkeletonBox } from '../../components/Loading'

// Home Icon (mobile header için)
function HomeIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGradProducts" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
        stroke="url(#homeGradProducts)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  )
}

export default function ProductsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [theme, setTheme] = useState('dark')
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isMobile, setIsMobile] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    unit_price: '',
    kdv_rate: '0',
    category: '',
    description: ''
  })
  const [saving, setSaving] = useState(false)
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
        await loadProducts(authUser.id)
      }
      setLoading(false)
    }
    init()
  }, [router])

  const loadProducts = async (userId) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('times_sold', { ascending: false })

    if (data) setProducts(data)
  }

  // Tab change handler (mobile bottom bar)
  const handleTabChange = (tabId) => {
    if (tabId === 'orders') router.push('/dashboard')
    else if (tabId === 'completed') router.push('/completed')
    else if (tabId === 'customers') router.push('/customers')
    else if (tabId === 'reports') router.push('/reports')
    else if (tabId === 'home') router.push('/home')
  }

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name || '',
        unit_price: product.unit_price?.toString() || '',
        kdv_rate: product.kdv_rate?.toString() || '0',
        category: product.category || '',
        description: product.description || ''
      })
    } else {
      setEditingProduct(null)
      setFormData({ name: '', unit_price: '', kdv_rate: '0', category: '', description: '' })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({ name: '', unit_price: '', kdv_rate: '0', category: '', description: '' })
  }

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      alert('Ürün adı boş olamaz')
      return
    }
    const price = parseFloat(formData.unit_price)
    if (isNaN(price) || price < 0) {
      alert('Geçerli bir fiyat girin')
      return
    }

    setSaving(true)
    const payload = {
      user_id: user.id,
      name: formData.name.trim(),
      unit_price: price,
      kdv_rate: parseFloat(formData.kdv_rate) || 0,
      category: formData.category?.trim() || null,
      description: formData.description?.trim() || null
    }

    let error
    if (editingProduct) {
      const result = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingProduct.id)
      error = result.error
    } else {
      const result = await supabase
        .from('products')
        .insert(payload)
      error = result.error
    }

    if (error) {
      if (error.code === '23505') {
        alert('Bu isimde bir ürün zaten var. Farklı bir isim seç.')
      } else {
        alert('Hata: ' + error.message)
      }
      setSaving(false)
      return
    }

    await loadProducts(user.id)
    closeModal()
    setSaving(false)
  }

  const handleDelete = async (product) => {
    if (!confirm(`"${product.name}" ürününü silmek istediğine emin misin?`)) return
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)
    if (error) {
      alert('Silme hatası: ' + error.message)
      return
    }
    await loadProducts(user.id)
  }

  // Categories
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean))
    return ['all', ...Array.from(set).sort()]
  }, [products])

  // Filtered products
  const filteredProducts = useMemo(() => {
    let list = [...products]
    if (filterCategory !== 'all') {
      list = list.filter(p => p.category === filterCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [products, search, filterCategory])

  // Stats
  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalSold = products.reduce((sum, p) => sum + (p.times_sold || 0), 0)
    const avgPrice = totalProducts > 0
      ? products.reduce((sum, p) => sum + parseFloat(p.unit_price || 0), 0) / totalProducts
      : 0
    const popularCount = products.filter(p => (p.times_sold || 0) >= 5).length
    return { totalProducts, totalSold, avgPrice, popularCount }
  }, [products])

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
          <SearchBoxSkeleton theme={theme} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} style={{ background: c.header, padding: '16px', borderRadius: '16px', border: '1px solid ' + c.border }}>
                <SkeletonBox width="160px" height="18px" theme={theme} />
                <div style={{ marginTop: '12px' }}>
                  <SkeletonBox width="100%" height="60px" borderRadius={10} theme={theme} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <SkeletonBox width="100%" height="34px" borderRadius={8} theme={theme} />
                </div>
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
      <div style={{ minHeight: '100vh', background: c.bgGradient, display: 'flex', flexDirection: 'column' }}>
        <Header user={user} ordersCreatedCount={ordersCreatedCount} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} isPro={isPro} />
        <ProUpgradePrompt
          theme={theme}
          feature="Ürün Kataloğu"
          description="Sık kullandığın ürünleri kaydet. Sipariş oluştururken hızlı seçim ile zaman kazan."
          icon="📦"
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
              <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '18px', fontWeight: '600' }}>Ürünler</span>
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
              }}>{filteredProducts.length}</span>
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

          {/* Stats Row - 4 mini kart */}
          <div style={{ padding: '0 16px 10px 16px', display: 'flex', gap: '6px' }}>
            <div style={{ flex: 1, background: isDark ? 'rgba(102, 126, 234, 0.12)' : 'rgba(102, 126, 234, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#667eea', fontSize: '17px', fontWeight: '700', margin: 0 }}>{stats.totalProducts}</p>
              <span style={{ color: c.textSecondary, fontSize: '8px', textTransform: 'uppercase' }}>Ürün</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#22c55e', fontSize: '17px', fontWeight: '700', margin: 0 }}>{stats.totalSold}</p>
              <span style={{ color: c.textSecondary, fontSize: '8px', textTransform: 'uppercase' }}>Satış</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(251, 191, 36, 0.12)' : 'rgba(251, 191, 36, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#fbbf24', fontSize: '17px', fontWeight: '700', margin: 0 }}>{stats.popularCount}</p>
              <span style={{ color: c.textSecondary, fontSize: '8px', textTransform: 'uppercase' }}>Popüler</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(79, 172, 254, 0.12)' : 'rgba(79, 172, 254, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#4facfe', fontSize: '13px', fontWeight: '700', margin: 0 }}>₺{stats.avgPrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</p>
              <span style={{ color: c.textSecondary, fontSize: '8px', textTransform: 'uppercase' }}>Ort.</span>
            </div>
          </div>

          {/* Search + Category */}
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
                placeholder="Ürün veya kategori ara..."
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
            {categories.length > 1 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  background: c.bgCard,
                  borderRadius: '10px',
                  padding: '10px 8px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                  color: isDark ? '#fff' : '#1a1a2e',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                  maxWidth: '110px'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? '📂 Hepsi' : cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 16px',
          paddingBottom: '100px'
        }}>
          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: c.textSecondary,
              padding: '60px 20px',
              background: c.bgCard,
              borderRadius: '20px',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <p style={{ fontSize: '56px', marginBottom: '16px' }}>{search.trim() || filterCategory !== 'all' ? '🔍' : '📦'}</p>
              <p style={{ fontSize: '16px', color: isDark ? '#64748b' : '#4a5568' }}>
                {search.trim() || filterCategory !== 'all' ? 'Ürün bulunamadı' : 'Henüz ürün yok'}
              </p>
              <p style={{ fontSize: '13px', marginTop: '8px', color: '#4a5568' }}>
                {search.trim() || filterCategory !== 'all'
                  ? 'Farklı arama veya kategori dene'
                  : '+ Ekle butonuna basarak ilk ürünü ekle'}
              </p>
              {!search.trim() && filterCategory === 'all' && (
                <button
                  onClick={() => openModal()}
                  style={{
                    marginTop: '16px',
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  ＋ İlk Ürünü Ekle
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredProducts.map(product => (
                <MobileProductCard
                  key={product.id}
                  product={product}
                  isDark={isDark}
                  onEdit={() => openModal(product)}
                  onDelete={() => handleDelete(product)}
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
          activeTab="reports"
          onTabChange={handleTabChange}
          onAddClick={() => router.push('/dashboard?add=1')}
          onLockedClick={() => setShowUpgradeModal(true)}
          isDark={isDark}
          isPro={isPro}
        />

        {/* Modal */}
        {showModal && (
          <ProductModal
            theme={theme}
            editingProduct={editingProduct}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onClose={closeModal}
            saving={saving}
            isMobile={isMobile}
          />
        )}
      </div>
    )
  }

  // ========== DESKTOP VIEW ==========
  return (
    <div style={{ minHeight: '100vh', background: c.bgGradient, display: 'flex', flexDirection: 'column' }}>
      <Header user={user} ordersCreatedCount={ordersCreatedCount} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} isPro={isPro} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', boxSizing: 'border-box', flex: 1, width: '100%' }}>
        {/* Page header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '28px' }}>📦</span>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: c.text,
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                Ürün Kataloğu
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
              Toplam {products.length} ürün kayıtlı
            </p>
          </div>

          <button
            onClick={() => openModal()}
            style={{
              padding: '12px 20px',
              background: buttonGradients.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: glowEffects.primary
            }}
          >
            ＋ Yeni Ürün Ekle
          </button>
        </div>

        {/* Search + filter */}
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
            placeholder="🔍 Ürün adı veya kategori ara..."
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
          {categories.length > 1 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
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
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? '📂 Tüm Kategoriler' : cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <EmptyState theme={theme} hasProducts={products.length > 0} onAdd={() => openModal()} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                theme={theme}
                onEdit={() => openModal(product)}
                onDelete={() => handleDelete(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          theme={theme}
          editingProduct={editingProduct}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
          isMobile={isMobile}
        />
      )}

      <Footer theme={theme} />
    </div>
  )
}

// === MOBILE PRODUCT CARD ===
function MobileProductCard({ product, isDark, onEdit, onDelete, theme }) {
  const c = colors[theme]
  const isPopular = (product.times_sold || 0) >= 5

  return (
    <div style={{
      background: c.bgCard,
      borderRadius: '14px',
      padding: '14px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
      position: 'relative'
    }}>
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '3px 7px',
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          color: '#fff',
          borderRadius: '6px',
          fontSize: '9px',
          fontWeight: '700'
        }}>
          🔥 POPÜLER
        </div>
      )}

      <div style={{ marginBottom: '10px', paddingRight: isPopular ? '70px' : '0' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '700',
          color: isDark ? '#fff' : '#1a1a2e',
          margin: '0 0 4px 0',
          lineHeight: 1.3
        }}>
          {product.name}
        </h3>
        {product.category && (
          <div style={{
            display: 'inline-block',
            padding: '2px 7px',
            background: isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.1)',
            color: '#667eea',
            borderRadius: '5px',
            fontSize: '10px',
            fontWeight: '600',
            marginTop: '2px'
          }}>
            {product.category}
          </div>
        )}
      </div>

      {product.description && (
        <p style={{
          fontSize: '11px',
          color: c.textSecondary,
          margin: '0 0 10px 0',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>
      )}

      <div style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderRadius: '10px',
        padding: '10px 12px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: c.textSecondary }}>FİYAT</div>
          <div style={{ fontSize: '17px', fontWeight: '700', color: '#22c55e' }}>
            ₺{parseFloat(product.unit_price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
          {parseFloat(product.kdv_rate) > 0 && (
            <div style={{ fontSize: '9px', color: c.textSecondary, marginTop: '1px' }}>
              + %{product.kdv_rate} KDV
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: c.textSecondary }}>SATILDI</div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: isDark ? '#fff' : '#1a1a2e' }}>
            {product.times_sold || 0}x
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            padding: '8px 10px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ✏️ Düzenle
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            color: '#ef4444',
            border: `1px solid #ef4444`,
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🗑️
        </button>
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

// === DESKTOP PRODUCT CARD ===
function ProductCard({ product, theme, onEdit, onDelete }) {
  const c = colors[theme]
  const isDark = theme === 'dark'
  const isPopular = (product.times_sold || 0) >= 5

  return (
    <div style={{
      background: c.bgCard,
      backdropFilter: c.backdropFilter,
      WebkitBackdropFilter: c.backdropFilter,
      border: `1px solid ${c.border}`,
      borderRadius: '16px',
      padding: '16px',
      position: 'relative',
      transition: 'all 0.2s ease'
    }}>
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '4px 8px',
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '10px',
          fontWeight: '700'
        }}>
          🔥 POPÜLER
        </div>
      )}

      <div style={{ marginBottom: '12px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: c.text,
          margin: '0 0 4px 0',
          paddingRight: isPopular ? '70px' : '0',
          lineHeight: 1.3
        }}>
          {product.name}
        </h3>
        {product.category && (
          <div style={{
            display: 'inline-block',
            padding: '2px 8px',
            background: isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.1)',
            color: '#667eea',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            marginTop: '2px'
          }}>
            {product.category}
          </div>
        )}
      </div>

      {product.description && (
        <p style={{
          fontSize: '12px',
          color: c.textSecondary,
          margin: '0 0 12px 0',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>
      )}

      <div style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderRadius: '10px',
        padding: '10px 12px',
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: c.textMuted }}>Fiyat</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>
            ₺{parseFloat(product.unit_price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
          {parseFloat(product.kdv_rate) > 0 && (
            <div style={{ fontSize: '10px', color: c.textMuted, marginTop: '2px' }}>
              + %{product.kdv_rate} KDV
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: c.textMuted }}>Satıldı</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: c.text }}>
            {product.times_sold || 0}x
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: buttonGradients.primary,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ✏️ Düzenle
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            color: '#ef4444',
            border: `1px solid #ef4444`,
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

// === EMPTY STATE (desktop) ===
function EmptyState({ theme, hasProducts, onAdd }) {
  const c = colors[theme]
  return (
    <div style={{
      background: c.bgCard,
      border: `1px solid ${c.border}`,
      borderRadius: '16px',
      padding: '60px 20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
      <h3 style={{ color: c.text, margin: '0 0 8px 0', fontSize: '20px' }}>
        {hasProducts ? 'Ürün bulunamadı' : 'Henüz ürün yok'}
      </h3>
      <p style={{ color: c.textSecondary, margin: '0 0 20px 0', fontSize: '14px', lineHeight: 1.6 }}>
        {hasProducts ? 'Arama kriterlerini değiştirip tekrar dene' : 'İlk ürününü ekle, sipariş formunda hızlıca seç'}
      </p>
      {!hasProducts && (
        <button
          onClick={onAdd}
          style={{
            padding: '12px 24px',
            background: buttonGradients.primary,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: glowEffects.primary
          }}
        >
          ＋ İlk Ürünü Ekle
        </button>
      )}
    </div>
  )
}

// === MODAL (hem mobile hem desktop) ===
function ProductModal({ theme, editingProduct, formData, setFormData, onSave, onClose, saving, isMobile }) {
  const c = colors[theme]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? '0' : '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: c.bgCard,
          backdropFilter: c.backdropFilter,
          WebkitBackdropFilter: c.backdropFilter,
          border: `1px solid ${c.border}`,
          borderRadius: isMobile ? '20px 20px 0 0' : '20px',
          padding: '24px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: c.text, margin: 0, fontSize: '20px' }}>
            {editingProduct ? '✏️ Ürün Düzenle' : '＋ Yeni Ürün'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: c.textSecondary,
              fontSize: '24px',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label style={labelStyle(c)}>Ürün Adı *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: El Yapımı Kolye"
              style={modalInputStyle(c)}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle(c)}>Birim Fiyat (TL) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                placeholder="0.00"
                style={modalInputStyle(c)}
              />
            </div>
            <div>
              <label style={labelStyle(c)}>KDV (%)</label>
              <select
                value={formData.kdv_rate}
                onChange={(e) => setFormData({ ...formData, kdv_rate: e.target.value })}
                style={modalInputStyle(c)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle(c)}>Kategori (opsiyonel)</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Örn: Takı, Çanta, Aksesuar..."
              style={modalInputStyle(c)}
            />
          </div>

          <div>
            <label style={labelStyle(c)}>Açıklama (opsiyonel)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ürün hakkında kısa açıklama..."
              style={{ ...modalInputStyle(c), minHeight: '70px', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              flex: 1,
              padding: '12px',
              background: c.bgSecondary,
              color: c.text,
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            İptal
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            style={{
              flex: 2,
              padding: '12px',
              background: buttonGradients.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? 'Kaydediliyor...' : (editingProduct ? '💾 Güncelle' : '＋ Ekle')}
          </button>
        </div>
      </div>
    </div>
  )
}

const labelStyle = (c) => ({
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: c.textSecondary,
  marginBottom: '6px'
})

const modalInputStyle = (c) => ({
  width: '100%',
  padding: '10px 12px',
  background: c.input,
  color: c.text,
  border: `1px solid ${c.inputBorder}`,
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
})