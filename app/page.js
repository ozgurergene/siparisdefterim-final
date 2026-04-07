'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import Loading from '../components/Loading'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      // Handle OAuth callback
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      
      if (accessToken) {
        // OAuth callback - session will be set automatically
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

  return <Loading />
}