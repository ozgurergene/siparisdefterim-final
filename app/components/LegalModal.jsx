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

  const [expandedItems, setExpandedItems] = useState({});

  const items = [
    {
      id: 'enlightenmentRead',
      label: 'KVKK Aydinlatma Metni',
      description: 'Kisisel verileriniz nasil islenecegini okuyunuz',
      fullText: `Veri Sorumlusu: SiparisDefterim

İşlenen Kişisel Veriler:
• Ad ve soyad
• E-mail adresi
• Telefon numarası
• Instagram hesap bilgileri
• Sipariş ve müşteri verileri
• Sistem logları (IP, cihaz, erişim saatleri)
• Çerez verileri

İşleme Amacı:
• Platform hizmetinin sunulması
• Üyelik ve hesap yönetimi
• Sipariş yönetim hizmetinin sağlanması
• WhatsApp bildirimleri gönderimi
• Müşteri destek hizmetleri
• Yasal yükümlülüklerin yerine getirilmesi
• Platform güvenliği
• Hizmet ve ürünlerin iyileştirilmesi

Hukuki Dayanak:
6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca işlenmektedir.`
    },
    {
      id: 'termsCheck',
      label: 'Mesafeli Sozlesmeler Yonetmeligi',
      description: '14 gun icinde cayma hakkiniz bulunmaktadir',
      fullText: `Mesafeli Sözleşmeler Yönetmeliği Kapsamında Bilgilendirme

Satıcı Bilgileri:
Şirket: SiparişDefterim
E-mail: support@siparisdefterim.com

Hizmet Özeti:
Instagram satıcıları için sipariş yönetim, durum takibi ve müşteri bildirimi hizmetleri

Fiyat:
Ücretsiz Plan: 50 siparişe kadar
Pro Plan: [Fiyat belirtilecek]

Ödeme Yöntemi:
Kredi kartı, banka transferi

Cayma Hakkı:
Sözleşmenin imzalanmasından itibaren 14 (on dört) gün içinde cayma hakkınız bulunmaktadır.`
    },
    {
      id: 'consentCheck',
      label: 'Acik Riza Beyan Formu',
      description: 'Kisisel verilerinizin islenmesine riza veriyorum',
      fullText: `Kişisel Verilere İlişkin Açık Rıza Beyan Formu

Yukarıda belirtilen kişisel verilerinizin SiparişDefterim tarafından işlenmesine ve 
aşağıdaki amaçlar doğrultusunda kullanılmasına özgür irademle rıza gösteriyorum:

1. Platform hizmetinin sunulması
2. Kişileştirilmiş deneyim sağlanması
3. İstatistiksel analiz yapılması
4. Yasal zorunluluklara uyum sağlanması
5. İş ortaklığı ve pazarlama faaliyetleri`
    },
    {
      id: 'privacyCheck',
      label: 'Gizlilik ve Cerez Politikasi',
      description: 'Cerezler ve gizlilik hakkinda bilgi',
      fullText: `Gizlilik ve Çerez Politikası

1. Çerezler Nedir?
Çerezler, internet siteyi ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır.

2. Çerez Türleri:

a) Teknik Çerezler:
- Oturum yönetimi
- Platform güvenliği
- Hata giderme

b) Analitik Çerezler:
- Ziyaretçi davranışı analizi
- Sayfa performansı takibi`
    },
    {
      id: 'disclaimerCheck',
      label: 'Sorumluluk Reddi',
      description: 'Platform OLDUGU GIBI sunulmaktadir',
      fullText: `Sorumluluk Reddi (Disclaimer)

SiparişDefterim Platform "OLDUĞU GİBİ" sunulmaktadır. 

Platform aşağıdakilerden sorumlu DEĞİLDİR:

1. Veri Doğruluğu:
Platform, kullanıcılar tarafından girilen verilerin doğruluğu konusunda sorumluluk almaz.

2. Hizmet Kesintileri:
Sunucu arızaları, ağ sorunları veya diğer teknik nedenlerle ortaya çıkan kesintilerden 
platform sorumlu değildir.`
    }
  ];

  const handleCheckboxChange = (field) => {
    setCheckboxes(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
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
        backgroundColor: '#F5F5F5',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '85vh',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        border: '3px solid #E74C3C',
        overflow: 'hidden',
      }}>
        
        {/* HEADER */}
        <div style={{
          padding: '24px',
          borderBottom: '2px solid #E74C3C',
          backgroundColor: '#F5F5F5',
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
          backgroundColor: '#F5F5F5',
        }}>
          {items.map((item) => (
            <div key={item.id}>
              {/* ITEM HEADER */}
              <div style={{
                borderBottom: '1px solid #E0E0E0',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                backgroundColor: '#F5F5F5',
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
                <button
                  onClick={() => toggleExpand(item.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#E74C3C',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: '0 8px',
                    flexShrink: 0,
                  }}
                >
                  {expandedItems[item.id] ? '▲' : '▼'}
                </button>
              </div>

              {/* EXPANDED CONTENT */}
              {expandedItems[item.id] && (
                <div style={{
                  backgroundColor: '#EEEEEE',
                  padding: '16px 24px',
                  borderBottom: '1px solid #E0E0E0',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}>
                  <pre style={{
                    fontSize: '12px',
                    color: '#555',
                    lineHeight: '1.6',
                    fontFamily: 'Arial, sans-serif',
                    margin: '0',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}>
                    {item.fullText}
                  </pre>
                </div>
              )}
            </div>
          ))}

          {/* EMAIL CHECKBOX */}
          <div style={{
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            backgroundColor: '#F5F5F5',
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
          backgroundColor: '#F5F5F5',
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
              color: '#F5F5F5',
              transition: 'all 0.3s',
            }}
          >
            {allRequiredChecked ? 'Üye Ol' : 'Tüm metinleri onayla'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;