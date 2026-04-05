'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Handle OAuth callback
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (code) {
          window.history.replaceState({}, '', '/')
          await supabase.auth.exchangeCodeForSession(code)
        }

        const { data } = await supabase.auth.getSession()
        
        if (data?.session?.user) {
          router.push('/home')
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [router])

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱</div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>SiparişDefterim</h1>
        <p style={{ margin: 0, opacity: 0.8 }}>Yükleniyor...</p>
      </div>
    </div>
  )
}