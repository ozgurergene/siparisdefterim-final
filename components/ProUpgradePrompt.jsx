'use client'

import { useRouter } from 'next/navigation'
import { colors, buttonGradients, glowEffects } from '../lib/theme'

/**
 * ProUpgradePrompt — Free kullanıcılara Pro yükseltme ekranı
 *
 * Kullanım:
 * <ProUpgradePrompt
 *   theme={theme}
 *   feature="Müşteri Yönetimi"
 *   description="Müşterilerini takip et, sipariş geçmişini gör"
 *   icon="👥"
 * />
 */
export default function ProUpgradePrompt({
  theme = 'light',
  feature = 'Bu Özellik',
  description = 'Pro plana geçerek tüm gelişmiş özelliklere erişin',
  icon = '✨'
}) {
  const router = useRouter()
  const c = colors[theme]
  const isDark = theme === 'dark'

  const features = [
    { icon: '👥', title: 'Müşteri Yönetimi', desc: 'Müşterilerini takip et, sipariş geçmişini gör' },
    { icon: '📦', title: 'Ürün Kataloğu', desc: 'Sık kullandığın ürünleri kaydet, hızlı seçim' },
    { icon: '📊', title: 'Detaylı Raporlar', desc: 'Gelir grafikleri, en çok satanlar, KPI\'lar' },
    { icon: '♾️', title: 'Sınırsız Sipariş', desc: '50 sipariş limitini kaldır' },
    { icon: '🚀', title: 'Öncelikli Destek', desc: 'Hızlı yanıt, özel destek' },
  ]

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: c.bgCard,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px 32px',
        border: `1px solid ${c.border}`,
        boxShadow: `0 20px 60px ${c.shadow}`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background gradient effect */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Lock icon */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            borderRadius: '50%',
            background: buttonGradients.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            boxShadow: glowEffects.primary,
            animation: 'pulse 2s infinite ease-in-out'
          }}>
            {icon}
          </div>

          {/* Pro badge */}
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#fff',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1px',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
          }}>
            ⭐ PRO ÖZELLİĞİ
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: c.text,
            margin: '0 0 12px 0',
            letterSpacing: '-0.5px'
          }}>
            {feature}
          </h1>

          <p style={{
            fontSize: '16px',
            color: c.textSecondary,
            margin: '0 0 32px 0',
            lineHeight: '1.6'
          }}>
            {description}
          </p>

          {/* Feature list */}
          <div style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '28px',
            textAlign: 'left'
          }}>
            <p style={{
              fontSize: '13px',
              fontWeight: '600',
              color: c.textMuted,
              margin: '0 0 16px 0',
              textAlign: 'center',
              letterSpacing: '0.5px'
            }}>
              PRO PLAN İLE NELER KAZANIYORSUN
            </p>
            {features.map((f, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                borderBottom: i < features.length - 1 ? `1px solid ${c.borderLight}` : 'none'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  {f.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: c.text,
                    marginBottom: '2px'
                  }}>
                    {f.title}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: c.textSecondary,
                    lineHeight: '1.4'
                  }}>
                    {f.desc}
                  </div>
                </div>
                <div style={{
                  color: '#22c55e',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  ✓
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div style={{
            background: buttonGradients.primary,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            color: '#fff'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>
              Sadece
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1' }}>
              99 TL<span style={{ fontSize: '16px', fontWeight: '500', opacity: 0.9 }}>/ay</span>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '6px' }}>
              veya yıllık 999 TL (2 ay bedava 🎁)
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => router.push('/pricing')}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: buttonGradients.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: glowEffects.primary,
              transition: 'transform 0.2s ease',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🚀 Pro&apos;ya Yükselt
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            style={{
              marginTop: '12px',
              padding: '10px 20px',
              background: 'transparent',
              color: c.textSecondary,
              border: 'none',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Daha sonra
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}