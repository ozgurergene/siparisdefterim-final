'use client'
import { useState, useEffect } from 'react'
import { colors, glowEffects, buttonGradients } from '../lib/theme'
import { calculateProductTotal } from '../lib/calculations'

export default function EditModal({ order, onSave, onClose, theme }) {
  const c = colors[theme]
  const [formData, setFormData] = useState({ customer_name: '', phone: '', address: '', notes: '', products: [{ name: '', quantity: 1, unit_price: 0, kdv_rate: '' }] })
  const [focusedField, setFocusedField] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (order) {
      setFormData({
        customer_name: order.customer_name || '', phone: order.phone || '', address: order.address || '', notes: order.notes || '',
        products: order.products?.length > 0 ? order.products.map(p => ({ name: p.name || '', quantity: p.quantity || 1, unit_price: p.unit_price || 0, kdv_rate: p.kdv_rate || '' })) : [{ name: '', quantity: 1, unit_price: 0, kdv_rate: '' }]
      })
    }
  }, [order])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleProductChange = (index, field, value) => { const newProducts = [...formData.products]; newProducts[index][field] = value; setFormData({ ...formData, products: newProducts }) }
  const addProduct = () => setFormData({ ...formData, products: [...formData.products, { name: '', quantity: 1, unit_price: 0, kdv_rate: '' }] })
  const removeProduct = (index) => { if (formData.products.length > 1) setFormData({ ...formData, products: formData.products.filter((_, i) => i !== index) }) }

  const handleSubmit = async (e) => { e.preventDefault(); setIsSaving(true); await onSave(order.id, formData); setIsSaving(false) }

  const totals = formData.products.reduce((acc, product) => { const { subtotal, kdvAmount, total } = calculateProductTotal(product); return { subtotal: acc.subtotal + subtotal, kdv: acc.kdv + kdvAmount, total: acc.total + total } }, { subtotal: 0, kdv: 0, total: 0 })

  const inputStyle = (fieldName) => ({ width: '100%', padding: '10px 12px', borderRadius: 8, border: `2px solid ${focusedField === fieldName ? '#667eea' : c.border}`, background: c.bgInput, color: c.text, fontSize: 14, fontWeight: 500, outline: 'none', boxSizing: 'border-box' })

  if (!order) return null

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: c.bgCard, borderRadius: 20, padding: 28, width: '100%', maxWidth: 650, maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${c.border}`, boxShadow: c.shadowLg }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${c.border}` }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: c.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}><span>✏️</span>Sipariş Düzenle</h2>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#2d1f2f', color: '#f5576c', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: c.textSecondary }}>Müşteri</label><input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} onFocus={() => setFocusedField('customer_name')} onBlur={() => setFocusedField(null)} required style={inputStyle('customer_name')} /></div>
            <div><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: c.textSecondary }}>Telefon</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} required style={inputStyle('phone')} /></div>
          </div>
          <div style={{ marginBottom: 12 }}><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: c.textSecondary }}>Adres</label><input type="text" name="address" value={formData.address} onChange={handleChange} onFocus={() => setFocusedField('address')} onBlur={() => setFocusedField(null)} style={inputStyle('address')} /></div>

          <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 14, marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: c.text, margin: 0 }}>📦 Ürünler</h3>
              <button type="button" onClick={addProduct} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: buttonGradients.success, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>➕ Ekle</button>
            </div>

            {formData.products.map((product, index) => {
              const { total } = calculateProductTotal(product)
              return (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 50px 70px 50px 70px 28px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <input type="text" value={product.name} onChange={(e) => handleProductChange(index, 'name', e.target.value)} placeholder="Ürün" required style={{ ...inputStyle(`p${index}`), padding: '8px 10px' }} onFocus={() => setFocusedField(`p${index}`)} onBlur={() => setFocusedField(null)} />
                  <input type="number" value={product.quantity} onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)} min="1" style={{ ...inputStyle(`q${index}`), padding: '8px 6px', textAlign: 'center' }} onFocus={() => setFocusedField(`q${index}`)} onBlur={() => setFocusedField(null)} />
                  <input type="number" value={product.unit_price} onChange={(e) => handleProductChange(index, 'unit_price', parseFloat(e.target.value) || 0)} min="0" step="0.01" style={{ ...inputStyle(`pr${index}`), padding: '8px 6px', textAlign: 'center' }} onFocus={() => setFocusedField(`pr${index}`)} onBlur={() => setFocusedField(null)} />
                  <input type="number" value={product.kdv_rate} onChange={(e) => handleProductChange(index, 'kdv_rate', e.target.value)} min="0" max="100" placeholder="%" style={{ ...inputStyle(`k${index}`), padding: '8px 6px', textAlign: 'center' }} onFocus={() => setFocusedField(`k${index}`)} onBlur={() => setFocusedField(null)} />
                  <span style={{ fontSize: 13, color: '#43e97b', fontWeight: 600, textAlign: 'center' }}>₺{total.toFixed(0)}</span>
                  <button type="button" onClick={() => removeProduct(index)} disabled={formData.products.length === 1} style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: formData.products.length === 1 ? 'transparent' : '#2d1f2f', color: '#f5576c', cursor: formData.products.length === 1 ? 'not-allowed' : 'pointer', opacity: formData.products.length === 1 ? 0.3 : 1, fontSize: 12 }}>🗑️</button>
                </div>
              )
            })}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${c.border}` }}>
              <span style={{ fontSize: 12, color: c.textSecondary }}>Tutar: <strong style={{ color: c.text }}>₺{totals.subtotal.toFixed(2)}</strong></span>
              <span style={{ fontSize: 12, color: c.textSecondary }}>KDV: <strong style={{ color: '#f093fb' }}>₺{totals.kdv.toFixed(2)}</strong></span>
              <span style={{ fontSize: 13, color: '#43e97b', fontWeight: 700 }}>Toplam: ₺{totals.total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ marginTop: 14 }}><label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: c.textSecondary }}>Not</label><textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} style={{ ...inputStyle('notes'), resize: 'vertical', minHeight: 50 }} onFocus={() => setFocusedField('notes')} onBlur={() => setFocusedField(null)} /></div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${c.border}`, background: 'transparent', color: c.text, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>İptal</button>
            <button type="submit" disabled={isSaving} style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: buttonGradients.primary, color: 'white', fontSize: 14, fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: isSaving ? 0.7 : 1 }}
              onMouseEnter={(e) => { if (!isSaving) { e.currentTarget.style.boxShadow = glowEffects.primary } }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}>
              {isSaving ? (<><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Kaydediliyor...</>) : '✓ Kaydet'}
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}