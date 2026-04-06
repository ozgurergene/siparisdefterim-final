'use client'

import { colors } from '../lib/theme'
import { calculateSubtotal, calculateKDVAmount, calculateLineTotal, calculateGrandTotal, calculateTotalKDV, calculateTotalSubtotal } from '../lib/calculations'

export default function EditModal({ editingId, editingData, setEditingData, saveEdit, cancelEdit, theme }) {
  const c = colors[theme]

  if (!editingId) return null

  const addProductLineEdit = () => {
    setEditingData({
      ...editingData,
      products: [...editingData.products, { product: '', quantity: 1, unit_price: '', kdv_rate: 0 }]
    })
  }

  const updateProductLineEdit = (index, field, value) => {
    const updatedProducts = [...editingData.products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setEditingData({ ...editingData, products: updatedProducts })
  }

  const removeProductLineEdit = (index) => {
    const updatedProducts = editingData.products.filter((_, i) => i !== index)
    setEditingData({ ...editingData, products: updatedProducts })
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: c.header, border: `1px solid ${c.border}`, borderRadius: '8px', padding: '20px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: c.text }}>
        <h2 style={{ margin: '0 0 20px 0', color: c.text }}>📝 Sipariş Düzenle</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '16px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri</label>
            <input
              type="text"
              value={editingData.customer_name}
              onChange={(e) => setEditingData({ ...editingData, customer_name: e.target.value })}
              style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '16px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
            <input
              type="text"
              value={editingData.customer_phone}
              onChange={(e) => setEditingData({ ...editingData, customer_phone: e.target.value.replace(/\D/g, '') })}
              maxLength="10"
              style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '16px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Adres</label>
          <input
            type="text"
            value={editingData.customer_address}
            onChange={(e) => setEditingData({ ...editingData, customer_address: e.target.value })}
            style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>

        <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
            <thead>
              <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold', color: c.text }}>Ürün</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', width: '70px', color: c.text }}>Adet</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', width: '100px', color: c.text }}>Fiyat</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', width: '80px', color: c.text }}>KDV%</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', width: '100px', color: c.text }}>Toplam</th>
                <th style={{ padding: '10px', width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {editingData.products && editingData.products.map((product, index) => (
                <tr key={index} style={{ borderBottom: `1px solid ${c.border}` }}>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="text"
                      value={product.product}
                      onChange={(e) => updateProductLineEdit(index, 'product', e.target.value)}
                      style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text }}
                    />
                  </td>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => updateProductLineEdit(index, 'quantity', e.target.value)}
                      style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="number"
                      value={product.unit_price}
                      onChange={(e) => updateProductLineEdit(index, 'unit_price', e.target.value)}
                      style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="number"
                      value={product.kdv_rate}
                      onChange={(e) => updateProductLineEdit(index, 'kdv_rate', e.target.value)}
                      style={{ width: '50px', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: '#007bff' }}>₺{calculateLineTotal(product)}</td>
                  <td style={{ padding: '8px' }}>
                    <button
                      onClick={() => removeProductLineEdit(index)}
                      disabled={editingData.products.length === 1}
                      style={{
                        padding: '4px 6px',
                        background: editingData.products.length === 1 ? '#ccc' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: editingData.products.length === 1 ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addProductLineEdit}
          style={{ padding: '6px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}
        >
          ➕
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: c.textSecondary, marginBottom: '5px' }}>Tutar</div>
            <div style={{ fontWeight: 'bold', color: c.text }}>₺{editingData.products ? calculateTotalSubtotal(editingData.products) : '0.00'}</div>
          </div>
          <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: c.textSecondary, marginBottom: '5px' }}>KDV</div>
            <div style={{ fontWeight: 'bold', color: c.text }}>₺{editingData.products ? calculateTotalKDV(editingData.products) : '0.00'}</div>
          </div>
          <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: c.textSecondary, marginBottom: '5px' }}>Toplam</div>
            <div style={{ fontWeight: 'bold', color: c.text }}>₺{editingData.products ? calculateGrandTotal(editingData.products) : '0.00'}</div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '16px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Not</label>
          <input
            type="text"
            value={editingData.note}
            onChange={(e) => setEditingData({ ...editingData, note: e.target.value })}
            style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={saveEdit}
            style={{ flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            Kaydet
          </button>
          <button
            onClick={cancelEdit}
            style={{ flex: 1, padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  )
}