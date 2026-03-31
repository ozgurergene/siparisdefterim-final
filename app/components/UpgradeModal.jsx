'use client';

import { useRouter } from 'next/navigation';

export default function UpgradeModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#F5F5F5',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        padding: '60px 40px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
      }}>
        
        {/* WARNING ICON */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#FF9800',
          borderRadius: '50%',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: '#FFFFFF',
        }}>
          ⚠️
        </div>

        {/* TITLE */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          margin: '0 0 16px 0',
        }}>
          LİMİT AŞILDI!
        </h2>

        {/* SUBTITLE */}
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '0 0 32px 0',
          lineHeight: '1.6',
        }}>
          Ücretsiz planda <strong>50 sipariş</strong>'e kadar sipariş oluşturabilirsiniz.
        </p>

        {/* LIMIT INFO */}
        <div style={{
          backgroundColor: '#FFF3E0',
          border: '2px solid #FF9800',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px',
        }}>
          <p style={{
            fontSize: '14px',
            color: '#E65100',
            margin: '0',
            fontWeight: '600',
          }}>
            📊 Mevcut durumu: 50/50 sipariş
          </p>
        </div>

        {/* BENEFITS */}
        <div style={{
          backgroundColor: '#F9F9F9',
          border: '2px solid #EEEEEE',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <p style={{
            fontSize: '12px',
            color: '#999',
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            fontWeight: '600',
          }}>
            Pro Plana Yükselt ve Şunları Kazan:
          </p>
          <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.8' }}>
            <div>✓ <strong>Sınırsız sipariş</strong></div>
            <div>✓ Gelişmiş raporlar</div>
            <div>✓ WhatsApp bildirimleri</div>
            <div>✓ Gelişmiş analitik</div>
            <div>✓ Öncelikli destek</div>
          </div>
        </div>

        {/* PRICING */}
        <div style={{
          backgroundColor: '#E8F5E9',
          border: '2px solid #4CAF50',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '32px',
        }}>
          <p style={{
            fontSize: '12px',
            color: '#2E7D32',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            fontWeight: '600',
          }}>
            Fiyatlandırma
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>Aylık</p>
              <p style={{ fontSize: '24px', color: '#4CAF50', fontWeight: 'bold', margin: '0' }}>
                ₺99<span style={{ fontSize: '14px' }}>/ay</span>
              </p>
            </div>
            <div style={{ borderLeft: '2px solid #DDD' }}></div>
            <div>
              <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>Yıllık</p>
              <p style={{ fontSize: '24px', color: '#4CAF50', fontWeight: 'bold', margin: '0' }}>
                ₺999<span style={{ fontSize: '14px' }}>/yıl</span>
              </p>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <button
          onClick={() => {
            onClose();
            router.push('/pricing');
          }}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: '#4CAF50',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#45A049'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          🚀 PRO'YA YÜKSEL
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px 24px',
            backgroundColor: 'transparent',
            color: '#666',
            border: '2px solid #DDD',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#EEEEEE';
            e.target.style.borderColor = '#BBB';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = '#DDD';
          }}
        >
          DAHA SONRA
        </button>

        {/* FOOTER */}
        <p style={{
          fontSize: '12px',
          color: '#999',
          margin: '24px 0 0 0',
        }}>
          Herhangi bir soru? <a href="mailto:support@siparisdefterim.com" style={{
            color: '#4CAF50',
            textDecoration: 'none',
            fontWeight: '600',
          }}>Bize Ulaşın</a>
        </p>
      </div>
    </div>
  );
}