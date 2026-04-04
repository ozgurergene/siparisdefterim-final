'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import Footer from '../../components/Footer'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [theme, setTheme] = useState('light')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const c = colors[theme]

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (code) {
          window.history.replaceState({}, '', '/login')
          await supabase.auth.exchangeCodeForSession(code)
        }

        const { data } = await supabase.auth.getSession()
        if (data?.session?.user) {
          router.push('/dashboard')
          return
        }
      } catch (error) {
        console.error('Auth error:', error)
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('siparisdefterim-theme', newTheme)
  }

  const handleGoogleSignIn = async () => {
    if (!termsAccepted) {
      alert('Devam etmek için Gizlilik Politikası ve Kullanım Koşullarını kabul etmelisiniz.')
      return
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://siparisdefterim-final.vercel.app/login'
      }
    })
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setResetMessage('')
    
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: 'https://siparisdefterim-final.vercel.app/reset-password',
    })

    if (error) {
      setResetMessage('Hata: ' + error.message)
    } else {
      setResetMessage('Şifre sıfırlama linki gönderildi! Email kutunuzu kontrol edin.')
      setTimeout(() => {
        setIsForgotPassword(false)
        setResetMessage('')
        setResetEmail('')
      }, 3000)
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    
    // Kayıt olurken checkbox kontrolü
    if (!isLogin && !termsAccepted) {
      alert('Kayıt olmak için Gizlilik Politikası ve Kullanım Koşullarını kabul etmelisiniz.')
      return
    }
    
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw new Error(error.message)
        router.push('/dashboard')
      } else {
        // KAYIT OL
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw new Error(error.message)
        
        // Kayıt başarılı - Direkt legal-confirm'e yönlendir (email confirmation kapalı)
        router.push('/legal-confirm')
        return
      }
      setEmail('')
      setPassword('')
    } catch (error) {
      alert('Hata: ' + error.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial', background: c.bg, color: c.text, minHeight: '100vh' }}>
        <h2>Yükleniyor...</h2>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', flexDirection: 'column', fontFamily: 'Arial' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '40px', border: `1px solid ${c.border}`, borderRadius: '12px', background: c.header, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <button
              onClick={toggleTheme}
              style={{
                padding: '8px 12px',
                background: c.bgSecondary,
                border: `1px solid ${c.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              {theme === 'light' ? '☀️' : '🌙'}
            </button>
          </div>

          {!isForgotPassword ? (
            <>
              <h1 style={{ textAlign: 'center', color: c.text, marginBottom: '10px' }}>📱 SiparişDefterim</h1>
              <p style={{ textAlign: 'center', color: c.textSecondary, marginBottom: '30px' }}>Instagram siparişlerini yönet</p>

              {/* Terms Checkbox */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{ marginTop: '3px', cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <label htmlFor="terms" style={{ fontSize: '13px', color: c.textSecondary, cursor: 'pointer', lineHeight: '1.4' }}>
                  <a href="/privacy-policy" target="_blank" style={{ color: '#007bff', textDecoration: 'underline' }}>Gizlilik Politikası</a>,{' '}
                  <a href="/terms-of-use" target="_blank" style={{ color: '#007bff', textDecoration: 'underline' }}>Kullanım Koşulları</a> ve{' '}
                  <a href="/gdpr-disclosure" target="_blank" style={{ color: '#007bff', textDecoration: 'underline' }}>KVKK Aydınlatma Metni</a>'ni okudum ve kabul ediyorum.
                </label>
              </div>

              <button
                onClick={handleGoogleSignIn}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#fff',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <g fill="none">
                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </g>
                </svg>
                Google ile Giriş Yap
              </button>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ flex: 1, height: '1px', background: c.border }}></div>
                <span style={{ padding: '0 15px', color: c.textSecondary, fontSize: '13px' }}>veya</span>
                <div style={{ flex: 1, height: '1px', background: c.border }}></div>
              </div>

              <form onSubmit={handleAuth}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${c.inputBorder}`,
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      background: c.input,
                      color: c.text,
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Şifre</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${c.inputBorder}`,
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      background: c.input,
                      color: c.text,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}
                >
                  {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
              </form>

              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '10px',
                  background: 'transparent',
                  border: `1px solid ${c.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#007bff',
                  fontWeight: 'bold',
                }}
              >
                {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>

              <button
                onClick={() => setIsForgotPassword(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '10px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#ff6b6b',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textDecoration: 'underline',
                }}
              >
                Şifremi Unuttum
              </button>
            </>
          ) : (
            <>
              <h2 style={{ textAlign: 'center', color: c.text, marginBottom: '20px' }}>🔐 Şifremi Unuttum</h2>
              <p style={{ textAlign: 'center', color: c.textSecondary, marginBottom: '20px', fontSize: '14px' }}>
                Email adresinizi girin, şifre sıfırlama linki göndereceğiz.
              </p>
              
              <form onSubmit={handleForgotPassword}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="email@example.com"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${c.inputBorder}`,
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      background: c.input,
                      color: c.text,
                    }}
                  />
                </div>

                {resetMessage && (
                  <div style={{
                    marginBottom: '15px',
                    padding: '12px',
                    background: resetMessage.includes('gönderildi') ? '#d4edda' : '#f8d7da',
                    color: resetMessage.includes('gönderildi') ? '#155724' : '#721c24',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}>
                    {resetMessage}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginBottom: '10px',
                  }}
                >
                  Şifre Sıfırlama Linki Gönder
                </button>
              </form>

              <button
                onClick={() => {
                  setIsForgotPassword(false)
                  setResetMessage('')
                  setResetEmail('')
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: `1px solid ${c.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#007bff',
                  fontWeight: 'bold',
                }}
              >
                ← Geri Dön
              </button>
            </>
          )}
        </div>
      </div>
      
      <Footer theme={theme} />
    </div>
  )
}