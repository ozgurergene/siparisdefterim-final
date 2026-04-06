'use client'
import { useState } from 'react'
import { colors, statusColors, glowEffects } from '../lib/theme'

export default function SearchBox({ 
  onSearch, 
  onStatusFilter,
  activeStatus = 'all',
  statusCounts = {},
  resultCount = 0,
  theme 
}) {
  const c = colors[theme]
  const [searchTerm, setSearchTerm] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSearch = (value) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const statusTabs = [
    { key: 'all', label: 'Tümü', icon: '📋', color: '#667eea' },
    { key: 'payment_pending', label: 'Bekleyen', icon: '💰', color: '#f5576c' },
    { key: 'paid', label: 'Ödendi', icon: '✅', color: '#43e97b' },
    { key: 'preparing', label: 'Paketlendi', icon: '📦', color: '#667eea' },
    { key: 'shipped', label: 'Kargoda', icon: '🚚', color: '#4facfe' },
  ]

  const totalCount = Object.values(statusCounts).reduce((a, b) => a + b, 0)

  return (
    <div
      style={{
        background: c.bgCard,
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        border: `1px solid ${c.border}`,
        boxShadow: `0 10px 40px ${c.shadow}`,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <h3 style={{ 
            fontSize: 15, 
            fontWeight: 600, 
            color: c.text, 
            margin: 0,
          }}>
            Sipariş Ara
          </h3>
          {(searchTerm || activeStatus !== 'all') && (
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 12,
                background: 'rgba(102, 126, 234, 0.15)',
                color: '#667eea',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Aktif
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: c.textMuted }}>
            {resultCount} sonuç
          </span>
          <span
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              fontSize: 12,
              color: c.textMuted,
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      <div
        style={{
          maxHeight: isExpanded ? 200 : 0,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        {/* Status Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginTop: 16,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}>
          {statusTabs.map((tab) => {
            const count = tab.key === 'all' ? totalCount : (statusCounts[tab.key] || 0)
            const isActive = activeStatus === tab.key
            
            return (
              <button
                key={tab.key}
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusFilter(tab.key)
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: isActive 
                    ? `linear-gradient(135deg, ${tab.color}dd, ${tab.color}99)`
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? 'white' : c.textSecondary,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 4px 15px ${tab.color}40` : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 8,
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                    fontSize: 11,
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setFocusedField('search')}
            onBlur={() => setFocusedField(null)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Ad, telefon veya ürün ara..."
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              borderRadius: 12,
              border: `2px solid ${focusedField === 'search' ? 'transparent' : c.inputBorder}`,
              background: focusedField === 'search'
                ? `linear-gradient(${c.input}, ${c.input}) padding-box, linear-gradient(135deg, #667eea, #764ba2) border-box`
                : c.input,
              color: c.text,
              fontSize: 14,
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: focusedField === 'search' ? '0 0 20px rgba(102, 126, 234, 0.2)' : 'none',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 16,
              opacity: 0.5,
            }}
          >
            🔍
          </span>
          
          {searchTerm && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSearch('')
              }}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(245, 87, 108, 0.15)',
                border: 'none',
                borderRadius: 8,
                width: 28,
                height: 28,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: '#f5576c',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(245, 87, 108, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(245, 87, 108, 0.15)'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}