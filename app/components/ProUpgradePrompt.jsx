'use client'

import { useRouter } from 'next/navigation'
import { colors } from '../lib/theme'

/**
 * ProUpgradePrompt — Free kullanıcılar için Pro'ya yükseltme ekranı
 * Tüm Pro-only sayfalarda kullanılır.
 * 
 * @param {string} featureName - Özellik adı (örn: "Müşteri Listesi")
 * @param {string} icon - Emoji ikon (örn: "👥")
 * @param {string} description - Özelliğin kısa açıklaması
 * @param {string[]} benefits - Pro üyelikle gelen 3-5 fayda listesi
 * @param {string} theme - 'light' veya 'dark'
 */
export default function ProUpgradePrompt({ 
  featureName, 
  icon = '✨', 
  description,
  benefits = [],
  theme = 'light' 
}) {
  const router = useRouter()
  const c = colors[theme]
  const isDark = theme === 'dark'

  const defaultBenefits = [
    'Sınırsız sipariş oluşturma',
    'Müşteri listesi ve analiz',
    'Detaylı raporlar ve grafikler',
    'Ürün kataloğu',
    'Öncelikli destek'
  ]

  const displayBenefits = benefits.length > 0 ? benefits : defaultBenefits

  return (
    <div style={{
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: c.bg
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: c.header,
        borderRadius: '20px',
        padding: '40px 32px',
        textAlign: 'center',
        border: `1px solid ${c.border}`,
        boxShadow: isDark 
          ? '0 20px 60px rgba(0,0,0,0.5)' 
          : '0 10px 40px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Üstte gradient şerit */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f59e0b 100%)'
        }} />

        {/* PRO Rozeti */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: '20px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '14px' }}>🔒</span>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.5px'
          }}>PRO ÖZELLİĞİ</span>
        </div>

        {/* İkon */}
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{icon}</div>

        {/* Başlık */}
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          margin: '0 0 12px 0',
          color: c.text
        }}>
          {featureName}
        </h1>

        {/* Açıklama */}
        {description && (
          <p style={{
            fontSize: '15px',
            color: c.textSecondary,
            margin: '0 0 28px 0',
            lineHeight: '1.6'
          }}>
            {description}
          </p>
        )}

        {/* Faydalar Listesi */}
        <div style={{
          background: isDark ? 'rgba(102, 126, 234, 0.08)' : 'rgba(102, 126, 234, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <p style={{
            fontSize: '13px',
            fontWeight: '600',
            color: c.text,
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            ✨ Pro üyelikle:
          </p>
          {displayBenefits.map((benefit, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 0',
              fontSize: '14px',
              color: c.text
            }}>
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: '#22c55e', fontSize: '11px', fontWeight: 'bold' }}>✓</span>
              </span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Butonları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => router.push('/pricing')}
            style={{
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            <span>⭐</span>
            Pro'ya Yükselt
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: c.textSecondary,
              border: `1px solid ${c.border}`,
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = c.bgSecondary
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            ← Panele Geri Dön
          </button>
        </div>

        {/* Alt bilgi */}
        <p style={{
          fontSize: '12px',
          color: c.textSecondary,
          marginTop: '20px',
          marginBottom: 0
        }}>
          14 gün koşulsuz iade garantisi · İstediğiniz zaman iptal
        </p>
      </div>
    </div>
  )
}