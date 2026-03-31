'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const planParam = searchParams.get('plan');
    const priceParam = searchParams.get('price');
    
    if (planParam) setPlan(planParam);
    if (priceParam) setPrice(priceParam);
  }, [searchParams]);

  const handlePayment = async () => {
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

      // TODO: Stripe Checkout Session oluştur
      // Şimdilik direkt success'e git (test amaçlı)
      
      // Gerçek uygulamada:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     userId: user.id,
      //     plan: plan,
      //     price: parseInt(price),
      //   }),
      // });
      // const { url } = await response.json();
      // window.location.href = url;

      // Test: Direkt success'e git
      router.push('/success');
    } catch (err) {
      setError('Ödeme başarısız: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
      }}>
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          margin: '0 0 8px 0',
          textAlign: 'center',
        }}>
          ÖDEME SAYFASI
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: '0 0 32px 0',
          textAlign: 'center',
        }}>
          Stripe ile ödeme yapın
        </p>

        {error && (
          <div style={{
            backgroundColor: '#FFEBEE',
            border: '1px solid #EF5350',
            color: '#C62828',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        {/* PLAN BİLGİSİ */}
        <div style={{
          backgroundColor: '#EEEEEE',
          border: '2px solid #4CAF50',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <span style={{
              fontSize: '14px',
              color: '#666',
              fontWeight: 'bold',
            }}>
              Plan:
            </span>
            <span style={{
              fontSize: '14px',
              color: '#333',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}>
              {plan === 'pro_monthly' ? 'PRO - AYLIK (₺99)' : 'PRO - YILLIK (₺999)'}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid #DDD',
          }}>
            <span style={{
              fontSize: '16px',
              color: '#333',
              fontWeight: 'bold',
            }}>
              Toplam:
            </span>
            <span style={{
              fontSize: '24px',
              color: '#4CAF50',
              fontWeight: 'bold',
            }}>
              ₺{price}
            </span>
          </div>
        </div>

        {/* ÖDEME METODU */}
        <div style={{
          backgroundColor: '#F9F9F9',
          border: '2px solid #DDD',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px',
        }}>
          <label style={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#333',
            textTransform: 'uppercase',
            marginBottom: '12px',
            display: 'block',
          }}>
            Ödeme Yöntemi
          </label>
          
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #4CAF50',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px',
            }}>
              Stripe ile Ödeme
            </div>
            <div style={{
              fontSize: '12px',
              color: '#999',
            }}>
              Kredi kartı, banka kartı, vb. tüm yöntemler
            </div>
          </div>
        </div>

        {/* ÖDEME BUTONU */}
        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: '#4CAF50',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            textTransform: 'uppercase',
            transition: 'all 0.3s',
            marginBottom: '16px',
          }}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#45A049')}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#4CAF50')}
        >
          {loading ? 'İŞLENİYOR...' : '₺' + price + ' ÖDEYIN'}
        </button>

        {/* GERİ DÖN */}
        <button
          onClick={() => router.back()}
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
          GERİ DÖN
        </button>

        {/* DİSKLAYMER */}
        <p style={{
          fontSize: '11px',
          color: '#999',
          margin: '24px 0 0 0',
          textAlign: 'center',
          lineHeight: '1.6',
        }}>
          Ödeme Stripe tarafından işlenir. Kredi kartı bilgileriniz Stripe sunucularında güvenle saklanır.
        </p>
      </div>
    </div>
  );
}