'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams?.get('onboarding') === '1'

  const [businessName, setBusinessName] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [businessInstagram, setBusinessInstagram] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [theme, setTheme] = useState('dark')

  const isDark = theme === 'dark'

  // Marka renkleri (landing/dashboard ile uyumlu)
  const c = isDark ? {
    bgGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)',
    card: '#13131f',
    cardBorder: 'rgba(102, 126, 234, 0.2)',
    text: '#ffffff',
    textSecondary: '#94a3b8',
    input: '#1a1a2e',
    inputBorder: '#2a2a3e',
  } : {
    bgGradient: 'linear-gradient(135deg, #f8e8fa 0%, #eef0ff 100%)',
    card: '#ffffff',
    cardBorder: 'rgba(102, 126, 234, 0.25)',
    text: '#1a1a2e',
    textSecondary: '#64748b',
    input: '#ffffff',
    inputBorder: 'rgba(0,0,0,0.12)',
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'dark'
    setTheme(savedTheme)
    loadBusinessInfo()
  }, [])

  const loadBusinessInfo = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData?.session?.user
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('business_name, business_phone, business_instagram')
        .eq('id', user.id)
        .single()

      if (error) throw new Error(error.message)

      if (data) {
        setBusinessName(data.business_name || '')
        setBusinessPhone(data.business_phone || '')
        setBusinessInstagram(data.business_instagram || '')
      }
    } catch (error) {
      setMessage('Bilgiler yüklenirken hata oluştu: ' + error.message)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!businessName.trim()) {
      setMessage('İşletme adı boş bırakılamaz!')
      return
    }

    setLoading(true)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData?.session?.user
      if (!user) {
        router.push('/login')
        return
      }

      const cleanInstagram = businessInstagram.trim().replace(/^@/, '')

      const { error } = await supabase
        .from('users')
        .update({
          business_name: businessName.trim(),
          business_phone: businessPhone.trim(),
          business_instagram: cleanInstagram,
        })
        .eq('id', user.id)

      if (error) throw new Error(error.message)

      setMessage('✅ İşletme bilgileriniz kaydedildi!')
      // Onboarding akisindaysa kaydedince panele gec, degilse mesaji goster
      if (isOnboarding) {
        setTimeout(() => router.push('/dashboard'), 900)
      } else {
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '600', color: c.text, fontSize: '14px' }
  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: `1px solid ${c.inputBorder}`,
    borderRadius: '10px',
    boxSizing: 'border-box',
    background: c.input,
    color: c.text,
    fontSize: '14px',
    outline: 'none',
  }
  const hintStyle = { fontSize: '12px', color: c.textSecondary, marginTop: '5px' }

  return (
    <div style={{
      minHeight: '100vh',
      background: c.bgGradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        padding: '40px',
        border: `1px solid ${c.cardBorder}`,
        borderRadius: '20px',
        background: c.card,
        boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(102, 126, 234, 0.15)'
      }}>

        {/* Logo + baslik */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{
            fontSize: '24px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            SiparişDefterim
          </span>
        </div>

        <h2 style={{ textAlign: 'center', color: c.text, marginBottom: '8px', fontSize: '22px', fontWeight: '700' }}>
          İşletme Bilgileri
        </h2>

        {isOnboarding && (
          <p style={{ textAlign: 'center', color: '#667eea', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>
            Başlamadan önce işletmenizi tanıtalım
          </p>
        )}

        <p style={{ textAlign: 'center', color: c.textSecondary, fontSize: '13px', marginBottom: '28px', lineHeight: 1.6 }}>
          Bu bilgiler sipariş fişlerinde ve müşterilerinize gönderilen WhatsApp mesajlarında görünür.
        </p>

        {initialLoading ? (
          <p style={{ textAlign: 'center', color: c.textSecondary }}>Yükleniyor...</p>
        ) : (
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>İşletme Adı *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Örn: Ayşe'nin Butiği"
                style={inputStyle}
              />
              <div style={hintStyle}>Müşterilerinizin sizi tanıdığı isim.</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>İşletme Telefonu</label>
              <input
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="Örn: 0532 123 45 67"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={labelStyle}>Instagram Kullanıcı Adı</label>
              <input
                type="text"
                value={businessInstagram}
                onChange={(e) => setBusinessInstagram(e.target.value)}
                placeholder="Örn: aysenin_butigi"
                style={inputStyle}
              />
              <div style={hintStyle}>Başına @ koymanıza gerek yok.</div>
            </div>

            {message && (
              <div style={{
                marginBottom: '16px',
                padding: '12px',
                background: message.includes('✅') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: message.includes('✅') ? '#22c55e' : '#ef4444',
                border: `1px solid ${message.includes('✅') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: '10px',
                fontSize: '14px',
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#4b4b5e' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '700',
                fontSize: '15px',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        )}

        <button
          onClick={() => {
            if (isOnboarding && typeof window !== 'undefined') {
              localStorage.setItem('onboarding_skipped', 'true')
            }
            router.push('/dashboard')
          }}
          style={{
            width: '100%',
            padding: '13px',
            marginTop: '10px',
            background: 'transparent',
            border: `1px solid ${c.inputBorder}`,
            borderRadius: '12px',
            cursor: 'pointer',
            color: c.textSecondary,
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          {isOnboarding ? 'Şimdilik Atla' : 'Panele Dön'}
        </button>
      </div>
    </div>
  )
}

export default function Settings() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontFamily: 'Arial', fontSize: '14px' }}>
        Yükleniyor...
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}