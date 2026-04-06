'use client'

import { colors } from '../lib/theme'
import { calculateSubtotal, calculateKDVAmount, calculateLineTotal, calculateGrandTotal, calculateTotalKDV, calculateTotalSubtotal } from '../lib/calculations'

export default function OrderForm({ newOrder, setNewOrder, ordersCreatedCount, handleAddOrder, theme }) {
  const c = colors[theme]

  const addProductLine = () => {
    setNewOrder({
      ...newOrder,
      products: [...newOrder.products, { product: '', quantity: 1, unit_price: '', kdv_rate: '' }]
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
    <div style={{ background: c.header, padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}` }}>
      <h3 style={{ margin: '0 0 15px 0', color: c.text, fontSize: '14px', fontWeight: 'bold' }}>📋 Sipariş Oluştur</h3>
      
      {/* Customer Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı Soyadı</label>
          <input
            type="text"
            placeholder="Adı Soyadı"
            value={newOrder.customer_name}
            onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
            style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
          <input
            type="text"
            placeholder="5551234567"
            value={newOrder.customer_phone}
            onChange={(e) => setNewOrder({ ...newOrder, customer_phone: e.target.value.replace(/\D/g, '') })}
            maxLength="10"
            style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
      </div>

      {/* Address Row */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Adres</label>
        <input
          type="text"
          placeholder="Adres"
          value={newOrder.customer_address}
          onChange={(e) => setNewOrder({ ...newOrder, customer_address: e.target.value })}
          style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
        />
      </div>

      {/* Product Lines Table */}
      <div style={{ marginBottom: '15px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Ürün</span>
                  <button 
                    type="button" 
                    onClick={addProductLine} 
                    style={{ 
                      padding: '4px 8px', 
                      background: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold', 
                      fontSize: '12px', 
                      lineHeight: '1',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.5)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >➕</button>
                </div>
              </th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '70px', color: c.text }}>Adet</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '100px', color: c.text }}>Birim Fiyatı</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>Tutar</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>KDV %</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>KDV Tutarı</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '100px', color: c.text }}>Toplam</th>
              <th style={{ padding: '10px', textAlign: 'center', width: '40px', color: c.text }}></th>
            </tr>
          </thead>
          <tbody>
            {newOrder.products.map((product, index) => (
              <tr key={index} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}` }}>
                  <input type="text" placeholder="Ürün adı" value={product.product} onChange={(e) => updateProductLine(index, 'product', e.target.value)} style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                </td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                  <input type="number" placeholder="1" min="1" value={product.quantity} onChange={(e) => updateProductLine(index, 'quantity', e.target.value)} style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                </td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                  <input type="number" placeholder="0" min="0" value={product.unit_price} onChange={(e) => updateProductLine(index, 'unit_price', e.target.value)} style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                </td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: c.text }}>₺{calculateSubtotal(product)}</td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                  <input type="number" placeholder="0" min="0" value={product.kdv_rate} onChange={(e) => updateProductLine(index, 'kdv_rate', e.target.value)} style={{ width: '50px', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                </td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: c.text }}>₺{calculateKDVAmount(product)}</td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: '#007bff' }}>₺{calculateLineTotal(product)}</td>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => removeProductLine(index)} 
                    disabled={newOrder.products.length === 1} 
                    style={{ 
                      padding: '4px 6px', 
                      background: newOrder.products.length === 1 ? '#ccc' : '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: newOrder.products.length === 1 ? 'not-allowed' : 'pointer', 
                      fontWeight: 'bold', 
                      fontSize: '14px',
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
                  >🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px', fontSize: '14px' }}>
        <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ color: c.textSecondary, marginBottom: '5px' }}>Tutar</div>
          <div style={{ fontWeight: 'bold', color: c.text, fontSize: '14px' }}>₺{calculateTotalSubtotal(newOrder.products)}</div>
        </div>
        <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ color: c.textSecondary, marginBottom: '5px' }}>KDV</div>
          <div style={{ fontWeight: 'bold', color: c.text, fontSize: '14px' }}>₺{calculateTotalKDV(newOrder.products)}</div>
        </div>
        <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ color: c.textSecondary, marginBottom: '5px', fontSize: '14px' }}>Toplam</div>
          <div style={{ fontWeight: 'bold', color: c.text, fontSize: '14px' }}>₺{calculateGrandTotal(newOrder.products)}</div>
        </div>
      </div>

      {/* Note */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Not (Opsiyonel)</label>
        <input type="text" placeholder="Özel talep, açıklama..." value={newOrder.note} onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })} style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
      </div>

      <button 
        onClick={handleAddOrder} 
        disabled={ordersCreatedCount >= 50} 
        style={{ 
          width: '100%', 
          padding: '12px', 
          background: ordersCreatedCount >= 50 ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: ordersCreatedCount >= 50 ? 'not-allowed' : 'pointer', 
          fontWeight: 'bold', 
          fontSize: '14px',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={(e) => {
          if (ordersCreatedCount < 50) {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.5)'
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >Onayla</button>
    </div>
  )
}