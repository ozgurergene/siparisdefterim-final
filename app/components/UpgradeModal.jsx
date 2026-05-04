'use client'

import { colors } from '../../lib/theme'

// Lemon Squeezy Checkout URLs (Test Mode)
const CHECKOUT_URLS = {
  monthly: 'https://siparisdefterim-final.lemonsqueezy.com/checkout/buy/c2ec9f39-40ec-4f7a-a0eb-f6a6f5ce2461',
  yearly: 'https://siparisdefterim-final.lemonsqueezy.com/checkout/buy/a4c6b3d5-dc9b-4375-babf-69ab15ca4999'
}

const SUPPORT_EMAIL = 'destek@deftertut.com'

export default function UpgradeModal({ isOpen, onClose, theme = 'light' }) {
  const c = colors[theme]

  if (!isOpen) return null

  const handleMonthly = () => {
    window.open(CHECKOUT_URLS.monthly, '_blank')
  }

  const handleYearly = () => {
    window.open(CHECKOUT_URLS.yearly, '_blank')
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: c.header,
        padding: '35px',
        borderRadius: '16px',
        maxWidth: '440px',
        width: '100%',
        textAlign: 'center',
        border: `1px solid ${c.border}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>
        {/* Icon */}
        <div style={{ fontSize: '64px', marginBottom: '15px' }}>🚀</div>

        {/* Title */}
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: c.text }}>
          Limit Doldu!
        </h2>

        {/* Subtitle */}
        <p style={{ margin: '0 0 25px 0', fontSize: '15px', color: c.textSecondary, lineHeight: '1.6' }}>
          50 sipariş limitine ulaştınız. Pro'ya yükselterek{' '}
          <strong style={{ color: '#667eea' }}>sınırsız sipariş</strong>{' '}
          oluşturabilirsiniz.
        </p>

        {/* Features */}
        <div style={{
          background: c.bgSecondary,
          padding: '18px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ color: '#1D9E75', fontSize: '16px', fontWeight: 'bold' }}>✓</span>
            <span style={{ color: c.text, fontSize: '14px' }}>Sınırsız sipariş oluşturma</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ color: '#1D9E75', fontSize: '16px', fontWeight: 'bold' }}>✓</span>
            <span style={{ color: c.text, fontSize: '14px' }}>Gelişmiş raporlama</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#1D9E75', fontSize: '16px', fontWeight: 'bold' }}>✓</span>
            <span style={{ color: c.text, fontSize: '14px' }}>Öncelikli destek</span>
          </div>
        </div>

        {/* Pricing Cards - Now Clickable */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {/* Monthly - Clickable */}
          <button
            onClick={handleMonthly}
            style={{
              flex: 1,
              background: c.bgSecondary,
              padding: '14px',
              borderRadius: '10px',
              border: `1px solid ${c.border}`,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Aylık
            </p>
            <p style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: c.text }}>
              ₺99<span style={{ fontSize: '12px', color: c.textSecondary, fontWeight: 'normal' }}>/ay</span>
            </p>
          </button>

          {/* Yearly - Clickable, highlighted */}
          <button
            onClick={handleYearly}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #667eea',
              position: 'relative',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '8px',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: '#fff',
              fontSize: '9px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '700'
            }}>
              %16 İNDİRİM
            </span>
            <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#667eea', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
              Yıllık
            </p>
            <p style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: c.text }}>
              ₺83<span style={{ fontSize: '12px', color: c.textSecondary, fontWeight: 'normal' }}>/ay</span>
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: c.textSecondary }}>
              ₺999 yıllık ödeme
            </p>
          </button>
        </div>

        {/* Hint Text */}
        <p style={{ margin: '0 0 18px 0', fontSize: '11px', color: c.textSecondary }}>
          💡 Yukarıdaki plana tıklayarak ödeme yapabilirsiniz
        </p>

        {/* Close Button */}
        <button
          onClick={onClose} style={{
          width: '100%',
          padding: '14px',
          background: 'rgba(182, 126, 234, 0.15)',
          border: '1px solid rgba(102, 126, 234, 0.4)',
          borderRadius: '12px',
          color: '#a5b4fc',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
          }}
        >
          Kapat
        </button>

        {/* Footer - Support Email */}
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: c.textSecondary,
          paddingTop: '16px',
          borderTop: `1px solid ${c.border}`
        }}>
          Herhangi bir soru?{' '}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600'
            }}
            onMouseOver={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
            onMouseOut={(e) => { e.currentTarget.style.textDecoration = 'none' }}
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}