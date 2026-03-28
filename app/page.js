'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orders, setOrders] = useState([])
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [theme, setTheme] = useState('light')
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    customer_phone: '',
    products: [{ product: '', quantity: 1, unit_price: '', kdv_rate: 18 }],
    note: ''
  })

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  // Theme colors
  const colors = {
    light: {
      bg: '#ffffff',
      bgSecondary: '#f5f7fa',
      text: '#1a1a1a',
      textSecondary: '#666666',
      border: '#e0e4e8',
      header: '#ffffff',
      input: '#ffffff',
      inputBorder: '#d0d5db',
      hover: '#f9fafb',
    },
    dark: {
      bg: '#1a1a1a',
      bgSecondary: '#2d2d2d',
      text: '#e0e0e0',
      textSecondary: '#b0b0b0',
      border: '#3a3a3a',
      header: '#252525',
      input: '#2d2d2d',
      inputBorder: '#3a3a3a',
      hover: '#333333',
    }
  }

  const c = colors[theme]

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  // Check user on load
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) {
        setUser(data.session.user)
        await fetchUserData(data.session.user.id)
      }
      setLoading(false)
    }
    checkUser()
  }, [])

  // Fetch user data and orders
  const fetchUserData = async (userId) => {
    const { data: userData } = await supabase
      .from('users')
      .select('orders_created_count')
      .eq('id', userId)
      .single()
    
    setOrdersCreatedCount(userData?.orders_created_count || 0)

    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setOrders(ordersData || [])
  }

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('siparisdefterim-theme', newTheme)
  }

  // Handle auth
  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw new Error(error.message)
        
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw new Error(error.message)
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.')
        setIsLogin(true)
      }
      setEmail('')
      setPassword('')
    } catch (error) {
      alert('Hata: ' + error.message)
      setLoading(false)
    }
  }

  // Calculate KDV amount
  const calculateKDV = (product) => {
    const quantity = parseInt(product.quantity) || 1
    const unitPrice = parseFloat(product.unit_price) || 0
    const subtotal = quantity * unitPrice
    const kdvAmount = (subtotal * product.kdv_rate) / 100
    return kdvAmount.toFixed(2)
  }

  // Calculate line total with KDV
  const calculateLineTotal = (product) => {
    const quantity = parseInt(product.quantity) || 1
    const unitPrice = parseFloat(product.unit_price) || 0
    const subtotal = quantity * unitPrice
    const kdvAmount = parseFloat(calculateKDV(product))
    return (subtotal + kdvAmount).toFixed(2)
  }

  // Calculate grand total
  const calculateGrandTotal = () => {
    return newOrder.products.reduce((sum, product) => {
      return sum + parseFloat(calculateLineTotal(product))
    }, 0).toFixed(2)
  }

  // Add product line
  const addProductLine = () => {
    setNewOrder({
      ...newOrder,
      products: [...newOrder.products, { product: '', quantity: 1, unit_price: '', kdv_rate: 18 }]
    })
  }

  // Update product line
  const updateProductLine = (index, field, value) => {
    const updatedProducts = [...newOrder.products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setNewOrder({ ...newOrder, products: updatedProducts })
  }

  // Remove product line
  const removeProductLine = (index) => {
    const updatedProducts = newOrder.products.filter((_, i) => i !== index)
    setNewOrder({ ...newOrder, products: updatedProducts })
  }

  // Add order
  const handleAddOrder = async (e) => {
    e.preventDefault()
    
    if (ordersCreatedCount >= 50) {
      alert('50 sipariş limitine ulaştınız! Pro plana yükseltin.')
      return
    }

    if (!newOrder.customer_name || !newOrder.customer_phone) {
      alert('Müşteri adı ve telefon zorunlu!')
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
      const totalPrice = parseFloat(calculateGrandTotal())
      const productList = newOrder.products.map(p => `${p.product} x${p.quantity} (₺${calculateLineTotal(p)})`).join(', ')

      const { error } = await supabase.from('orders').insert([
        {
          user_id: user.id,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          product: productList,
          price: totalPrice,
          status: 'payment_pending',
          note: newOrder.note,
        },
      ])

      if (error) throw error

      const { error: updateError } = await supabase
        .from('users')
        .update({ orders_created_count: ordersCreatedCount + 1 })
        .eq('id', user.id)

      if (updateError) throw updateError

      setNewOrder({
        customer_name: '',
        customer_phone: '',
        products: [{ product: '', quantity: 1, unit_price: '', kdv_rate: 18 }],
        note: ''
      })
      await fetchUserData(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      await fetchUserData(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!confirm('Siparişi silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

      if (error) throw error
      await fetchUserData(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setOrders([])
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial', background: c.bg, color: c.text, minHeight: '100vh', margin: 0 }}>
        <h2>Yükleniyor...</h2>
      </div>
    )
  }

  // LOGIN PAGE
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial', padding: '20px', margin: 0 }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '40px', border: `1px solid ${c.border}`, borderRadius: '12px', background: c.header, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <button
              onClick={toggleTheme}
              style={{
                padding: '8px 12px',
                background: c.bgSecondary,
                border: `1px solid ${c.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {theme === 'light' ? '☀️' : '🌙'}
            </button>
          </div>

          <h1 style={{ textAlign: 'center', color: c.text, marginBottom: '10px' }}>📱 SiparişDefterim</h1>
          <p style={{ textAlign: 'center', color: c.textSecondary, marginBottom: '30px' }}>Instagram siparişlerini yönet</p>

          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${c.inputBorder}`,
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  background: c.input,
                  color: c.text,
                  fontFamily: 'Arial',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${c.inputBorder}`,
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  background: c.input,
                  color: c.text,
                  fontFamily: 'Arial',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '10px',
              background: 'transparent',
              border: `1px solid ${c.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#007bff',
              fontWeight: 'bold',
            }}
          >
            {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </div>
      </div>
    )
  }

  // DASHBOARD PAGE
  const statusColors = {
    payment_pending: '#ff6b6b',
    paid: '#ffd93d',
    preparing: '#6bcf7f',
    shipped: '#4d96ff',
    completed: '#95e1d3',
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'Arial', color: c.text, transition: 'background 0.3s', margin: 0, padding: 0 }}>
      {/* Header */}
      <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', minWidth: '150px' }}>📱 SiparişDefterim</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: c.textSecondary }}>Siparişler: {ordersCreatedCount}/50</p>
              <div style={{ width: '150px', height: '8px', background: c.bgSecondary, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(ordersCreatedCount / 50) * 100}%`, height: '100%', background: ordersCreatedCount >= 50 ? '#ff6b6b' : '#007bff', transition: 'width 0.3s' }} />
              </div>
            </div>
            <span style={{ color: c.textSecondary, fontSize: '14px', minWidth: '120px' }}>{user.email}</span>
            <button
              onClick={toggleTheme}
              style={{
                padding: '8px 12px',
                background: c.bgSecondary,
                border: `1px solid ${c.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
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
              }}
            >
              Çıkış
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Limit Warning */}
        {ordersCreatedCount >= 50 && (
          <div style={{ background: theme === 'light' ? '#ffe0e0' : '#4a2626', border: '2px solid #ff6b6b', borderRadius: '8px', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#ff6b6b', fontWeight: 'bold' }}>
              ⚠️ 50 sipariş limitine ulaştınız! Daha fazla sipariş oluşturmak için Pro'ya yükseltin.
            </p>
          </div>
        )}

        {/* Add Order Form */}
        <div style={{ background: c.header, padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}` }}>
          <h3 style={{ margin: '0 0 15px 0', color: c.text, fontSize: '16px', fontWeight: 'bold' }}>📋 Sipariş Oluştur</h3>
          
          {/* Customer Info - Fixed */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı Soyadı</label>
              <input
                type="text"
                placeholder="Adı Soyadı"
                value={newOrder.customer_name}
                onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
              <input
                type="text"
                placeholder="5551234567"
                value={newOrder.customer_phone}
                onChange={(e) => setNewOrder({ ...newOrder, customer_phone: e.target.value.replace(/\D/g, '') })}
                maxLength="10"
                style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text }}
              />
            </div>
          </div>

          {/* Product Lines */}
          <div style={{ marginBottom: '15px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1fr 0.8fr 1fr 1fr auto', gap: '8px', marginBottom: '10px', fontSize: '11px', fontWeight: 'bold', color: c.textSecondary, minWidth: '900px' }}>
              <div>Ürün</div>
              <div style={{ textAlign: 'center' }}>Adet</div>
              <div style={{ textAlign: 'center' }}>Birim Fiyat</div>
              <div style={{ textAlign: 'center' }}>KDV %</div>
              <div style={{ textAlign: 'center' }}>KDV Tutar</div>
              <div style={{ textAlign: 'center' }}>Toplam</div>
              <div></div>
            </div>

            {newOrder.products.map((product, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1fr 0.8fr 1fr 1fr auto', gap: '8px', marginBottom: '10px', alignItems: 'end', minWidth: '900px' }}>
                <input
                  type="text"
                  placeholder="Ürün adı"
                  value={product.product}
                  onChange={(e) => updateProductLine(index, 'product', e.target.value)}
                  style={{ padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text }}
                />
                <input
                  type="number"
                  placeholder="1"
                  min="1"
                  value={product.quantity}
                  onChange={(e) => updateProductLine(index, 'quantity', e.target.value)}
                  style={{ padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }}
                />
                <input
                  type="number"
                  placeholder="0"
                  value={product.unit_price}
                  onChange={(e) => updateProductLine(index, 'unit_price', e.target.value)}
                  style={{ padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }}
                />
                <select
                  value={product.kdv_rate}
                  onChange={(e) => updateProductLine(index, 'kdv_rate', parseFloat(e.target.value))}
                  style={{ padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }}
                >
                  <option value={0}>%0</option>
                  <option value={8}>%8</option>
                  <option value={18}>%18</option>
                </select>
                <div style={{ padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', background: c.bgSecondary, color: c.text, fontWeight: 'bold', textAlign: 'center' }}>
                  ₺{calculateKDV(product)}
                </div>
                <div style={{ padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', background: c.bgSecondary, color: c.text, fontWeight: 'bold', textAlign: 'center' }}>
                  ₺{calculateLineTotal(product)}
                </div>
                <button
                  type="button"
                  onClick={() => removeProductLine(index)}
                  disabled={newOrder.products.length === 1}
                  style={{
                    padding: '6px 8px',
                    background: newOrder.products.length === 1 ? '#ccc' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: newOrder.products.length === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Add Product Line Button */}
          <button
            type="button"
            onClick={addProductLine}
            style={{
              padding: '6px 10px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
              marginBottom: '15px',
            }}
          >
            ➕
          </button>

          {/* Grand Total */}
          <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', color: c.text }}>
              <span>GENEL TOPLAM:</span>
              <span style={{ fontSize: '16px', color: '#007bff' }}>₺{calculateGrandTotal()}</span>
            </div>
          </div>

          {/* Note */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Not (Opsiyonel)</label>
            <input
              type="text"
              placeholder="Özel talep, açıklama..."
              value={newOrder.note}
              onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })}
              style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text }}
            />
          </div>

          {/* Create Order Button */}
          <button
            onClick={handleAddOrder}
            disabled={ordersCreatedCount >= 50}
            style={{
              width: '100%',
              padding: '12px',
              background: ordersCreatedCount >= 50 ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: ordersCreatedCount >= 50 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Onayla
          </button>
        </div>

        {/* Orders Table */}
        <div style={{ background: c.header, borderRadius: '8px', overflow: 'auto', border: `1px solid ${c.border}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Müşteri</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Telefon</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Ürünler</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '60px', color: c.text }}>Fiyat</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '90px', color: c.text }}>Durum</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>WhatsApp</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', width: '50px', color: c.text }}>Sil</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, color: c.text }}>{order.customer_name}</td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, fontSize: '12px', color: c.textSecondary }}>📱 {order.customer_phone}</td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, color: c.text }}>
                    {order.product}
                    {order.note && <div style={{ fontSize: '11px', color: c.textSecondary, marginTop: '3px' }}>Not: {order.note}</div>}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}`, fontWeight: 'bold', color: c.text }}>₺{order.price}</td>
                  <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}` }}>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        padding: '4px 6px',
                        border: `2px solid ${statusColors[order.status]}`,
                        background: statusColors[order.status],
                        color: order.status === 'paid' || order.status === 'completed' ? '#333' : 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '11px',
                      }}
                    >
                      <option value="payment_pending">💰 Ödeme</option>
                      <option value="paid">✅ Ödendi</option>
                      <option value="preparing">📦 Hazır.</option>
                      <option value="shipped">🚚 Kargo</option>
                      <option value="completed">🎉 Tamamlandı</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}` }}>
                    {order.customer_phone && (
                      <a
                        href={`https://wa.me/90${order.customer_phone}?text=Merhaba! "${order.customer_name}" için sipariş oluşturdunuz. Ürünler: ${order.product}, Toplam: ₺${order.price}. Lütfen ödeme yapınız.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          background: '#25d366',
                          color: 'white',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          fontSize: '11px',
                        }}
                      >
                        💬 WhatsApp
                      </a>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      style={{
                        padding: '6px 10px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '11px',
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div style={{ textAlign: 'center', color: c.textSecondary, padding: '50px', background: c.header, borderRadius: '8px', marginTop: '20px', border: `1px solid ${c.border}` }}>
            <p>📭 Henüz sipariş yok.</p>
            <p>Yukarıdaki formu kullanarak ilk siparişinizi ekleyin!</p>
          </div>
        )}
      </div>
    </div>
  )
}