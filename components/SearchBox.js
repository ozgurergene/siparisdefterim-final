'use client'

import { useState } from 'react'
import { colors } from '../lib/theme'

export default function SearchBox({ searchName, setSearchName, searchPhone, setSearchPhone, searchProduct, setSearchProduct, filteredCount, theme }) {
  const c = colors[theme]
  const [isOpen, setIsOpen] = useState(false)
  
  // Aktif arama var mı?
  const hasActiveSearch = searchName || searchPhone || searchProduct

  return (
    <div style={{ background: c.header, borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
      {/* Header - Always visible */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '12px 15px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          background: isOpen ? c.bgSecondary : c.header,
          transition: 'background 0.2s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: c.text }}>🔍 Sipariş Ara</span>
          {hasActiveSearch && (
            <span style={{ 
              background: '#007bff', 
              color: 'white', 
              fontSize: '11px', 
              padding: '2px 8px', 
              borderRadius: '10px',
              fontWeight: 'bold'
            }}>
              Aktif
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: c.textSecondary }}>{filteredCount} sonuç</span>
          <span style={{ 
            fontSize: '12px', 
            color: c.textSecondary,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}>
            ▼
          </span>
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div style={{ padding: '15px', borderTop: `1px solid ${c.border}` }}>
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
                onClick={(e) => { 
                  e.stopPropagation()
                  setSearchName('')
                  setSearchPhone('')
                  setSearchProduct('')
                }}
                style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '23px' }}
              >
                Temizle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}