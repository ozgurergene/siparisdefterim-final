'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/home')
      } else {
        if (!agreedToTerms) {
          throw new Error('Lütfen kullanım koşullarını kabul edin')
        }
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: `${window.location.origin}/` }
        })
        if (error) throw error
        setMessage('Kayıt başarılı! Lütfen e-postanızı doğrulayın.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` }
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Lütfen e-posta adresinizi girin'); return }
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
      setMessage('Şifre sıfırlama linki e-postanıza gönderildi')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '16px 20px',
    borderRadius: 12,
    border: `2px solid ${focusedField === fieldName ? '#667eea' : '#2a2a3e'}`,
    background: '#1a1a2e',
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  })

  const primaryGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#16161f',
        borderRadius: 24,
        padding: 40,
        width: '100%',
        maxWidth: 420,
        border: '1px solid #2a2a3e',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📱</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: '#667eea' }}>SiparişDefterim</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 8 }}>Instagram siparişlerinizi kolayca yönetin</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: '#12121f', padding: 6, borderRadius: 12 }}>
          <button onClick={() => setIsLogin(true)} style={{
            flex: 1, padding: '12px', borderRadius: 8, border: 'none',
            background: isLogin ? primaryGradient : 'transparent',
            color: isLogin ? 'white' : '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Giriş Yap</button>
          <button onClick={() => setIsLogin(false)} style={{
            flex: 1, padding: '12px', borderRadius: 8, border: 'none',
            background: !isLogin ? primaryGradient : 'transparent',
            color: !isLogin ? 'white' : '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Kayıt Ol</button>
        </div>

        {/* Error/Message */}
        {error && (
          <div style={{ background: '#2d1f2f', border: '1px solid #f5576c', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ff6b7a', fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}
        {message && (
          <div style={{ background: '#1a2e1f', border: '1px solid #43e97b', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#5ff592', fontSize: 13 }}>
            ✓ {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="E-posta"
              required
              style={inputStyle('email')}
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="Şifre"
              required
              minLength={6}
              style={inputStyle('password')}
            />
          </div>

          {/* Terms for signup - TEK SATIR */}
          {!isLogin && (
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, cursor: 'pointer' }}>
              <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 2, accentColor: '#667eea' }} />
              <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                <a href="/terms-of-use" target="_blank" style={{ color: '#667eea' }}>Kullanım Koşulları</a>,{' '}
                <a href="/privacy-policy" target="_blank" style={{ color: '#667eea' }}>Gizlilik Politikası</a> ve{' '}
                <a href="/gdpr-disclosure" target="_blank" style={{ color: '#667eea' }}>KVKK</a>'yı kabul ediyorum.
              </span>
            </label>
          )}

          {/* Forgot password */}
          {isLogin && (
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button type="button" onClick={handleForgotPassword}
                style={{ background: 'none', border: 'none', color: '#667eea', fontSize: 13, cursor: 'pointer' }}>
                Şifremi Unuttum
              </button>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '16px', borderRadius: 12, border: 'none',
            background: primaryGradient, color: 'white', fontSize: 16, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#2a2a3e' }} />
          <span style={{ fontSize: 12, color: '#64748b' }}>veya</span>
          <div style={{ flex: 1, height: 1, background: '#2a2a3e' }} />
        </div>

        {/* Google Login */}
        <button onClick={handleGoogleLogin} disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: 12, border: '1px solid #2a2a3e',
          background: '#1a1a2e', color: '#f8fafc', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google ile Devam Et
        </button>

        {/* Footer Links */}
        <div style={{ marginTop: 28, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          <a href="/privacy-policy" style={{ color: '#64748b', marginRight: 16 }}>Gizlilik</a>
          <a href="/terms-of-use" style={{ color: '#64748b', marginRight: 16 }}>Kullanım</a>
          <a href="/gdpr-disclosure" style={{ color: '#64748b' }}>KVKK</a>
        </div>
      </div>
    </div>
  )
}