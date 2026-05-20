'use client'

// app/RootRedirect.jsx
// Mevcut page.js'teki session-kontrol mantÄ±ÄŸÄ±nÄ±n KORUNMUÅ hali.
// FARK: GiriÅŸ yapmamÄ±ÅŸ kullanÄ±cÄ±yÄ± /login'e ATMAZ â€” landing'de bÄ±rakÄ±r.
// Sadece giriÅŸ yapmÄ±ÅŸ kullanÄ±cÄ±yÄ± /home'a yÃ¶nlendirir (eski davranÄ±ÅŸ korunur).
// HiÃ§bir gÃ¶rsel Ã§Ä±ktÄ± Ã¼retmez (return null), landing'in Ã¼stÃ¼nde sessizce Ã§alÄ±ÅŸÄ±r.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      // OAuth hash token akÄ±ÅŸÄ± â€” mevcut davranÄ±ÅŸ korundu
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')

      if (accessToken) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // GiriÅŸ yapmÄ±ÅŸsa eski davranÄ±ÅŸ: /home'a git.
      // GiriÅŸ yapmamÄ±ÅŸsa HÄ°Ã‡BÄ°R ÅEY yapma â€” landing gÃ¶rÃ¼nÃ¼r kalsÄ±n.
      if (session) {
        router.replace('/home')
      }
    }

    checkSession()
  }, [router])

  return null
}
