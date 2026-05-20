'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { colors, getAvatarGradient, getInitials, buttonGradients, glowEffects, statusColors } from '../../../lib/theme'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ProUpgradePrompt from '../../../components/ProUpgradePrompt'
import ProfilePopup from '../../../components/ProfilePopup'
import { SkeletonBox } from '../../../components/Loading'

const statusLabels = {
  payment_pending: 'Ödeme Bekliyor',
  paid: 'Ödendi',
  preparing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  completed: 'Tamamlandı'
}

const statusEmojis = {
  payment_pending: '💰',
  paid: '✅',
  preparing: '📦',
  shipped: '🚚',
  completed: '🎉'
}

// Home Icon (mobile header için)
function HomeIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGradCustomerDetail" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
        stroke="url(#homeGradCustomerDetail)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  )
}

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id

  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [theme, setTheme] = useState('dark')
  const [isMobile, setIsMobile] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  // === YENI: Sipariş detay modali için ===
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Theme detection (ayri useEffect, return cakismasin)
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

      if (userIsPro && customerId) {
        await loadCustomer(authUser.id, customerId)
      }
      setLoading(false)
    }
    init()
  }, [router, customerId])

  const loadCustomer = async (userId, custId) => {
    const { data: customerData, error: cError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', custId)
      .eq('user_id', userId)
      .single()

    if (cError || !customerData) {
      router.push('/customers')
      return
    }

    setCustomer(customerData)
    setEditData({
      name: customerData.name || '',
      phone: customerData.phone || '',
      city: customerData.city || '',
      district: customerData.district || '',
      address: customerData.address || '',
      note: customerData.note || ''
    })

    if (customerData.phone) {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .eq('customer_phone', customerData.phone)
        .order('created_at', { ascending: false })

      if (ordersData) setOrders(ordersData)
    }
  }

  // Tab change handler (mobile bottom bar)
  const handleTabChange = (tabId) => {
    if (tabId === 'orders') router.push('/dashboard')
    else if (tabId === 'completed') router.push('/completed')
    else if (tabId === 'customers') router.push('/customers')
    else if (tabId === 'reports') router.push('/reports')
    else if (tabId === 'home') router.push('/home')
  }

  const handleSave = async () => {
    if (!editData.name?.trim()) {
      alert('İsim boş olamaz')
      return
    }
    setSaving(true)
    const { error } = await supabase
      .from('customers')
      .update({
        name: editData.name.trim(),
        phone: editData.phone?.trim() || null,
        city: editData.city?.trim() || null,
        district: editData.district?.trim() || null,
        address: editData.address?.trim() || null,
        note: editData.note?.trim() || null
      })
      .eq('id', customer.id)

    if (error) {
      alert('Kayıt sırasında hata oluştu: ' + error.message)
      setSaving(false)
      return
    }

    await loadCustomer(user.id, customer.id)
    setEditing(false)
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm(`"${customer.name}" müşterisini silmek istediğine emin misin?\n\nNot: Siparişler silinmeyecek, sadece müşteri kaydı silinecek.`)) {
      return
    }
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customer.id)

    if (error) {
      alert('Silme sırasında hata: ' + error.message)
      return
    }
    router.push('/customers')
  }

  const handleWhatsApp = () => {
    if (!customer.phone) {
      alert('Bu müşterinin telefon numarası kayıtlı değil')
      return
    }
    const phone = customer.phone.replace(/\D/g, '')
    const msg = `Merhaba ${customer.name?.split(' ')[0] || ''}, `
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleCall = () => {
    if (!customer.phone) {
      alert('Bu müşterinin telefon numarası kayıtlı değil')
      return
    }
    window.location.href = `tel:${customer.phone}`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  // === YENI: Tarih ve saat birlikte format ===
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) +
           ', ' + d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }

  // === YENI: Siparişi tekrarla (aynı ürünlerle yeni sipariş) ===
  const handleRepeatOrder = (order) => {
    // Aynı müşteri + ürünler ile dashboard'a yönlendir
    // sessionStorage'a sipariş bilgilerini kaydet, dashboard onu okuyup formu doldursun
    const repeatData = {
      customer_name: order.customer_name || customer.name,
      customer_phone: order.customer_phone || customer.phone,
      customer_address: order.customer_address || customer.address || '',
      customer_city: order.customer_city || customer.city || '',
      customer_district: order.customer_district || customer.district || '',
      products: order.products_detail || [{ product: order.product, quantity: 1, unit_price: order.price, kdv_rate: order.kdv || 0 }],
      note: ''
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('repeat_order_data', JSON.stringify(repeatData))
    }
    router.push('/dashboard?repeat=1')
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
      <div style={{ minHeight: '100vh', background: c.bgGradient, display: 'flex', flexDirection: 'column', fontFamily: 'Arial', overflowX: 'hidden' }}>
        <div style={{ background: c.header, borderBottom: '1px solid ' + c.border, padding: '15px 20px', backdropFilter: c.backdropFilter, WebkitBackdropFilter: c.backdropFilter }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SkeletonBox width="180px" height="28px" theme={theme} />
            <SkeletonBox width="100px" height="36px" borderRadius={6} theme={theme} />
          </div>
        </div>
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', flex: 1, width: '100%' }}>
          <div style={{ marginBottom: '12px' }}>
            <SkeletonBox width="140px" height="20px" theme={theme} />
          </div>
          <div style={{ background: c.bgCard, backdropFilter: c.backdropFilter, WebkitBackdropFilter: c.backdropFilter, borderRadius: '20px', padding: '24px', marginBottom: '20px', border: '1px solid ' + c.border }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <SkeletonBox width="72px" height="72px" borderRadius={36} theme={theme} />
              <div style={{ flex: 1 }}>
                <SkeletonBox width="200px" height="26px" theme={theme} />
                <div style={{ marginTop: '8px' }}>
                  <SkeletonBox width="160px" height="14px" theme={theme} />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[1,2,3].map(i => (
                <SkeletonBox key={i} width="100%" height="70px" borderRadius={12} theme={theme} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <SkeletonBox width="100%" height="44px" borderRadius={10} theme={theme} />
              <SkeletonBox width="100%" height="44px" borderRadius={10} theme={theme} />
              <SkeletonBox width="100%" height="44px" borderRadius={10} theme={theme} />
            </div>
          </div>
          <SkeletonBox width="180px" height="22px" theme={theme} />
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1,2,3,4].map(i => (
              <SkeletonBox key={i} width="100%" height="68px" borderRadius={12} theme={theme} />
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
        <ProUpgradePrompt theme={theme} feature="Müşteri Detayı" icon="👤" />
      </div>
    )
  }

  if (!customer) return null

  const initials = getInitials(customer.name)
  const avatarGradient = getAvatarGradient(customer.name)

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
                onClick={() => router.push('/customers')}
                style={{
                  padding: '8px',
                  background: c.bgCard,
                  border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
                  fontSize: '16px',
                  color: isDark ? '#fff' : '#1a1a2e'
                }}
              >
                ←
              </button>
              <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '17px', fontWeight: '600' }}>Müşteri Detayı</span>
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
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 16px',
          paddingBottom: '100px'
        }}>
          {/* Profil Kartı */}
          <div style={{
            background: c.bgCard,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '14px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '76px', height: '76px',
              borderRadius: '50%',
              background: avatarGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '700',
              fontSize: '28px',
              margin: '0 auto 12px'
            }}>
              {initials}
            </div>

            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: isDark ? '#fff' : '#1a1a2e',
              margin: '0 0 6px 0'
            }}>
              {customer.name || 'İsimsiz'}
            </h2>

            <div style={{ fontSize: '13px', color: c.textSecondary, marginBottom: '4px' }}>
              📞 {customer.phone || 'Telefon yok'}
            </div>

            {(customer.city || customer.district) && (
              <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '10px' }}>
                📍 {[customer.district, customer.city].filter(Boolean).join(', ')}
              </div>
            )}

            {(customer.total_orders || 0) >= 5 && (
              <div style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: '700',
                marginTop: '4px'
              }}>
                ⭐ VIP MÜŞTERİ
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '14px'
          }}>
            <div style={{
              background: isDark ? 'rgba(102, 126, 234, 0.12)' : 'rgba(102, 126, 234, 0.15)',
              borderRadius: '12px',
              padding: '12px 8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '9px', color: c.textSecondary, marginBottom: '4px', fontWeight: '600' }}>SİPARİŞ</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#667eea' }}>
                {customer.total_orders || 0}
              </div>
            </div>
            <div style={{
              background: isDark ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.15)',
              borderRadius: '12px',
              padding: '12px 8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '9px', color: c.textSecondary, marginBottom: '4px', fontWeight: '600' }}>TOPLAM</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#22c55e' }}>
                ₺{parseFloat(customer.total_spent || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div style={{
              background: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.15)',
              borderRadius: '12px',
              padding: '12px 8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '9px', color: c.textSecondary, marginBottom: '4px', fontWeight: '600' }}>İLK</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: isDark ? '#fff' : '#1a1a2e', lineHeight: 1.3 }}>
                {formatDate(customer.first_order_at)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '14px'
          }}>
            <button
              onClick={handleCall}
              disabled={!customer.phone}
              style={{
                padding: '12px 8px',
                background: customer.phone ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                color: customer.phone ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: customer.phone ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              📞 Ara
            </button>
            <button
              onClick={handleWhatsApp}
              disabled={!customer.phone}
              style={{
                padding: '12px 8px',
                background: customer.phone ? 'linear-gradient(135deg, #25d366, #128c7e)' : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                color: customer.phone ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: customer.phone ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              💬 WhatsApp
            </button>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                padding: '12px 8px',
                background: editing ? (isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9') : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: editing ? (isDark ? '#fff' : '#1a1a2e') : '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              {editing ? '✕ İptal' : '✏️ Düzenle'}
            </button>
          </div>

          {/* Edit Form (mobile) */}
          {editing && (
            <div style={{
              background: c.bgCard,
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '14px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
            }}>
              <h3 style={{ color: isDark ? '#fff' : '#1a1a2e', margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700' }}>
                ✏️ Bilgileri Düzenle
              </h3>

              <div style={{ display: 'grid', gap: '10px' }}>
                <MobileField label="İsim *" isDark={isDark} theme={theme}>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    style={mobileInputStyle(isDark)}
                  />
                </MobileField>

                <MobileField label="Telefon" isDark={isDark} theme={theme}>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    style={mobileInputStyle(isDark)}
                  />
                </MobileField>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <MobileField label="Şehir" isDark={isDark} theme={theme}>
                    <input
                      type="text"
                      value={editData.city}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      style={mobileInputStyle(isDark)}
                    />
                  </MobileField>
                  <MobileField label="İlçe" isDark={isDark} theme={theme}>
                    <input
                      type="text"
                      value={editData.district}
                      onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                      style={mobileInputStyle(isDark)}
                    />
                  </MobileField>
                </div>

                <MobileField label="Adres" isDark={isDark} theme={theme}>
                  <textarea
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    style={{ ...mobileInputStyle(isDark), minHeight: '50px', resize: 'vertical' }}
                  />
                </MobileField>

                <MobileField label="Not" isDark={isDark} theme={theme}>
                  <textarea
                    value={editData.note}
                    onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                    placeholder="Müşteri hakkında not..."
                    style={{ ...mobileInputStyle(isDark), minHeight: '50px', resize: 'vertical' }}
                  />
                </MobileField>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1
                }}
              >
                {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
              </button>

              <button
                onClick={handleDelete}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '10px',
                  background: 'transparent',
                  color: '#ef4444',
                  border: `1px solid #ef4444`,
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🗑️ Müşteriyi Sil
              </button>
            </div>
          )}

          {/* Note (mobile) */}
          {customer.note && !editing && (
            <div style={{
              background: isDark ? 'rgba(251, 191, 36, 0.08)' : 'rgba(251, 191, 36, 0.12)',
              border: `1px solid ${isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(251, 191, 36, 0.3)'}`,
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '14px'
            }}>
              <div style={{ fontSize: '10px', color: '#f59e0b', marginBottom: '4px', fontWeight: '700' }}>
                📝 NOT
              </div>
              <div style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '13px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {customer.note}
              </div>
            </div>
          )}

          {/* Sipariş Geçmişi (mobile) */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: isDark ? '#fff' : '#1a1a2e',
              margin: '0 0 10px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              📦 Sipariş Geçmişi <span style={{ color: c.textSecondary, fontWeight: '500', fontSize: '12px' }}>({orders.length})</span>
            </h3>

            {orders.length === 0 ? (
              <div style={{
                background: c.bgCard,
                borderRadius: '14px',
                padding: '30px 16px',
                textAlign: 'center',
                color: c.textSecondary,
                fontSize: '13px'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>📦</div>
                Henüz sipariş yok
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {orders.map(order => (
                  <MobileOrderHistoryCard
                    key={order.id}
                    order={order}
                    isDark={isDark}
                    formatDate={formatDate}
                    theme={theme}
                    onClick={() => setSelectedOrder(order)}
                  />
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
          activeTab="customers"
          onTabChange={handleTabChange}
          onAddClick={() => router.push('/dashboard?add=1')}
          onLockedClick={() => setShowUpgradeModal(true)}
          isDark={isDark}
          isPro={isPro}
        />

        {/* === YENI: ORDER DETAIL MODAL === */}
        <OrderDetailModal
          order={selectedOrder}
          customer={customer}
          isOpen={selectedOrder !== null}
          onClose={() => setSelectedOrder(null)}
          onRepeat={handleRepeatOrder}
          theme={theme}
          isDark={isDark}
          formatDateTime={formatDateTime}
        />
      </div>
    )
  }

  // ========== DESKTOP VIEW ==========
  return (
    <div style={{ minHeight: '100vh', background: c.bgGradient, display: 'flex', flexDirection: 'column' }}>
      <Header user={user} ordersCreatedCount={ordersCreatedCount} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} isPro={isPro} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', boxSizing: 'border-box', flex: 1, width: '100%' }}>
        {/* Back button */}
        <button
          onClick={() => router.push('/customers')}
          style={{
            background: 'transparent',
            border: 'none',
            color: c.textSecondary,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px 0',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← Müşterilere Dön
        </button>

        {/* Customer header */}
        <div style={{
          background: c.bgCard,
          backdropFilter: c.backdropFilter,
          WebkitBackdropFilter: c.backdropFilter,
          border: `1px solid ${c.border}`,
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: avatarGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '700',
              fontSize: '28px',
              flexShrink: 0
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: c.text,
                margin: '0 0 6px 0'
              }}>
                {customer.name || 'İsimsiz Müşteri'}
              </h1>
              <div style={{ fontSize: '14px', color: c.textSecondary, marginBottom: '4px' }}>
                📞 {customer.phone || 'Telefon yok'}
              </div>
              {(customer.city || customer.district) && (
                <div style={{ fontSize: '13px', color: c.textMuted }}>
                  📍 {[customer.district, customer.city].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
            {(customer.total_orders || 0) >= 5 && (
              <div style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                ⭐ VIP MÜŞTERİ
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: c.textMuted, marginBottom: '4px' }}>SİPARİŞ</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: c.text }}>
                {customer.total_orders || 0}
              </div>
            </div>
            <div style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: c.textMuted, marginBottom: '4px' }}>TOPLAM</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#22c55e' }}>
                ₺{parseFloat(customer.total_spent || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: c.textMuted, marginBottom: '4px' }}>İLK SİPARİŞ</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: c.text, lineHeight: 1.3 }}>
                {formatDate(customer.first_order_at)}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleWhatsApp}
              disabled={!customer.phone}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: customer.phone ? 'linear-gradient(135deg, #25d366, #128c7e)' : c.bgSecondary,
                color: customer.phone ? '#fff' : c.textMuted,
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: customer.phone ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              💬 WhatsApp
            </button>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: editing ? c.bgSecondary : buttonGradients.primary,
                color: editing ? c.text : '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {editing ? '✕ İptal' : '✏️ Düzenle'}
            </button>
            <button
              onClick={handleDelete}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'transparent',
                color: '#ef4444',
                border: `1px solid #ef4444`,
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🗑️ Sil
            </button>
          </div>
        </div>

        {/* Edit form */}
        {editing && (
          <div style={{
            background: c.bgCard,
            backdropFilter: c.backdropFilter,
            WebkitBackdropFilter: c.backdropFilter,
            border: `1px solid ${c.border}`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: c.text, margin: '0 0 16px 0', fontSize: '16px' }}>
              ✏️ Müşteri Bilgilerini Düzenle
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              <Field label="İsim *" theme={theme}>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  style={inputStyle(c)}
                />
              </Field>

              <Field label="Telefon" theme={theme}>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  style={inputStyle(c)}
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Şehir" theme={theme}>
                  <input
                    type="text"
                    value={editData.city}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                    style={inputStyle(c)}
                  />
                </Field>
                <Field label="İlçe" theme={theme}>
                  <input
                    type="text"
                    value={editData.district}
                    onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                    style={inputStyle(c)}
                  />
                </Field>
              </div>

              <Field label="Adres" theme={theme}>
                <textarea
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  style={{ ...inputStyle(c), minHeight: '60px', resize: 'vertical' }}
                />
              </Field>

              <Field label="Not" theme={theme}>
                <textarea
                  value={editData.note}
                  onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                  placeholder="Müşteri hakkında not (örn. tercih ettiği saatler, özel istekler...)"
                  style={{ ...inputStyle(c), minHeight: '60px', resize: 'vertical' }}
                />
              </Field>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '14px',
                background: buttonGradients.success,
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1
              }}
            >
              {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
            </button>
          </div>
        )}

        {/* Note */}
        {customer.note && !editing && (
          <div style={{
            background: c.bgCard,
            backdropFilter: c.backdropFilter,
            WebkitBackdropFilter: c.backdropFilter,
            border: `1px solid ${c.border}`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '12px', color: c.textMuted, marginBottom: '6px', fontWeight: '600' }}>
              📝 NOT
            </div>
            <div style={{ color: c.text, fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {customer.note}
            </div>
          </div>
        )}

        {/* Orders timeline */}
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: c.text,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📦 Sipariş Geçmişi <span style={{ color: c.textMuted, fontWeight: '500' }}>({orders.length})</span>
          </h2>

          {orders.length === 0 ? (
            <div style={{
              background: c.bgCard,
              backdropFilter: c.backdropFilter,
              WebkitBackdropFilter: c.backdropFilter,
              border: `1px solid ${c.border}`,
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              color: c.textSecondary
            }}>
              Bu müşterinin henüz siparişi yok
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {orders.map(order => (
                <OrderHistoryCard
                  key={order.id}
                  order={order}
                  theme={theme}
                  formatDate={formatDate}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer theme={theme} />

      {/* === YENI: ORDER DETAIL MODAL === */}
      <OrderDetailModal
        order={selectedOrder}
        customer={customer}
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        onRepeat={handleRepeatOrder}
        theme={theme}
        isDark={isDark}
        formatDateTime={formatDateTime}
      />
    </div>
  )
}

// === MOBILE FIELD (label) ===
function MobileField({ label, children, isDark , theme }) {
  const c = colors[theme]
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: '600',
        color: c.textSecondary,
        marginBottom: '4px'
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const mobileInputStyle = (isDark) => ({
  width: '100%',
  padding: '9px 11px',
  background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
  color: isDark ? '#fff' : '#1a1a2e',
  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
  borderRadius: '8px',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
})

// === MOBILE ORDER HISTORY CARD ===
function MobileOrderHistoryCard({ order, isDark, formatDate, theme, onClick }) {
  const c = colors[theme]
  const status = order.status || 'payment_pending'
  const total = order.price || 0

  return (
    <div
      onClick={onClick}
      style={{
        background: c.bgCard,
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s'
      }}
      onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
      onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '9px',
        background: (statusColors[status] || '#667eea') + '22',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '17px',
        flexShrink: 0
      }}>
        {statusEmojis[status]}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: isDark ? '#fff' : '#1a1a2e',
          marginBottom: '2px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {order.product || 'Sipariş'}
        </div>
        <div style={{ fontSize: '11px', color: c.textSecondary }}>
          {formatDate(order.created_at)} · {statusLabels[status]}
        </div>
      </div>

      <div style={{
        fontSize: '14px',
        fontWeight: '700',
        color: '#22c55e',
        flexShrink: 0
      }}>
        ₺{parseFloat(total).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
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

// === DESKTOP FIELD (label) ===
function Field({ label, children, theme }) {
  const c = colors[theme]
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: c.textSecondary,
        marginBottom: '6px'
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = (c) => ({
  width: '100%',
  padding: '10px 12px',
  background: c.input,
  color: c.text,
  border: `1px solid ${c.inputBorder}`,
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
})

// === DESKTOP ORDER HISTORY CARD ===
function OrderHistoryCard({ order, theme, formatDate, onClick }) {
  const c = colors[theme]
  const status = order.status || 'payment_pending'
  const total = order.price || 0

  return (
    <div
      onClick={onClick}
      style={{
        background: c.bgCard,
        backdropFilter: c.backdropFilter,
        WebkitBackdropFilter: c.backdropFilter,
        border: `1px solid ${c.border}`,
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'transform 0.15s, border-color 0.15s'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = c.border
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: (statusColors[status] || '#667eea') + '22',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0
      }}>
        {statusEmojis[status]}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: c.text,
          marginBottom: '2px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {order.product || 'Sipariş'}
        </div>
        <div style={{ fontSize: '12px', color: c.textSecondary }}>
          {formatDate(order.created_at)} · {statusLabels[status]}
        </div>
      </div>

      <div style={{
        fontSize: '16px',
        fontWeight: '700',
        color: '#22c55e',
        flexShrink: 0
      }}>
        ₺{parseFloat(total).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
      </div>
    </div>
  )
}

// === YENI: ORDER DETAIL MODAL ===
function OrderDetailModal({ order, customer, isOpen, onClose, onRepeat, theme, isDark, formatDateTime }) {
  const c = colors[theme]
  if (!isOpen || !order) return null

  const status = order.status || 'payment_pending'
  const statusColor = statusColors[status] || '#667eea'

  // Ürünleri parse et: products_detail varsa onu, yoksa product string'i kullan
  const productList = (() => {
    if (order.products_detail && Array.isArray(order.products_detail) && order.products_detail.length > 0) {
      return order.products_detail.filter(p => p.product)
    }
    // Fallback: product stringini parse et
    if (order.product) {
      return order.product.split(',').map(part => {
        const match = part.trim().match(/(.+) x(\d+)/)
        if (match) return { product: match[1], quantity: parseInt(match[2]), unit_price: '', kdv_rate: '' }
        return { product: part.trim(), quantity: 1, unit_price: '', kdv_rate: '' }
      })
    }
    return []
  })()

  // Toplam hesapları
  const subtotal = productList.reduce((sum, p) => {
    const qty = parseInt(p.quantity) || 1
    const price = parseFloat(p.unit_price) || 0
    return sum + (qty * price)
  }, 0)

  const kdvTotal = productList.reduce((sum, p) => {
    const qty = parseInt(p.quantity) || 1
    const price = parseFloat(p.unit_price) || 0
    const kdvRate = parseFloat(p.kdv_rate) || 0
    return sum + (qty * price * kdvRate / 100)
  }, 0)

  const grandTotal = parseFloat(order.price) || (subtotal + kdvTotal)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDark ? '#0d0d1a' : '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.3s ease'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: c.textSecondary, marginBottom: '4px', fontWeight: '600' }}>
              SİPARİŞ NO
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: isDark ? '#fff' : '#1a1a2e' }}>
              #{order.id?.toString().slice(0, 8) || '-'}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '11px', color: c.textSecondary, marginBottom: '4px', fontWeight: '600' }}>
              DURUM
            </div>
            <span style={{
              background: statusColor + '22',
              color: statusColor,
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              display: 'inline-block'
            }}>
              {statusEmojis[status]} {statusLabels[status]}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '14px',
              color: isDark ? '#fff' : '#1a1a2e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* Tarih + Müşteri */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
        }}>
          <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '6px' }}>
            📅 Sipariş Tarihi
          </div>
          <div style={{ fontSize: '14px', color: isDark ? '#fff' : '#1a1a2e', fontWeight: '500', marginBottom: '12px' }}>
            {formatDateTime(order.created_at)}
          </div>

          <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '6px' }}>
            👤 Müşteri
          </div>
          <div style={{ fontSize: '14px', color: isDark ? '#fff' : '#1a1a2e', fontWeight: '500' }}>
            {order.customer_name || customer?.name || '-'}
          </div>
          {order.customer_phone && (
            <div style={{ fontSize: '13px', color: c.textSecondary, marginTop: '4px' }}>
              📞 {order.customer_phone}
            </div>
          )}
        </div>

        {/* Ürünler */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
        }}>
          <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '10px', fontWeight: '600' }}>
            🛒 ÜRÜNLER
          </div>
          {productList.length === 0 ? (
            <div style={{ fontSize: '13px', color: c.textSecondary, fontStyle: 'italic' }}>
              Ürün bilgisi yok
            </div>
          ) : (
            productList.map((p, i) => {
              const qty = parseInt(p.quantity) || 1
              const price = parseFloat(p.unit_price) || 0
              const lineTotal = qty * price
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: i < productList.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` : 'none',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ flex: 1, color: isDark ? '#fff' : '#1a1a2e' }}>
                    {p.product} <span style={{ color: c.textSecondary }}>× {qty}</span>
                  </div>
                  {price > 0 && (
                    <div style={{ color: isDark ? '#fff' : '#1a1a2e', fontWeight: '600' }}>
                      ₺{lineTotal.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Toplam */}
        <div style={{
          padding: '16px 20px',
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
        }}>
          {subtotal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: c.textSecondary }}>Ara Toplam</span>
              <span style={{ color: isDark ? '#fff' : '#1a1a2e' }}>
                ₺{subtotal.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
          {kdvTotal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: c.textSecondary }}>KDV</span>
              <span style={{ color: isDark ? '#fff' : '#1a1a2e' }}>
                ₺{kdvTotal.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: subtotal > 0 || kdvTotal > 0 ? `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` : 'none',
            marginTop: subtotal > 0 || kdvTotal > 0 ? '4px' : '0'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: isDark ? '#fff' : '#1a1a2e' }}>
              Genel Toplam
            </span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#22c55e' }}>
              ₺{grandTotal.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Teslimat Adresi */}
        {(order.customer_address || order.customer_city || order.customer_district) && (
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
          }}>
            <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '6px', fontWeight: '600' }}>
              📍 TESLİMAT ADRESİ
            </div>
            <div style={{ fontSize: '13px', color: isDark ? '#fff' : '#1a1a2e', lineHeight: 1.5 }}>
              {order.customer_address && <div>{order.customer_address}</div>}
              {(order.customer_district || order.customer_city) && (
                <div style={{ color: c.textSecondary, marginTop: '2px' }}>
                  {[order.customer_district, order.customer_city].filter(Boolean).join(' / ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Kargo Bilgisi */}
        {(order.cargo_company || order.tracking_number) && (
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
          }}>
            <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '8px', fontWeight: '600' }}>
              🚚 KARGO BİLGİSİ
            </div>
            {order.cargo_company && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: c.textSecondary }}>Kargo Firması</span>
                <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontWeight: '500' }}>
                  {order.cargo_company}
                </span>
              </div>
            )}
            {order.tracking_number && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: c.textSecondary }}>Takip No</span>
                <span style={{ color: '#667eea', fontWeight: '600', fontFamily: 'monospace' }}>
                  {order.tracking_number}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Not */}
        {order.note && (
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
          }}>
            <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '6px', fontWeight: '600' }}>
              📝 NOT
            </div>
            <div style={{
              fontSize: '13px',
              color: isDark ? '#fff' : '#1a1a2e',
              fontStyle: 'italic',
              lineHeight: 1.5
            }}>
              "{order.note}"
            </div>
          </div>
        )}

        {/* Aksiyon Butonları */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
              borderRadius: '10px',
              color: isDark ? '#fff' : '#1a1a2e',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Kapat
          </button>
          <button
            onClick={() => onRepeat(order)}
            style={{
              flex: 1,
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            🔁 Tekrarla
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}