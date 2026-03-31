'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState('');
  const [price, setPrice] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, []);

  const getPlanLabel = () => {
    if (plan === 'pro_monthly') return 'PRO - AYLIK';
    if (plan === 'pro_yearly') return 'PRO - YILLIK';
    return 'ÜCRETSİZ';
  };

  const getPriceLabel = () => {
    if (price === '99') return '₺99/ay';
    if (price === '999') return '₺999/yıl';
    return 'Ücretsiz';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#F5F5F5',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        padding: '60px 40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
      }}>
        
        {/* SUCCESS ICON */}
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
          color: '#FFFFFF',
          border: '3px solid #4CAF50',
        }}>
          ✓
        </div>

        {/* TITLE */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          margin: '0 0 12px 0',
          border: '2px solid #4CAF50',
          padding: '16px 24px',
          borderRadius: '8px',
          display: 'inline-block',
        }}>
          BAŞARIYLA KAYIT OLDUNUZ!
        </h1>

        {/* SUBTITLE */}
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '24px 0 32px 0',
          lineHeight: '1.6',
        }}>
          Hesabınız başarıyla oluşturuldu ve aktif hale getirilmiştir.
        </p>

        {/* PLAN INFO CARD */}
        <div style={{
          backgroundColor: '#F0F8F5',
          border: '2px solid #4CAF50',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <p style={{
            fontSize: '12px',
            color: '#999',
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '600',
          }}>
            Plan Bilgileri
          </p>

          <div style={{
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid #DDD',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '14px',
              color: '#666',
              fontWeight: '500',
            }}>
              Email:
            </span>
            <span style={{
              fontSize: '14px',
              color: '#333',
              fontWeight: 'bold',
            }}>
              {userEmail}
            </span>
          </div>

          <div style={{
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid #DDD',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '14px',
              color: '#666',
              fontWeight: '500',
            }}>
              Plan:
            </span>
            <span style={{
              fontSize: '14px',
              color: '#4CAF50',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}>
              {plan ? getPlanLabel() : 'ÜCRETSİZ'}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '14px',
              color: '#666',
              fontWeight: '500',
            }}>
              Fiyat:
            </span>
            <span style={{
              fontSize: '16px',
              color: '#4CAF50',
              fontWeight: 'bold',
            }}>
              {price ? getPriceLabel() : 'Ücretsiz'}
            </span>
          </div>
        </div>

        {/* FEATURES */}
        <div style={{
          backgroundColor: '#F9F9F9',
          border: '2px solid #DDD',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <p style={{
            fontSize: '12px',
            color: '#999',
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '600',
          }}>
            Plan Özellikleri
          </p>

          {plan && (plan === 'pro_monthly' || plan === 'pro_yearly') ? (
            <>
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
            </>
          ) : (
            <>
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✓ <span>WhatsApp bildirimleri</span>
              </div>
            </>
          )}
        </div>

        {/* BUTTONS */}
        <button
          onClick={() => router.push('/dashboard')}
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
          📊 PANELE GİT
        </button>

        <button
          onClick={() => router.push('/')}
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
          ANA SAYFAYA DÖN
        </button>

        {/* FOOTER */}
        <p style={{
          fontSize: '12px',
          color: '#999',
          margin: '24px 0 0 0',
          lineHeight: '1.6',
        }}>
          Yardıma mı ihtiyacın var? <a href="mailto:support@siparisdefterim.com" style={{
            color: '#4CAF50',
            textDecoration: 'none',
            fontWeight: '600',
          }}>BİZE ULAŞIN</a>
        </p>
      </div>
    </div>
  );
}