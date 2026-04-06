'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, metricGradients, glowEffects, keyframesCSS } from '../../lib/theme'
import { calculateOrderTotals } from '../../lib/calculations'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OrderForm from '../../components/OrderForm'
import OrderTable from '../../components/OrderTable'
import SearchBox from '../../components/SearchBox'
import EditModal from '../../components/EditModal'
import { DashboardSkeleton } from '../../components/Loading'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [editingOrder, setEditingOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  const c = colors[theme]

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.replace('/login')
      return
    }
    setUser(session.user)
    await fetchOrders(session.user.id)
    setLoading(false)
  }

  const fetchOrders = async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'completed')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrders(data)
    }
  }

  const filterOrders = () => {
    let result = [...orders]
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter)
    }
    
    // Search filter
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

  const getStatusCounts = () => {
    return {
      payment_pending: orders.filter(o => o.status === 'payment_pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
    }
  }

  const handleSubmit = async (formData) => {
    // Calculate product totals
    const products = formData.products.map(p => {
      const quantity = parseInt(p.quantity) || 0
      const unitPrice = parseFloat(p.unit_price) || 0
      const kdvRate = parseFloat(p.kdv_rate) || 0
      const subtotal = quantity * unitPrice
      const kdvAmount = subtotal * (kdvRate / 100)
      const total = subtotal + kdvAmount
      
      return {
        ...p,
        quantity,
        unit_price: unitPrice,
        kdv_rate: kdvRate,
        subtotal,
        kdv_amount: kdvAmount,
        total
      }
    })

    const totals = calculateOrderTotals(products)

    const orderData = {
      user_id: user.id,
      customer_name: formData.customer_name,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      products,
      total_amount: totals.total,
      status: 'payment_pending'
    }

    const { error } = await supabase.from('orders').insert([orderData])
    
    if (!error) {
      await fetchOrders(user.id)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      if (newStatus === 'completed') {
        setOrders(orders.filter(o => o.id !== orderId))
      } else {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      }
    }
  }

  const handleDelete = async (orderId) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (!error) {
      setOrders(orders.filter(o => o.id !== orderId))
    }
  }

  const handleEdit = (order) => {
    setEditingOrder(order)
  }

  const handleSaveEdit = async (orderId, formData) => {
    const products = formData.products.map(p => {
      const quantity = parseInt(p.quantity) || 0
      const unitPrice = parseFloat(p.unit_price) || 0
      const kdvRate = parseFloat(p.kdv_rate) || 0
      const subtotal = quantity * unitPrice
      const kdvAmount = subtotal * (kdvRate / 100)
      const total = subtotal + kdvAmount
      
      return {
        ...p,
        quantity,
        unit_price: unitPrice,
        kdv_rate: kdvRate,
        subtotal,
        kdv_amount: kdvAmount,
        total
      }
    })

    const totals = calculateOrderTotals(products)

    const { error } = await supabase
      .from('orders')
      .update({
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        products,
        total_amount: totals.total
      })
      .eq('id', orderId)

    if (!error) {
      await fetchOrders(user.id)
      setEditingOrder(null)
    }
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

  // Stats for metric cards
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'payment_pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    shipped: orders.filter(o => o.status === 'shipped' || o.status === 'preparing').length,
  }

  const metricCards = [
    { label: 'Toplam Sipariş', value: stats.total, icon: '📦', gradient: metricGradients.active },
    { label: 'Ödeme Bekleyen', value: stats.pending, icon: '💰', gradient: metricGradients.pending },
    { label: 'Ödeme Alındı', value: stats.paid, icon: '✅', gradient: metricGradients.today },
    { label: 'Kargo Sürecinde', value: stats.shipped, icon: '🚚', gradient: metricGradients.shipped },
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
        orderCount={orders.length}
        maxOrders={50}
        theme={theme} 
        setTheme={setTheme} 
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: '24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          
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
                      {card.value}
                    </p>
                  </div>
                  <span style={{ fontSize: 24 }}>{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 24 }}>
            
            {/* Order Form */}
            <div>
              <OrderForm onSubmit={handleSubmit} theme={theme} />
            </div>

            {/* Orders List */}
            <div>
              <SearchBox
                onSearch={setSearchTerm}
                onStatusFilter={setStatusFilter}
                activeStatus={statusFilter}
                statusCounts={getStatusCounts()}
                resultCount={filteredOrders.length}
                theme={theme}
              />
              
              <OrderTable
                orders={filteredOrders}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={handleEdit}
                theme={theme}
              />
            </div>
          </div>

        </div>
      </main>

      <Footer theme={theme} />

      {/* Edit Modal */}
      {editingOrder && (
        <EditModal
          order={editingOrder}
          onSave={handleSaveEdit}
          onClose={() => setEditingOrder(null)}
          theme={theme}
        />
      )}

      <style jsx global>{`
        ${keyframesCSS}
      `}</style>
    </div>
  )
}