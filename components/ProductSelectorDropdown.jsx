'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { colors } from '../lib/theme'

/**
 * ProductSelectorDropdown — Sipariş formunda kayıtlı ürünleri seçme dropdown'u
 *
 * Kullanım:
 * <ProductSelectorDropdown
 *   userId={user.id}
 *   isPro={isPro}
 *   onSelect={(product) => {
 *     // product.name, product.unit_price, product.kdv_rate, product.category
 *   }}
 *   theme={theme}
 * />
 *
 * Özellikler:
 * - Pro kullanıcılar için aktif
 * - Free kullanıcılar için disabled (Pro yükselt rozetli)
 * - Arama özelliği
 * - En çok satanlar üstte (🔥 rozeti)
 * - Fiyat ve KDV otomatik dolar
 */
export default function ProductSelectorDropdown({ userId, isPro, onSelect, theme = 'light' }) {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)

  const c = colors[theme]
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!open || !userId || !isPro) return
    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('times_sold', { ascending: false })
      if (data) setProducts(data)
      setLoading(false)
    }
    load()
  }, [open, userId, isPro])

  // Click outside to close
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const filtered = search.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(search.toLowerCase())
      )
    : products

  const handleSelect = (product) => {
    if (onSelect) onSelect(product)
    setOpen(false)
    setSearch('')
  }

  // Pro değilse: disabled durumda göster, "Pro" rozetli
  if (!isPro) {
    return (
      <div style={{ marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/pricing'
            }
          }}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: isDark ? 'rgba(102,126,234,0.08)' : 'rgba(102,126,234,0.05)',
            border: `1px dashed ${c.inputBorder}`,
            borderRadius: '10px',
            color: c.textSecondary,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            📦 Kayıtlı Ürünleri Kullan
          </span>
          <span style={{
            padding: '2px 8px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: '700'
          }}>
            ⭐ PRO
          </span>
        </button>
      </div>
    )
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', marginBottom: '12px' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: open
            ? 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))'
            : (isDark ? 'rgba(102,126,234,0.1)' : 'rgba(102,126,234,0.05)'),
          border: `1px solid ${open ? '#667eea' : c.inputBorder}`,
          borderRadius: '10px',
          color: c.text,
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          📦 Kayıtlı Ürünlerden Seç
          {products.length > 0 && (
            <span style={{
              padding: '1px 6px',
              background: '#667eea',
              color: '#fff',
              borderRadius: '5px',
              fontSize: '10px',
              fontWeight: '700'
            }}>
              {products.length}
            </span>
          )}
        </span>
        <span style={{
          fontSize: '10px',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: c.bgCard,
          border: `1px solid ${c.border}`,
          borderRadius: '12px',
          boxShadow: `0 10px 30px ${c.shadow}`,
          zIndex: 50,
          maxHeight: '400px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}>
          {/* Search */}
          <div style={{ padding: '10px', borderBottom: `1px solid ${c.borderLight}` }}>
            <input
              type="text"
              placeholder="🔍 Ürün ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '8px 12px',
                background: c.input,
                color: c.text,
                border: `1px solid ${c.inputBorder}`,
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: c.textSecondary, fontSize: '13px' }}>
                Yükleniyor...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: c.textSecondary, fontSize: '13px' }}>
                {products.length === 0
                  ? 'Henüz kayıtlı ürün yok. /products sayfasından ekleyebilirsin.'
                  : 'Aramana uygun ürün bulunamadı'}
              </div>
            ) : (
              filtered.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelect(product)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1px solid ${c.borderLight}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: c.text,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {product.name}
                      </span>
                      {(product.times_sold || 0) >= 5 && (
                        <span style={{
                          fontSize: '9px',
                          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                          color: '#fff',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          fontWeight: '700',
                          flexShrink: 0
                        }}>🔥</span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: c.textSecondary }}>
                      {product.category && <span>{product.category} · </span>}
                      {(product.times_sold || 0)}x satılmış
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e' }}>
                      ₺{parseFloat(product.unit_price).toFixed(2)}
                    </div>
                    {parseFloat(product.kdv_rate) > 0 && (
                      <div style={{ fontSize: '10px', color: c.textSecondary }}>
                        +%{product.kdv_rate} KDV
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}