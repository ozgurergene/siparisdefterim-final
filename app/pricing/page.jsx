'use client';

import { useState } from 'react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const monthlyPrice = 99;
  const yearlyPrice = 999;
  const monthlyAnnualTotal = monthlyPrice * 12;
  const discountPercent = Math.round(((monthlyAnnualTotal - yearlyPrice) / monthlyAnnualTotal) * 100);
  const discountAmount = monthlyAnnualTotal - yearlyPrice;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
      padding: '60px 20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        
        {/* HEADER */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
        }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#333',
            margin: '0 0 16px 0',
          }}>
            SİPARİŞ DEFTERİM FİYATLANDIRMASI
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            margin: '0',
          }}>
            Basit, şeffaf ve uygun fiyatlı planlar
          </p>
        </div>

        {/* FREE PLAN */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '60px',
        }}>
          
          {/* FREE CARD */}
          <div style={{
            backgroundColor: '#F5F5F5',
            border: '2px solid #333',
            borderRadius: '16px',
            padding: '40px 30px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 8px 0',
            }}>
              ÜCRETSİZ
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#999',
              margin: '0 0 24px 0',
            }}>
              Başlamak için mükemmel
            </p>

            <div style={{
              backgroundColor: '#EEEEEE',
              border: '2px solid #BBBBBB',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#333',
              }}>
                ₺0
              </div>
              <div style={{
                fontSize: '14px',
                color: '#999',
                marginTop: '8px',
              }}>
                / 50 siparişe kadar
              </div>
            </div>

            <div style={{
              textAlign: 'left',
              marginBottom: '32px',
            }}>
              <div style={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✓ <span>50 siparişe kadar</span>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✓ <span>Temel raporlar</span>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✓ <span>WhatsApp bildirimleri</span>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#999',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✗ <span>Gelişmiş analitik</span>
              </div>
            </div>

            <button style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: '#DDDDDD',
              color: '#333',
              border: '2px solid #BBBBBB',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}>
              HEMEN BAŞLA
            </button>
          </div>

          {/* PRO CARD */}
          <div style={{
            backgroundColor: '#F5F5F5',
            border: '3px solid #4CAF50',
            borderRadius: '16px',
            padding: '40px 30px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(76, 175, 80, 0.15)',
            transform: 'scale(1.05)',
            position: 'relative',
          }}>
            
            {/* POPULAR BADGE */}
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#4CAF50',
              color: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              ⭐ EN POPÜLERİ
            </div>

            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              margin: '16px 0 8px 0',
            }}>
              PRO
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#999',
              margin: '0 0 24px 0',
            }}>
              Sınırsız siparişler
            </p>

            {/* PRICE SELECTOR */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px',
              backgroundColor: '#EEEEEE',
              padding: '8px',
              borderRadius: '8px',
            }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: billingCycle === 'monthly' ? '#4CAF50' : 'transparent',
                  color: billingCycle === 'monthly' ? '#FFFFFF' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                AYLIK
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: billingCycle === 'yearly' ? '#4CAF50' : 'transparent',
                  color: billingCycle === 'yearly' ? '#FFFFFF' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                YILLIK
              </button>
            </div>

            {/* PRICING DISPLAY */}
            {billingCycle === 'monthly' ? (
              <div style={{
                backgroundColor: '#F0F8F5',
                border: '2px solid #4CAF50',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
              }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#4CAF50',
                }}>
                  ₺{monthlyPrice}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginTop: '8px',
                }}>
                  / Ayda
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginTop: '8px',
                }}>
                  Yıllık toplam: ₺{monthlyAnnualTotal}
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#F0F8F5',
                border: '2px solid #4CAF50',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
                position: 'relative',
              }}>
                
                {/* DISCOUNT BADGE */}
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '12px',
                  backgroundColor: '#4CAF50',
                  color: '#FFFFFF',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  %{discountPercent} İNDİRİM
                </div>

                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#4CAF50',
                }}>
                  ₺{yearlyPrice}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginTop: '8px',
                }}>
                  / Yılda
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginTop: '8px',
                }}>
                  Tasarruf: ₺{discountAmount}
                </div>
              </div>
            )}

            <div style={{
              textAlign: 'left',
              marginBottom: '32px',
            }}>
              <div style={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✓ <span><strong>Sınırsız siparişler</strong></span>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✓ <span>Gelişmiş raporlar</span>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✓ <span>WhatsApp bildirimleri</span>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✓ <span>Gelişmiş analitik</span>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✓ <span>Öncelikli destek</span>
              </div>
            </div>

            <button style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: '#4CAF50',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#45A049'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
            >
              HEMEN BAŞLA
            </button>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#F5F5F5',
          borderRadius: '16px',
          padding: '40px 30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            SIKÇA SORULAN SORULAR
          </h2>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 8px 0',
            }}>
              Hangi planı seçmeliyim?
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '0',
              lineHeight: '1.6',
            }}>
              Ayda 50'den az sipariş işliyorsanız Ücretsiz plan yeterli. Daha fazlasına ihtiyaç duyarsanız Pro plana yükseltebilirsiniz.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 8px 0',
            }}>
              İstediğim zaman ayrılabilir miyim?
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '0',
              lineHeight: '1.6',
            }}>
              Evet! İstediğiniz zaman planınızı iptal edebilirsiniz. Herhangi bir uzun vadeli kontrat yoktur.
            </p>
          </div>

          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 8px 0',
            }}>
              Nasıl ödeme yapabilirim?
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '0',
              lineHeight: '1.6',
            }}>
              Kredi kartı, banka transferi ve Stripe ile ödeme yapabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}