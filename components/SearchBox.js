'use client'
import { useState } from 'react'
import { colors } from '../lib/theme'

export default function SearchBox({ onSearch, onStatusFilter, activeStatus = 'all', statusCounts = {}, resultCount = 0, theme }) {
  const c = colors[theme]
  const [searchTerm, setSearchTerm] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSearch = (value) => { setSearchTerm(value); onSearch(value) }

  const statusTabs = [
    { key: 'all', label: 'Tümü', icon: '📋', color: '#667eea' },
    { key: 'payment_pending', label: 'Bekleyen', icon: '💰', color: '#f5576c' },
    { key: 'paid', label: 'Ödendi', icon: '✅', color: '#43e97b' },
    { key: 'preparing', label: 'Paketlendi', icon: '📦', color: '#667eea' },
    { key: 'shipped', label: 'Kargoda', icon: '🚚', color: '#4facfe' },
  ]

  const totalCount = Object.values(statusCounts).reduce((a, b) => a + b, 0)

  return (
    <div style={{ background: c.bgCard, borderRadius: 16, padding: 18, marginBottom: 20, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: c.text, margin: 0 }}>Sipariş Ara</h3>
          {(searchTerm || activeStatus !== 'all') && <span style={{ padding: '3px 10px', borderRadius: 10, background: '#1f1f3d', color: '#667eea', fontSize: 11, fontWeight: 600 }}>Aktif</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: c.textSecondary, fontWeight: 500 }}>{resultCount} sonuç</span>
          <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', fontSize: 12, color: c.textMuted }}>▼</span>
        </div>
      </div>

      <div style={{ maxHeight: isExpanded ? 180 : 0, overflow: 'hidden', transition: 'all 0.25s ease', opacity: isExpanded ? 1 : 0 }}>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 14, flexWrap: 'wrap' }}>
          {statusTabs.map((tab) => {
            const count = tab.key === 'all' ? totalCount : (statusCounts[tab.key] || 0)
            const isActive = activeStatus === tab.key
            return (
              <button key={tab.key} onClick={(e) => { e.stopPropagation(); onStatusFilter(tab.key) }}
                style={{ padding: '8px 14px', borderRadius: 8, border: isActive ? 'none' : `1px solid ${c.border}`, background: isActive ? `linear-gradient(135deg, ${tab.color}dd, ${tab.color}99)` : c.bgTertiary, color: isActive ? 'white' : c.textSecondary, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{tab.icon}</span>{tab.label}
                <span style={{ padding: '2px 7px', borderRadius: 6, background: isActive ? 'rgba(255,255,255,0.2)' : c.bgCard, fontSize: 11, fontWeight: 700 }}>{count}</span>
              </button>
            )
          })}
        </div>

        <div style={{ position: 'relative' }}>
          <input type="text" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} onFocus={() => setFocusedField('search')} onBlur={() => setFocusedField(null)} onClick={(e) => e.stopPropagation()} placeholder="Ad, telefon veya ürün ara..."
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 8, border: `2px solid ${focusedField === 'search' ? '#667eea' : c.border}`, background: c.bgInput, color: c.text, fontSize: 14, fontWeight: 500, outline: 'none', boxSizing: 'border-box' }} />
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.5 }}>🔍</span>
          {searchTerm && <button onClick={(e) => { e.stopPropagation(); handleSearch('') }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: '#2d1f2f', border: 'none', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#f5576c', fontWeight: 700 }}>✕</button>}
        </div>
      </div>
    </div>
  )
}