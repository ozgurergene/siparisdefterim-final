'use client'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.replace('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 24,
      padding: 20,
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 40,
        boxShadow: '0 0 40px rgba(67, 233, 123, 0.4)',
      }}>
        ✓
      </div>
      
      <h1 style={{
        fontSize: 28,
        fontWeight: 700,
        color: '#f8fafc',
        margin: 0,
        textAlign: 'center',
      }}>
        Ödeme Başarılı!
      </h1>
      
      <p style={{
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.6)',
        margin: 0,
        textAlign: 'center',
      }}>
        Pro üyeliğiniz aktif edildi. Artık sınırsız sipariş ekleyebilirsiniz.
      </p>

      <p style={{
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
        margin: 0,
      }}>
        {countdown} saniye içinde yönlendirileceksiniz...
      </p>

      <button
        onClick={() => router.replace('/dashboard')}
        style={{
          padding: '14px 32px',
          borderRadius: 10,
          border: 'none',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: 10,
        }}
      >
        Panele Git
      </button>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>Yükleniyor...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}