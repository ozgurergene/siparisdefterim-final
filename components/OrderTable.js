'use client'

import { colors, statusColors } from '../lib/theme'

export default function OrderTable({ filteredOrders, user, theme, startEditing, deleteOrder, updateOrderStatus }) {
  const c = colors[theme]

  return (
    <div style={{ background: c.header, borderRadius: '8px', overflow: 'auto', border: `1px solid ${c.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', minWidth: '800px' }}>
        <thead>
          <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Müşteri</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Telefon</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Ürünler</th>
            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '60px', color: c.text }}>Fiyat</th>
            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '90px', color: c.text }}>Durum</th>
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
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      if (order.customer_phone) {
                        window.open(`https://wa.me/90${order.customer_phone}?text=Merhaba! "${order.customer_name}" için sipariş. Ürünler: ${order.product}, Toplam: ₺${order.price}`, '_blank')
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
  )
}