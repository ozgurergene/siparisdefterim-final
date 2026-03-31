'use client';

import React, { useState } from 'react';

const LegalModal = ({ onComplete }) => {
  const [checkboxes, setCheckboxes] = useState({
    enlightenmentRead: false,
    consentCheck: false,
    termsCheck: false,
    privacyCheck: false,
    disclaimerCheck: false,
    emailMarketing: false,
  });

  const items = [
    { id: 'enlightenmentRead', label: 'KVKK Aydinlatma Metni', description: 'Kisisel verileriniz nasil islenecegini okuyunuz' },
    { id: 'termsCheck', label: 'Mesafeli Sozlesmeler Yonetmeligi', description: '14 gun icinde cayma hakkiniz bulunmaktadir' },
    { id: 'consentCheck', label: 'Acik Riza Beyan Formu', description: 'Kisisel verilerinizin islenmesine riza veriyorum' },
    { id: 'privacyCheck', label: 'Gizlilik ve Cerez Politikasi', description: 'Cerezler ve gizlilik hakkinda bilgi' },
    { id: 'disclaimerCheck', label: 'Sorumluluk Reddi', description: 'Platform OLDUGU GIBI sunulmaktadir' },
  ];

  const handleCheckboxChange = (field) => {
    setCheckboxes(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const allRequiredChecked = 
    checkboxes.enlightenmentRead &&
    checkboxes.consentCheck &&
    checkboxes.termsCheck &&
    checkboxes.privacyCheck &&
    checkboxes.disclaimerCheck;

  const handleComplete = () => {
    if (allRequiredChecked) {
      onComplete({
        ...checkboxes,
        timestamp: new Date().toISOString(),
      });
    }
  };

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
        backgroundColor: '#FFFFFF',
        width: '90%',
        maxWidth: '700px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        border: '3px solid #E74C3C',
      }}>
        
        {/* HEADER */}
        <div style={{
          padding: '24px',
          borderBottom: '2px solid #E74C3C',
          backgroundColor: '#F8F9FA',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            margin: '0 0 8px 0',
          }}>
            Kisisel Verilere Iliskin Aydinlatma
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: '0',
          }}>
            Lutfen tum hukuki metinleri okuyup onaylayin
          </p>
        </div>

        {/* ITEMS LIST */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0',
        }}>
          {items.map((item, index) => (
            <div key={item.id} style={{
              borderBottom: index < items.length - 1 ? '1px solid #E0E0E0' : 'none',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <input
                type="checkbox"
                id={item.id}
                checked={checkboxes[item.id]}
                onChange={() => handleCheckboxChange(item.id)}
                style={{
                  marginTop: '4px',
                  cursor: 'pointer',
                  width: '18px',
                  height: '18px',
                  accentColor: '#E74C3C',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <label htmlFor={item.id} style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  cursor: 'pointer',
                  display: 'block',
                  marginBottom: '4px',
                }}>
                  {item.label}
                </label>
                <p style={{
                  fontSize: '12px',
                  color: '#999',
                  margin: '0',
                  cursor: 'pointer',
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}

          {/* EMAIL CHECKBOX */}
          <div style={{
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            backgroundColor: '#F8F9FA',
            borderTop: '1px solid #E0E0E0',
          }}>
            <input
              type="checkbox"
              id="emailMarketing"
              checked={checkboxes.emailMarketing}
              onChange={() => handleCheckboxChange('emailMarketing')}
              style={{
                marginTop: '4px',
                cursor: 'pointer',
                width: '18px',
                height: '18px',
                accentColor: '#E74C3C',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <label htmlFor="emailMarketing" style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                cursor: 'pointer',
                display: 'block',
              }}>
                Kampanyalardan haberdar olmak istiyorum
              </label>
              <p style={{
                fontSize: '12px',
                color: '#999',
                margin: '0',
              }}>
                (Secmeli)
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #E0E0E0',
          backgroundColor: '#F8F9FA',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={handleComplete}
            disabled={!allRequiredChecked}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '6px',
              cursor: allRequiredChecked ? 'pointer' : 'not-allowed',
              backgroundColor: allRequiredChecked ? '#E74C3C' : '#CCCCCC',
              color: '#FFFFFF',
              transition: 'all 0.3s',
            }}
          >
            {allRequiredChecked ? 'Kabul Edip Uye Ol' : 'Tum metinleri onayla'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;