'use client'
import { useState, useEffect } from 'react'
import { colors, glowEffects, buttonGradients } from '../lib/theme'
import { calculateProductTotal } from '../lib/calculations'

export default function EditModal({ order, onSave, onClose, theme }) {
  const c = colors[theme]
  
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    notes: '',
    products: [{ name: '', quantity: 1, unit_price: 0, kdv_rate: '' }]
  })
  
  const [focusedField, setFocusedField] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (order) {
      setFormData({
        customer_name: order.customer_name || '',
        phone: order.phone || '',
        address: order.address || '',
        notes: order.notes || '',
        products: order.products?.length > 0 
          ? order.products.map(p => ({
              name: p.name || '',
              quantity: p.quantity || 1,
              unit_price: p.unit_price || 0,
              kdv_rate: p.kdv_rate || ''
            }))
          : [{ name: '', quantity: 1, unit_price: 0, kdv_rate: '' }]
      })
    }
  }, [order])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products]
    newProducts[index][field] = value
    setFormData({ ...formData, products: newProducts })
  }

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: '', quantity: 1, unit_price: 0, kdv_rate: '' }]
    })
  }

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const newProducts = formData.products.filter((_, i) => i !== index)
      setFormData({ ...formData, products: newProducts })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    await onSave(order.id, formData)
    setIsSaving(false)
  }

  // Calculate totals
  const totals = formData.products.reduce((acc, product) => {
    const { subtotal, kdvAmount, total } = calculateProductTotal(product)
    return {
      subtotal: acc.subtotal + subtotal,
      kdv: acc.kdv + kdvAmount,
      total: acc.total + total
    }
  }, { subtotal: 0, kdv: 0, total: 0 })

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: `2px solid ${focusedField === fieldName ? 'transparent' : c.inputBorder}`,
    background: focusedField === fieldName 
      ? `linear-gradient(${c.input}, ${c.input}) padding-box, linear-gradient(135deg, #667eea, #764ba2) border-box`
      : c.input,
    color: c.text,
    fontSize: 14,
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: focusedField === fieldName ? '0 0 20px rgba(102, 126, 234, 0.2)' : 'none',
  })

  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 500,
    color: c.textSecondary,
  }

  if (!order) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: c.bgCard,
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: 28,
          width: '100%',
          maxWidth: 700,
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `1px solid ${c.border}`,
          boxShadow: `0 25px 80px ${c.shadowLg}`,
          animation: 'scaleIn 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: `1px solid ${c.border}`,
        }}>
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 600, 
            color: c.text, 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span>✏️</span>
            Sipariş Düzenle
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: 'none',
              background: 'rgba(245, 87, 108, 0.15)',
              color: '#f5576c',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = glowEffects.danger
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Customer Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Müşteri Adı Soyadı</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                onFocus={() => setFocusedField('customer_name')}
                onBlur={() => setFocusedField(null)}
                required
                style={inputStyle('customer_name')}
              />
            </div>
            <div>
              <label style={labelStyle}>Telefon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                required
                style={inputStyle('phone')}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Adres</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onFocus={() => setFocusedField('address')}
              onBlur={() => setFocusedField(null)}
              style={inputStyle('address')}
            />
          </div>

          {/* Products */}
          <div style={{ 
            borderTop: `1px solid ${c.border}`, 
            paddingTop: 16,
            marginTop: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: c.text, margin: 0 }}>
                📦 Ürünler
              </h3>
              <button
                type="button"
                onClick={addProduct}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: buttonGradients.success,
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = glowEffects.success
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                ➕ Ekle
              </button>
            </div>

            {formData.products.map((product, index) => {
              const { subtotal, kdvAmount, total } = calculateProductTotal(product)
              return (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 60px 80px 60px 80px 30px',
                    gap: 8,
                    marginBottom: 8,
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    placeholder="Ürün"
                    required
                    style={{ ...inputStyle(`product_${index}`), padding: '10px 12px' }}
                    onFocus={() => setFocusedField(`product_${index}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    min="1"
                    style={{ ...inputStyle(`qty_${index}`), padding: '10px 8px', textAlign: 'center' }}
                    onFocus={() => setFocusedField(`qty_${index}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                  <input
                    type="number"
                    value={product.unit_price}
                    onChange={(e) => handleProductChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    placeholder="Fiyat"
                    style={{ ...inputStyle(`price_${index}`), padding: '10px 8px', textAlign: 'center' }}
                    onFocus={() => setFocusedField(`price_${index}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                  <input
                    type="number"
                    value={product.kdv_rate}
                    onChange={(e) => handleProductChange(index, 'kdv_rate', e.target.value)}
                    min="0"
                    max="100"
                    placeholder="%"
                    style={{ ...inputStyle(`kdv_${index}`), padding: '10px 8px', textAlign: 'center' }}
                    onFocus={() => setFocusedField(`kdv_${index}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                  <span style={{ fontSize: 13, color: '#43e97b', fontWeight: 500, textAlign: 'center' }}>
                    ₺{total.toFixed(0)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    disabled={formData.products.length === 1}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: 'none',
                      background: formData.products.length === 1 ? 'transparent' : 'rgba(245, 87, 108, 0.15)',
                      color: '#f5576c',
                      cursor: formData.products.length === 1 ? 'not-allowed' : 'pointer',
                      opacity: formData.products.length === 1 ? 0.3 : 1,
                      fontSize: 12,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              )
            })}

            {/* Totals */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 20, 
              marginTop: 12,
              paddingTop: 12,
              borderTop: `1px solid ${c.border}`,
            }}>
              <span style={{ fontSize: 13, color: c.textSecondary }}>
                Tutar: <strong style={{ color: c.text }}>₺{totals.subtotal.toFixed(2)}</strong>
              </span>
              <span style={{ fontSize: 13, color: c.textSecondary }}>
                KDV: <strong style={{ color: '#f093fb' }}>₺{totals.kdv.toFixed(2)}</strong>
              </span>
              <span style={{ fontSize: 14, color: '#43e97b', fontWeight: 600 }}>
                Toplam: ₺{totals.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Not</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              onFocus={() => setFocusedField('notes')}
              onBlur={() => setFocusedField(null)}
              rows={2}
              style={{ ...inputStyle('notes'), resize: 'vertical', minHeight: 60 }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 12,
                border: `1px solid ${c.border}`,
                background: 'transparent',
                color: c.text,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = c.hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: buttonGradients.primary,
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.3s ease',
                opacity: isSaving ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = glowEffects.primary
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {isSaving ? (
                <>
                  <span style={{
                    width: 18,
                    height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Kaydediliyor...
                </>
              ) : (
                <>✓ Kaydet</>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}