'use client';

import LegalModal from '../components/LegalModal';
import { useState } from 'react';

export default function SignupPage() {
  const [showLegalModal, setShowLegalModal] = useState(true);
  const [legalConsent, setLegalConsent] = useState(null);

  const handleLegalComplete = (consent) => {
    console.log('Consent:', consent);
    setLegalConsent(consent);
    setShowLegalModal(false);
  };

  if (showLegalModal) {
    return <LegalModal onComplete={handleLegalComplete} />;
  }

  // SUCCESS SAYFASI
  return (
    <div style={{
      minHeight: '100vh',
      background: '#E8E8E8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#4A4A4A',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '60px 40px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#4CAF50',
          borderRadius: '50%',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: '#CCCCCC',
          border: '3px solid #4CAF50',
        }}>✓</div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#CCCCCC',
          margin: '0 0 12px 0',
          border: '2px solid #4CAF50',
          padding: '16px 24px',
          borderRadius: '8px',
          display: 'inline-block',
        }}>BAŞARIYLA KAYIT OLDUNUZ!</h1>
        <p style={{
          fontSize: '18px',
          color: '#BBBBBB',
          margin: '24px 0 32px 0',
          lineHeight: '1.6',
        }}>Hukuki metinleri onayladığınız için teşekkür ederiz. Hesabınız aktif hale getirilmiştir.</p>
        <div style={{
          backgroundColor: '#555555',
          border: '2px solid #4CAF50',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <p style={{fontSize: '14px', color: '#AAAAAA', margin: '0 0 12px 0', textTransform: 'uppercase', fontWeight: '600'}}>İLETİŞİM TERCİHLERİ</p>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span style={{fontSize: '16px', color: '#BBBBBB', fontWeight: '500'}}>KAMPANYA E-MAİLLERİ</span>
            <span style={{fontSize: '16px', color: '#4CAF50', fontWeight: 'bold'}}>✓ {legalConsent?.emailMarketing ? 'KABUL EDİLDİ' : 'RETTEDİLDİ'}</span>
          </div>
        </div>
        <button onClick={() => window.location.href = '/login'} style={{
          width: '100%', padding: '16px 24px', backgroundColor: '#4CAF50', color: '#FFFFFF',
          border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
          textTransform: 'uppercase',
        }}>PANELE GİT</button>
        <p style={{fontSize: '13px', color: '#AAAAAA', margin: '24px 0 0 0'}}>
          Yardıma mı ihtiyacın var? <a href="mailto:support@siparisdefterim.com" style={{
            color: '#BBBBBB', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid #BBBBBB'}}>BİZE ULAŞIN</a>
        </p>
      </div>
    </div>
  );
}