'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const monthlyPrice = 99;
  const yearlyPrice = 999;
  const monthlyAnnualTotal = monthlyPrice * 12;
  const discountPercent = Math.round(((monthlyAnnualTotal - yearlyPrice) / monthlyAnnualTotal) * 100);
  const discountAmount = monthlyAnnualTotal - yearlyPrice;

  const handlePlanSelect = async (planType) => {
    setLoading(true);
    setError('');

    try {
      // Şu anki user'ı al
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setError('Giriş yapmanız gerekiyor');
        router.push('/login');
        return;
      }

      // Ücretsiz plan seçilirse → Direkt success'e git
      if (planType === 'free') {
        router.push('/success');
        return;
      }

      // Pro plan seçilirse → Supabase'e kaydet + Payment'e git
      const planName = billingCycle === 'monthly' ? 'pro_monthly' : 'pro_yearly';
      const price = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;

      // Subscriptions tablosuna kaydet
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: planName,
          status: 'active',
          price: price,
          start_date: new Date().toISOString(),
        });

      if (insertError) {
        setError('Plan kaydedilemedi: ' + insertError.message);
        return;
      }

      // Payment sayfasına yönlendir
      router.push(`/payment?plan=${planName}&price=${price}`);
    } catch (err) {
      setError('Bir hata oluştu: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            SİPARİŞDEFTERİM FİYATLANDIRMASI
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            margin: '0',
          }}>
            Basit, şeffaf ve uygun fiyatlı planlar
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div style={{
            backgroundColor: '#FFEBEE',
            border: '1px solid #EF5350',
            color: '#C62828',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '30px',
            maxWidth: '600px',
            margin: '0 auto 30px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* PLANS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '60px',
        }}>
          
          {/* FREE PLAN */}
          <div style={{
            backgroundColor: '#F5F5F5',
            border: '2px solid #CCCCCC',
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
                / Sonsuza kadar
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

            <button
              onClick={() => handlePlanSelect('free')}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                backgroundColor: '#DDDDDD',
                color: '#333',
                border: '2px solid #BBBBBB',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.3s',
              }}
            >
              HEMEN BAŞLA
            </button>
          </div>

          {/* PRO PLAN */}
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

            <button
              onClick={() => handlePlanSelect('pro')}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                backgroundColor: '#4CAF50',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#45A049')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#4CAF50')}
            >
              {loading ? 'YÜKLENİYOR...' : 'HEMEN BAŞLA'}
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
              Ayda 50'den az sipariş işliyorsanız Ücretsiz plan yeterli. Daha fazlasına ihtiyaç duyarsanız Pro plana yükseltin.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 8px 0',
            }}>
              Yerinden ayrılabilir miyim?
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