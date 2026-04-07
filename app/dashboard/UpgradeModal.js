'use client'

import { useRouter } from 'next/navigation'
import { colors } from '../../lib/theme'

export default function UpgradeModal({ show, onClose, theme }) {
  const router = useRouter()
  const c = colors[theme]

  if (!show) return null

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
      padding: '20px'
    }}>
      <div style={{
        background: c.header,
        padding: '35px',
        borderRadius: '16px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        border: `1px solid ${c.border}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '15px' }}>🚀</div>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: c.text }}>Limit Doldu!</h2>
        <p style={{ margin: '0 0 25px 0', fontSize: '15px', color: c.textSecondary, lineHeight: '1.6' }}>
          50 sipariş limitine ulaştınız. Pro'ya yükselterek <strong style={{ color: '#667eea' }}>sınırsız sipariş</strong> oluşturabilirsiniz.
        </p>

        {/* Features */}
        <div style={{ 
          background: c.bgSecondary, 
          padding: '15px', 
          borderRadius: '10px', 
          marginBottom: '25px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ color: '#1D9E75', fontSize: '16px' }}>✓</span>
            <span style={{ color: c.text, fontSize: '14px' }}>Sınırsız sipariş oluşturma</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ color: '#1D9E75', fontSize: '16px' }}>✓</span>
            <span style={{ color: c.text, fontSize: '14px' }}>Öncelikli destek</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#1D9E75', fontSize: '16px' }}>✓</span>
            <span style={{ color: c.text, fontSize: '14px' }}>Gelişmiş raporlama</span>
          </div>
        </div>

        {/* Price */}
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: c.textSecondary }}>
          Sadece <span style={{ fontSize: '24px', fontWeight: 'bold', color: c.text }}>₺99</span>/ay
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              color: c.textSecondary,
              border: `1px solid ${c.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Sonra
          </button>
          <button
            onClick={() => router.push('/payment')}
            style={{
              flex: 2,
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Pro'ya Yükselt 🚀
          </button>
        </div>
      </div>
    </div>
  )
}