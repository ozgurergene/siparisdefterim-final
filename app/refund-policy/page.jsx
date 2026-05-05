'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import Footer from '../../components/Footer'

export default function RefundPolicyPage() {
  const router = useRouter()
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)

  const c = colors[theme]

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
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
      background: c.bg,
      fontFamily: 'Arial, sans-serif',
      color: c.text,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Basit Header */}
      <div style={{
        background: c.header,
        borderBottom: `1px solid ${c.border}`,
        padding: '15px 20px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ color: c.text, textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            📋 SiparişDefterim
          </a>
          <a 
            href={user ? '/dashboard' : '/'} 
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
          Son güncelleme: 4 Mayıs 2026
        </p>

        <div style={{
          background: 'rgba(102, 126, 234, 0.1)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: '8px',
          padding: '15px 20px',
          marginBottom: '30px'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: c.text, lineHeight: '1.6' }}>
            <strong>💡 Kısa Özet:</strong> Pro üyeliğinizden 14 gün içinde herhangi bir sebep göstermeden cayma hakkınız vardır. 
            İptal etmek için <a href="/manage-subscription" style={{ color: '#667eea', fontWeight: '600' }}>Aboneliği Yönet</a> sayfasından 
            kendiniz iptal edebilir veya <a href="mailto:destek@deftertut.com" style={{ color: '#667eea', fontWeight: '600' }}>destek@deftertut.com</a> 
            adresine yazabilirsiniz.
          </p>
        </div>

        {/* Bölüm 1 */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>1. Cayma Hakkı (14 Gün İade Garantisi)</h2>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, 
            Pro üyelik aboneliğinizi satın aldığınız tarihten itibaren <strong>14 gün içinde</strong> herhangi bir 
            sebep göstermeden ve cezai şart ödemeden sözleşmeden cayma hakkınız bulunmaktadır.
          </p>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
            Cayma hakkını kullandığınız takdirde, ödediğiniz tutar 14 gün içinde ödeme yaptığınız yönteme iade edilir.
          </p>
        </section>

        {/* Bölüm 2 */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>2. İptal Nasıl Yapılır?</h2>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            Aboneliğinizi iki şekilde iptal edebilirsiniz:
          </p>
          <div style={{ paddingLeft: '20px', marginBottom: '12px' }}>
            <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '8px' }}>
              <strong>A) Self-Service (Önerilen):</strong> <a href="/manage-subscription" style={{ color: '#667eea' }}>Aboneliği Yönet</a> sayfasından 
              "Aboneliği Yönet" butonuna tıklayarak Lemon Squeezy müşteri portalına ulaşın ve oradan iptal işlemini gerçekleştirin.
            </p>
            <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
              <strong>B) E-posta ile:</strong> <a href="mailto:destek@deftertut.com" style={{ color: '#667eea' }}>destek@deftertut.com</a> adresine 
              "İptal Talebi" konulu bir e-posta gönderebilirsiniz. Talebiniz 1-2 iş günü içinde işleme alınır.
            </p>
          </div>
        </section>

        {/* Bölüm 3 */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>3. İade Şartları</h2>
          <ul style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', paddingLeft: '25px' }}>
            <li style={{ marginBottom: '8px' }}>İade talebi, satın alma tarihinden itibaren <strong>14 gün içinde</strong> yapılmalıdır.</li>
            <li style={{ marginBottom: '8px' }}>İade tutarı, ödeme yöntemine bağlı olarak <strong>5-14 iş günü</strong> içinde hesabınıza yansır.</li>
            <li style={{ marginBottom: '8px' }}>Kredi kartı iadeleri, kart sağlayıcınızın işlem sürelerine göre değişebilir.</li>
            <li style={{ marginBottom: '8px' }}>İade işlemi sonrası Pro üyeliğiniz sonlandırılır ve hesabınız Ücretsiz plana geçirilir.</li>
            <li style={{ marginBottom: '8px' }}>Önceden oluşturduğunuz tüm siparişler ve veriler kaybolmaz, görüntülemeye devam edebilirsiniz.</li>
          </ul>
        </section>

        {/* Bölüm 4 */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>4. Cayma Hakkının İstisnaları</h2>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi uyarınca, aşağıdaki durumlarda cayma hakkı kullanılamaz:
          </p>
          <ul style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', paddingLeft: '25px' }}>
            <li style={{ marginBottom: '8px' }}>14 günlük cayma süresi geçtikten sonra yapılan talepler.</li>
            <li style={{ marginBottom: '8px' }}>Yıllık abonelik döneminin ortasında, ilk 14 gün haricinde, kullanılmamış aylar için iade talebi (yıllık üyelikte cayma hakkı yalnızca ilk 14 gün için geçerlidir).</li>
          </ul>
        </section>

        {/* Bölüm 5 */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>5. Yenileme ve Otomatik Tahsilat</h2>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px', marginBottom: '12px' }}>
            Aboneliğiniz, seçtiğiniz dönem (aylık veya yıllık) sonunda otomatik olarak yenilenir. Otomatik yenilemeyi 
            durdurmak istiyorsanız, yenileme tarihinden önce aboneliğinizi iptal etmeniz yeterlidir.
          </p>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
            İptal ettiğinizde, ödediğiniz dönemin sonuna kadar Pro özelliklerini kullanmaya devam edersiniz; 
            dönem bitiminde otomatik olarak Ücretsiz plana geçirilirsiniz.
          </p>
        </section>

        {/* Bölüm 6 */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>6. Veri Saklama</h2>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
            İptal veya iade durumunda, sipariş ve müşteri verileriniz silinmez; sadece Pro özelliklerine erişiminiz 
            sınırlandırılır. Verilerinizin tamamen silinmesini istiyorsanız, KVKK kapsamındaki haklarınız doğrultusunda 
            <a href="mailto:destek@deftertut.com" style={{ color: '#667eea' }}> destek@deftertut.com</a> adresine yazabilirsiniz.
          </p>
        </section>

        {/* Bölüm 7 */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: c.text }}>7. Ödeme Sağlayıcısı</h2>
          <p style={{ color: c.text, lineHeight: '1.7', fontSize: '14px' }}>
            Tüm ödeme işlemleri Merchant of Record (Yetkili Satıcı) olarak Lemon Squeezy Inc. tarafından gerçekleştirilir. 
            İade işlemleri de aynı kanal üzerinden yapılır. Lemon Squeezy'nin kendi <a href="https://www.lemonsqueezy.com/legal/refund-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>iade politikası</a> da geçerlidir.
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
            İade veya iptal süreciyle ilgili her türlü sorunuz için bize ulaşabilirsiniz:
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
            Yönetmeliği hükümleri çerçevesinde hazırlanmıştır.
          </p>
        </section>
      </div>

      <Footer theme={theme} />
    </div>
  )
}