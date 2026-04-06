'use client'
import { useState } from 'react'
import { colors, statusColors, glowEffects, getAvatarGradient, getInitials } from '../lib/theme'

export default function OrderTable({ orders, onStatusChange, onDelete, onEdit, theme }) {
  const c = colors[theme]
  const [hoveredRow, setHoveredRow] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const whatsappLogo = 'https://dcqdgklkrjvmfjzhliph.supabase.co/storage/v1/object/sign/wp%20logo/pngwing.com.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjA2YmZmMy04N2Q0LTRmMjAtYjRmMC01MGRiZDM3OWI1NGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3cCBsb2dvL3BuZ3dpbmcuY29tLnBuZyIsImlhdCI6MTc3NDcyNTQxMSwiZXhwIjoxODA2MjYxNDExfQ.p5yP8eFZijbKeH4XwfggFNDvI6vpPPsU756s2t4vZKI'

  const sendWhatsApp = (order) => {
    const products = order.products?.map(p => 
      `${p.name} x${p.quantity} (${p.total?.toFixed(2) || '0.00'} TL)`
    ).join('\n') || ''
    
    const message = `Merhaba ${order.customer_name},\n\nSipariniz:\n${products}\n\nToplam: ${order.total_amount?.toFixed(2) || '0.00'} TL\n\nTesekkurler!`
    
    const phone = order.phone?.replace(/\D/g, '')
    const fullPhone = phone?.startsWith('90') ? phone : `90${phone}`
    
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleDelete = (order) => {
    if (confirmDelete === order.id) {
      onDelete(order.id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(order.id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  if (!orders || orders.length === 0) {
    return (
      <div
        style={{
          background: c.bgCard,
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          padding: 60,
          textAlign: 'center',
          border: `1px solid ${c.border}`,
        }}
      >
        <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📭</span>
        <p style={{ color: c.textSecondary, fontSize: 16 }}>Henüz sipariş bulunmuyor</p>
      </div>
    )
  }

  return (
    <div
      style={{
        background: c.bgCard,
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        overflow: 'hidden',
        border: `1px solid ${c.border}`,
        boxShadow: `0 10px 40px ${c.shadow}`,
      }}
    >
      {/* Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '50px 2fr 1.5fr 100px 140px 130px',
          gap: 16,
          padding: '16px 24px',
          background: 'rgba(102, 126, 234, 0.05)',
          borderBottom: `1px solid ${c.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}></span>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Müşteri</span>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Ürünler</span>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Fiyat</span>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' }}>Durum</span>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>İşlem</span>
      </div>

      {/* Table Body */}
      {orders.map((order, index) => {
        const status = statusColors[order.status] || statusColors.payment_pending
        const isHovered = hoveredRow === order.id
        
        return (
          <div
            key={order.id}
            onMouseEnter={() => setHoveredRow(order.id)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              display: 'grid',
              gridTemplateColumns: '50px 2fr 1.5fr 100px 140px 130px',
              gap: 16,
              padding: '16px 24px',
              borderBottom: `1px solid ${c.borderLight}`,
              alignItems: 'center',
              background: isHovered ? c.bgCardHover : 'transparent',
              transition: 'all 0.2s ease',
              animation: 'fadeIn 0.3s ease-out',
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'both',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: getAvatarGradient(order.customer_name),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
                color: 'white',
                boxShadow: isHovered ? '0 4px 15px rgba(102, 126, 234, 0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              {getInitials(order.customer_name)}
            </div>

            {/* Customer Info */}
            <div>
              <p style={{ 
                margin: 0, 
                fontSize: 14, 
                fontWeight: 500, 
                color: c.text,
              }}>
                {order.customer_name}
              </p>
              <p style={{ 
                margin: '4px 0 0', 
                fontSize: 12, 
                color: c.textMuted,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{ color: '#667eea' }}>📱</span>
                {order.phone}
              </p>
            </div>

            {/* Products */}
            <div style={{ fontSize: 13, color: c.textSecondary, lineHeight: 1.6 }}>
              {order.products?.map((p, i) => (
                <div key={i}>
                  {p.name} x{p.quantity} <span style={{ color: c.textMuted }}>(₺{p.total?.toFixed(2) || '0.00'})</span>
                </div>
              ))}
              {order.notes && (
                <div style={{ 
                  marginTop: 4, 
                  fontSize: 11, 
                  color: '#f093fb',
                  fontStyle: 'italic',
                }}>
                  Not: {order.notes}
                </div>
              )}
            </div>

            {/* Price */}
            <div style={{ textAlign: 'right' }}>
              <span style={{ 
                fontSize: 16, 
                fontWeight: 600, 
                color: '#43e97b',
              }}>
                ₺{order.total_amount?.toFixed(0) || '0'}
              </span>
            </div>

            {/* Status Badge */}
            <div style={{ textAlign: 'center' }}>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 20,
                  border: `1px solid ${status.border}`,
                  background: status.bgSolid,
                  color: status.text,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  textAlign: 'center',
                  minWidth: 130,
                  transition: 'all 0.3s ease',
                }}
              >
                <option value="payment_pending">💰 Ödeme Bekleniyor</option>
                <option value="paid">✅ Ödeme Alındı</option>
                <option value="preparing">📦 Paketlendi</option>
                <option value="shipped">🚚 Kargoda</option>
                <option value="completed">✓ Teslim Edildi</option>
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {/* WhatsApp */}
              <button
                onClick={() => sendWhatsApp(order)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: 'none',
                  background: 'rgba(37, 211, 102, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.15)'
                  e.currentTarget.style.boxShadow = glowEffects.whatsapp
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                title="WhatsApp'tan Mesaj Gönder"
              >
                <img src={whatsappLogo} alt="WhatsApp" style={{ width: 20, height: 20 }} />
              </button>

              {/* Edit */}
              <button
                onClick={() => onEdit(order)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: 'none',
                  background: 'rgba(79, 172, 254, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.15)'
                  e.currentTarget.style.boxShadow = glowEffects.info
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                title="Düzenle"
              >
                ✏️
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(order)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: 'none',
                  background: confirmDelete === order.id 
                    ? 'rgba(245, 87, 108, 0.3)' 
                    : 'rgba(245, 87, 108, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.15)'
                  e.currentTarget.style.boxShadow = glowEffects.danger
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                title={confirmDelete === order.id ? 'Silmek için tekrar tıkla' : 'Sil'}
              >
                {confirmDelete === order.id ? '⚠️' : '🗑️'}
              </button>
            </div>
          </div>
        )
      })}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}