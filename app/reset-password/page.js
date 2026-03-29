'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState('light')

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  const colors = {
    light: {
      bg: '#ffffff',
      bgSecondary: '#f5f7fa',
      text: '#1a1a1a',
      textSecondary: '#666666',
      border: '#e0e4e8',
      header: '#ffffff',
      input: '#ffffff',
      inputBorder: '#d0d5db',
    },
    dark: {
      bg: '#1a1a1a',
      bgSecondary: '#2d2d2d',
      text: '#e0e0e0',
      textSecondary: '#b0b0b0',
      border: '#3a3a3a',
      header: '#252525',
      input: '#2d2d2d',
      inputBorder: '#3a3a3a',
    }
  }

  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setMessage('')

    if (password.length < 6) {
      setMessage('Şifre en az 6 karakter olmalı!')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Şifreler eşleşmiyor!')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw new Error(error.message)

      setMessage('✅ Şifreniz başarıyla güncellendi! Yönlendiriliyorsunuz...')
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } catch (error) {
      setMessage('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial', padding: '20px' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '40px', border: `1px solid ${c.border}`, borderRadius: '12px', background: c.header, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        
        <h1 style={{ textAlign: 'center', color: c.text, marginBottom: '10px' }}>📱 SiparişDefterim</h1>
        <h2 style={{ textAlign: 'center', color: c.text, marginBottom: '30px', fontSize: '20px' }}>🔐 Yeni Şifre Belirle</h2>

        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Yeni Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 6 karakter"
              style={{ width: '100%', padding: '10px', border: `1px solid ${c.inputBorder}`, borderRadius: '6px', boxSizing: 'border-box', background: c.input, color: c.text, fontFamily: 'Arial' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Şifre Tekrar</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifrenizi tekrar girin"
              style={{ width: '100%', padding: '10px', border: `1px solid ${c.inputBorder}`, borderRadius: '6px', boxSizing: 'border-box', background: c.input, color: c.text, fontFamily: 'Arial' }}
            />
          </div>

          {message && (
            <div style={{
              marginBottom: '15px',
              padding: '12px',
              background: message.includes('✅') ? '#d4edda' : '#f8d7da',
              color: message.includes('✅') ? '#155724' : '#721c24',
              borderRadius: '6px',
              fontSize: '14px',
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            {loading ? 'Güncelleniyor...' : 'Şifremi Güncelle'}
          </button>
        </form>

        <button
          onClick={() => window.location.href = '/'}
          style={{ width: '100%', padding: '12px', marginTop: '10px', background: 'transparent', border: `1px solid ${c.border}`, borderRadius: '6px', cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}
        >
          Giriş Sayfasına Dön
        </button>
      </div>
    </div>
  )
}