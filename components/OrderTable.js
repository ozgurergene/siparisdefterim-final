'use client'
import { useState } from 'react'
import { colors, statusColors, glowEffects, getAvatarGradient, getInitials } from '../lib/theme'

export default function OrderTable({ orders, onStatusChange, onDelete, onEdit, theme }) {
  const c = colors[theme]
  const [hoveredRow, setHoveredRow] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const whatsappLogo = 'https://dcqdgklkrjvmfjzhliph.supabase.co/storage/v1/object/sign/wp%20logo/pngwing.com.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjA2YmZmMy04N2Q0LTRmMjAtYjRmMC01MGRiZDM3OWI1NGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3cCBsb2dvL3BuZ3dpbmcuY29tLnBuZyIsImlhdCI6MTc3NDcyNTQxMSwiZXhwIjoxODA2MjYxNDExfQ.p5yP8eFZijbKeH4XwfggFNDvI6vpPPsU756s2t4vZKI'

  const sendWhatsApp = (order) => {
    const products = order.products?.map(p => `${p.name} x${p.quantity} (${p.total?.toFixed(2) || '0.00'} TL)`).join('\n') || ''
    const message = `Merhaba ${order.customer_name},\n\nSipariniz:\n${products}\n\nToplam: ${order.total_amount?.toFixed(2) || '0.00'} TL\n\nTesekkurler!`
    const phone = order.phone?.replace(/\D/g, '')
    const fullPhone = phone?.startsWith('90') ? phone : `90${phone}`
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleDelete = (order) => {
    if (confirmDelete === order.id) { onDelete(order.id); setConfirmDelete(null) }
    else { setConfirmDelete(order.id); setTimeout(() => setConfirmDelete(null), 3000) }
  }

  if (!orders || orders.length === 0) {
    return (
      <div style={{ background: c.bgCard, borderRadius: 16, padding: 60, textAlign: 'center', border: `1px solid ${c.border}` }}>
        <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📭</span>
        <p style={{ color: c.textSecondary, fontSize: 15, fontWeight: 500, margin: 0 }}>Henüz sipariş bulunmuyor</p>
      </div>
    )
  }

  return (
    <div style={{ background: c.bgCard, borderRadius: 16, overflow: 'hidden', border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
      <div style={{ display: 'grid', gridTemplateColumns: '50px 2fr 1.5fr 100px 140px 130px', gap: 16, padding: '14px 20px', background: c.bgTertiary, borderBottom: `1px solid ${c.border}` }}>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}></span>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Müşteri</span>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ürünler</span>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Fiyat</span>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Durum</span>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>İşlem</span>
      </div>

      {orders.map((order) => {
        const status = statusColors[order.status] || statusColors.payment_pending
        const isHovered = hoveredRow === order.id
        return (
          <div key={order.id} onMouseEnter={() => setHoveredRow(order.id)} onMouseLeave={() => setHoveredRow(null)}
            style={{ display: 'grid', gridTemplateColumns: '50px 2fr 1.5fr 100px 140px 130px', gap: 16, padding: '14px 20px', borderBottom: `1px solid ${c.borderLight}`, alignItems: 'center', background: isHovered ? c.bgCardHover : 'transparent', transition: 'background 0.15s ease' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: getAvatarGradient(order.customer_name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white' }}>{getInitials(order.customer_name)}</div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: c.text }}>{order.customer_name}</p>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: c.textMuted, fontWeight: 500 }}>📱 {order.phone}</p>
            </div>
            <div style={{ fontSize: 13, color: c.textSecondary, lineHeight: 1.5 }}>
              {order.products?.map((p, i) => (<div key={i} style={{ fontWeight: 500 }}>{p.name} x{p.quantity} <span style={{ color: c.textMuted }}>(₺{p.total?.toFixed(0) || '0'})</span></div>))}
              {order.notes && <div style={{ marginTop: 4, fontSize: 11, color: '#f093fb', fontStyle: 'italic', fontWeight: 500 }}>Not: {order.notes}</div>}
            </div>
            <div style={{ textAlign: 'right' }}><span style={{ fontSize: 16, fontWeight: 700, color: '#43e97b' }}>₺{order.total_amount?.toFixed(0) || '0'}</span></div>
            <div style={{ textAlign: 'center' }}>
              <select value={order.status} onChange={(e) => onStatusChange(order.id, e.target.value)} style={{ padding: '8px 12px', borderRadius: 20, border: `2px solid ${status.border}`, background: status.bg, color: status.text, fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none', minWidth: 130 }}>
                <option value="payment_pending">💰 Ödeme Bekleniyor</option>
                <option value="paid">✅ Ödeme Alındı</option>
                <option value="preparing">📦 Paketlendi</option>
                <option value="shipped">🚚 Kargoda</option>
                <option value="completed">✓ Teslim Edildi</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => sendWhatsApp(order)} style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: '#1a3d2a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = glowEffects.whatsapp }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }} title="WhatsApp"><img src={whatsappLogo} alt="WhatsApp" style={{ width: 18, height: 18 }} /></button>
              <button onClick={() => onEdit(order)} style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: '#1a2a3e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = glowEffects.info }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }} title="Düzenle">✏️</button>
              <button onClick={() => handleDelete(order)} style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: confirmDelete === order.id ? '#3d1f2a' : '#2d1f2f', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = glowEffects.danger }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }} title={confirmDelete === order.id ? 'Silmek için tekrar tıkla' : 'Sil'}>{confirmDelete === order.id ? '⚠️' : '🗑️'}</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}