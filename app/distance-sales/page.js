'use client'

import { useEffect, useState } from 'react'
import { colors } from '../../lib/theme'

export default function DistanceSales() {
  const [theme, setTheme] = useState('dark')
  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'dark'
    setTheme(savedTheme)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: '40px 20px', fontFamily: 'Arial' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: c.header, padding: '40px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
        <h1 style={{ color: c.text, marginBottom: '30px', fontSize: '28px' }}>Mesafeli Satış Sözleşmesi</h1>
        
        <div style={{ color: c.text, lineHeight: '1.8', fontSize: '15px' }}>
          <h2 style={{ marginTop: '20px', marginBottom: '15px', fontSize: '20px' }}>1. Taraflar</h2>
          <p><strong>Satıcı:</strong> SiparişDefterim</p>
          <p><strong>Alıcı:</strong> Platformu kullanan üye</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>2. Sözleşmenin Konusu</h2>
          <p>Bu sözleşme, alıcının satıcıya ait SiparişDefterim platformu üzerinden sunulan hizmetleri satın almasına ilişkin tarafların hak ve yükümlülüklerini düzenler.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>3. Hizmet Bilgileri</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Hizmet:</strong> Sipariş yönetim platformu</li>
            <li><strong>Ücretsiz Plan:</strong> 50 siparişe kadar ücretsiz</li>
            <li><strong>Pro Plan:</strong> Aylık $2.99 USD veya Yıllık $29.99 USD</li>
            <li style={{ fontSize: '13px', color: c.textSecondary, marginTop: '4px' }}>Ödemeler ABD Doları (USD) olarak alınır; kartınızdan çekilen tutar bankanızın o günkü kur ve komisyon politikasına göre Türk Lirasına çevrilir.</li>
          </ul>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>4. Ödeme Şekli</h2>
          <p>
          Tüm ödemeler Merchant of Record (Yetkili Satıcı) sıfatıyla
          <strong> Polar Software (Polar.sh)</strong> tarafından tahsil edilir. Kart ödemeleri,
          Polar'ın alt ödeme işlemcisi olan <strong>Stripe, Inc.</strong> üzerinden
          PCI-DSS standartlarına uygun olarak işlenir. KDV / sales tax hesaplama ve
          fatura düzenleme süreçleri Polar Software tarafından yürütülür.
          Kredi kartı, Apple Pay ve Google Pay desteklenir.
        </p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>5. Teslimat</h2>
          <p>Dijital hizmet olup, ödeme onayından sonra anında hesabınız aktif edilir. Hizmetin ifasına ödeme onayıyla birlikte başlanmış sayılır.</p>

          {/* === GUNCEL: Cayma Hakki - Feragat ve TKHK Madde 15/g === */}
          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>6. Cayma Hakkı</h2>
          
          <div style={{
            background: theme === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)',
            border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '15px'
          }}>
            <p style={{ marginTop: 0, fontWeight: '600' }}>
              ⚠️ Önemli: Bu hizmet, cayma hakkı kapsamı dışındadır.
            </p>
          </div>

          <p>
            <strong>6.1.</strong> Satın aldığınız Pro üyelik, 6502 sayılı Tüketicinin Korunması Hakkında Kanun (TKHK) 
            ve Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin 1. fıkrasının (ğ) bendi uyarınca 
            <strong> "elektronik ortamda anında ifa edilen hizmetler"</strong> kapsamında değerlendirilmektedir.
          </p>

          <p style={{ marginTop: '12px' }}>
            <strong>6.2.</strong> Pro üyelik ödemesinin onaylanması ve hizmetin aktive edilmesiyle birlikte 
            hizmetin ifasına başlanmış sayılır. Bu nedenle <strong>cayma hakkı bulunmamaktadır</strong>.
          </p>

          <p style={{ marginTop: '12px' }}>
            <strong>6.3.</strong> Alıcı, bu sözleşmeyi kabul ederek hizmetin satın alma anında ifasına 
            başlanmasını ve cayma hakkından feragat ettiğini açıkça beyan ve kabul eder.
          </p>

          <p style={{ marginTop: '12px' }}>
            <strong>6.4.</strong> Alıcı, dilediği zaman aboneliğini iptal edebilir. İptal sonrasında 
            ödediği dönemin (aylık/yıllık) sonuna kadar Pro özelliklerini kullanmaya devam eder ve 
            dönem sonunda otomatik olarak ücretsiz pakete geçer. <strong>Yapılan ödemeler iade edilmez.</strong>
          </p>

          <p style={{ marginTop: '12px' }}>
            İptal talepleri için <strong>destek@deftertut.com</strong> adresine e-posta gönderebilirsiniz.
          </p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>7. Uyuşmazlık Çözümü</h2>
          <p>Bu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti mahkemeleri ve icra daireleri yetkilidir.</p>

          <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>8. İletişim</h2>
          <p>Sözleşme ile ilgili tüm sorular için: <strong>destek@deftertut.com</strong></p>
        </div>

        <a href="/login" style={{ display: 'inline-block', marginTop: '30px', color: '#007bff', textDecoration: 'underline' }}>← Geri Dön</a>
      </div>
    </div>
  )
}