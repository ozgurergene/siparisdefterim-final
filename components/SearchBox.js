'use client'

import { colors } from '../lib/theme'

export default function SearchBox({ searchName, setSearchName, searchPhone, setSearchPhone, searchProduct, setSearchProduct, filteredCount, theme }) {
  const c = colors[theme]

  return (
    <div style={{ background: c.header, padding: '15px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, color: c.text, fontSize: '14px', fontWeight: 'bold' }}>🔍 Sipariş Ara</h3>
        <span style={{ fontSize: '13px', color: c.textSecondary }}>{filteredCount} sonuç</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı</label>
          <input
            type="text"
            placeholder="Adı ara..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
          <input
            type="text"
            placeholder="Telefon ara..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value.replace(/\D/g, ''))}
            maxLength="10"
            style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Ürün</label>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
        <div>
          <button
            onClick={() => {
              setSearchName('')
              setSearchPhone('')
              setSearchProduct('')
            }}
            style={{ 
              padding: '8px 15px', 
              background: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '14px', 
              marginTop: '23px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(108, 117, 125, 0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Temizle
          </button>
        </div>
      </div>
    </div>
  )
}