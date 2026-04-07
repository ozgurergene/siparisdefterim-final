'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      
      if (accessToken) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        router.replace('/home')
      } else {
        router.replace('/login')
      }
    }
    
    checkSession()
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>📱</div>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Yükleniyor...</p>
      </div>
    </div>
  )
}