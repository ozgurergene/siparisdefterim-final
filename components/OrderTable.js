'use client'

import { useState } from 'react'
import { colors, statusColors } from '../lib/theme'

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
          zIndex: 1000,
          padding: '15px'
        }}>
          <div style={{
            background: c.header,
            padding: '25px',
            borderRadius: '12px',
            maxWidth: '350px',
            width: '100%',
            textAlign: 'center',
            border: `1px solid ${c.border}`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
            <h3 style={{ margin: '0 0 12px 0', color: c.text, fontSize: '16px' }}>Siparişi Teslim Et</h3>
            <p style={{ margin: '0 0 20px 0', color: c.textSecondary, fontSize: '13px', lineHeight: '1.5' }}>
              <strong style={{ color: c.text }}>{confirmModal.customerName}</strong> adlı müşterinin siparişini teslim edildi olarak işaretlemek istediğinize emin misiniz?
              <br /><br />
              <span style={{ color: '#ff6b6b', fontSize: '12px' }}>⚠️ Bu işlem geri alınamaz.</span>
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={cancelComplete}
                style={{
                  flex: 1,
                  padding: '12px',
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
                  flex: 1,
                  padding: '12px',
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

      {/* Filter Header */}
      <div style={{ 
        background: c.header, 
        padding: '12px 15px', 
        borderRadius: '8px 8px 0 0', 
        border: `1px solid ${c.border}`,
        borderBottom: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold', color: c.text, fontSize: '14px' }}>Siparişler</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '6px 10px',
            border: `1px solid ${c.border}`,
            borderRadius: '6px',
            background: c.input,
            color: c.text,
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          <option value="all">Tümü</option>
          <option value="payment_pending">💰 Ödeme Bekl.</option>
          <option value="paid">✅ Ödeme Alındı</option>
          <option value="preparing">📦 Paketlendi</option>
          <option value="shipped">🚚 Kargoda</option>
        </select>
      </div>

      {/* Order Cards - Mobile Friendly */}
      <div style={{ 
        background: c.header, 
        borderRadius: '0 0 8px 8px', 
        border: `1px solid ${c.border}`,
        borderTop: `1px solid ${c.border}`
      }}>
        {filteredOrders.map((order, index) => (
          <div 
            key={order.id} 
            style={{ 
              padding: '15px',
              borderBottom: index < filteredOrders.length - 1 ? `1px solid ${c.border}` : 'none',
              background: index % 2 === 0 ? c.header : c.bgSecondary
            }}
          >
            {/* Customer & Price Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: c.text, fontSize: '15px', marginBottom: '3px' }}>
                  {order.customer_name}
                </div>
                <div style={{ fontSize: '13px', color: c.textSecondary }}>
                  📱 {order.customer_phone}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#007bff', fontSize: '16px' }}>
                  ₺{order.price}
                </div>
              </div>
            </div>

            {/* Products */}
            <div style={{ 
              background: c.bgSecondary, 
              padding: '10px', 
              borderRadius: '6px', 
              marginBottom: '10px',
              fontSize: '13px',
              color: c.text
            }}>
              {order.product.split(', ').map((prod, idx) => (
                <div key={idx} style={{ marginBottom: idx < order.product.split(', ').length - 1 ? '5px' : '0' }}>
                  {prod}
                </div>
              ))}
              {order.note && (
                <div style={{ fontSize: '12px', color: c.textSecondary, marginTop: '8px', fontStyle: 'italic' }}>
                  📝 {order.note}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div style={{ marginBottom: '10px' }}>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value, order.customer_name)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `2px solid ${statusColors[order.status]}`,
                  background: statusColors[order.status],
                  color: order.status === 'paid' || order.status === 'completed' ? '#333' : 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                <option value="payment_pending">{statusEmojis.payment_pending} Ödeme Bekleniyor</option>
                <option value="paid">{statusEmojis.paid} Ödeme Alındı</option>
                <option value="preparing">{statusEmojis.preparing} Paketlendi</option>
                <option value="shipped">{statusEmojis.shipped} Kargoda</option>
                <option value="completed">{statusEmojis.completed} Teslim Edildi</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  if (order.customer_phone) {
                    const message = getWhatsAppMessage(order)
                    const url = 'https://wa.me/90' + order.customer_phone + '?text=' + encodeURIComponent(message)
                    window.open(url, '_blank')
                  }
                }}
                style={{ 
                  flex: 1,
                  padding: '10px', 
                  background: '#25d366', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <img 
                  src="https://dcqdgklkrjvmfjzhliph.supabase.co/storage/v1/object/sign/wp%20logo/pngwing.com.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjA2YmZmMy04N2Q0LTRmMjAtYjRmMC01MGRiZDM3OWI1NGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3cCBsb2dvL3BuZ3dpbmcuY29tLnBuZyIsImlhdCI6MTc3NDcyNTQxMSwiZXhwIjoxODA2MjYxNDExfQ.p5yP8eFZijbKeH4XwfggFNDvI6vpPPsU756s2t4vZKI"
                  alt="WhatsApp"
                  style={{ width: '18px', height: '18px' }}
                />
                Mesaj
              </button>
              <button
                onClick={() => startEditing(order)}
                style={{ 
                  padding: '10px 15px', 
                  background: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  fontSize: '13px' 
                }}
              >
                ✎
              </button>
              <button
                onClick={() => deleteOrder(order.id)}
                style={{ 
                  padding: '10px 15px', 
                  background: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  fontSize: '13px' 
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        
        {filteredOrders.length === 0 && (
          <div style={{ textAlign: 'center', color: c.textSecondary, padding: '40px 20px' }}>
            <p style={{ fontSize: '14px' }}>📭 Sipariş bulunamadı.</p>
          </div>
        )}
      </div>
    </>
  )
}