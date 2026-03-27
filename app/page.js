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
  const [showAddOrder, setShowAddOrder] = useState(false)
  const [theme, setTheme] = useState('light')
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    customer_phone: '',
    product: '',
    price: '',
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
      bg: '#0f1419',
      bgSecondary: '#1a1f2e',
      text: '#e4e4e7',
      textSecondary: '#9ca3af',
      border: '#2d3748',
      header: '#131820',
      input: '#1a1f2e',
      inputBorder: '#2d3748',
      hover: '#1f2937',
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
  }, [supabase])

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
    } finally {
      setLoading(false)
    }
  }

  // Add order
  const handleAddOrder = async (e) => {
    e.preventDefault()
    
    if (ordersCreatedCount >= 50) {
      alert('50 sipariş limitine ulaştınız! Pro plana yükseltin.')
      return
    }

    if (!newOrder.customer_name || !newOrder.customer_phone || !newOrder.product || !newOrder.price) {
      alert('Müşteri adı, telefon, ürün ve fiyat zorunlu!')
      return
    }

    if (!/^\d{10}$/.test(newOrder.customer_phone)) {
      alert('Telefon numarası 10 haneli olmalı (örn: 5551234567)')
      return
    }

    try {
      const { error } = await supabase.from('orders').insert([
        {
          user_id: user.id,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          product: newOrder.product,
          price: parseFloat(newOrder.price),
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

      setNewOrder({ customer_name: '', customer_phone: '', product: '', price: '', note: '' })
      setShowAddOrder(false)
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
    setShowAddOrder(false)
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

  const statusLabels = {
    payment_pending: '💰 Ödeme',
    paid: '✅ Ödendi',
    preparing: '📦 Hazırlaniyor',
    shipped: '🚚 Kargoya',
    completed: '🎉 Tamamlandı',
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'Arial', color: c.text, transition: 'background 0.3s', margin: 0, padding: 0 }}>
      {/* Header */}
      <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>📱 SiparişDefterim</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: c.textSecondary }}>Siparişler: {ordersCreatedCount}/50</p>
              <div style={{ width: '150px', height: '8px', background: c.bgSecondary, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(ordersCreatedCount / 50) * 100}%`, height: '100%', background: ordersCreatedCount >= 50 ? '#ff6b6b' : '#007bff', transition: 'width 0.3s' }} />
              </div>
            </div>
            <span style={{ color: c.textSecondary, fontSize: '14px' }}>{user.email}</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: '150px 120px 1fr 80px 100px', gap: '10px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı</label>
              <input
                type="text"
                placeholder="Adı"
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
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Ürün</label>
              <input
                type="text"
                placeholder="Ürün adı"
                value={newOrder.product}
                onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
                style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Fiyat</label>
              <input
                type="number"
                placeholder="0"
                value={newOrder.price}
                onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
                style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text }}
              />
            </div>
            <button
              onClick={handleAddOrder}
              disabled={ordersCreatedCount >= 50}
              style={{
                padding: '8px 15px',
                background: ordersCreatedCount >= 50 ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: ordersCreatedCount >= 50 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              ➕ Ekle
            </button>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Not (Opsiyonel)</label>
            <input
              type="text"
              placeholder="Özel talep, açıklama..."
              value={newOrder.note}
              onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })}
              style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text }}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ background: c.header, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${c.border}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Müşteri</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Telefon</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Ürün</th>
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
                        href={`https://wa.me/90${order.customer_phone}?text=Merhaba! "${order.customer_name}" için sipariş oluşturdunuz. Ürün: ${order.product}, Fiyat: ₺${order.price}. Lütfen ödeme yapınız.`}
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