'use client'

import { useState } from 'react'
import { colors, statusColors } from '../lib/theme'

// Yeni durum isimleri
const statusLabels = {
  payment_pending: 'Ödeme Bekleniyor',
  paid: 'Ödeme Alındı',
  preparing: 'Paketlendi',
  shipped: 'Kargoda',
  completed: 'Teslim Edildi'
}

const statusEmojis = {
  payment_pending: '💰',
  paid: '✅',
  preparing: '📦',
  shipped: '🚚',
  completed: '🎉'
}

export default function OrderTable({ filteredOrders, user, theme, startEditing, deleteOrder, updateOrderStatus, statusFilter, setStatusFilter }) {
  const c = colors[theme]
  const [confirmModal, setConfirmModal] = useState({ show: false, orderId: null, customerName: '' })

  const getWhatsAppMessage = (order) => {
    const name = order.customer_name
    const product = order.product
    const price = order.price
    
    const messages = {
      payment_pending: `Merhaba ${name},

Siparişiniz başarıyla oluşturuldu, teşekkür ederiz!

Sipariş Detayı:
${product}

Toplam Tutar: ${price} TL

Ödemenizi aldıktan sonra siparişinizi hemen hazırlamaya başlayacağız. Herhangi bir sorunuz olursa yazabilirsiniz.

İyi günler dileriz!`,
      
      paid: `Merhaba ${name},

Ödemeniz başarıyla alındı, teşekkür ederiz!

Siparişinizi özenle hazırlamaya başlıyoruz. Kargoya verildiğinde size hemen bilgi vereceğiz.

İyi günler dileriz!`,
      
      preparing: `Merhaba ${name},

Siparişiniz paketlendi!

Çok yakında kargoya teslim edeceğiz. Takip numarasını sizinle paylaşacağız.

Bizi tercih ettiğiniz için teşekkürler!`,
      
      shipped: `Merhaba ${name},

Harika haber! Siparişiniz kargoya verildi!

Paketiniz yolda, çok yakında elinizde olacak.

Kargo ile ilgili sorularınız için bize ulaşabilirsiniz. İyi günler!`,
      
      completed: `Merhaba ${name},

Siparişiniz teslim edildi!

Umarız ürünlerimizi beğenirsiniz. Memnuniyetiniz bizim için çok değerli!

Bizi tercih ettiğiniz için tekrar teşekkür ederiz. Görüşmek üzere!`
    }
    
    return messages[order.status] || messages.payment_pending
  }

  const handleStatusChange = (orderId, newStatus, customerName) => {
    if (newStatus === 'completed') {
      setConfirmModal({ show: true, orderId, customerName })
    } else {
      updateOrderStatus(orderId, newStatus)
    }
  }

  const confirmComplete = () => {
    updateOrderStatus(confirmModal.orderId, 'completed')
    setConfirmModal({ show: false, orderId: null, customerName: '' })
  }

  const cancelComplete = () => {
    setConfirmModal({ show: false, orderId: null, customerName: '' })
  }

  return (
    <>
      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: c.header,
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            border: `1px solid ${c.border}`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
            <h3 style={{ margin: '0 0 15px 0', color: c.text, fontSize: '18px' }}>Siparişi Teslim Et</h3>
            <p style={{ margin: '0 0 25px 0', color: c.textSecondary, fontSize: '14px', lineHeight: '1.5' }}>
              <strong style={{ color: c.text }}>{confirmModal.customerName}</strong> adlı müşterinin siparişini teslim edildi olarak işaretlemek istediğinize emin misiniz?
              <br /><br />
              <span style={{ color: '#ff6b6b', fontSize: '13px' }}>⚠️ Bu işlem geri alınamaz. Sipariş "Tamamlananlar" sayfasına taşınacaktır.</span>
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={cancelComplete}
                style={{
                  padding: '12px 25px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                ✕ İptal
              </button>
              <button
                onClick={confirmComplete}
                style={{
                  padding: '12px 25px',
                  background: '#1D9E75',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                ✓ Onayla
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: c.header, borderRadius: '8px', overflow: 'auto', border: `1px solid ${c.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Müşteri</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Telefon</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Ürünler</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '60px', color: c.text }}>Fiyat</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '140px', color: c.text }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <span>Durum</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: '2px 4px',
                      border: `1px solid ${c.border}`,
                      borderRadius: '4px',
                      background: c.input,
                      color: c.text,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">▼ Hepsi</option>
                    <option value="payment_pending">💰 Ödeme Bekleniyor</option>
                    <option value="paid">✅ Ödeme Alındı</option>
                    <option value="preparing">📦 Paketlendi</option>
                    <option value="shipped">🚚 Kargoda</option>
                  </select>
                </div>
              </th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', width: '120px', color: c.text }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, color: c.text }}>{order.customer_name}</td>
                <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, fontSize: '16px', color: c.textSecondary }}>📱 {order.customer_phone}</td>
                <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, color: c.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {order.product.split(', ').map((prod, idx) => (
                    <div key={idx} style={{ marginBottom: idx < order.product.split(', ').length - 1 ? '8px' : '0' }}>{prod}</div>
                  ))}
                  {order.note && <div style={{ fontSize: '12px', color: c.textSecondary, marginTop: '8px' }}>Not: {order.note}</div>}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}`, fontWeight: 'bold', color: c.text }}>₺{order.price}</td>
                <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}` }}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value, order.customer_name)}
                    style={{
                      padding: '4px 6px',
                      border: `2px solid ${statusColors[order.status]}`,
                      background: statusColors[order.status],
                      color: order.status === 'paid' || order.status === 'completed' ? '#333' : 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      width: '100%'
                    }}
                  >
                    <option value="payment_pending">{statusEmojis.payment_pending} Ödeme Bekleniyor</option>
                    <option value="paid">{statusEmojis.paid} Ödeme Alındı</option>
                    <option value="preparing">{statusEmojis.preparing} Paketlendi</option>
                    <option value="shipped">{statusEmojis.shipped} Kargoda</option>
                    <option value="completed">{statusEmojis.completed} Teslim Edildi</option>
                  </select>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
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
                        style={{ width: '20px', height: '20px' }}
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
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div style={{ textAlign: 'center', color: c.textSecondary, padding: '50px' }}>
            <p>📭 Sipariş bulunamadı.</p>
          </div>
        )}
      </div>
    </>
  )
}