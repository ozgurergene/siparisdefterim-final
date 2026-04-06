'use client'
import { useState } from 'react'
import { colors, glowEffects, buttonGradients } from '../lib/theme'
import { calculateProductTotal } from '../lib/calculations'

export default function OrderForm({ onSubmit, theme }) {
  const c = colors[theme]
  
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    notes: '',
    products: [{ name: '', quantity: 1, unit_price: 0, kdv_rate: '' }]
  })
  
  const [focusedField, setFocusedField] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    setIsSubmitting(true)
    await onSubmit(formData)
    setIsSubmitting(false)
    setFormData({
      customer_name: '',
      phone: '',
      address: '',
      notes: '',
      products: [{ name: '', quantity: 1, unit_price: 0, kdv_rate: '' }]
    })
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
    padding: '14px 16px',
    borderRadius: 12,
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
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 500,
    color: c.textSecondary,
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          background: c.bgCard,
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
          border: `1px solid ${c.border}`,
          boxShadow: `0 10px 40px ${c.shadow}`,
        }}
      >
        <h2 style={{ 
          fontSize: 18, 
          fontWeight: 600, 
          color: c.text, 
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span>📝</span>
          Sipariş Oluştur
        </h2>

        {/* Customer Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Müşteri Adı Soyadı</label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              onFocus={() => setFocusedField('customer_name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Adı Soyadı"
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
              placeholder="5551234567"
              required
              style={inputStyle('phone')}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Adres</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onFocus={() => setFocusedField('address')}
            onBlur={() => setFocusedField(null)}
            placeholder="Adres"
            style={inputStyle('address')}
          />
        </div>

        {/* Products Section */}
        <div style={{ 
          borderTop: `1px solid ${c.border}`, 
          paddingTop: 20,
          marginTop: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ 
              fontSize: 15, 
              fontWeight: 600, 
              color: c.text,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span>📦</span>
              Ürünler
            </h3>
            <button
              type="button"
              onClick={addProduct}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: 'none',
                background: buttonGradients.success,
                color: 'white',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
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
              <span>➕</span>
              Ürün Ekle
            </button>
          </div>

          {/* Products Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 80px 100px 100px 80px 100px 100px 40px',
              gap: 12,
              padding: '10px 0',
              borderBottom: `1px solid ${c.border}`,
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 12, color: c.textMuted, fontWeight: 500 }}>Ürün Adı</span>
            <span style={{ fontSize: 12, color: c.textMuted, fontWeight: 500, textAlign: 'center' }}>Adet</span>
            <span style={{ fontSize: 12, color: c.textMuted, fontWeight: 500, textAlign: 'center' }}>Birim Fiyatı</span>
            <span style={{ fontSize: 12, color: c.textMuted, fontWeight: 500, textAlign: 'center' }}>Tutar</span>
            <span style={{ fontSize: 12, color: c.textMuted, fontWeight: 500, textAlign: 'center' }}>KDV %</span>
            <span style={{ fontSize: 12, color: c.textMuted, fontWeight: 500, textAlign: 'center' }}>KDV Tutarı</span>
            <span style={{ fontSize: 12, color: c.textMuted, fontWeight: 500, textAlign: 'center' }}>Toplam</span>
            <span></span>
          </div>

          {/* Product Rows */}
          {formData.products.map((product, index) => {
            const { subtotal, kdvAmount, total } = calculateProductTotal(product)
            return (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 80px 100px 100px 80px 100px 100px 40px',
                  gap: 12,
                  padding: '8px 0',
                  alignItems: 'center',
                  animation: 'fadeIn 0.3s ease-out',
                }}
              >
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                  placeholder="Ürün adı"
                  required
                  style={{
                    ...inputStyle(`product_name_${index}`),
                    padding: '10px 12px',
                  }}
                  onFocus={() => setFocusedField(`product_name_${index}`)}
                  onBlur={() => setFocusedField(null)}
                />
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  min="1"
                  style={{
                    ...inputStyle(`quantity_${index}`),
                    padding: '10px 8px',
                    textAlign: 'center',
                  }}
                  onFocus={() => setFocusedField(`quantity_${index}`)}
                  onBlur={() => setFocusedField(null)}
                />
                <input
                  type="number"
                  value={product.unit_price}
                  onChange={(e) => handleProductChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  style={{
                    ...inputStyle(`unit_price_${index}`),
                    padding: '10px 8px',
                    textAlign: 'center',
                  }}
                  onFocus={() => setFocusedField(`unit_price_${index}`)}
                  onBlur={() => setFocusedField(null)}
                />
                <span style={{ 
                  textAlign: 'center', 
                  fontSize: 14, 
                  color: c.text,
                  fontWeight: 500,
                }}>
                  ₺{subtotal.toFixed(2)}
                </span>
                <input
                  type="number"
                  value={product.kdv_rate}
                  onChange={(e) => handleProductChange(index, 'kdv_rate', e.target.value)}
                  min="0"
                  max="100"
                  placeholder="0"
                  style={{
                    ...inputStyle(`kdv_rate_${index}`),
                    padding: '10px 8px',
                    textAlign: 'center',
                  }}
                  onFocus={() => setFocusedField(`kdv_rate_${index}`)}
                  onBlur={() => setFocusedField(null)}
                />
                <span style={{ 
                  textAlign: 'center', 
                  fontSize: 14, 
                  color: c.textSecondary,
                }}>
                  ₺{kdvAmount.toFixed(2)}
                </span>
                <span style={{ 
                  textAlign: 'center', 
                  fontSize: 14, 
                  color: '#43e97b',
                  fontWeight: 600,
                }}>
                  ₺{total.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  disabled={formData.products.length === 1}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: 'none',
                    background: formData.products.length === 1 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(245, 87, 108, 0.15)',
                    color: formData.products.length === 1 ? c.textMuted : '#f5576c',
                    cursor: formData.products.length === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    transition: 'all 0.3s ease',
                    opacity: formData.products.length === 1 ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (formData.products.length > 1) {
                      e.currentTarget.style.transform = 'scale(1.1)'
                      e.currentTarget.style.boxShadow = glowEffects.danger
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  🗑️
                </button>
              </div>
            )
          })}

          {/* Totals */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 16,
              marginTop: 20,
              padding: '16px 0',
              borderTop: `1px solid ${c.border}`,
            }}
          >
            <div style={{ 
              background: 'rgba(102, 126, 234, 0.1)', 
              padding: 16, 
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 12, color: c.textMuted, margin: '0 0 4px 0' }}>Tutar</p>
              <p style={{ fontSize: 20, fontWeight: 600, color: c.text, margin: 0 }}>₺{totals.subtotal.toFixed(2)}</p>
            </div>
            <div style={{ 
              background: 'rgba(240, 147, 251, 0.1)', 
              padding: 16, 
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 12, color: c.textMuted, margin: '0 0 4px 0' }}>KDV</p>
              <p style={{ fontSize: 20, fontWeight: 600, color: '#f093fb', margin: 0 }}>₺{totals.kdv.toFixed(2)}</p>
            </div>
            <div style={{ 
              background: 'rgba(67, 233, 123, 0.15)', 
              padding: 16, 
              borderRadius: 12,
              textAlign: 'center',
              border: '1px solid rgba(67, 233, 123, 0.3)',
            }}>
              <p style={{ fontSize: 12, color: c.textMuted, margin: '0 0 4px 0' }}>Toplam</p>
              <p style={{ fontSize: 20, fontWeight: 600, color: '#43e97b', margin: 0 }}>₺{totals.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginTop: 20 }}>
          <label style={labelStyle}>Not (Opsiyonel)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            onFocus={() => setFocusedField('notes')}
            onBlur={() => setFocusedField(null)}
            placeholder="Özel talep, açıklama..."
            rows={3}
            style={{
              ...inputStyle('notes'),
              resize: 'vertical',
              minHeight: 80,
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '16px 24px',
            marginTop: 20,
            borderRadius: 12,
            border: 'none',
            background: buttonGradients.primary,
            color: 'white',
            fontSize: 16,
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'all 0.3s ease',
            opacity: isSubmitting ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'scale(1.02)'
              e.currentTarget.style.boxShadow = glowEffects.primary
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {isSubmitting ? (
            <>
              <span style={{
                width: 20,
                height: 20,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              Kaydediliyor...
            </>
          ) : (
            <>
              <span>✓</span>
              Onayla
            </>
          )}
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  )
}