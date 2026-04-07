'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'

function PaymentContent() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('light')

  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data?.session?.user) {
        router.push('/login')
        return
      }
      setUser(data.session.user)
      setLoading(false)
    }
    checkUser()
  }, [router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: c.textSecondary }}>Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial'
    }}>
      <div style={{ 
        background: c.header, 
        padding: '40px', 
        borderRadius: '16px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚀</div>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '28px', color: c.text }}>Pro'ya Yükselt</h1>
        <p style={{ margin: '0 0 30px 0', fontSize: '16px', color: c.textSecondary }}>
          Sınırsız sipariş oluştur, işini büyüt!
        </p>

        {/* Features */}
        <div style={{ textAlign: 'left', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ color: '#1D9E75', fontSize: '20px' }}>✓</span>
            <span style={{ color: c.text }}>Sınırsız sipariş oluşturma</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ color: '#1D9E75', fontSize: '20px' }}>✓</span>
            <span style={{ color: c.text }}>Öncelikli destek</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ color: '#1D9E75', fontSize: '20px' }}>✓</span>
            <span style={{ color: c.text }}>Gelişmiş raporlama</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#1D9E75', fontSize: '20px' }}>✓</span>
            <span style={{ color: c.text }}>Yeni özellikler öncelikli erişim</span>
          </div>
        </div>

        {/* Price */}
        <div style={{ 
          background: c.bgSecondary, 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '25px',
          border: `1px solid ${c.border}`
        }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: c.textSecondary }}>Aylık</p>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: c.text }}>
            ₺99<span style={{ fontSize: '16px', fontWeight: 'normal', color: c.textSecondary }}>/ay</span>
          </p>
        </div>

        {/* Placeholder Button */}
        <button
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            marginBottom: '15px'
          }}
          onClick={() => alert('Ödeme sistemi yakında aktif olacak!')}
        >
          Şimdi Satın Al
        </button>

        <button
          onClick={() => router.push('/home')}
          style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            color: c.textSecondary,
            border: `1px solid ${c.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Geri Dön
        </button>

        <p style={{ marginTop: '20px', fontSize: '12px', color: c.textSecondary }}>
          İptal istediğiniz zaman. Sorularınız için iletişime geçin.
        </p>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Yükleniyor...</p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}