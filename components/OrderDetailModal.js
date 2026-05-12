'use client'

import { useState } from 'react'
import { colors } from '../lib/theme'

// Status etiketleri ve renkleri
const statusLabels = {
  payment_pending: { label: 'Ödeme Bekleniyor', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
  paid: { label: 'Ödeme Alındı', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
  preparing: { label: 'Hazırlanıyor', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  shipped: { label: 'Kargoda', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
  completed: { label: 'Tamamlandı', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' }
}

// Tarih + Saat formatla
function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ', ' + d.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Para formatla
function formatMoney(n) {
  return parseFloat(n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function OrderDetailModal({ order, isOpen, onClose, onRepeat, theme = 'light' }) {
  const c = colors[theme]
  const isDark = theme === 'dark'
  const [copied, setCopied] = useState(false)
  const [pdfToast, setPdfToast] = useState(false)

  if (!isOpen || !order) return null

  const orderNo = order.id ? order.id.slice(0, 8) : '-'
  const statusInfo = statusLabels[order.status] || statusLabels.payment_pending

  // products_detail varsa detayli mod, yoksa basit mod
  const hasDetail = Array.isArray(order.products_detail) && order.products_detail.length > 0

  // Ürünleri parse et
  const products = (() => {
    if (hasDetail) {
      return order.products_detail
    }
    // Fallback: product string'ten parse
    if (!order.product) return []
    return order.product.split(', ').map(part => {
      const match = part.match(/(.+) x(\d+)/)
      return match
        ? { product: match[1], quantity: parseInt(match[2]), unit_price: '', kdv_rate: '' }
        : { product: part, quantity: 1, unit_price: '', kdv_rate: '' }
    })
  })()

  // === Hesaplamalar (sadece detail varsa) ===
  let subtotal = 0
  let totalKdv = 0
  if (hasDetail) {
    products.forEach(p => {
      const qty = parseInt(p.quantity) || 1
      const price = parseFloat(p.unit_price) || 0
      const kdvRate = parseFloat(p.kdv_rate) || 0
      subtotal += qty * price
      totalKdv += qty * price * kdvRate / 100
    })
  }

  const grandTotal = parseFloat(order.price) || (subtotal + totalKdv)

  const handleCopyOrderNo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('#' + orderNo)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePdfDownload = () => {
    setPdfToast(true)
    setTimeout(() => setPdfToast(false), 2500)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDark ? '#0d0d1a' : '#ffffff',
          border: `1px solid ${c.border}`,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.3s ease'
        }}
      >
        {/* Header: Sipariş No + Durum + Kapat */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '20px 20px 16px 20px',
          borderBottom: `1px solid ${c.border}`
        }}>
          <div>
            <div style={{ fontSize: '11px', color: c.textSecondary, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              SİPARİŞ NO
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: isDark ? '#fff' : '#1a1a2e',
                fontFamily: 'monospace'
              }}>
                #{orderNo}
              </h2>
              <button
                onClick={handleCopyOrderNo}
                title="Kopyala"
                style={{
                  background: copied ? 'rgba(34, 197, 94, 0.15)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                  border: copied ? '1px solid #22c55e' : `1px solid ${c.border}`,
                  borderRadius: '6px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: copied ? '#22c55e' : c.textSecondary,
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                {copied ? '✓ Kopyalandı' : '📋 Kopyala'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: c.textSecondary, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                DURUM
              </div>
              <span style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: statusInfo.bg,
                color: statusInfo.color,
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                whiteSpace: 'nowrap'
              }}>
                {order.status === 'completed' ? '🎉' : ''} {statusInfo.label}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                color: isDark ? '#fff' : '#1a1a2e',
                fontSize: '18px',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Sipariş Tarihi */}
        <div style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${c.border}`,
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '11px', color: c.textSecondary, marginBottom: '4px' }}>
            📅 Sipariş Tarihi
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#fff' : '#1a1a2e' }}>
            {formatDateTime(order.created_at)}
          </div>
        </div>

        {/* Müşteri Bilgisi */}
        <div style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${c.border}`
        }}>
          <div style={{ fontSize: '11px', color: c.textSecondary, marginBottom: '6px' }}>
            👤 Müşteri
          </div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: isDark ? '#fff' : '#1a1a2e', marginBottom: '2px' }}>
            {order.customer_name || '-'}
          </div>
          {order.customer_phone && (
            <div style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600' }}>
              📱 {order.customer_phone}
            </div>
          )}
        </div>

        {/* === GUNCEL: Ürünler - KDV satir satir === */}
        <div style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${c.border}`
        }}>
          <div style={{ fontSize: '11px', color: c.textSecondary, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🛒 ÜRÜNLER
          </div>

          {hasDetail ? (
            // === DETAYLI MOD: Her ürün için adet, birim fiyat, KDV%, KDV tutarı, toplam ===
            <div>
              {products.map((p, i) => {
                const qty = parseInt(p.quantity) || 1
                const price = parseFloat(p.unit_price) || 0
                const kdvRate = parseFloat(p.kdv_rate) || 0
                const lineSubtotal = qty * price
                const lineKdv = lineSubtotal * kdvRate / 100
                const lineTotal = lineSubtotal + lineKdv

                return (
                  <div key={i} style={{
                    padding: '10px 12px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '8px',
                    marginBottom: i < products.length - 1 ? '8px' : '0',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                  }}>
                    {/* Ürün adı + adet + satır toplam */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#fff' : '#1a1a2e' }}>
                          {p.product}
                        </span>
                        <span style={{ fontSize: '13px', color: c.textSecondary, marginLeft: '6px' }}>
                          × {qty}
                        </span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#22c55e' }}>
                        ₺{formatMoney(lineTotal)}
                      </span>
                    </div>

                    {/* Detaylar: Birim fiyat, KDV oranı, KDV tutarı */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '8px',
                      fontSize: '11px'
                    }}>
                      <div>
                        <div style={{ color: c.textSecondary, marginBottom: '2px' }}>Birim Fiyat</div>
                        <div style={{ color: isDark ? '#fff' : '#1a1a2e', fontWeight: '600' }}>
                          ₺{formatMoney(price)}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: c.textSecondary, marginBottom: '2px' }}>KDV Oranı</div>
                        <div style={{ color: isDark ? '#fff' : '#1a1a2e', fontWeight: '600' }}>
                          %{kdvRate}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: c.textSecondary, marginBottom: '2px' }}>KDV Tutarı</div>
                        <div style={{ color: isDark ? '#fff' : '#1a1a2e', fontWeight: '600' }}>
                          ₺{formatMoney(lineKdv)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Ara Toplam + KDV + Genel Toplam */}
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${c.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ color: c.textSecondary }}>Ara Toplam</span>
                  <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontWeight: '600' }}>
                    ₺{formatMoney(subtotal)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: c.textSecondary }}>Toplam KDV</span>
                  <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontWeight: '600' }}>
                    ₺{formatMoney(totalKdv)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: `1px solid ${c.border}`,
                  fontSize: '16px',
                  fontWeight: '700'
                }}>
                  <span style={{ color: isDark ? '#fff' : '#1a1a2e' }}>Genel Toplam</span>
                  <span style={{ color: '#22c55e' }}>
                    ₺{formatMoney(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // === BASIT MOD: Eski siparişler için (products_detail yok) ===
            <div>
              {products.map((p, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < products.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` : 'none'
                }}>
                  <div>
                    <span style={{ fontSize: '14px', color: isDark ? '#fff' : '#1a1a2e', fontWeight: '500' }}>
                      {p.product}
                    </span>
                    <span style={{ fontSize: '13px', color: c.textSecondary, marginLeft: '6px' }}>
                      × {p.quantity || 1}
                    </span>
                  </div>
                </div>
              ))}

              {/* Sadece Genel Toplam (KDV bilgisi yok) */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: `1px solid ${c.border}`,
                fontSize: '16px',
                fontWeight: '700'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: isDark ? '#fff' : '#1a1a2e' }}>Genel Toplam</span>
                  <span style={{ fontSize: '11px', color: c.textSecondary, fontWeight: '500', marginTop: '2px' }}>
                    KDV dahil
                  </span>
                </div>
                <span style={{ color: '#22c55e' }}>
                  ₺{formatMoney(grandTotal)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Teslimat Adresi */}
        {(order.customer_address || order.customer_city || order.customer_district) && (
          <div style={{
            padding: '14px 20px',
            borderBottom: `1px solid ${c.border}`
          }}>
            <div style={{ fontSize: '11px', color: c.textSecondary, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📍 TESLİMAT ADRESİ
            </div>
            {order.customer_address && (
              <div style={{ fontSize: '13px', color: isDark ? '#fff' : '#1a1a2e', marginBottom: '2px', lineHeight: 1.4 }}>
                {order.customer_address}
              </div>
            )}
            {(order.customer_city || order.customer_district) && (
              <div style={{ fontSize: '13px', color: c.textSecondary }}>
                {[order.customer_district, order.customer_city].filter(Boolean).join(' / ')}
              </div>
            )}
          </div>
        )}

        {/* Kargo Bilgisi (varsa) */}
        {(order.cargo_company || order.tracking_number) && (
          <div style={{
            padding: '14px 20px',
            borderBottom: `1px solid ${c.border}`
          }}>
            <div style={{ fontSize: '11px', color: c.textSecondary, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📦 KARGO BİLGİSİ
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '2px' }}>Kargo Firması</div>
                <div style={{ fontSize: '13px', color: isDark ? '#fff' : '#1a1a2e', fontWeight: '600' }}>
                  {order.cargo_company || '-'}
                </div>
              </div>
              {order.tracking_number && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: c.textSecondary, marginBottom: '2px' }}>Takip No</div>
                  <div style={{ fontSize: '13px', color: '#667eea', fontFamily: 'monospace', fontWeight: '600' }}>
                    {order.tracking_number}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Not (varsa) */}
        {order.note && (
          <div style={{
            padding: '14px 20px',
            borderBottom: `1px solid ${c.border}`
          }}>
            <div style={{ fontSize: '11px', color: c.textSecondary, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📝 NOT
            </div>
            <div style={{
              fontSize: '13px',
              color: isDark ? '#fff' : '#1a1a2e',
              fontStyle: 'italic',
              lineHeight: 1.5
            }}>
              "{order.note}"
            </div>
          </div>
        )}

        {/* Butonlar */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              minWidth: '90px',
              padding: '12px',
              background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
              border: `1px solid ${c.border}`,
              borderRadius: '10px',
              color: isDark ? '#fff' : '#1a1a2e',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Kapat
          </button>

          <button
            onClick={handlePdfDownload}
            style={{
              flex: 1,
              minWidth: '110px',
              padding: '12px',
              background: 'transparent',
              border: `1px solid ${c.border}`,
              borderRadius: '10px',
              color: c.textSecondary,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="PDF olarak indir (yakında)"
          >
            📄 PDF İndir
          </button>

          {onRepeat && (
            <button
              onClick={() => { onRepeat(order); onClose() }}
              style={{
                flex: 1.2,
                minWidth: '110px',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              🔁 Tekrarla
            </button>
          )}
        </div>
      </div>

      {/* PDF Toast */}
      {pdfToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          padding: '14px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 10000,
          animation: 'fadeIn 0.2s ease'
        }}>
          📄 PDF indirme özelliği yakında gelecek!
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}