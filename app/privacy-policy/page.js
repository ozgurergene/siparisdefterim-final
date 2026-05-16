'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors } from '../../lib/theme'
import Footer from '../../components/Footer'

export default function PrivacyPolicy() {
  const router = useRouter()
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('siparisdefterim-theme') || 'light'
  })
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

    const handleStorageChange = () => {
      const t = localStorage.getItem('siparisdefterim-theme')
      if (t) setTheme(t)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
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
              color: '#a78bfa',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {user ? '← Panele Dön' : 'Giriş Yap'}
          </a>
        </div>
      </div>

      {/* Ana Icerik */}
      <div style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: c.bgCard,
          backdropFilter: c.backdropFilter,
          WebkitBackdropFilter: c.backdropFilter,
          padding: '40px',
          borderRadius: '20px',
          border: `1px solid ${c.border}`
        }}>
          <h1 style={{ color: c.text, marginBottom: '10px', fontSize: '28px' }}>Gizlilik ve Çerez Politikası</h1>
          <p style={{ color: c.textSecondary, fontSize: '13px', marginBottom: '30px' }}>
            Son güncelleme: 15 Mayıs 2026
          </p>

          <div style={{ color: c.text, lineHeight: '1.8', fontSize: '15px' }}>
            {/* 1. Veri Sorumlusu */}
            <h2 style={{ marginTop: '20px', marginBottom: '15px', fontSize: '20px' }}>1. Veri Sorumlusu</h2>
            <p>
              SiparişDefterim (deftertut.com) hizmetinin işletmecisi sıfatıyla kişisel verilerinizin işlenmesinden sorumludur.
              Tüm soru, talep ve şikayetlerinizi <a href="mailto:destek@deftertut.com" style={{ color: '#a78bfa' }}>destek@deftertut.com</a> adresine
              iletebilirsiniz.
            </p>

            {/* 2. Toplanan Veriler */}
            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>2. Toplanan Veriler</h2>
            <p>Hizmetimizi sağlayabilmek için aşağıdaki kişisel veri kategorilerini işliyoruz:</p>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>a) Hesap Bilgileri</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>E-posta adresi (kayıt ve giriş için)</li>
              <li>Şifre (şifrelenmiş olarak saklanır)</li>
              <li>Kayıt tarihi ve son giriş zamanı</li>
              <li>Hesap tipi (Ücretsiz / Pro)</li>
            </ul>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>b) Sipariş ve Müşteri Verileri</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Müşterilerinizin isim, telefon, adres bilgileri (sizin tarafınızdan girilen)</li>
              <li>Ürün, fiyat, sipariş durumu</li>
              <li>Sipariş tarihi ve geçmişi</li>
            </ul>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>c) Ödeme Bilgileri</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Pro üyelik satın alındığında, ödeme bilgileri Polar Software (Polar.sh) ve onun ödeme işlemcisi Stripe tarafından işlenir (detay aşağıda)</li>
              <li>Kart numaranız, CVV gibi hassas bilgilere SiparişDefterim erişmez ve saklamaz</li>
            </ul>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>d) Teknik Veriler</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>IP adresi, tarayıcı tipi, cihaz bilgileri</li>
              <li>Çerez tercihleri</li>
              <li>Hizmet kullanım istatistikleri</li>
            </ul>

            {/* 3. Verilerin İşleme Amaçları */}
            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>3. Verilerin İşleme Amaçları</h2>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Hesabınızı oluşturmak ve yönetmek</li>
              <li>Hizmeti sağlamak (sipariş kaydı, takibi, raporlama)</li>
              <li>Pro üyelik satın alma işlemlerini gerçekleştirmek</li>
              <li>Hizmet kalitesini iyileştirmek</li>
              <li>Yasal yükümlülüklere uyum sağlamak</li>
              <li>İletişim ve destek sağlamak</li>
            </ul>

            {/* 4. Üçüncü Taraf Hizmet Sağlayıcılar */}
            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>4. Üçüncü Taraf Hizmet Sağlayıcılar</h2>
            <p>
              Hizmetimizi sağlayabilmek için aşağıdaki üçüncü taraf hizmet sağlayıcıları kullanıyoruz. Bu hizmet sağlayıcıların
              kendi gizlilik politikaları bulunmaktadır:
            </p>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>a) Supabase Inc. (ABD)</h3>
            <p style={{ marginBottom: '10px' }}>
              <strong>Hizmet:</strong> Veritabanı, kimlik doğrulama ve dosya depolama altyapısı.<br />
              <strong>İşlenen Veriler:</strong> Hesap bilgileri, sipariş verileri, müşteri verileri.<br />
              <strong>Konum:</strong> Sunucular ABD'de bulunmaktadır.<br />
              <strong>Gizlilik Politikası:</strong> <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>https://supabase.com/privacy</a>
            </p>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>b) Polar Software (ABD) — Ödeme Sağlayıcısı (Merchant of Record)</h3>
            <p style={{ marginBottom: '10px' }}>
              <strong>Hizmet:</strong> Pro üyelik ödemelerinin tahsilatı (Merchant of Record / Yetkili Satıcı). Polar Software, vergi (KDV/sales tax) hesaplama ve fatura düzenleme süreçlerini de yürütür.<br />
              <strong>İşlenen Veriler:</strong> E-posta, ad, fatura adresi, kart bilgileri (Polar ve alt işlemcisi Stripe tarafından, SiparişDefterim'e iletilmez).<br />
              <strong>Konum:</strong> Sunucular ABD'de bulunmaktadır.<br />
              <strong>Gizlilik Politikası:</strong> <a href="https://polar.sh/legal/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>https://polar.sh/legal/privacy</a><br />
              <strong>Kullanım Koşulları:</strong> <a href="https://polar.sh/legal/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>https://polar.sh/legal/terms</a>
            </p>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>c) Stripe, Inc. (ABD) — Ödeme İşlemcisi</h3>
            <p style={{ marginBottom: '10px' }}>
              <strong>Hizmet:</strong> Polar.sh'in alt ödeme işlemcisi olarak kart ödemelerinin işlenmesi ve banka hesabına aktarımı.<br />
              <strong>İşlenen Veriler:</strong> Kart bilgileri (PCI-DSS standartlarına uygun), ödeme tutarı, işlem geçmişi.<br />
              <strong>Konum:</strong> Sunucular ABD'de bulunmaktadır.<br />
              <strong>Gizlilik Politikası:</strong> <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>https://stripe.com/privacy</a>
            </p>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>d) Vercel Inc. (ABD)</h3>
            <p style={{ marginBottom: '10px' }}>
              <strong>Hizmet:</strong> Web sitesi barındırma (hosting).<br />
              <strong>İşlenen Veriler:</strong> IP adresi, tarayıcı bilgisi (sunucu logları).<br />
              <strong>Konum:</strong> Sunucular ABD ve AB'de bulunmaktadır.<br />
              <strong>Gizlilik Politikası:</strong> <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>https://vercel.com/legal/privacy-policy</a>
            </p>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>e) Google LLC (ABD) — OAuth Girişi</h3>
            <p style={{ marginBottom: '10px' }}>
              <strong>Hizmet:</strong> Google ile giriş yapma seçeneği (opsiyonel).<br />
              <strong>İşlenen Veriler:</strong> Google hesabı kullanırsanız e-posta adresi.<br />
              <strong>Gizlilik Politikası:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>https://policies.google.com/privacy</a>
            </p>

            {/* 5. Yurt Dışına Veri Aktarımı */}
            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>5. Yurt Dışına Veri Aktarımı</h2>
            <p>
              Yukarıda belirtilen üçüncü taraf hizmet sağlayıcılar Amerika Birleşik Devletleri'nde (ABD) bulunduğundan,
              kişisel verileriniz hizmetin sağlanması amacıyla ABD'ye aktarılmaktadır. Bu aktarım, KVKK'nın 9. maddesi
              ve GDPR Madde 44-50 uyarınca, yeterli koruma sağlanan ülkelere veya uygun güvenceler (Standard Contractual Clauses)
              altında gerçekleştirilmektedir.
            </p>
            <p>
              Hizmetimizi kullanarak bu veri aktarımına onay vermiş sayılırsınız. Onay vermek istemiyorsanız, hizmetten
              yararlanmamanızı tavsiye ederiz.
            </p>

            {/* 6. Çerezler */}
            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>6. Çerezler</h2>
            <p>Çerezler, internet sitesini ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır.</p>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>a) Teknik Çerezler (Zorunlu)</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Oturum yönetimi (giriş yapma)</li>
              <li>Platform güvenliği</li>
              <li>Tema tercihi (açık / koyu)</li>
              <li>Çerez tercih saklama</li>
            </ul>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '17px' }}>b) Analitik Çerezler (Opsiyonel)</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Ziyaretçi davranışı analizi</li>
              <li>Sayfa performansı takibi</li>
            </ul>

            {/* 7. Veri Saklama Süreleri */}
            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>7. Veri Saklama Süreleri</h2>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Hesap bilgileri:</strong> Hesap aktif olduğu sürece. Hesap silindiğinde 30 gün içinde anonimleştirilir veya silinir.</li>
              <li><strong>Sipariş verileri:</strong> Hesap aktif olduğu sürece kullanıcı kontrolünde.</li>
              <li><strong>Ödeme kayıtları:</strong> Geçerli vergi mevzuatı uyarınca <strong>10 yıl</strong>'a kadar (Polar Software / Stripe tarafından).</li>
              <li><strong>Sunucu logları:</strong> 30 gün.</li>
            </ul>

            {/* 8. Veri Güvenliği */}
            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>8. Veri Güvenliği</h2>
            <p>Kişisel verilerinizin güvenliği için aldığımız önlemler:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>SSL/TLS ile veri iletimi şifrelenir</li>
              <li>Şifreler bcrypt algoritması ile şifrelenir</li>
              <li>Veritabanı erişimi yetkili kişilerle sınırlıdır</li>
              <li>Düzenli güvenlik denetimleri yapılır</li>
              <li>Hassas ödeme verileri PCI-DSS uyumlu sağlayıcı (Polar.sh / Stripe) tarafından işlenir</li>
            </ul>

            {/* 9. Haklarınız */}
            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>9. KVKK Kapsamındaki Haklarınız</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen verilerinize erişim talep etme</li>
              <li>Verilerinizin düzeltilmesini isteme</li>
              <li>Verilerinizin silinmesini isteme</li>
              <li>Verilerinizin işlenmesine itiraz etme</li>
              <li>Verilerinizin yurt dışına aktarımı hakkında bilgi alma</li>
            </ul>
            <p style={{ marginTop: '10px' }}>
              Bu haklarınızı kullanmak için <a href="mailto:destek@deftertut.com" style={{ color: '#a78bfa' }}>destek@deftertut.com</a> adresine yazabilirsiniz.
              Talepleriniz 30 gün içinde yanıtlanır.
            </p>

            {/* 10. İletişim */}
            <h2 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '20px' }}>10. İletişim</h2>
            <p>
              Bu Gizlilik Politikası ile ilgili her türlü soru ve talebiniz için bize ulaşabilirsiniz:
            </p>
            <p style={{ margin: '8px 0' }}>
              📧 <a href="mailto:destek@deftertut.com" style={{ color: '#a78bfa', fontWeight: '600' }}>destek@deftertut.com</a>
            </p>
            <p style={{ margin: '8px 0' }}>
              🌐 <a href="https://deftertut.com" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', fontWeight: '600' }}>deftertut.com</a>
            </p>
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}