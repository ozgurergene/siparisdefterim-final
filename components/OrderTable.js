'use client'

import { colors, statusColors } from '../lib/theme'

export default function OrderTable({ filteredOrders, user, theme, startEditing, deleteOrder, updateOrderStatus }) {
  const c = colors[theme]

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const turkeyTime = new Date(date.getTime() + (3 * 60 * 60 * 1000))
    const day = String(turkeyTime.getDate()).padStart(2, '0')
    const month = String(turkeyTime.getMonth() + 1).padStart(2, '0')
    const year = turkeyTime.getFullYear()
    const hours = String(turkeyTime.getHours()).padStart(2, '0')
    const minutes = String(turkeyTime.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year} ${hours}:${minutes}`
  }

  const getWhatsAppMessage = (order) => {
    const name = order.customer_name
    const product = order.product
    const price = order.price
    
    const messages = {
      payment_pending: `Merhaba :) ${name},

Siparişiniz başarıyla oluşturuldu, teşekkür ederiz!

Sipariş Detayı:
${product}

Toplam Tutar: ${price} TL

Ödemenizi aldıktan sonra siparişinizi hemen hazırlamaya başlayacağız. Herhangi bir sorunuz olursa yazabilirsiniz.

İyi günler dileriz!`,
      
      paid: `Merhaba :) ${name},

Ödemeniz başarıyla alındı, teşekkür ederiz! :)

Siparişinizi özenle hazırlamaya başlıyoruz. Kargoya verildiğinde size bilgi vereceğiz.

İyi günler dileriz! :)`,
      
      preparing: `Merhaba :) ${name},

Siparişiniz şu anda özenle hazırlanıyor! :)

Çok yakında kargoya teslim edeceğiz. Takip numarasını sizinle paylaşacağız.

Bizi tercih ettiğiniz için teşekkür ederiz!`,
      
      shipped: `Merhaba :) ${name},

Harika haber! Siparişiniz kargoya verildi!

Paketiniz yolda, çok yakında sizlere ulaştırılacak.

Kargo ile ilgili sorularınız için bize ulaşabilirsiniz. İyi günler dileriz! :)`,
      
      completed: `Merhaba :) ${name},

Siparişiniz tamamlandı! :)

Umarız ürünlerimizi beğenirsiniz. :) Memnuniyetiniz bizim için çok değerli!

Bizi tercih ettiğiniz için tekrar teşekkür ederiz. Görüşmek üzere! :)`
    }
    
    return messages[order.status] || messages.payment_pending
  }

  return (
    <div style={{ background: c.header, borderRadius: '8px', overflow: 'auto', border: `1px solid ${c.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '1000px' }}>
        <thead>
          <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
            <th style={{ padding: '11px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text, width: '120px' }}>Müşteri</th>
            <th style={{ padding: '11px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text, width: '80px' }}>Telefon</th>
            <th style={{ padding: '11px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Ürünler</th>
            <th style={{ padding: '11px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '60px', color: c.text }}>Fiyat</th>
            <th style={{ padding: '11px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '90px', color: c.text }}>Durum</th>
            <th style={{ padding: '11px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '140px', color: c.text }}>İşlem Tarihi</th>
            <th style={{ padding: '11px', textAlign: 'center', fontWeight: 'bold', width: '120px', color: c.text }}>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => {
            const createdDate = formatDate(order.created_at)
            const updatedDate = formatDate(order.updated_at)
            const isEdited = order.updated_at && new Date(order.updated_at) > new Date(order.created_at)
            
            return (
              <tr key={order.id} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                <td style={{ padding: '10px', borderRight: `1px solid ${c.border}`, color: c.text, fontSize: '14px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.customer_name}</td>
                <td style={{ padding: '10px', borderRight: `1px solid ${c.border}`, fontSize: '14px', color: c.textSecondary, width: '80px', textAlign: 'center' }}>{order.customer_phone}</td>
                <td style={{ padding: '10px', borderRight: `1px solid ${c.border}`, color: c.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '15px' }}>
                  {order.product.split(', ').map((prod, idx) => (
                    <div key={idx} style={{ marginBottom: idx < order.product.split(', ').length - 1 ? '6px' : '0', fontSize: '15px' }}>{prod}</div>
                  ))}
                  {order.note && <div style={{ fontSize: '13px', color: c.textSecondary, marginTop: '6px' }}>Not: {order.note}</div>}
                </td>
                <td style={{ padding: '10px', textAlign: 'center', borderRight: `1px solid ${c.border}`, fontWeight: 'bold', color: c.text, fontSize: '14px' }}>₺{order.price}</td>
                <td style={{ padding: '10px', textAlign: 'center', borderRight: `1px solid ${c.border}`, fontSize: '14px' }}>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    style={{
                      padding: '4px 6px',
                      border: `2px solid ${statusColors[order.status]}`,
                      background: statusColors[order.status],
                      color: order.status === 'paid' || order.status === 'completed' ? '#333' : 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    <option value="payment_pending">💰 Ödeme</option>
                    <option value="paid">✅ Ödendi</option>
                    <option value="preparing">📦 Hazır.</option>
                    <option value="shipped">🚚 Kargo</option>
                    <option value="completed">🎉 Tamamlandı</option>
                  </select>
                </td>
                <td style={{ padding: '10px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontSize: '14px', color: c.text }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{createdDate}</div>
                  {isEdited && (
                    <div style={{ fontSize: '12px', color: c.textSecondary, marginTop: '4px', fontWeight: 'bold' }}>
                      Düzenlendi: {updatedDate}
                    </div>
                  )}
                </td>
                <td style={{ padding: '10px', textAlign: 'center', fontSize: '14px' }}>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    <button
                      onClick={() => {
                        if (order.customer_phone) {
                          const message = getWhatsAppMessage(order)
                          const url = 'https://wa.me/90' + order.customer_phone + '?text=' + encodeURIComponent(message)
                          window.open(url, '_blank')
                        }
                      }}
                      style={{ padding: '6px 10px', background: '#25d366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <img 
                        src="https://dcqdgklkrjvmfjzhliph.supabase.co/storage/v1/object/sign/wp%20logo/pngwing.com.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjA2YmZmMy04N2Q0LTRmMjAtYjRmMC01MGRiZDM3OWI1NGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3cCBsb2dvL3BuZ3dpbmcuY29tLnBuZyIsImlhdCI6MTc3NDcyNTQxMSwiZXhwIjoxODA2MjYxNDExfQ.p5yP8eFZijbKeH4XwfggFNDvI6vpPPsU756s2t4vZKI"
                        alt="WhatsApp"
                        style={{ width: '16px', height: '16px' }}
                      />
                    </button>
                    <button
                      onClick={() => startEditing(order)}
                      style={{ padding: '6px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      style={{ padding: '6px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      
      {filteredOrders.length === 0 && (
        <div style={{ textAlign: 'center', color: c.textSecondary, padding: '50px' }}>
          <p style={{ fontSize: '14px' }}>📭 Sipariş bulunamadı.</p>
        </div>
      )}
    </div>
  )
}