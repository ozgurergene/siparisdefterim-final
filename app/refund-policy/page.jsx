'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import Footer from '../../components/Footer'

export default function RefundPolicyPage() {
  const router = useRouter()
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState(null)

  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'dark'
    setTheme(savedTheme)

    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) setUser(data.session.user)
    }
    checkUser()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: c.bgGradient,
      fontFamily: 'Arial, sans-serif',
      color: c.text,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Basit Header */}
      <div style={{
        background: c.header,
        backdropFilter: c.backdropFilter,
        WebkitBackdropFilter: c.backdropFilter,
        borderBottom: `1px solid ${c.border}`,
        padding: '15px 20px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '26px' }}>📱</span>
            <span style={{
              fontSize: '20px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>SiparişDefterim</span>
          </a>
          <a
            href={user ? '/dashboard' : '/login'}
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {user ? '← Panele Dön' : '← Ana Sayfa'}
          </a>
        </div>
      </div>

      {/* İçerik */}
      <div style={{ flex: 1, padding: '40px 20px', maxWidth: '900px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px', color: c.text }}>İade ve İptal Politikası</h1>
        <p style={{ color: c.textSecondary, fontSize: '13px', marginBottom: '30px' }}>
          Son güncelleme: 15 Mayıs 2026
        </p>

        {/* Üst özet kutusu - "Iade yok" net mesaj */}
        <div style={{
          background: theme === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.06)',
          border: `1px solid ${theme === 'dark' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.25)'}`,
          borderRadius: '8px',
          padding: '15px 20px',
          marginBottom: '30px'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: c.text, lineHeight: '1.6' }}>
            <strong>⚠️ Önemli Özet:</strong> Pro üyelik dijital bir hizmet olduğu için <strong>cayma hakkı kapsamı dışındadır</strong> ve
            ödenen ücretler iade edilmez. Ancak <strong>dilediğiniz zaman iptal edebilirsiniz</strong>; iptal
            sonrasında ödediğiniz dönemin sonuna kadar Pro özelliklerini kullanmaya devam edersiniz.
            İptal için <a href="mailto:destek@deftertut.com" style={{ color: '#667eea', fontWeight: '600' }}>destek@deftertut.com</a> adresine yazabilirsiniz.
          </p>
        </div>

        {/* Bölüm 1: Cayma Hakkı YOK + TKHK Madde 15/g */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>1. Cayma Hakkı ve İade Politikası</h2>

          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            Pro üyelik aboneliği, 6502 sayılı <strong>Tüketicinin Korunması Hakkında Kanun (TKHK)</strong> ve
            <strong> Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin 1. fıkrasının (ğ) bendi</strong> uyarınca
            <strong> "elektronik ortamda anında ifa edilen hizmetler"</strong> kapsamındadır.
          </p>

          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            Pro üyelik ödemesi onaylandığı anda hizmetin ifasına başlanır ve Pro özellikler hesabınızda aktive edilir.
            Bu sebeple <strong>cayma hakkı kullanılamaz</strong> ve <strong>ödenen ücretler iade edilmez</strong>.
          </p>

          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
            Pro üyelik satın alma sürecinde, sözleşmeyi kabul ederek bu hizmetin cayma hakkı kapsamı dışında
            olduğunu ve cayma hakkından feragat ettiğinizi açıkça beyan etmiş olursunuz.
          </p>
        </section>

        {/* Bölüm 2: İptal Nasıl Yapılır */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>2. İptal Hakkı ve İptal Nasıl Yapılır?</h2>

          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            İade yapılmamakla birlikte, <strong>aboneliğinizi dilediğiniz zaman iptal edebilirsiniz</strong>.
            İptal sonrasında:
          </p>

          <ul style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', paddingLeft: '25px', marginBottom: '12px' }}>
            <li style={{ marginBottom: '8px' }}>Ödediğiniz dönemin (aylık/yıllık) <strong>sonuna kadar</strong> Pro özelliklerini kullanmaya devam edersiniz.</li>
            <li style={{ marginBottom: '8px' }}>Dönem sonunda hesabınız otomatik olarak <strong>Ücretsiz plana</strong> geçer.</li>
            <li style={{ marginBottom: '8px' }}>Bir sonraki dönem için sizden <strong>ücret tahsil edilmez</strong>.</li>
            <li style={{ marginBottom: '8px' }}>Tüm siparişleriniz, müşterileriniz ve verileriniz <strong>kaybolmaz</strong>, görüntülemeye devam edebilirsiniz.</li>
          </ul>

          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            İptal talebinizi göndermek için:
          </p>

          <div style={{ paddingLeft: '20px', marginBottom: '12px' }}>
            <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '8px' }}>
              📧 <a href="mailto:destek@deftertut.com" style={{ color: '#667eea', fontWeight: '600' }}>destek@deftertut.com</a> adresine
              "İptal Talebi" konulu bir e-posta gönderin.
            </p>
            <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
              Veya doğrudan <a href="/manage-subscription" style={{ color: '#667eea', fontWeight: '600' }}>Aboneliği Yönet</a> sayfasından
              "İptal Talebi Gönder" butonunu kullanın.
            </p>
          </div>

          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
            Talebiniz <strong>1-2 iş günü içinde</strong> işleme alınır ve onay e-postası gönderilir.
          </p>
        </section>

        {/* Bölüm 3: İade Politikası - İade YOK */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>3. İade Politikası</h2>

          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            Pro üyelik abonelikleri için <strong>iade yapılmamaktadır</strong>. Bu durum aşağıdaki sebeplere dayanmaktadır:
          </p>

          <ul style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', paddingLeft: '25px' }}>
            <li style={{ marginBottom: '8px' }}>Pro üyelik, ödeme onayıyla birlikte <strong>anında aktive edilen dijital bir hizmettir</strong>.</li>
            <li style={{ marginBottom: '8px' }}>TKHK Madde 15/ğ uyarınca elektronik ortamda anında ifa edilen hizmetler cayma hakkı kapsamı dışındadır.</li>
            <li style={{ marginBottom: '8px' }}>Pro özellikler aktive edildiği anda kullanıma sunulur ve geri alınamaz nitelikte bir hizmettir.</li>
            <li style={{ marginBottom: '8px' }}>Bu sebeple <strong>kullanılmamış süre veya kısmi iade talepleri kabul edilmez</strong>.</li>
          </ul>
        </section>

        {/* Bölüm 4: Ücretsiz Deneme Önerisi */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>4. Satın Almadan Önce Deneyin</h2>

          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            Pro üyelik için iade yapılmadığından, satın almadan önce hizmeti ücretsiz olarak deneyebilirsiniz:
          </p>

          <ul style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', paddingLeft: '25px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Ücretsiz Plan:</strong> 50 siparişe kadar tüm temel özellikler ücretsizdir.</li>
            <li style={{ marginBottom: '8px' }}>Hizmetin size uygun olduğundan emin olduktan sonra Pro'ya yükseltebilirsiniz.</li>
            <li style={{ marginBottom: '8px' }}>Sorularınız için satın almadan önce <a href="mailto:destek@deftertut.com" style={{ color: '#667eea' }}>destek@deftertut.com</a> adresine yazabilirsiniz.</li>
          </ul>
        </section>

        {/* Bölüm 5: Yenileme ve Otomatik Tahsilat */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>5. Yenileme ve Otomatik Tahsilat</h2>

          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            Aboneliğiniz, seçtiğiniz dönem (aylık veya yıllık) sonunda otomatik olarak yenilenir.
            Otomatik yenilemeyi durdurmak istiyorsanız, <strong>yenileme tarihinden önce</strong> aboneliğinizi iptal etmeniz yeterlidir.
          </p>

          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
            Yenileme gerçekleştikten sonra yapılan iptal taleplerinde, mevcut dönem için ödenen ücret iade edilmez
            (madde 3 uyarınca); ancak bir sonraki yenileme yapılmaz.
          </p>
        </section>

        {/* Bölüm 6: Veri Saklama */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>6. Veri Saklama</h2>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
            İptal durumunda, sipariş ve müşteri verileriniz silinmez; sadece Pro özelliklerine erişiminiz
            sınırlandırılır. Verilerinizin tamamen silinmesini istiyorsanız, KVKK kapsamındaki haklarınız doğrultusunda
            <a href="mailto:destek@deftertut.com" style={{ color: '#667eea' }}> destek@deftertut.com</a> adresine yazabilirsiniz.
          </p>
        </section>

        {/* Bölüm 7: Ödeme Sağlayıcısı — Polar.sh */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>7. Ödeme Sağlayıcısı ve Para Birimi</h2>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            Tüm ödeme işlemleri Merchant of Record (Yetkili Satıcı) olarak <strong>Polar Software</strong> (polar.sh) tarafından
            gerçekleştirilir. Polar Software, vergi (KDV/sales tax) hesaplama ve fatura düzenleme süreçlerini de yürütür.
            Kart ödemeleri, Polar'ın alt ödeme işlemcisi olan <strong>Stripe, Inc.</strong> üzerinden PCI-DSS standartlarına
            uygun şekilde işlenir.
          </p>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
            Ödemeler <strong>ABD Doları (USD)</strong> cinsinden alınır; kartınızdan çekilen tutar bankanızın
            o günkü kurundan Türk Lirasına çevrilir. Bu nedenle ekstrenizdeki TL tutarı dönemden döneme küçük farklılıklar
            gösterebilir. Ödeme süreciyle ilgili sorularınız için bizimle iletişime geçmeniz yeterlidir;
            tüm talepler tarafımızdan koordine edilir.
          </p>
        </section>

        {/* Bölüm 8 - İletişim */}
        <section style={{
          background: c.header,
          border: `1px solid ${c.border}`,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>📞 İletişim</h2>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '8px' }}>
            İptal veya bu politikayla ilgili her türlü sorunuz için bize ulaşabilirsiniz:
          </p>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', margin: '4px 0' }}>
            📧 E-posta: <a href="mailto:destek@deftertut.com" style={{ color: '#667eea', fontWeight: '600' }}>destek@deftertut.com</a>
          </p>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', margin: '4px 0' }}>
            🌐 Site: <a href="https://deftertut.com" style={{ color: '#667eea', fontWeight: '600' }}>deftertut.com</a>
          </p>
          <p style={{ color: c.textSecondary, fontSize: '12px', marginTop: '12px', marginBottom: 0 }}>
            Tüm taleplerinize 1-2 iş günü içinde dönüş yapılır.
          </p>
        </section>

        {/* Yasal Çerçeve */}
        <section style={{ borderTop: `1px solid ${c.border}`, paddingTop: '20px', marginTop: '30px' }}>
          <p style={{ color: c.textSecondary, fontSize: '12px', lineHeight: '1.6', textAlign: 'center', margin: 0 }}>
            Bu politika, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve 27.11.2014 tarihli Mesafeli Sözleşmeler
            Yönetmeliği'nin 15/1-ğ maddesi hükümleri çerçevesinde hazırlanmıştır.
          </p>
        </section>
      </div>

      <Footer theme={theme} />
    </div>
  )
}