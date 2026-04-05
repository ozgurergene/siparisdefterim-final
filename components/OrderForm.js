'use client'

import { colors } from '../lib/theme'
import { calculateSubtotal, calculateKDVAmount, calculateLineTotal, calculateGrandTotal, calculateTotalKDV, calculateTotalSubtotal } from '../lib/calculations'

export default function OrderForm({ newOrder, setNewOrder, ordersCreatedCount, handleAddOrder, theme }) {
  const c = colors[theme]

  const addProductLine = () => {
    setNewOrder({
      ...newOrder,
      products: [...newOrder.products, { product: '', quantity: 1, unit_price: '', kdv_rate: 0 }]
    })
  }

  const updateProductLine = (index, field, value) => {
    const updatedProducts = [...newOrder.products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setNewOrder({ ...newOrder, products: updatedProducts })
  }

  const removeProductLine = (index) => {
    const updatedProducts = newOrder.products.filter((_, i) => i !== index)
    setNewOrder({ ...newOrder, products: updatedProducts })
  }

  return (
    <div style={{ background: c.header, padding: '15px', borderRadius: '8px', marginBottom: '15px', border: `1px solid ${c.border}` }}>
      <h3 style={{ margin: '0 0 15px 0', color: c.text, fontSize: '14px', fontWeight: 'bold' }}>📋 Sipariş Oluştur</h3>
      
      {/* Customer Info - Stacked on mobile */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı Soyadı</label>
          <input
            type="text"
            placeholder="Adı Soyadı"
            value={newOrder.customer_name}
            onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
            style={{ width: '100%', padding: '10px', border: `1px solid ${c.inputBorder}`, borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
          <input
            type="tel"
            placeholder="5551234567"
            value={newOrder.customer_phone}
            onChange={(e) => setNewOrder({ ...newOrder, customer_phone: e.target.value.replace(/\D/g, '') })}
            maxLength="10"
            style={{ width: '100%', padding: '10px', border: `1px solid ${c.inputBorder}`, borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Adres</label>
          <input
            type="text"
            placeholder="Adres"
            value={newOrder.customer_address}
            onChange={(e) => setNewOrder({ ...newOrder, customer_address: e.target.value })}
            style={{ width: '100%', padding: '10px', border: `1px solid ${c.inputBorder}`, borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
      </div>

      {/* Product Lines - Card based for mobile */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: c.text }}>Ürünler</label>
          <button 
            type="button" 
            onClick={addProductLine} 
            style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            ➕ Ürün Ekle
          </button>
        </div>
        
        {newOrder.products.map((product, index) => (
          <div key={index} style={{ 
            background: c.bgSecondary, 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '10px',
            border: `1px solid ${c.border}`
          }}>
            {/* Product Name */}
            <input 
              type="text" 
              placeholder="Ürün adı" 
              value={product.product} 
              onChange={(e) => updateProductLine(index, 'product', e.target.value)} 
              style={{ width: '100%', padding: '10px', border: `1px solid ${c.inputBorder}`, borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text, marginBottom: '10px' }} 
            />
            
            {/* Quantity, Price, KDV Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: c.textSecondary, marginBottom: '3px' }}>Adet</label>
                <input 
                  type="number" 
                  placeholder="1" 
                  min="1" 
                  value={product.quantity} 
                  onChange={(e) => updateProductLine(index, 'quantity', e.target.value)} 
                  style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: c.textSecondary, marginBottom: '3px' }}>Fiyat (₺)</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={product.unit_price} 
                  onChange={(e) => updateProductLine(index, 'unit_price', e.target.value)} 
                  style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: c.textSecondary, marginBottom: '3px' }}>KDV %</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={product.kdv_rate} 
                  onChange={(e) => updateProductLine(index, 'kdv_rate', e.target.value)} 
                  style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} 
                />
              </div>
            </div>
            
            {/* Totals & Delete Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: c.text }}>
                <span style={{ color: c.textSecondary }}>Toplam: </span>
                <strong style={{ color: '#007bff' }}>₺{calculateLineTotal(product)}</strong>
                <span style={{ color: c.textSecondary, marginLeft: '8px', fontSize: '11px' }}>(KDV: ₺{calculateKDVAmount(product)})</span>
              </div>
              <button 
                type="button" 
                onClick={() => removeProductLine(index)} 
                disabled={newOrder.products.length === 1} 
                style={{ 
                  padding: '6px 10px', 
                  background: newOrder.products.length === 1 ? '#ccc' : '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: newOrder.products.length === 1 ? 'not-allowed' : 'pointer', 
                  fontWeight: 'bold', 
                  fontSize: '12px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  opacity: newOrder.products.length === 1 ? 0.5 : 1
                }}
                onMouseOver={(e) => {
                  if (newOrder.products.length > 1) {
                    e.currentTarget.style.transform = 'scale(1.1)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.5)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary - 3 columns on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '15px' }}>
        <div style={{ padding: '10px 5px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ color: c.textSecondary, marginBottom: '3px', fontSize: '11px' }}>Tutar</div>
          <div style={{ fontWeight: 'bold', color: c.text, fontSize: '14px' }}>₺{calculateTotalSubtotal(newOrder.products)}</div>
        </div>
        <div style={{ padding: '10px 5px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ color: c.textSecondary, marginBottom: '3px', fontSize: '11px' }}>KDV</div>
          <div style={{ fontWeight: 'bold', color: c.text, fontSize: '14px' }}>₺{calculateTotalKDV(newOrder.products)}</div>
        </div>
        <div style={{ padding: '10px 5px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ color: c.textSecondary, marginBottom: '3px', fontSize: '11px' }}>Toplam</div>
          <div style={{ fontWeight: 'bold', color: '#007bff', fontSize: '14px' }}>₺{calculateGrandTotal(newOrder.products)}</div>
        </div>
      </div>

      {/* Note */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Not (Opsiyonel)</label>
        <input 
          type="text" 
          placeholder="Özel talep, açıklama..." 
          value={newOrder.note} 
          onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })} 
          style={{ width: '100%', padding: '10px', border: `1px solid ${c.inputBorder}`, borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text }} 
        />
      </div>

      <button 
        onClick={handleAddOrder} 
        disabled={ordersCreatedCount >= 50} 
        style={{ width: '100%', padding: '14px', background: ordersCreatedCount >= 50 ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: ordersCreatedCount >= 50 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}
      >
        ✓ Siparişi Onayla
      </button>
    </div>
  )
}