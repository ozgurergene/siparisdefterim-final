'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import ContactForm from './components/ContactForm'

export default function Home() {
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
          router.push('/dashboard')
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
      textAlign: 'center', 
      padding: '50px', 
      fontFamily: 'Arial', 
      background: '#1a1a1a', 
      color: '#e0e0e0', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h2>Yükleniyor...</h2>
      
      <div style={{ marginTop: '60px', borderTop: '1px solid #444', paddingTop: '40px', width: '100%' }}>
        <h3>Destek / İletişim</h3>
        <ContactForm />
      </div>
    </div>
  )
}