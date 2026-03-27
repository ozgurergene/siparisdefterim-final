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
  const [showAddOrder, setShowAddOrder] = useState(false)
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    product: '',
    price: '',
    note: ''
  })

  const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})

  // Check user on load
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) {
        setUser(data.session.user)
        await fetchOrders(data.session.user.id)
      }
      setLoading(false)
    }
    checkUser()
  }, [supabase])

  // Fetch orders
  const fetchOrders = async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error) {
      setOrders(data || [])
    }
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
    if (!newOrder.customer_name || !newOrder.product || !newOrder.price) {
      alert('Tüm alanları doldurunuz!')
      return
    }

    try {
      const { error } = await supabase.from('orders').insert([
        {
          user_id: user.id,
          customer_name: newOrder.customer_name,
          product: newOrder.product,
          price: parseFloat(newOrder.price),
          status: 'payment_pending',
          note: newOrder.note,
        },
      ])

      if (error) throw error
      setNewOrder({ customer_name: '', product: '', price: '', note: '' })
      setShowAddOrder(false)
      await fetchOrders(user.id)
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
      await fetchOrders(user.id)
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
      await fetchOrders(user.id)
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
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
        <h2>Yükleniyor...</h2>
      </div>
    )
  }

  // LOGIN PAGE
  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', fontFamily: 'Arial' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>📱 SiparişDefterim</h1>
        <p style={{ textAlign: 'center', color: '#666' }}>Instagram siparişlerini yönet</p>

        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box',
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
              borderRadius: '5px',
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
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#007bff',
            fontWeight: 'bold',
          }}
        >
          {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
        </button>
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
    payment_pending: '💰 Ödeme Bekleniyor',
    paid: '✅ Ödeme Alındı',
    preparing: '📦 Hazırlanıyor',
    shipped: '🚚 Kargoya Verildi',
    completed: '🎉 Tamamlandı',
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>📱 SiparişDefterim</h1>
        <div>
          <span style={{ marginRight: '20px', color: '#666' }}>{user.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 15px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Çıkış
          </button>
        </div>
      </div>

      {/* Add Order Button */}
      {!showAddOrder && (
        <button
          onClick={() => setShowAddOrder(true)}
          style={{
            padding: '12px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '30px',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          ➕ Yeni Sipariş
        </button>
      )}

      {/* Add Order Form */}
      {showAddOrder && (
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
          <h3>Yeni Sipariş Ekle</h3>
          <form onSubmit={handleAddOrder}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Müşteri Adı"
                value={newOrder.customer_name}
                onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <input
                type="text"
                placeholder="Ürün"
                value={newOrder.product}
                onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <input
                type="number"
                placeholder="Fiyat (TL)"
                value={newOrder.price}
                onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <input
                type="text"
                placeholder="Not (opsiyonel)"
                value={newOrder.note}
                onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setShowAddOrder(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Orders Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: `2px solid ${statusColors[order.status]}`,
              borderRadius: '10px',
              padding: '20px',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{order.customer_name}</h3>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Ürün:</strong> {order.product}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Fiyat:</strong> ₺{order.price}
            </p>
            {order.note && (
              <p style={{ margin: '5px 0', color: '#666' }}>
                <strong>Not:</strong> {order.note}
              </p>
            )}

            {/* Status */}
            <div style={{ margin: '15px 0' }}>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>Durum:</p>
              <p
                style={{
                  display: 'inline-block',
                  background: statusColors[order.status],
                  color: order.status === 'paid' ? '#333' : 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  margin: 0,
                  fontWeight: 'bold',
                }}
              >
                {statusLabels[order.status]}
              </p>
            </div>

            {/* Status Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <button
                onClick={() => updateOrderStatus(order.id, 'payment_pending')}
                style={{
                  padding: '8px',
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Ödeme Bekle
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'paid')}
                style={{
                  padding: '8px',
                  background: '#ffd93d',
                  color: '#333',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Ödendi
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'preparing')}
                style={{
                  padding: '8px',
                  background: '#6bcf7f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Hazırlaniyor
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'shipped')}
                style={{
                  padding: '8px',
                  background: '#4d96ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Kargoya Verildi
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'completed')}
                style={{
                  padding: '8px',
                  background: '#95e1d3',
                  color: '#333',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Tamamlandı
              </button>
              <button
                onClick={() => deleteOrder(order.id)}
                style={{
                  padding: '8px',
                  background: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Sil
              </button>
            </div>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/905354640492?text=Merhaba! "${order.customer_name}" için sipariş oluşturdunuz. Ürün: ${order.product}, Fiyat: ₺${order.price}. Lütfen ödeme yapınız.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '10px',
                background: '#25d366',
                color: 'white',
                borderRadius: '5px',
                textDecoration: 'none',
                fontWeight: 'bold',
                marginTop: '10px',
              }}
            >
              💬 WhatsApp Mesajı Gönder
            </a>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div style={{ textAlign: 'center', color: '#999', padding: '50px' }}>
          <p>Henüz sipariş yok. "Yeni Sipariş" butonuna tıklayarak başlayın!</p>
        </div>
      )}
    </div>
  )
}