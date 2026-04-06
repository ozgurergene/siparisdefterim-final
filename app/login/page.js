'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, glowEffects, buttonGradients, keyframesCSS } from '../../lib/theme'

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
  
  const c = colors.dark

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
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
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
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Lütfen e-posta adresinizi girin')
      return
    }
    
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
    borderRadius: 14,
    border: `2px solid ${focusedField === fieldName ? 'transparent' : c.inputBorder}`,
    background: focusedField === fieldName 
      ? `linear-gradient(${c.input}, ${c.input}) padding-box, linear-gradient(135deg, #667eea, #764ba2) border-box`
      : c.input,
    color: c.text,
    fontSize: 15,
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: focusedField === fieldName ? '0 0 30px rgba(102, 126, 234, 0.3)' : 'none',
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: c.bgGradient,
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          background: c.bgCard,
          backdropFilter: 'blur(30px)',
          borderRadius: 28,
          padding: 40,
          width: '100%',
          maxWidth: 440,
          border: `1px solid ${c.border}`,
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
          animation: 'scaleIn 0.4s ease-out',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📱</div>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            SiparişDefterim
          </h1>
          <p style={{ color: c.textMuted, fontSize: 14, marginTop: 8 }}>
            Instagram siparişlerinizi kolayca yönetin
          </p>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginBottom: 28,
          background: 'rgba(255, 255, 255, 0.03)',
          padding: 6,
          borderRadius: 14,
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: isLogin ? buttonGradients.primary : 'transparent',
              color: isLogin ? 'white' : c.textMuted,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isLogin ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
            }}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: !isLogin ? buttonGradients.primary : 'transparent',
              color: !isLogin ? 'white' : c.textMuted,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: !isLogin ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
            }}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Error/Message */}
        {error && (
          <div style={{
            background: 'rgba(245, 87, 108, 0.15)',
            border: '1px solid rgba(245, 87, 108, 0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 20,
            color: '#f5576c',
            fontSize: 13,
            animation: 'fadeIn 0.3s ease-out',
          }}>
            ⚠️ {error}
          </div>
        )}
        
        {message && (
          <div style={{
            background: 'rgba(67, 233, 123, 0.15)',
            border: '1px solid rgba(67, 233, 123, 0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 20,
            color: '#43e97b',
            fontSize: 13,
            animation: 'fadeIn 0.3s ease-out',
          }}>
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

          {/* Terms checkbox for signup */}
          {!isLogin && (
            <label style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 10, 
              marginBottom: 20,
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ 
                  width: 18, 
                  height: 18, 
                  marginTop: 2,
                  accentColor: '#667eea',
                }}
              />
              <span style={{ fontSize: 13, color: c.textSecondary, lineHeight: 1.5 }}>
                <a href="/terms-of-use" target="_blank" style={{ color: '#667eea' }}>Kullanım Koşulları</a>,{' '}
                <a href="/privacy-policy" target="_blank" style={{ color: '#667eea' }}>Gizlilik Politikası</a> ve{' '}
                <a href="/gdpr-disclosure" target="_blank" style={{ color: '#667eea' }}>KVKK Aydınlatma Metni</a>'ni 
                okudum, kabul ediyorum.
              </span>
            </label>
          )}

          {/* Forgot password */}
          {isLogin && (
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Şifremi Unuttum
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 14,
              border: 'none',
              background: buttonGradients.primary,
              color: 'white',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = glowEffects.primary
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 20,
                  height: 20,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                İşleniyor...
              </>
            ) : (
              isLogin ? 'Giriş Yap' : 'Kayıt Ol'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 16, 
          margin: '24px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: c.border }} />
          <span style={{ fontSize: 12, color: c.textMuted }}>veya</span>
          <div style={{ flex: 1, height: 1, background: c.border }} />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 14,
            border: `1px solid ${c.border}`,
            background: 'rgba(255, 255, 255, 0.03)',
            color: c.text,
            fontSize: 14,
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.borderColor = '#667eea'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
            e.currentTarget.style.borderColor = c.border
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google ile Devam Et
        </button>

        {/* Footer Links */}
        <div style={{ 
          marginTop: 28, 
          textAlign: 'center', 
          fontSize: 12, 
          color: c.textMuted,
        }}>
          <a href="/privacy-policy" style={{ color: c.textMuted, marginRight: 16 }}>Gizlilik</a>
          <a href="/terms-of-use" style={{ color: c.textMuted, marginRight: 16 }}>Kullanım</a>
          <a href="/gdpr-disclosure" style={{ color: c.textMuted }}>KVKK</a>
        </div>
      </div>

      <style jsx global>{`
        ${keyframesCSS}
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}