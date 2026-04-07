'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, getAvatarGradient, getInitials } from '../../lib/theme'
import { calculateGrandTotal } from '../../lib/calculations'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OrderForm from '../../components/OrderForm'
import OrderTable from '../../components/OrderTable'
import SearchBox from '../../components/SearchBox'
import EditModal from '../../components/EditModal'
import { StatsCardsSkeleton, SearchBoxSkeleton, TableSkeleton } from '../../components/Loading'

// Mobile Order Card Component
function MobileOrderCard({ order, onEdit, onDelete, onWhatsApp, statusColor }) {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [swiped, setSwiped] = useState(false)
  const cardRef = useRef(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      setSwiped(true)
    } else if (isRightSwipe) {
      setSwiped(false)
    }
  }

  // Close swipe when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setSwiped(false)
      }
    }
    document.addEventListener('touchstart', handleClickOutside)
    return () => document.removeEventListener('touchstart', handleClickOutside)
  }, [])

  return (
    <div ref={cardRef} style={{ position: 'relative', overflow: 'hidden', marginBottom: '12px' }}>
      {/* Swipe Actions Background */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        zIndex: 1
      }}>
        <button
          onClick={() => { onEdit(order); setSwiped(false) }}
          style={{
            width: '70px',
            height: '100%',
            background: '#3b82f6',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ✏️
        </button>
        <button
          onClick={() => { onDelete(order.id); setSwiped(false) }}
          style={{
            width: '70px',
            height: '100%',
            background: '#ef4444',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          🗑️
        </button>
      </div>

      {/* Card Content */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          background: '#1a1a2e',
          borderRadius: '12px',
          padding: '16px',
          borderLeft: `4px solid ${statusColor}`,
          position: 'relative',
          zIndex: 2,
          transform: swiped ? 'translateX(-140px)' : 'translateX(0)',
          transition: 'transform 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
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

        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button
            onClick={() => onWhatsApp(order)}
            style={{
              flex: 1,
              padding: '10px',
              background: '#22c55e',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            WhatsApp
          </button>
          <button
            onClick={() => onEdit(order)}
            style={{
              flex: 1,
              padding: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Düzenle
          </button>
        </div>
      </div>
    </div>
  )
}

// Mobile Add Order Modal
function MobileAddOrderModal({ isOpen, onClose, newOrder, setNewOrder, handleAddOrder, theme }) {
  const c = colors[theme]
  
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        background: '#0d0d1a',
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        paddingTop: '60px'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '28px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Yeni Sipariş</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px', fontSize: '14px' }}>Müşteri Adı</label>
          <input
            type="text"
            value={newOrder.customer_name}
            onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Adı Soyadı"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px', fontSize: '14px' }}>Telefon</label>
          <input
            type="tel"
            value={newOrder.customer_phone}
            onChange={(e) => setNewOrder({ ...newOrder, customer_phone: e.target.value.replace(/\D/g, '') })}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="5XX XXX XX XX"
            maxLength="10"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px', fontSize: '14px' }}>Ürün</label>
          <input
            type="text"
            value={newOrder.products[0]?.product || ''}
            onChange={(e) => {
              const updatedProducts = [...newOrder.products]
              updatedProducts[0] = { ...updatedProducts[0], product: e.target.value }
              setNewOrder({ ...newOrder, products: updatedProducts })
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Ürün adı"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px', fontSize: '14px' }}>Adet</label>
            <input
              type="number"
              value={newOrder.products[0]?.quantity || 1}
              onChange={(e) => {
                const updatedProducts = [...newOrder.products]
                updatedProducts[0] = { ...updatedProducts[0], quantity: parseInt(e.target.value) || 1 }
                setNewOrder({ ...newOrder, products: updatedProducts })
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              min="1"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px', fontSize: '14px' }}>Birim Fiyat</label>
            <input
              type="number"
              value={newOrder.products[0]?.unit_price || ''}
              onChange={(e) => {
                const updatedProducts = [...newOrder.products]
                updatedProducts[0] = { ...updatedProducts[0], unit_price: e.target.value }
                setNewOrder({ ...newOrder, products: updatedProducts })
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="₺"
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px', fontSize: '14px' }}>Not (Opsiyonel)</label>
          <input
            type="text"
            value={newOrder.note}
            onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Özel talep, açıklama..."
          />
        </div>

        <button
          onClick={() => { handleAddOrder(); onClose() }}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          ✓ Sipariş Ekle
        </button>
      </div>
    </div>
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
      background: 'linear-gradient(180deg, rgba(13,13,26,0.95) 0%, #0d0d1a 100%)',
      padding: '10px 20px 25px 20px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      zIndex: 1000,
      borderTop: '1px solid #2a2a3e'
    }}>
      {tabs.map((tab) => (
        tab.isMain ? (
          <button
            key={tab.id}
            onClick={onAddClick}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#fff',
              cursor: 'pointer',
              marginTop: '-30px',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.5)'
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
              opacity: activeTab === tab.id ? 1 : 0.5,
              transition: 'opacity 0.2s'
            }}
          >
            <span style={{ fontSize: '24px' }}>{tab.icon}</span>
            <span style={{ fontSize: '11px', color: activeTab === tab.id ? '#22c55e' : '#94a3b8' }}>
              {tab.label}
            </span>
          </button>
        )
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [theme, setTheme] = useState('light')
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')
  
  // Search states
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // New order state
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    customer_city: '',
    customer_district: '',
    products: [{ product: '', quantity: 1, unit_price: '', kdv_rate: '' }],
    note: ''
  })
  
  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [editingData, setEditingData] = useState(null)

  const c = colors[theme]

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
        await fetchUserData(data.session.user.id)
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  // Filter orders
  useEffect(() => {
    let filtered = orders
    
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
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }
    setFilteredOrders(filtered)
  }, [searchName, searchPhone, searchProduct, statusFilter, orders])

  const fetchUserData = async (userId) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (userError && userError.code === 'PGRST116') {
        await supabase.from('users').insert([{ id: userId, orders_created_count: 0 }])
      }

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      const allOrders = ordersData || []
      setOrders(allOrders.filter(o => o.status !== 'completed'))
      setOrdersCreatedCount(allOrders.length)
    } catch (error) {
      console.error('fetchUserData error:', error)
    }
  }

  const handleRefresh = async () => {
    if (!user) return
    setIsRefreshing(true)
    await fetchUserData(user.id)
    setTimeout(() => setIsRefreshing(false), 1000)
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

  const handleAddOrder = async () => {
    if (!newOrder.customer_name || !newOrder.customer_phone) {
      alert('Lütfen müşteri adı ve telefon numarası girin.')
      return
    }

    const hasValidProduct = newOrder.products.some(p => p.product && p.unit_price)
    if (!hasValidProduct) {
      alert('Lütfen en az bir ürün ve fiyat girin.')
      return
    }

    const productString = newOrder.products
      .filter(p => p.product)
      .map(p => `${p.product} x${p.quantity}`)
      .join(', ')

    const totalPrice = calculateGrandTotal(newOrder.products)

    const orderData = {
      user_id: user.id,
      customer_name: newOrder.customer_name,
      customer_phone: newOrder.customer_phone,
      customer_address: newOrder.customer_address,
      customer_city: newOrder.customer_city,
      customer_district: newOrder.customer_district,
      product: productString,
      price: totalPrice,
      status: 'payment_pending',
      note: newOrder.note
    }

    const { data, error } = await supabase.from('orders').insert([orderData]).select()

    if (error) {
      console.error('Order error:', error)
      alert('Sipariş oluşturulamadı.')
      return
    }

    await supabase
      .from('users')
      .update({ orders_created_count: ordersCreatedCount + 1 })
      .eq('id', user.id)

    setOrders([data[0], ...orders])
    setOrdersCreatedCount(ordersCreatedCount + 1)
    setNewOrder({
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      customer_city: '',
      customer_district: '',
      products: [{ product: '', quantity: 1, unit_price: '', kdv_rate: '' }],
      note: ''
    })
  }

  const deleteOrder = async (orderId) => {
    if (!confirm('Siparişi silmek istediğinize emin misiniz?')) return

    const { error } = await supabase.from('orders').delete().eq('id', orderId)
    if (error) {
      console.error('Delete error:', error)
      alert('Sipariş silinemedi.')
      return
    }

    setOrders(orders.filter(o => o.id !== orderId))
    setOrdersCreatedCount(ordersCreatedCount - 1)

    await supabase
      .from('users')
      .update({ orders_created_count: ordersCreatedCount - 1 })
      .eq('id', user.id)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      console.error('Status update error:', error)
      alert('Durum güncellenemedi.')
      return
    }

    if (newStatus === 'completed') {
      setOrders(orders.filter(o => o.id !== orderId))
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    }
  }

  const startEditing = (order) => {
    const productParts = order.product.split(', ')
    const products = productParts.map(part => {
      const match = part.match(/(.+) x(\d+)/)
      if (match) {
        return { product: match[1], quantity: parseInt(match[2]), unit_price: '', kdv_rate: '' }
      }
      return { product: part, quantity: 1, unit_price: '', kdv_rate: '' }
    })

    setEditingId(order.id)
    setEditingData({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address || '',
      customer_city: order.customer_city || '',
      customer_district: order.customer_district || '',
      products: products.length > 0 ? products : [{ product: '', quantity: 1, unit_price: '', kdv_rate: '' }],
      note: order.note || ''
    })
  }

  const saveEdit = async () => {
    const productString = editingData.products
      .filter(p => p.product)
      .map(p => `${p.product} x${p.quantity}`)
      .join(', ')

    const totalPrice = calculateGrandTotal(editingData.products)

    const updateData = {
      customer_name: editingData.customer_name,
      customer_phone: editingData.customer_phone,
      customer_address: editingData.customer_address,
      customer_city: editingData.customer_city,
      customer_district: editingData.customer_district,
      product: productString,
      price: totalPrice,
      note: editingData.note
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', editingId)

    if (error) {
      console.error('Update error:', error)
      alert('Sipariş güncellenemedi.')
      return
    }

    setOrders(orders.map(o => o.id === editingId ? { ...o, ...updateData } : o))
    setEditingId(null)
    setEditingData(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingData(null)
  }

  const handleWhatsApp = (order) => {
    const phone = order.customer_phone.startsWith('0') ? order.customer_phone.slice(1) : order.customer_phone
    const message = `Merhaba ${order.customer_name}, siparişiniz hakkında bilgi vermek istiyorum.`
    window.open(`https://wa.me/90${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'completed') {
      router.push('/completed')
    } else if (tabId === 'customers') {
      // TODO: Müşteri sayfası
    } else if (tabId === 'reports') {
      // TODO: Rapor sayfası
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'payment_pending': return '#3b82f6'
      case 'paid': return '#22c55e'
      case 'preparing': return '#f59e0b'
      case 'shipped': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  // Stats
  const activeOrders = orders.filter(o => o.status !== 'completed').length
  const pendingPayments = orders.filter(o => o.status === 'payment_pending').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.created_at)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  }).length

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'Arial', overflowX: 'hidden' }}>
        <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: 180, height: 28, background: c.bgSecondary, borderRadius: 4 }} />
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ width: 100, height: 36, background: c.bgSecondary, borderRadius: 6 }} />
              <div style={{ width: 120, height: 36, background: c.bgSecondary, borderRadius: 6 }} />
            </div>
          </div>
        </div>
        <div style={{ padding: '20px' }}>
          <StatsCardsSkeleton theme={theme} />
          <SearchBoxSkeleton theme={theme} />
          <TableSkeleton rows={5} theme={theme} />
        </div>
      </div>
    )
  }

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0d0d1a',
        fontFamily: 'Arial',
        color: '#fff',
        paddingBottom: '100px'
      }}>
        {/* Mobile Header */}
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Siparişler</h1>
          <div
            onClick={handleLogout}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: getAvatarGradient(user.email),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {getInitials(user.email)}
          </div>
        </div>

        {/* Pull to Refresh Indicator */}
        {isRefreshing && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            color: '#94a3b8'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #667eea',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '10px' }}>Yenileniyor...</p>
          </div>
        )}

        {/* Orders List */}
        <div style={{ padding: '0 20px' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 20px' }}>
              <p style={{ fontSize: '48px', marginBottom: '10px' }}>📭</p>
              <p>Henüz sipariş yok</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <MobileOrderCard
                key={order.id}
                order={order}
                onEdit={startEditing}
                onDelete={deleteOrder}
                onWhatsApp={handleWhatsApp}
                statusColor={getStatusColor(order.status)}
              />
            ))
          )}
        </div>

        {/* Bottom Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onAddClick={() => setShowAddModal(true)}
        />

        {/* Add Order Modal */}
        <MobileAddOrderModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          handleAddOrder={handleAddOrder}
          theme={theme}
        />

        {/* Edit Modal */}
        <EditModal
          editingId={editingId}
          editingData={editingData}
          setEditingData={setEditingData}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          theme={theme}
        />

        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // DESKTOP VIEW (unchanged)
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
      <Header 
        user={user} 
        ordersCreatedCount={ordersCreatedCount} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        handleLogout={handleLogout} 
      />

      <div style={{ 
        flex: 1, 
        width: '100%', 
        padding: '20px 24px', 
        boxSizing: 'border-box'
      }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>📦 Aktif Siparişler</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: c.text }}>{activeOrders}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>💰 Ödeme Bekleyen</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#f39c12' }}>{pendingPayments}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>🚚 Kargoda</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#9b59b6' }}>{shippedOrders}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>📅 Bugün Eklenen</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1D9E75' }}>{todayOrders}</p>
          </div>
        </div>

        {/* Order Form */}
        <OrderForm 
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          ordersCreatedCount={ordersCreatedCount}
          handleAddOrder={handleAddOrder}
          theme={theme}
        />

        {/* Search Box */}
        <SearchBox
          searchName={searchName}
          setSearchName={setSearchName}
          searchPhone={searchPhone}
          setSearchPhone={setSearchPhone}
          searchProduct={searchProduct}
          setSearchProduct={setSearchProduct}
          filteredCount={filteredOrders.length}
          theme={theme}
        />

        {/* Order Table */}
        <OrderTable
          filteredOrders={filteredOrders}
          user={user}
          theme={theme}
          startEditing={startEditing}
          deleteOrder={deleteOrder}
          updateOrderStatus={updateOrderStatus}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {/* Edit Modal */}
      <EditModal
        editingId={editingId}
        editingData={editingData}
        setEditingData={setEditingData}
        saveEdit={saveEdit}
        cancelEdit={cancelEdit}
        theme={theme}
      />

      <Footer theme={theme} />
    </div>
  )
}