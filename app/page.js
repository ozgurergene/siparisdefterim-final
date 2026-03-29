'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [theme, setTheme] = useState('light')
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [editingId, setEditingId] = useState(null)
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

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

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

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        await fetchUserData(session.user.id)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

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
    setFilteredOrders(filtered)
  }, [searchName, searchPhone, orders])

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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('siparisdefterim-theme', newTheme)
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
    if (error) alert('Hata: ' + error.message)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResetMessage('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      })
      if (error) throw new Error(error.message)
      setResetMessage('Şifre sıfırlama bağlantısı email adresinize gönderildi. Lütfen kontrol edin.')
      setResetEmail('')
      setTimeout(() => {
        setIsForgotPassword(false)
        setResetMessage('')
      }, 3000)
    } catch (error) {
      setResetMessage('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw new Error(error.message)
        setTimeout(() => { window.location.reload() }, 1000)
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
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

  const calculateKDVAmount = (product) => {
    const quantity = parseInt(product.quantity) || 1
    const unitPrice = parseFloat(product.unit_price) || 0
    const subtotal = quantity * unitPrice
    const kdvRate = parseFloat(product.kdv_rate) || 0
    return ((subtotal * kdvRate) / 100).toFixed(2)
  }

  const calculateSubtotal = (product) => {
    const quantity = parseInt(product.quantity) || 1
    const unitPrice = parseFloat(product.unit_price) || 0
    return (quantity * unitPrice).toFixed(2)
  }

  const calculateLineTotal = (product) => {
    return (parseFloat(calculateSubtotal(product)) + parseFloat(calculateKDVAmount(product))).toFixed(2)
  }

  const calculateGrandTotal = () => {
    return newOrder.products.reduce((sum, product) => sum + parseFloat(calculateLineTotal(product)), 0).toFixed(2)
  }

  const calculateEditGrandTotal = () => {
    if (!editingData.products) return '0.00'
    return editingData.products.reduce((sum, product) => sum + parseFloat(calculateLineTotal(product)), 0).toFixed(2)
  }

  const calculateTotalKDV = () => {
    return newOrder.products.reduce((sum, product) => sum + parseFloat(calculateKDVAmount(product)), 0).toFixed(2)
  }

  const calculateEditTotalKDV = () => {
    if (!editingData.products) return '0.00'
    return editingData.products.reduce((sum, product) => sum + parseFloat(calculateKDVAmount(product)), 0).toFixed(2)
  }

  const addProductLine = () => {
    setNewOrder({ ...newOrder, products: [...newOrder.products, { product: '', quantity: 1, unit_price: '', kdv_rate: 0 }] })
  }

  const addProductLineEdit = () => {
    setEditingData({ ...editingData, products: [...editingData.products, { product: '', quantity: 1, unit_price: '', kdv_rate: 0 }] })
  }

  const updateProductLine = (index, field, value) => {
    const updatedProducts = [...newOrder.products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setNewOrder({ ...newOrder, products: updatedProducts })
  }

  const updateProductLineEdit = (index, field, value) => {
    const updatedProducts = [...editingData.products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setEditingData({ ...editingData, products: updatedProducts })
  }

  const removeProductLine = (index) => {
    setNewOrder({ ...newOrder, products: newOrder.products.filter((_, i) => i !== index) })
  }

  const removeProductLineEdit = (index) => {
    setEditingData({ ...editingData, products: editingData.products.filter((_, i) => i !== index) })
  }

  const parseProducts = (order) => {
    if (order.products_json) {
      try { return JSON.parse(order.products_json) } catch (e) {}
    }
    try {
      return order.product.split(', ').map(p => {
        const match = p.match(/^(.+?)\s+x(\d+)\s+\(₺([\d.]+)\)/)
        if (match) return { product: match[1], quantity: parseInt(match[2]), unit_price: (parseFloat(match[3]) / parseInt(match[2])).toFixed(2), kdv_rate: 0 }
        return { product: p, quantity: 1, unit_price: 0, kdv_rate: 0 }
      })
    } catch (e) {
      return [{ product: order.product, quantity: 1, unit_price: 0, kdv_rate: 0 }]
    }
  }

  const startEditing = (order) => {
    setEditingId(order.id)
    setEditingData({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address || '',
      products: parseProducts(order),
      note: order.note,
      status: order.status
    })
  }

  const saveEdit = async () => {
    try {
      const totalPrice = parseFloat(calculateEditGrandTotal())
      const productList = editingData.products.map(p => `${p.product} x${p.quantity} (₺${calculateLineTotal(p)})`).join(', ')
      const { error } = await supabase.from('orders').update({
        customer_name: editingData.customer_name,
        customer_phone: editingData.customer_phone,
        product: productList,
        products_json: JSON.stringify(editingData.products),
        price: totalPrice,
        note: editingData.note,
        status: editingData.status
      }).eq('id', editingId)
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

  const handleAddOrder = async (e) => {
    e.preventDefault()
    if (ordersCreatedCount >= 50) { alert('50 sipariş limitine ulaştınız! Pro plana yükseltin.'); return }
    if (!newOrder.customer_name || !newOrder.customer_phone || !newOrder.customer_address) { alert('Müşteri adı, telefon ve adres zorunlu!'); return }
    if (!/^\d{10}$/.test(newOrder.customer_phone)) { alert('Telefon numarası 10 haneli olmalı (örn: 5551234567)'); return }
    if (newOrder.products.some(p => !p.product || !p.unit_price)) { alert('Tüm ürünlerin adı ve fiyatı zorunlu!'); return }

    try {
      const totalPrice = parseFloat(calculateGrandTotal())
      const productList = newOrder.products.map(p => `${p.product} x${p.quantity} (₺${calculateLineTotal(p)})`).join(', ')
      const { error } = await supabase.from('orders').insert([{
        user_id: user.id,
        customer_name: newOrder.customer_name,
        customer_phone: newOrder.customer_phone,
        product: productList,
        products_json: JSON.stringify(newOrder.products),
        price: totalPrice,
        status: 'payment_pending',
        note: newOrder.note,
      }])
      if (error) throw error
      const { error: updateError } = await supabase.from('users').update({ orders_created_count: ordersCreatedCount + 1 }).eq('id', user.id)
      if (updateError) throw updateError
      setNewOrder({ customer_name: '', customer_phone: '', customer_address: '', products: [{ product: '', quantity: 1, unit_price: '', kdv_rate: 0 }], note: '' })
      await fetchUserData(user.id)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
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

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial', padding: '20px', margin: 0 }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '40px', border: `1px solid ${c.border}`, borderRadius: '12px', background: c.header, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <button onClick={toggleTheme} style={{ padding: '8px 12px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '20px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {theme === 'light' ? '☀️' : '🌙'}
            </button>
          </div>

          {!isForgotPassword ? (
            <>
              <h1 style={{ textAlign: 'center', color: c.text, marginBottom: '10px' }}>📱 SiparişDefterim</h1>
              <p style={{ textAlign: 'center', color: c.textSecondary, marginBottom: '30px' }}>Instagram siparişlerini yönet</p>

              <form onSubmit={handleAuth}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com"
                    style={{ width: '100%', padding: '10px', border: `1px solid ${c.inputBorder}`, borderRadius: '6px', boxSizing: 'border-box', background: c.input, color: c.text, fontFamily: 'Arial' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Şifre</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    style={{ width: '100%', padding: '10px', border: `1px solid ${c.inputBorder}`, borderRadius: '6px', boxSizing: 'border-box', background: c.input, color: c.text, fontFamily: 'Arial' }} />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                  {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
              </form>

              {/* Google Login Butonu */}
              <button type="button" onClick={handleGoogleLogin}
                style={{ width: '100%', padding: '12px', marginTop: '10px', background: 'white', color: '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Google ile Giriş Yap
              </button>

              <button onClick={() => setIsLogin(!isLogin)}
                style={{ width: '100%', padding: '12px', marginTop: '10px', background: 'transparent', border: `1px solid ${c.border}`, borderRadius: '6px', cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}>
                {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>

              <button onClick={() => setIsForgotPassword(true)}
                style={{ width: '100%', padding: '12px', marginTop: '10px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#ff6b6b', fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>
                Şifremi Unuttum
              </button>
            </>
          ) : (
            <>
              <h2 style={{ textAlign: 'center', color: c.text, marginBottom: '20px' }}>🔐 Şifremi Unuttum</h2>
              <form onSubmit={handleForgotPassword}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Email Adresiniz</label>
                  <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="email@example.com"
                    style={{ width: '100%', padding: '10px', border: `1px solid ${c.inputBorder}`, borderRadius: '6px', boxSizing: 'border-box', background: c.input, color: c.text, fontFamily: 'Arial' }} />
                </div>
                {resetMessage && (
                  <div style={{ marginBottom: '15px', padding: '12px', background: resetMessage.includes('gönderildi') ? '#d4edda' : '#f8d7da', color: resetMessage.includes('gönderildi') ? '#155724' : '#721c24', borderRadius: '6px', fontSize: '14px' }}>
                    {resetMessage}
                  </div>
                )}
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                  Reset Linki Gönder
                </button>
              </form>
              <button onClick={() => { setIsForgotPassword(false); setResetMessage(''); setResetEmail('') }}
                style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px solid ${c.border}`, borderRadius: '6px', cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}>
                Giriş Sayfasına Dön
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const statusColors = {
    payment_pending: '#ff6b6b',
    paid: '#ffd93d',
    preparing: '#6bcf7f',
    shipped: '#4d96ff',
    completed: '#95e1d3',
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'Arial', color: c.text, transition: 'background 0.3s', margin: 0, padding: 0 }}>
      <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '25px', minWidth: '150px' }}>📱 SiparişDefterim</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: c.textSecondary }}>Siparişler: {ordersCreatedCount}/50</p>
              <div style={{ width: '150px', height: '8px', background: c.bgSecondary, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(ordersCreatedCount / 50) * 100}%`, height: '100%', background: ordersCreatedCount >= 50 ? '#ff6b6b' : '#007bff', transition: 'width 0.3s' }} />
              </div>
            </div>
            <span style={{ color: c.textSecondary, fontSize: '15px', minWidth: '120px' }}>{user.email}</span>
            <button onClick={toggleTheme} style={{ padding: '8px 12px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Çıkış
            </button>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', padding: '20px' }}>
        {ordersCreatedCount >= 50 && (
          <div style={{ background: theme === 'light' ? '#ffe0e0' : '#4a2626', border: '2px solid #ff6b6b', borderRadius: '8px', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#ff6b6b', fontWeight: 'bold' }}>⚠️ 50 sipariş limitine ulaştınız! Daha fazla sipariş oluşturmak için Pro'ya yükseltin.</p>
          </div>
        )}

        <div style={{ background: c.header, padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}` }}>
          <h3 style={{ margin: '0 0 15px 0', color: c.text, fontSize: '17px', fontWeight: 'bold' }}>📋 Sipariş Oluştur</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı Soyadı</label>
              <input type="text" placeholder="Adı Soyadı" value={newOrder.customer_name} onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
              <input type="text" placeholder="5551234567" value={newOrder.customer_phone} onChange={(e) => setNewOrder({ ...newOrder, customer_phone: e.target.value.replace(/\D/g, '') })} maxLength="10"
                style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Adres</label>
            <input type="text" placeholder="Adres" value={newOrder.customer_address} onChange={(e) => setNewOrder({ ...newOrder, customer_address: e.target.value })}
              style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
          </div>

          <div style={{ marginBottom: '15px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
                  <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Ürün</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '70px', color: c.text }}>Adet</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '100px', color: c.text }}>Birim Fiyatı</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>Tutar</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>KDV %</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>KDV Tutarı</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '100px', color: c.text }}>Toplam Tutar</th>
                  <th style={{ padding: '10px', textAlign: 'center', width: '40px', color: c.text }}></th>
                </tr>
              </thead>
              <tbody>
                {newOrder.products.map((product, index) => (
                  <tr key={index} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                    <td style={{ padding: '8px', borderRight: `1px solid ${c.border}` }}>
                      <input type="text" placeholder="Ürün adı" value={product.product} onChange={(e) => updateProductLine(index, 'product', e.target.value)}
                        style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                    </td>
                    <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                      <input type="number" placeholder="1" min="1" value={product.quantity} onChange={(e) => updateProductLine(index, 'quantity', e.target.value)}
                        style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                    </td>
                    <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                      <input type="number" placeholder="0" value={product.unit_price} onChange={(e) => updateProductLine(index, 'unit_price', e.target.value)}
                        style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                    </td>
                    <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: c.text }}>₺{calculateSubtotal(product)}</td>
                    <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: c.text }}>%</span>
                        <input type="number" placeholder="0" value={product.kdv_rate} onChange={(e) => updateProductLine(index, 'kdv_rate', e.target.value)}
                          style={{ width: '50px', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                      </div>
                    </td>
                    <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: c.text }}>₺{calculateKDVAmount(product)}</td>
                    <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: '#007bff' }}>₺{calculateLineTotal(product)}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <button type="button" onClick={() => removeProductLine(index)} disabled={newOrder.products.length === 1}
                        style={{ padding: '4px 6px', background: newOrder.products.length === 1 ? '#ccc' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: newOrder.products.length === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={addProductLine}
            style={{ padding: '6px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginBottom: '15px' }}>
            ➕
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px', fontSize: '14px' }}>
            <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ color: c.textSecondary, marginBottom: '5px' }}>Tutar</div>
              <div style={{ fontWeight: 'bold', color: c.text, fontSize: '17px' }}>₺{newOrder.products.reduce((sum, p) => sum + parseFloat(calculateSubtotal(p)), 0).toFixed(2)}</div>
            </div>
            <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ color: c.textSecondary, marginBottom: '5px' }}>KDV</div>
              <div style={{ fontWeight: 'bold', color: c.text, fontSize: '17px' }}>₺{calculateTotalKDV()}</div>
            </div>
            <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ color: c.textSecondary, marginBottom: '5px', fontSize: '13px' }}>Toplam Tutar</div>
              <div style={{ fontWeight: 'bold', color: c.text, fontSize: '17px' }}>₺{calculateGrandTotal()}</div>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Not (Opsiyonel)</label>
            <input type="text" placeholder="Özel talep, açıklama..." value={newOrder.note} onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })}
              style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
          </div>

          <button onClick={handleAddOrder} disabled={ordersCreatedCount >= 50}
            style={{ width: '100%', padding: '12px', background: ordersCreatedCount >= 50 ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: ordersCreatedCount >= 50 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            Onayla
          </button>
        </div>

        <div style={{ background: c.header, padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}` }}>
          <h3 style={{ margin: '0 0 15px 0', color: c.text, fontSize: '17px', fontWeight: 'bold' }}>🔍 Sipariş Ara</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı</label>
              <input type="text" placeholder="Adı ara..." value={searchName} onChange={(e) => setSearchName(e.target.value)}
                style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
              <input type="text" placeholder="Telefon ara..." value={searchPhone} onChange={(e) => setSearchPhone(e.target.value.replace(/\D/g, ''))} maxLength="10"
                style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
            </div>
            <div>
              <button onClick={() => { setSearchName(''); setSearchPhone('') }}
                style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '23px' }}>
                Temizle
              </button>
            </div>
          </div>
          <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: c.textSecondary }}>Bulunan: {filteredOrders.length} sipariş</p>
        </div>

        <div style={{ background: c.header, borderRadius: '8px', overflow: 'auto', border: `1px solid ${c.border}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Müşteri</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Telefon</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Ürünler</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '60px', color: c.text }}>Fiyat</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '90px', color: c.text }}>Durum</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '120px', color: c.text }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order.id} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, color: c.text }}>{order.customer_name}</td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, fontSize: '13px', color: c.textSecondary }}>📱 {order.customer_phone}</td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, color: c.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {order.product.split(', ').map((prod, idx) => (
                      <div key={idx} style={{ marginBottom: idx < order.product.split(', ').length - 1 ? '8px' : '0' }}>{prod}</div>
                    ))}
                    {order.note && <div style={{ fontSize: '12px', color: c.textSecondary, marginTop: '8px' }}>Not: {order.note}</div>}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}`, fontWeight: 'bold', color: c.text }}>₺{order.price}</td>
                  <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}` }}>
                    <select value={order.status} onChange={(e) => { supabase.from('orders').update({ status: e.target.value }).eq('id', order.id).then(() => { fetchUserData(user.id) }) }}
                      style={{ padding: '4px 6px', border: `2px solid ${statusColors[order.status]}`, background: statusColors[order.status], color: order.status === 'paid' || order.status === 'completed' ? '#333' : 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                      <option value="payment_pending">💰 Ödeme</option>
                      <option value="paid">✅ Ödendi</option>
                      <option value="preparing">📦 Hazır.</option>
                      <option value="shipped">🚚 Kargo</option>
                      <option value="completed">🎉 Tamamlandı</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button onClick={() => { if (order.customer_phone) { window.open(`https://wa.me/90${order.customer_phone}?text=Merhaba! "${order.customer_name}" için sipariş oluşturdunuz. Ürünler: ${order.product}, Toplam: ₺${order.price}. Lütfen ödeme yapınız.`, '_blank') } }}
                        style={{ padding: '6px 10px', background: '#25d366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <img src="https://dcqdgklkrjvmfjzhliph.supabase.co/storage/v1/object/sign/wp%20logo/pngwing.com.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjA2YmZmMy04N2Q0LTRmMjAtYjRmMC01MGRiZDM3OWI1NGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3cCBsb2dvL3BuZ3dpbmcuY29tLnBuZyIsImlhdCI6MTc3NDcyNTQxMSwiZXhwIjoxODA2MjYxNDExfQ.p5yP8eFZijbKeH4XwfggFNDvI6vpPPsU756s2t4vZKI" alt="WhatsApp" style={{ width: '15px', height: '15px' }} />
                      </button>
                      <button onClick={() => startEditing(order)}
                        style={{ padding: '6px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>✎</button>
                      <button onClick={() => deleteOrder(order.id)}
                        style={{ padding: '6px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div style={{ textAlign: 'center', color: c.textSecondary, padding: '50px', background: c.header, borderRadius: '8px', marginTop: '20px', border: `1px solid ${c.border}` }}>
            <p>📭 Sipariş bulunamadı.</p>
          </div>
        )}
      </div>

      {editingId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: c.header, border: `1px solid ${c.border}`, borderRadius: '8px', padding: '20px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: c.text }}>
            <h2 style={{ margin: '0 0 20px 0', color: c.text }}>📝 Sipariş Düzenle</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı Soyadı</label>
                <input type="text" value={editingData.customer_name} onChange={(e) => setEditingData({ ...editingData, customer_name: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
                <input type="text" value={editingData.customer_phone} onChange={(e) => setEditingData({ ...editingData, customer_phone: e.target.value.replace(/\D/g, '') })} maxLength="10"
                  style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Adres</label>
              <input type="text" value={editingData.customer_address} onChange={(e) => setEditingData({ ...editingData, customer_address: e.target.value })}
                style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
            </div>
            <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
                    <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Ürün</th>
                    <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '70px', color: c.text }}>Adet</th>
                    <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '100px', color: c.text }}>Birim Fiyatı</th>
                    <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>Tutar</th>
                    <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>KDV %</th>
                    <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>KDV Tutarı</th>
                    <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '100px', color: c.text }}>Toplam Tutar</th>
                    <th style={{ padding: '10px', textAlign: 'center', width: '40px', color: c.text }}></th>
                  </tr>
                </thead>
                <tbody>
                  {editingData.products && editingData.products.map((product, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                      <td style={{ padding: '8px', borderRight: `1px solid ${c.border}` }}>
                        <input type="text" value={product.product} onChange={(e) => updateProductLineEdit(index, 'product', e.target.value)}
                          style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                      </td>
                      <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                        <input type="number" min="1" value={product.quantity} onChange={(e) => updateProductLineEdit(index, 'quantity', e.target.value)}
                          style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                      </td>
                      <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                        <input type="number" value={product.unit_price} onChange={(e) => updateProductLineEdit(index, 'unit_price', e.target.value)}
                          style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                      </td>
                      <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: c.text }}>₺{calculateSubtotal(product)}</td>
                      <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: c.text }}>%</span>
                          <input type="number" value={product.kdv_rate} onChange={(e) => updateProductLineEdit(index, 'kdv_rate', e.target.value)}
                            style={{ width: '50px', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                        </div>
                      </td>
                      <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: c.text }}>₺{calculateKDVAmount(product)}</td>
                      <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: '#007bff' }}>₺{calculateLineTotal(product)}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        <button onClick={() => removeProductLineEdit(index)} disabled={editingData.products.length === 1}
                          style={{ padding: '4px 6px', background: editingData.products.length === 1 ? '#ccc' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: editingData.products.length === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addProductLineEdit}
              style={{ padding: '6px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginBottom: '20px' }}>
              ➕
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px', fontSize: '14px' }}>
              <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: c.textSecondary, marginBottom: '5px' }}>Tutar</div>
                <div style={{ fontWeight: 'bold', color: c.text, fontSize: '17px' }}>₺{editingData.products ? editingData.products.reduce((sum, p) => sum + parseFloat(calculateSubtotal(p)), 0).toFixed(2) : '0.00'}</div>
              </div>
              <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: c.textSecondary, marginBottom: '5px' }}>KDV</div>
                <div style={{ fontWeight: 'bold', color: c.text, fontSize: '17px' }}>₺{calculateEditTotalKDV()}</div>
              </div>
              <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: c.textSecondary, marginBottom: '5px', fontSize: '13px' }}>Toplam Tutar</div>
                <div style={{ fontWeight: 'bold', color: c.text, fontSize: '17px' }}>₺{calculateEditGrandTotal()}</div>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Not (Opsiyonel)</label>
              <input type="text" value={editingData.note} onChange={(e) => setEditingData({ ...editingData, note: e.target.value })}
                style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={saveEdit}
                style={{ flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                Kaydet
              </button>
              <button onClick={cancelEdit}
                style={{ flex: 1, padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}