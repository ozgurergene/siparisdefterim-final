'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { colors } from '../../lib/theme'

function SuccessContent() {
  const router = useRouter()
  const [theme, setTheme] = useState('light')
  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1D9E75 0%, #28a745 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial'
    }}>
      <div style={{ 
        background: c.header, 
        padding: '50px', 
        borderRadius: '16px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '28px', color: c.text }}>Tebrikler!</h1>
        <p style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1D9E75', fontWeight: 'bold' }}>
          Pro üyeliğiniz aktif!
        </p>
        <p style={{ margin: '0 0 30px 0', fontSize: '14px', color: c.textSecondary }}>
          Artık sınırsız sipariş oluşturabilirsiniz. İşinizi büyütmenin tadını çıkarın!
        </p>

        <button
          onClick={() => router.push('/dashboard')}
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
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Siparişlere Git →
        </button>

        <p style={{ marginTop: '25px', fontSize: '12px', color: c.textSecondary }}>
          Desteğiniz için teşekkür ederiz! 💜
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Yükleniyor...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}