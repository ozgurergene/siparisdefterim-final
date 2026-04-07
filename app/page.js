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
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)',
      fontFamily: 'Arial'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱</div>
        <p style={{ color: '#94a3b8' }}>Yükleniyor...</p>
      </div>
    </div>
  )
}