'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [legalConsent, setLegalConsent] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        padding: '60px 40px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
      }}>
        
        {/* SUCCESS ICON */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#999999',
          borderRadius: '50%',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: 'white',
        }}>
          ✓
        </div>

        {/* TITLE */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333333',
          margin: '0 0 12px 0',
          letterSpacing: '0.5px',
        }}>
          BAŞARIYLA KAYIT OLDUNUZ!
        </h1>

        {/* SUBTITLE */}
        <p style={{
          fontSize: '18px',
          color: '#666666',
          margin: '0 0 32px 0',
          lineHeight: '1.6',
          fontWeight: '400',
        }}>
          Hukuki metinleri onayladığınız için teşekkür ederiz. Hesabınız aktif hale getirilmiştir.
        </p>

        {/* INFO CARD */}
        <div style={{
          backgroundColor: '#F5F5F5',
          border: '1px solid #DDDDDD',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <p style={{
            fontSize: '14px',
            color: '#888888',
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '600',
          }}>
            İLETİŞİM TERCİHLERİ
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '16px',
              color: '#333333',
              fontWeight: '500',
            }}>
              KAMPANYA E-MAİLLERİ
            </span>
            <span style={{
              fontSize: '16px',
              color: '#666666',
              fontWeight: 'bold',
            }}>
              ✓ KABUL EDİLDİ
            </span>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: '#777777',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#666666'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#777777'}
        >
          PANELE GİT
        </button>

        {/* FOOTER TEXT */}
        <p style={{
          fontSize: '13px',
          color: '#999999',
          margin: '24px 0 0 0',
          fontWeight: '400',
        }}>
          Yardıma mı ihtiyacın var? <a href="mailto:support@siparisdefterim.com" style={{
            color: '#666666',
            textDecoration: 'none',
            fontWeight: '600',
            borderBottom: '1px solid #666666',
          }}>BİZE ULAŞIN</a>
        </p>
      </div>
    </div>
  );
}