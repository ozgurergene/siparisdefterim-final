'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [theme, setTheme] = useState('light')
  
  // KVKK checkbox states
  const [kvkkAydinlatma, setKvkkAydinlatma] = useState(false)
  const [kullanımKosullari, setKullanimKosullari] = useState(false)
  const [gizlilikPolitikasi, setGizlilikPolitikasi] = useState(false)
  const [acikRiza, setAcikRiza] = useState(false)
  const [pazarlamaIzni, setPazarlamaIzni] = useState(false)

  const c = colors[theme]

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) {
        router.push('/home')
      }
    }
    checkSession()
  }, [router])

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (isSignUp) {
      // Check required checkboxes for signup
      if (!kvkkAydinlatma || !kullanımKosullari || !gizlilikPolitikasi || !acikRiza) {
        setError('Lütfen zorunlu onayları işaretleyin.')
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Kayıt başarılı! E-posta adresinizi doğrulayın.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/home')
      }
    }

    setLoading(false)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('siparisdefterim-theme', newTheme)
  }

  const allRequiredChecked = kvkkAydinlatma && kullanımKosullari && gizlilikPolitikasi && acikRiza

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme === 'light' 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #2d1b4e 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial'
    }}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px 15px',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div style={{ 
        background: c.header, 
        padding: '40px', 
        borderRadius: '16px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '420px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📱</div>
          <h1 style={{ margin: 0, fontSize: '24px', color: c.text }}>SiparişDefterim</h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: c.textSecondary }}>
            Instagram satıcıları için dijital sipariş defteri
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '25px', background: c.bgSecondary, borderRadius: '8px', padding: '4px' }}>
          <button
            onClick={() => setIsSignUp(false)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              background: !isSignUp ? '#007bff' : 'transparent',
              color: !isSignUp ? 'white' : c.textSecondary
            }}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              background: isSignUp ? '#007bff' : 'transparent',
              color: isSignUp ? 'white' : c.textSecondary
            }}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: `1px solid ${c.inputBorder}`, 
                borderRadius: '8px', 
                fontSize: '14px', 
                boxSizing: 'border-box',
                background: c.input,
                color: c.text
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: `1px solid ${c.inputBorder}`, 
                borderRadius: '8px', 
                fontSize: '14px', 
                boxSizing: 'border-box',
                background: c.input,
                color: c.text
              }}
            />
          </div>

          {/* KVKK Checkboxes - Only show on signup */}
          {isSignUp && (
            <div style={{ marginBottom: '20px', fontSize: '13px' }}>
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="kvkkAydinlatma"
                  checked={kvkkAydinlatma}
                  onChange={(e) => setKvkkAydinlatma(e.target.checked)}
                  style={{ marginTop: '3px' }}
                />
                <label htmlFor="kvkkAydinlatma" style={{ color: c.text }}>
                  <a href="/kvkk" target="_blank" style={{ color: '#667eea' }}>KVKK Aydınlatma Metni</a>'ni okudum, anladım. <span style={{ color: '#ff6b6b' }}>*</span>
                </label>
              </div>

              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="kullanim"
                  checked={kullanımKosullari}
                  onChange={(e) => setKullanimKosullari(e.target.checked)}
                  style={{ marginTop: '3px' }}
                />
                <label htmlFor="kullanim" style={{ color: c.text }}>
                  <a href="/kullanim" target="_blank" style={{ color: '#667eea' }}>Kullanım Koşulları</a>'nı kabul ediyorum. <span style={{ color: '#ff6b6b' }}>*</span>
                </label>
              </div>

              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="gizlilik"
                  checked={gizlilikPolitikasi}
                  onChange={(e) => setGizlilikPolitikasi(e.target.checked)}
                  style={{ marginTop: '3px' }}
                />
                <label htmlFor="gizlilik" style={{ color: c.text }}>
                  <a href="/gizlilik" target="_blank" style={{ color: '#667eea' }}>Gizlilik Politikası</a>'nı kabul ediyorum. <span style={{ color: '#ff6b6b' }}>*</span>
                </label>
              </div>

              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="acikRiza"
                  checked={acikRiza}
                  onChange={(e) => setAcikRiza(e.target.checked)}
                  style={{ marginTop: '3px' }}
                />
                <label htmlFor="acikRiza" style={{ color: c.text }}>
                  <a href="/kvkk-riza" target="_blank" style={{ color: '#667eea' }}>Açık Rıza Beyanı</a>'nı onaylıyorum. <span style={{ color: '#ff6b6b' }}>*</span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="pazarlama"
                  checked={pazarlamaIzni}
                  onChange={(e) => setPazarlamaIzni(e.target.checked)}
                  style={{ marginTop: '3px' }}
                />
                <label htmlFor="pazarlama" style={{ color: c.textSecondary }}>
                  Kampanya ve duyurulardan haberdar olmak istiyorum. (Opsiyonel)
                </label>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (isSignUp && !allRequiredChecked)}
            style={{
              width: '100%',
              padding: '14px',
              background: (loading || (isSignUp && !allRequiredChecked)) ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: (loading || (isSignUp && !allRequiredChecked)) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              if (!loading && (!isSignUp || allRequiredChecked)) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {loading ? 'Yükleniyor...' : (isSignUp ? 'Kayıt Ol' : 'Giriş Yap')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: c.textSecondary }}>
          deftertut.com © 2026
        </p>
      </div>
    </div>
  )
}