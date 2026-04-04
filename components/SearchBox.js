'use client'

import { colors } from '../lib/theme'

export default function SearchBox({ searchName, setSearchName, searchPhone, setSearchPhone, filteredCount, theme }) {
  const c = colors[theme]

  return (
    <div style={{ background: c.header, padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}` }}>
      <h3 style={{ margin: '0 0 15px 0', color: c.text, fontSize: '14px', fontWeight: 'bold' }}>🔍 Sipariş Ara</h3>
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
          <button
            onClick={() => { setSearchName(''); setSearchPhone(''); }}
            style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '23px' }}
          >
            Temizle
          </button>
        </div>
      </div>
      <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: c.textSecondary }}>Bulunan: {filteredCount} sipariş</p>
    </div>
  )
}