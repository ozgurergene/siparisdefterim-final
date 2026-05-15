'use client'

import { useState } from 'react'
import { colors } from '../../lib/theme'
import { useRouter } from 'next/navigation'
import { startPolarCheckout } from '../../lib/checkout-client'

const SUPPORT_EMAIL = 'destek@deftertut.com'

export default function UpgradeModal({ isOpen, onClose, theme = 'light' }) {
  const c = colors[theme]
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handlePlanClick = async (plan) => {
    if (loadingPlan) return
    setError(null)
    setLoadingPlan(plan)
    try {
      await startPolarCheckout(plan)
    } catch (err) {
      setError(err.message || 'Ödeme sayfası açılamadı, lütfen tekrar deneyin.')
      setLoadingPlan(null)
    }
  }

  const handleViewAllPlans = () => {
    onClose()
    router.push('/pricing')
  }

  const isMonthlyLoading = loadingPlan === 'monthly'
  const isYearlyLoading = loadingPlan === 'yearly'
  const anyLoading = loadingPlan !== null

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
        <div style={{ fontSize: '64px', marginBottom: '15px' }}>🚀</div>

        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: c.text }}>
          Limit Doldu!
        </h2>

        <p style={{ margin: '0 0 25px 0', fontSize: '15px', color: c.textSecondary, lineHeight: '1.6' }}>
          50 sipariş limitine ulaştınız. Pro'ya yükselterek{' '}
          <strong style={{ color: '#667eea' }}>sınırsız sipariş</strong>{' '}
          oluşturabilirsiniz.
        </p>

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

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '14px',
            textAlign: 'left'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button
            onClick={() => handlePlanClick('monthly')}
            disabled={anyLoading}
            style={{
              flex: 1,
              background: c.bgSecondary,
              padding: '14px',
              borderRadius: '10px',
              border: `1px solid ${c.border}`,
              cursor: anyLoading ? 'wait' : 'pointer',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              opacity: anyLoading && !isMonthlyLoading ? 0.5 : 1
            }}
            onMouseOver={(e) => {
              if (anyLoading) return
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
              {isMonthlyLoading ? (
                <span style={{ fontSize: '14px' }}>Yönlendiriliyor...</span>
              ) : (
                <>$2.99<span style={{ fontSize: '12px', color: c.textSecondary, fontWeight: 'normal' }}>/ay</span></>
              )}
            </p>
          </button>

          <button
            onClick={() => handlePlanClick('yearly')}
            disabled={anyLoading}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #667eea',
              position: 'relative',
              cursor: anyLoading ? 'wait' : 'pointer',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              opacity: anyLoading && !isYearlyLoading ? 0.5 : 1
            }}
            onMouseOver={(e) => {
              if (anyLoading) return
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
              {isYearlyLoading ? (
                <span style={{ fontSize: '14px' }}>Yönlendiriliyor...</span>
              ) : (
                <>$2.50<span style={{ fontSize: '12px', color: c.textSecondary, fontWeight: 'normal' }}>/ay</span></>
              )}
            </p>
            {!isYearlyLoading && (
              <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: c.textSecondary }}>
                $29.99 yıllık ödeme
              </p>
            )}
          </button>
        </div>

        <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: c.textSecondary }}>
          💡 Yukarıdaki plana tıklayarak ödeme yapabilirsiniz
        </p>

        <button
          onClick={handleViewAllPlans}
          disabled={anyLoading}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#667eea',
            fontSize: '13px',
            fontWeight: '600',
            cursor: anyLoading ? 'wait' : 'pointer',
            marginBottom: '18px',
            padding: '4px 8px',
            textDecoration: 'underline',
            opacity: anyLoading ? 0.5 : 1
          }}
        >
          Tüm planları ve detayları gör →
        </button>

        <button
          onClick={onClose}
          disabled={anyLoading}
          style={{
            width: '100%',
            padding: '14px',
            background: 'rgba(182, 126, 234, 0.15)',
            border: '1px solid rgba(102, 126, 234, 0.4)',
            borderRadius: '12px',
            color: '#a5b4fc',
            fontSize: '14px',
            fontWeight: '600',
            cursor: anyLoading ? 'not-allowed' : 'pointer',
            opacity: anyLoading ? 0.5 : 1
          }}
        >
          Kapat
        </button>

        <p style={{
          margin: '16px 0 0 0',
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