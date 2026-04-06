'use client'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard')
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 20,
    }}>
      <div style={{
        width: 50,
        height: 50,
        border: '3px solid rgba(102, 126, 234, 0.1)',
        borderTop: '3px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>Ödeme işleniyor...</p>
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function PaymentPage() {
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
      <PaymentContent />
    </Suspense>
  )
}