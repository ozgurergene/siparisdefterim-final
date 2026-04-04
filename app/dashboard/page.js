'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import { calculateGrandTotal, calculateLineTotal, parseProducts } from '../../lib/calculations'
import Header from '../../components/Header'
import OrderForm from '../../components/OrderForm'
import OrderTable from '../../components/OrderTable'
import SearchBox from '../../components/SearchBox'
import EditModal from '../../components/EditModal'
import Footer from '../../components/Footer'

const UpgradeModal = dynamic(() => import('./UpgradeModal'), { ssr: false })

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [theme, setTheme] = useState('light')
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [editingData, setEditingData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    products: [],
    note: '',
    status: 'payment_pending'
  })
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    products: [{ product: '', quantity: 1, unit_price: '', kdv_rate: 0 }],
    note: ''
  })

  const c = colors[theme]

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  // Check user on load
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

  // Real-time filter - exclude completed orders
  useEffect(() => {
    let filtered = orders.filter(order => order.status !== 'completed')
    
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
        setOrdersCreatedCount(0)
      } else {
        setOrdersCreatedCount(userData?.orders_created_count || 0)
      }

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      setOrders(ordersData || [])
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

  const handleAddOrder = async (e) => {
    e.preventDefault()
    
    if (ordersCreatedCount >= 50) {
      setShowUpgradeModal(true)
      return
    }

    if (!newOrder.customer_name || !newOrder.customer_phone || !newOrder.customer_address) {
      alert('Müşteri adı, telefon ve adres zorunlu!')
      return
    }

    if (!/^\d{10}$/.test(newOrder.customer_phone)) {
      alert('Telefon numarası 10 haneli olmalı (örn: 5551234567)')
      return
    }

    if (newOrder.products.some(p => !p.product || !p.unit_price)) {
      alert('Tüm ürünlerin adı ve fiyatı zorunlu!')
      return
    }

    try {
      const totalPrice = parseFloat(calculateGrandTotal(newOrder.products))
      const productList = newOrder.products.map(p => `${p.product} x${p.quantity} (₺${calculateLineTotal(p)})`).join(', ')
      const productsJson = JSON.stringify(newOrder.products)

      const { error } = await supabase.from('orders').insert([{
        user_id: user.id,
        customer_name: newOrder.customer_name,
        customer_phone: newOrder.customer_phone,
        product: productList,
        products_json: productsJson,
        price: totalPrice,
        status: 'payment_pending',
        note: newOrder.note,
      }])

      if (error) throw error

      await supabase
        .from('users')
        .update({ orders_created_count: ordersCreatedCount + 1 })
        .eq('id', user.id)

      setNewOrder({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        products: [{ product: '', quantity: 1, unit_price: '', kdv_rate: 0 }],
        note: ''
      })
      await fetchUserData(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  const startEditing = (order) => {
    const products = parseProducts(order)
    setEditingId(order.id)
    setEditingData({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address || '',
      products: products,
      note: order.note,
      status: order.status
    })
  }

  const saveEdit = async () => {
    try {
      const totalPrice = parseFloat(calculateGrandTotal(editingData.products))
      const productList = editingData.products.map(p => `${p.product} x${p.quantity} (₺${calculateLineTotal(p)})`).join(', ')
      const productsJson = JSON.stringify(editingData.products)

      const { error } = await supabase
        .from('orders')
        .update({
          customer_name: editingData.customer_name,
          customer_phone: editingData.customer_phone,
          product: productList,
          products_json: productsJson,
          price: totalPrice,
          note: editingData.note,
          status: editingData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId)

      if (error) throw error
      
      setEditingId(null)
      setEditingData({})
      await fetchUserData(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingData({})
  }

  const deleteOrder = async (orderId) => {
    if (!confirm('Siparişi silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId)
      if (error) throw error
      await fetchUserData(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId)
      await fetchUserData(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  if (loading || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial', background: c.bg, color: c.text, minHeight: '100vh' }}>
        <h2>Yükleniyor...</h2>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'Arial', color: c.text, margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

      <Header
        user={user}
        ordersCreatedCount={ordersCreatedCount}
        theme={theme}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
      />

      <div style={{ flex: 1, width: '100%', padding: '20px' }}>
        {/* Limit Warning */}
        {ordersCreatedCount >= 50 && (
          <div style={{ background: theme === 'light' ? '#ffe0e0' : '#4a2626', border: '2px solid #ff6b6b', borderRadius: '8px', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#ff6b6b', fontWeight: 'bold' }}>
              ⚠️ 50 sipariş limitine ulaştınız! Daha fazla sipariş oluşturmak için Pro'ya yükseltin.
            </p>
          </div>
        )}

        <OrderForm
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          ordersCreatedCount={ordersCreatedCount}
          handleAddOrder={handleAddOrder}
          theme={theme}
        />

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