'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [showAddOrder, setShowAddOrder] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    product: '',
    price: '',
    phone: '',
    note: ''
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession()
    if (data?.session?.user) {
      setUser(data.session.user)
      await fetchOrders(data.session.user.id)
    } else {
      setLoading(false)
    }
  }

  const fetchOrders = async (userId) => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    setOrders(data || [])
    setLoading(false)
  }

  const handleAddOrder = async (e) => {
    e.preventDefault()
    if (!newOrder.customer_name || !newOrder.product || !newOrder.price) {
      alert('Müşteri adı, ürün ve fiyat zorunlu!')
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
      setNewOrder({ customer_name: '', product: '', price: '', phone: '', note: '' })
      setShowAddOrder(false)
      await fetchOrders(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    try {
      await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date() })
        .eq('id', orderId)
      
      await fetchOrders(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  const deleteOrder = async (orderId) => {
    if (!confirm('Siparişi silmek istediğinize emin misiniz?')) return
    
    try {
      await supabase.from('orders').delete().eq('id', orderId)
      await fetchOrders(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  // Filter ve search
  const filteredOrders = orders.filter(order => {
    const matchSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = filterStatus === 'all' || order.status === filterStatus
    return matchSearch && matchFilter
  })

  // Hesaplamalar
  const totalOrders = orders.length
  const paidOrders = orders.filter(o => o.status !== 'payment_pending').length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0)
  const todayOrders = orders.filter(o => {
    const today = new Date().toDateString()
    return new Date(o.created_at).toDateString() === today
  }).length

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

  const statusSteps = ['payment_pending', 'paid', 'preparing', 'shipped', 'completed']

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>Yükleniyor...</div>
  }

  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', fontFamily: 'Arial', textAlign: 'center' }}>
        <h1>📱 SiparişDefterim</h1>
        <p>Giriş yapmanız gerekiyor.</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Sayfayı Yenile
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', fontFamily: 'Arial', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0 }}>📱 SiparişDefterim</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: '#666' }}>{user.email}</span>
          <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Çıkış
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Toplam Siparişler</h3>
          <h2 style={{ margin: 0, color: '#007bff', fontSize: '32px' }}>{totalOrders}</h2>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Bugün Sipariş</h3>
          <h2 style={{ margin: 0, color: '#6bcf7f', fontSize: '32px' }}>{todayOrders}</h2>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Ödeme Alınan</h3>
          <h2 style={{ margin: 0, color: '#ffd93d', fontSize: '32px' }}>{paidOrders}</h2>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Toplam Gelir</h3>
          <h2 style={{ margin: 0, color: '#28a745', fontSize: '32px' }}>₺{totalRevenue.toFixed(0)}</h2>
        </div>
      </div>

      {/* ADD ORDER BUTTON */}
      {!showAddOrder && (
        <button onClick={() => setShowAddOrder(true)} style={{ padding: '12px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}>
          ➕ Yeni Sipariş
        </button>
      )}

      {/* ADD ORDER FORM */}
      {showAddOrder && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>Yeni Sipariş Ekle</h3>
          <form onSubmit={handleAddOrder}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <input type="text" placeholder="Müşteri Adı *" value={newOrder.customer_name} onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'Arial' }} required />
              <input type="text" placeholder="Ürün *" value={newOrder.product} onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'Arial' }} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <input type="number" placeholder="Fiyat (TL) *" value={newOrder.price} onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'Arial' }} required />
              <input type="tel" placeholder="Telefon (opsiyonel)" value={newOrder.phone} onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'Arial' }} />
            </div>
            <textarea placeholder="Not (opsiyonel)" value={newOrder.note} onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'Arial', width: '100%', minHeight: '80px', marginBottom: '15px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Kaydet
              </button>
              <button type="button" onClick={() => setShowAddOrder(false)} style={{ flex: 1, padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH & FILTER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '15px', marginBottom: '20px' }}>
        <input type="text" placeholder="🔍 Müşteri adı ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'Arial' }} />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'Arial' }}>
          <option value="all">Tüm Durumlar</option>
          <option value="payment_pending">💰 Ödeme Bekleniyor</option>
          <option value="paid">✅ Ödeme Alındı</option>
          <option value="preparing">📦 Hazırlanıyor</option>
          <option value="shipped">🚚 Kargoya Verildi</option>
          <option value="completed">🎉 Tamamlandı</option>
        </select>
      </div>

      {/* ORDERS LIST */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredOrders.map((order) => (
          <div key={order.id} style={{ background: 'white', border: `3px solid ${statusColors[order.status]}`, borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {/* Customer & Product */}
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{order.customer_name}</h3>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Ürün:</strong> {order.product}
            </p>
            <p style={{ margin: '5px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              ₺{order.price}
            </p>
            {order.note && (
              <p style={{ margin: '5px 0', color: '#999', fontSize: '12px' }}>
                <strong>Not:</strong> {order.note}
              </p>
            )}

            {/* Status Badge */}
            <div style={{ margin: '15px 0', padding: '10px', background: statusColors[order.status], color: order.status === 'paid' || order.status === 'completed' ? '#333' : 'white', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }}>
              {statusLabels[order.status]}
            </div>

            {/* Status Progress */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
              {statusSteps.map((step) => (
                <div key={step} style={{ flex: 1, height: '8px', background: statusSteps.indexOf(step) <= statusSteps.indexOf(order.status) ? statusColors[step] : '#e0e0e0', borderRadius: '4px' }} />
              ))}
            </div>

            {/* Status Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <button onClick={() => updateStatus(order.id, 'payment_pending')} style={{ padding: '8px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                💰 Ödeme Bekle
              </button>
              <button onClick={() => updateStatus(order.id, 'paid')} style={{ padding: '8px', background: '#ffd93d', color: '#333', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                ✅ Ödendi
              </button>
              <button onClick={() => updateStatus(order.id, 'preparing')} style={{ padding: '8px', background: '#6bcf7f', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                📦 Hazırlanıyor
              </button>
              <button onClick={() => updateStatus(order.id, 'shipped')} style={{ padding: '8px', background: '#4d96ff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                🚚 Kargoya Verildi
              </button>
              <button onClick={() => updateStatus(order.id, 'completed')} style={{ padding: '8px', background: '#95e1d3', color: '#333', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                🎉 Tamamlandı
              </button>
              <button onClick={() => deleteOrder(order.id)} style={{ padding: '8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                🗑️ Sil
              </button>
            </div>

            {/* WhatsApp Button */}
            <a href={`https://wa.me/90${order.phone?.replace(/\D/g, '')}?text=Merhaba ${order.customer_name}! Siparişiniz için: ${order.product} - ₺${order.price}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#25d366', color: 'white', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', marginTop: '10px' }}>
              💬 WhatsApp
            </a>

            {/* Created Date */}
            <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '11px', textAlign: 'right' }}>
              {new Date(order.created_at).toLocaleDateString('tr-TR')}
            </p>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div style={{ textAlign: 'center', color: '#999', padding: '50px', background: 'white', borderRadius: '10px' }}>
          <p style={{ fontSize: '18px' }}>📭 Sipariş bulunamadı.</p>
          <p>"Yeni Sipariş" butonuna tıklayarak başlayın!</p>
        </div>
      )}
    </div>
  )
}