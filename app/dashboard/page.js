'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import { calculateGrandTotal } from '../../lib/calculations'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OrderForm from '../../components/OrderForm'
import OrderTable from '../../components/OrderTable'
import SearchBox from '../../components/SearchBox'
import EditModal from '../../components/EditModal'
import { StatsCardsSkeleton, SearchBoxSkeleton, TableSkeleton } from '../../components/Loading'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [theme, setTheme] = useState('light')
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  
  // Search states
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // New order state with İl/İlçe
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
      // Check if user exists in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (userError && userError.code === 'PGRST116') {
        await supabase.from('users').insert([{ id: userId, orders_created_count: 0 }])
      }

      // Fetch orders and use actual count
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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('siparisdefterim-theme', newTheme)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Add new order
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

    // Update orders_created_count
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

  // Delete order
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

  // Update order status
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

  // Start editing
  const startEditing = (order) => {
    // Parse existing product string to products array
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

  // Save edit
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

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null)
    setEditingData(null)
  }

  // Calculate stats
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ width: 180, height: 28, background: c.bgSecondary, borderRadius: 4 }} />
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ width: 100, height: 36, background: c.bgSecondary, borderRadius: 6 }} />
              <div style={{ width: 120, height: 36, background: c.bgSecondary, borderRadius: 6 }} />
            </div>
          </div>
        </div>
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
          <StatsCardsSkeleton theme={theme} />
          <SearchBoxSkeleton theme={theme} />
          <TableSkeleton rows={5} theme={theme} />
        </div>
      </div>
    )
  }

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
        padding: '20px', 
        boxSizing: 'border-box',
        maxWidth: '1400px',
        margin: '0 auto'
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