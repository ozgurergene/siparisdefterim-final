'use client'

import { colors } from '../lib/theme'

export default function SearchBox({ searchName, setSearchName, searchPhone, setSearchPhone, searchProduct, setSearchProduct, filteredCount, theme }) {
  const c = colors[theme]

  return (
    <div style={{ background: c.header, padding: '15px', borderRadius: '8px', marginBottom: '15px', border: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: c.text, fontSize: '14px', fontWeight: 'bold' }}>🔍 Sipariş Ara</h3>
        <span style={{ fontSize: '12px', color: c.textSecondary }}>{filteredCount} sonuç</span>
      </div>
      
      {/* Search Fields - Stacked on mobile */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="👤 Müşteri adı ara..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: `1px solid ${c.inputBorder}`, 
            borderRadius: '6px', 
            fontSize: '16px', 
            boxSizing: 'border-box', 
            background: c.input, 
            color: c.text 
          }}
        />
        <input
          type="tel"
          placeholder="📱 Telefon ara..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value.replace(/\D/g, ''))}
          maxLength="10"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: `1px solid ${c.inputBorder}`, 
            borderRadius: '6px', 
            fontSize: '16px', 
            boxSizing: 'border-box', 
            background: c.input, 
            color: c.text 
          }}
        />
        <input
          type="text"
          placeholder="📦 Ürün ara..."
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: `1px solid ${c.inputBorder}`, 
            borderRadius: '6px', 
            fontSize: '16px', 
            boxSizing: 'border-box', 
            background: c.input, 
            color: c.text 
          }}
        />
        
        {/* Clear Button - Only show if there's a search */}
        {(searchName || searchPhone || searchProduct) && (
          <button
            onClick={() => { setSearchName(''); setSearchPhone(''); setSearchProduct(''); }}
            style={{ 
              width: '100%',
              padding: '12px', 
              background: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '14px'
            }}
          >
            ✕ Aramayı Temizle
          </button>
        )}
      </div>
    </div>
  )
}