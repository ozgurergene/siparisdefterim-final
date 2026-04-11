'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, getAvatarGradient, getInitials } from '../../lib/theme'
import { calculateGrandTotal } from '../../lib/calculations'
import { turkeyData } from '../../lib/turkeyData'
import Footer from '../../components/Footer'
import { StatsCardsSkeleton, SearchBoxSkeleton, TableSkeleton } from '../../components/Loading'

// Gradient Home Icon SVG Component
function HomeIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGradientCompleted" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" stroke="url(#homeGradientCompleted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="url(#homeGradientCompleted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Profile Popup Component
function ProfilePopup({ user, isOpen, onClose, onLogout, ordersCreatedCount, theme, toggleTheme }) {
  if (!isOpen) return null

  const isDark = theme === 'dark'

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 998
        }}
      />
      <div style={{
        position: 'absolute',
        top: '60px',
        right: '16px',
        width: '220px',
        background: isDark ? '#1a1a2e' : '#ffffff',
        borderRadius: '14px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(0,0,0,0.1)'}`,
        zIndex: 999,
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease'
      }}>
        <div style={{
          padding: '16px',
          background: isDark 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: getAvatarGradient(user.email),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              {getInitials(user.email)}
            </div>
            <div>
              <p style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                {user.email.split('@')[0]}
              </p>
              <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0 0' }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px' }}>Toplam Sipariş</span>
            <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '11px', fontWeight: '600' }}>{ordersCreatedCount} / 50</span>
          </div>
          <div style={{ height: '4px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min((ordersCreatedCount / 50) * 100, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: '2px'
            }} />
          </div>
          <p style={{ color: '#64748b', fontSize: '9px', margin: '6px 0 0 0' }}>Ücretsiz plan - 50 sipariş hakkı</p>
        </div>

        <div style={{ padding: '8px' }}>
          {/* Theme Toggle */}
          <div 
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
            }}
          >
            <span style={{ fontSize: '16px' }}>{isDark ? '🌙' : '☀️'}</span>
            <span style={{ color: isDark ? '#e2e8f0' : '#1a1a2e', fontSize: '13px' }}>Tema: {isDark ? 'Koyu' : 'Açık'}</span>
            <div style={{
              marginLeft: 'auto',
              width: '36px',
              height: '20px',
              background: isDark ? '#667eea' : '#cbd5e1',
              borderRadius: '10px',
              position: 'relative',
              transition: 'background 0.2s ease'
            }}>
              <div style={{
                position: 'absolute',
                left: isDark ? '18px' : '2px',
                top: '2px',
                width: '16px',
                height: '16px',
                background: '#fff',
                borderRadius: '50%',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>✏️</span>
            <span style={{ color: isDark ? '#e2e8f0' : '#1a1a2e', fontSize: '13px' }}>Profili Düzenle</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>⭐</span>
            <span style={{ color: isDark ? '#e2e8f0' : '#1a1a2e', fontSize: '13px' }}>Pro'ya Yükselt</span>
            <span style={{
              marginLeft: 'auto',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: '#fff',
              fontSize: '8px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '600'
            }}>YENİ</span>
          </div>

          <div style={{ height: '1px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', margin: '6px 0' }} />

          <div onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>Çıkış Yap</span>
          </div>
        </div>
      </div>
    </>
  )
}

// Success Toast Component
function SuccessToast({ show, message }) {
  if (!show) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: '#fff',
      padding: '14px 24px',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(34, 197, 94, 0.4)',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '14px',
      fontWeight: '600',
      animation: 'slideDown 0.3s ease'
    }}>
      <span style={{ fontSize: '18px' }}>✅</span>
      {message}
    </div>
  )
}

// Mobile Add Order Modal - Same design as Edit Modal
function MobileAddOrderModal({ isOpen, onClose, newOrder, setNewOrder, handleAddOrder, turkeyData, isDark = true }) {
  if (!isOpen) return null

  const cities = turkeyData ? Object.keys(turkeyData).sort((a, b) => a.localeCompare(b, 'tr')) : []
  const districts = newOrder.customer_city && turkeyData 
    ? (turkeyData[newOrder.customer_city] || []).slice().sort((a, b) => a.localeCompare(b, 'tr')) 
    : []

  // Calculate totals
  const calculateTotals = () => {
    const product = newOrder.products[0] || {}
    const quantity = parseInt(product.quantity) || 1
    const unitPrice = parseFloat(product.unit_price) || 0
    const kdvRate = parseFloat(product.kdv_rate) || 0
    const tutar = quantity * unitPrice
    const kdv = tutar * (kdvRate / 100)
    const toplam = tutar + kdv
    return { tutar, kdv, toplam }
  }

  const { tutar, kdv, toplam } = calculateTotals()

  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: isDark ? 'rgba(26, 26, 46, 0.8)' : 'rgba(248, 250, 252, 1)',
    border: `1px solid ${isDark ? '#2a2a3e' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '10px',
    color: isDark ? '#fff' : '#1a1a2e',
    fontSize: '14px',
    boxSizing: 'border-box'
  }

  const selectStyle = {
    width: '100%',
    padding: '12px',
    paddingRight: '32px',
    background: isDark ? 'rgba(26, 26, 46, 0.8)' : 'rgba(248, 250, 252, 1)',
    border: `1px solid ${isDark ? '#2a2a3e' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '10px',
    color: isDark ? '#fff' : '#1a1a2e',
    fontSize: '14px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${isDark ? '%2394a3b8' : '%236b7280'}' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center'
  }

  // For native mobile select dropdowns
  const optionStyle = { color: '#000', backgroundColor: '#fff' }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.5)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: isDark ? '#0d0d1a' : '#ffffff',
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        paddingTop: '20px',
        animation: 'slideUp 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: isDark ? '#fff' : '#1a1a2e', margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✏️ Yeni Sipariş
          </h2>
          <button
            onClick={onClose}
            style={{
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              border: 'none',
              color: isDark ? '#fff' : '#1a1a2e',
              fontSize: '18px',
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Müşteri Adı Soyadı ve Telefon */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Müşteri Adı Soyadı</label>
            <input
              type="text"
              value={newOrder.customer_name}
              onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
              style={inputStyle}
              placeholder="Adı Soyadı"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Telefon</label>
            <input
              type="tel"
              value={newOrder.customer_phone}
              onChange={(e) => setNewOrder({ ...newOrder, customer_phone: e.target.value.replace(/\D/g, '') })}
              style={inputStyle}
              placeholder="5XX XXX XX XX"
              maxLength="10"
            />
          </div>
        </div>

        {/* Adres */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Adres</label>
          <input
            type="text"
            value={newOrder.customer_address}
            onChange={(e) => setNewOrder({ ...newOrder, customer_address: e.target.value })}
            style={inputStyle}
            placeholder="Mahalle, sokak, bina no..."
          />
        </div>

        {/* İl ve İlçe */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>İl</label>
            <select
              value={newOrder.customer_city}
              onChange={(e) => setNewOrder({ ...newOrder, customer_city: e.target.value, customer_district: '' })}
              style={selectStyle}
            >
              <option value="" style={optionStyle}>İl Seçin</option>
              {cities.map(city => (
                <option key={city} value={city} style={optionStyle}>{city}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>İlçe</label>
            <select
              value={newOrder.customer_district}
              onChange={(e) => setNewOrder({ ...newOrder, customer_district: e.target.value })}
              style={selectStyle}
              disabled={!newOrder.customer_city}
            >
              <option value="" style={optionStyle}>İlçe Seçin</option>
              {districts.map(district => (
                <option key={district} value={district} style={optionStyle}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ürün Bilgileri */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Ürün</label>
            <input
              type="text"
              value={newOrder.products[0]?.product || ''}
              onChange={(e) => {
                const updatedProducts = [...newOrder.products]
                updatedProducts[0] = { ...updatedProducts[0], product: e.target.value }
                setNewOrder({ ...newOrder, products: updatedProducts })
              }}
              style={inputStyle}
              placeholder="Ürün adı"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Adet</label>
            <input
              type="number"
              value={newOrder.products[0]?.quantity || 1}
              onChange={(e) => {
                const updatedProducts = [...newOrder.products]
                updatedProducts[0] = { ...updatedProducts[0], quantity: parseInt(e.target.value) || 1 }
                setNewOrder({ ...newOrder, products: updatedProducts })
              }}
              style={{ ...inputStyle, textAlign: 'center' }}
              min="1"
            />
          </div>
        </div>

        {/* Birim Fiyat ve KDV */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Birim Fiyat</label>
            <input
              type="number"
              value={newOrder.products[0]?.unit_price || ''}
              onChange={(e) => {
                const updatedProducts = [...newOrder.products]
                updatedProducts[0] = { ...updatedProducts[0], unit_price: e.target.value }
                setNewOrder({ ...newOrder, products: updatedProducts })
              }}
              style={{ ...inputStyle, textAlign: 'center' }}
              placeholder="₺"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>KDV %</label>
            <input
              type="number"
              value={newOrder.products[0]?.kdv_rate || ''}
              onChange={(e) => {
                const updatedProducts = [...newOrder.products]
                updatedProducts[0] = { ...updatedProducts[0], kdv_rate: e.target.value }
                setNewOrder({ ...newOrder, products: updatedProducts })
              }}
              style={{ ...inputStyle, textAlign: 'center' }}
              placeholder="0"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#22c55e', marginBottom: '4px', fontSize: '12px' }}>Toplam</label>
            <div style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '10px',
              color: '#22c55e',
              fontSize: '14px',
              fontWeight: '600',
              boxSizing: 'border-box',
              textAlign: 'center'
            }}>
              ₺{toplam.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Tutar Özeti */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div style={{ flex: 1, background: isDark ? 'rgba(26, 26, 46, 0.6)' : 'rgba(248, 250, 252, 1)', borderRadius: '10px', padding: '10px', textAlign: 'center', border: isDark ? 'none' : '1px solid rgba(0,0,0,0.08)' }}>
            <p style={{ color: '#64748b', fontSize: '10px', margin: '0 0 4px 0' }}>Tutar</p>
            <p style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '14px', fontWeight: '600', margin: 0 }}>₺{tutar.toFixed(2)}</p>
          </div>
          <div style={{ flex: 1, background: isDark ? 'rgba(26, 26, 46, 0.6)' : 'rgba(248, 250, 252, 1)', borderRadius: '10px', padding: '10px', textAlign: 'center', border: isDark ? 'none' : '1px solid rgba(0,0,0,0.08)' }}>
            <p style={{ color: '#64748b', fontSize: '10px', margin: '0 0 4px 0' }}>KDV</p>
            <p style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '14px', fontWeight: '600', margin: 0 }}>₺{kdv.toFixed(2)}</p>
          </div>
          <div style={{ flex: 1, background: 'rgba(34, 197, 94, 0.15)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <p style={{ color: '#22c55e', fontSize: '10px', margin: '0 0 4px 0' }}>Toplam</p>
            <p style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600', margin: 0 }}>₺{toplam.toFixed(2)}</p>
          </div>
        </div>

        {/* Not */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Not (Opsiyonel)</label>
          <textarea
            value={newOrder.note}
            onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })}
            style={{
              ...inputStyle,
              minHeight: '60px',
              resize: 'none'
            }}
            placeholder="Özel notlar..."
          />
        </div>

        {/* Sipariş Oluştur Button */}
        <button
          onClick={() => { handleAddOrder(); onClose() }}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
        >
          ✓ Sipariş Oluştur
        </button>
      </div>
    </div>
  )
}

// Bottom Tab Bar Component - Same as Dashboard
function BottomTabBar({ activeTab, onTabChange, onAddClick, isDark = true }) {
  const tabs = [
    { id: 'orders', icon: '📦', label: 'Sipariş' },
    { id: 'completed', icon: '✅', label: 'Tamamlanan' },
    { id: 'add', icon: '+', label: '', isMain: true },
    { id: 'customers', icon: '👥', label: 'Müşteri' },
    { id: 'reports', icon: '📊', label: 'Rapor' }
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: isDark ? 'rgba(13, 13, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '8px 0 24px 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      zIndex: 1000,
      borderTop: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
      boxShadow: isDark ? '0 -4px 30px rgba(0, 0, 0, 0.3)' : '0 -4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: '400px'
      }}>
        {tabs.map((tab) => (
          tab.isMain ? (
            <div
              key={tab.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px'
              }}
            >
              <button
                onClick={onAddClick}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: `3px solid ${isDark ? '#0d0d1a' : '#ffffff'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  color: '#fff',
                  cursor: 'pointer',
                  marginTop: '-28px',
                  boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
                  fontWeight: '300'
                }}
              >
                +
              </button>
            </div>
          ) : (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: 'pointer',
                opacity: activeTab === tab.id ? 1 : 0.5,
                padding: '4px 0',
                width: '60px'
              }}
            >
              <span style={{ fontSize: '20px' }}>{tab.icon}</span>
              <span style={{ 
                fontSize: '10px', 
                color: activeTab === tab.id ? '#22c55e' : '#64748b',
                fontWeight: activeTab === tab.id ? '600' : '400',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                {tab.label}
              </span>
            </button>
          )
        ))}
      </div>
    </div>
  )
}

// Mobile Completed Order Card
// Highlight matching text
function HighlightText({ text, searchTerm, color = '#fff' }) {
  if (!searchTerm || !searchTerm.trim()) {
    return <span>{text}</span>
  }
  
  const term = searchTerm.toLowerCase()
  const lowerText = text.toLowerCase()
  const index = lowerText.indexOf(term)
  
  if (index === -1) {
    return <span>{text}</span>
  }
  
  const before = text.slice(0, index)
  const match = text.slice(index, index + term.length)
  const after = text.slice(index + term.length)
  
  return (
    <span>
      {before}
      <span style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '1px 4px',
        borderRadius: '4px',
        fontWeight: '600'
      }}>
        {match}
      </span>
      {after}
    </span>
  )
}

function MobileCompletedCard({ order, isDark = true, onRepeat, searchTerm = '' }) {
  return (
    <div style={{
      background: isDark ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '12px 14px',
      borderLeft: '3px solid #22c55e',
      marginBottom: '8px',
      boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)'
    }}>
      {/* Row 1: Name + Repeat Button + Price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: isDark ? '#fff' : '#1a1a2e' }}>
            <HighlightText text={order.customer_name} searchTerm={searchTerm} />
          </p>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
            <HighlightText text={order.product} searchTerm={searchTerm} />
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Repeat Order Button */}
          <button
            onClick={() => onRepeat(order)}
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Siparişi Tekrarla"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 1l4 4-4 4"/>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <path d="M7 23l-4-4 4-4"/>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
          </button>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#22c55e' }}>
            ₺{order.price}
          </p>
        </div>
      </div>
      
      {/* Row 2: Phone + Dates */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}>
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          📱 <HighlightText text={order.customer_phone} searchTerm={searchTerm} />
        </span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            📅 {new Date(order.created_at).toLocaleDateString('tr-TR')}
          </span>
          <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: '600' }}>
            ✅ {new Date(order.updated_at).toLocaleDateString('tr-TR')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CompletedPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completedOrders, setCompletedOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [theme, setTheme] = useState('light')
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    customer_city: '',
    customer_district: '',
    products: [{ product: '', quantity: 1, unit_price: '', kdv_rate: '' }],
    note: ''
  })

  const c = colors[theme]

  const hasActiveSearch = searchName || searchPhone || searchProduct

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('siparisdefterim-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!data?.session?.user) {
          router.push('/login')
          return
        }
        setUser(data.session.user)
        await fetchCompletedOrders(data.session.user.id)
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  useEffect(() => {
    let filtered = completedOrders
    
    // Single search input searches across name, phone, and product
    if (searchName.trim()) {
      const searchTerm = searchName.toLowerCase().trim()
      filtered = filtered.filter(order => 
        order.customer_name.toLowerCase().includes(searchTerm) ||
        order.customer_phone.includes(searchTerm) ||
        order.product.toLowerCase().includes(searchTerm)
      )
    }
    setFilteredOrders(filtered)
  }, [searchName, completedOrders])

  const fetchCompletedOrders = async (userId) => {
    // Fetch all orders to get total count for profile popup
    const { data: allOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
    
    // Set total orders count
    setOrdersCreatedCount(allOrders?.length || 0)
    
    // Filter and set completed orders
    const completed = (allOrders || []).filter(o => o.status === 'completed')
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    
    setCompletedOrders(completed)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('siparisdefterim-theme', newTheme)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleTabChange = (tabId) => {
    if (tabId === 'orders') router.push('/dashboard')
    else if (tabId === 'completed') router.push('/completed')
  }

  const handleAddOrder = async () => {
    if (!newOrder.customer_name || !newOrder.customer_phone) {
      alert('Lütfen müşteri adı ve telefon numarası girin.')
      return
    }
    const hasValidProduct = newOrder.products.some(p => p.product && p.unit_price)
    if (!hasValidProduct) {
      alert('Lütfen en az bir ürün ve fiyat girin.')
      return
    }
    const productString = newOrder.products.filter(p => p.product).map(p => `${p.product} x${p.quantity}`).join(', ')
    const totalPrice = calculateGrandTotal(newOrder.products)
    const orderData = {
      user_id: user.id,
      customer_name: newOrder.customer_name,
      customer_phone: newOrder.customer_phone,
      customer_address: newOrder.customer_address,
      customer_city: newOrder.customer_city,
      customer_district: newOrder.customer_district,
      product: productString,
      price: totalPrice,
      status: 'payment_pending',
      note: newOrder.note
    }
    const { error } = await supabase.from('orders').insert([orderData])
    if (error) {
      console.error('Order error:', error)
      alert('Sipariş oluşturulamadı.')
      return
    }
    
    // Reset form
    setNewOrder({
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      customer_city: '',
      customer_district: '',
      products: [{ product: '', quantity: 1, unit_price: '', kdv_rate: '' }],
      note: ''
    })
    
    // Show success toast
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
    
    setOrdersCreatedCount(ordersCreatedCount + 1)
  }

  // Siparişi tekrarla - geçmiş siparişin bilgilerini modal'a doldur
  const handleRepeatOrder = (order) => {
    // Parse product string back to products array
    // Format: "Ürün1 x2 (₺100.00), Ürün2 x1 (₺50.00)" or "Ürün1 x2, Ürün2 x1"
    const productParts = order.product.split(', ')
    const totalPrice = parseFloat(order.price) || 0
    const totalQuantity = productParts.reduce((sum, part) => {
      const match = part.match(/x(\d+)/)
      return sum + (match ? parseInt(match[1]) : 1)
    }, 0)
    
    // Estimate unit price by dividing total by quantity
    const estimatedUnitPrice = totalQuantity > 0 ? (totalPrice / totalQuantity).toFixed(2) : ''
    
    const products = productParts.map(part => {
      // Try to match "Ürün x2 (₺100.00)" or "Ürün x2"
      const matchWithPrice = part.match(/^(.+?)\s*x(\d+)\s*\(₺?([\d.]+)\)?$/)
      const matchSimple = part.match(/^(.+?)\s*x(\d+)$/)
      
      if (matchWithPrice) {
        return {
          product: matchWithPrice[1].trim(),
          quantity: parseInt(matchWithPrice[2]) || 1,
          unit_price: matchWithPrice[3],
          kdv_rate: '0'
        }
      } else if (matchSimple) {
        return {
          product: matchSimple[1].trim(),
          quantity: parseInt(matchSimple[2]) || 1,
          unit_price: estimatedUnitPrice,
          kdv_rate: '0'
        }
      }
      return {
        product: part.trim(),
        quantity: 1,
        unit_price: estimatedUnitPrice,
        kdv_rate: '0'
      }
    })

    // Fill the form with order data
    setNewOrder({
      customer_name: order.customer_name || '',
      customer_phone: order.customer_phone || '',
      customer_address: order.customer_address || '',
      customer_city: order.customer_city || '',
      customer_district: order.customer_district || '',
      products: products.length > 0 ? products : [{ product: '', quantity: 1, unit_price: '', kdv_rate: '' }],
      note: order.note || ''
    })

    // Open the add order modal
    setShowAddModal(true)
  }

  const totalCompleted = completedOrders.length
  const totalRevenue = completedOrders.reduce((sum, order) => sum + parseFloat(order.price || 0), 0)
  
  const now = new Date()
  const thisMonth = completedOrders.filter(order => {
    const orderDate = new Date(order.updated_at)
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
  }).length

  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = completedOrders.filter(order => {
    const orderDate = new Date(order.updated_at)
    return orderDate >= oneWeekAgo
  }).length

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'Arial', overflowX: 'hidden' }}>
        <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: 180, height: 28, background: c.bgSecondary, borderRadius: 4 }} />
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ width: 100, height: 36, background: c.bgSecondary, borderRadius: 6 }} />
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <StatsCardsSkeleton theme={theme} />
          <SearchBoxSkeleton theme={theme} />
          <TableSkeleton rows={5} theme={theme} />
        </div>
      </div>
    )
  }

  // ========== MOBILE VIEW ==========
  if (isMobile) {
    const isDark = theme === 'dark'
    
    return (
      <div style={{
        height: '100vh',
        background: isDark 
          ? 'linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)' 
          : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        fontFamily: 'Arial, sans-serif',
        color: isDark ? '#fff' : '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* STICKY HEADER SECTION */}
        <div style={{
          flexShrink: 0,
          background: isDark 
            ? 'linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)' 
            : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          {/* Mobile Header */}
          <div style={{
            padding: '16px 16px 10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => router.push('/home')}
                style={{
                  padding: '8px',
                  background: isDark ? 'rgba(26, 26, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <HomeIcon size={18} />
              </button>
              <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '18px', fontWeight: '600' }}>Tamamlananlar</span>
              <span style={{
                background: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '10px',
                fontWeight: '500'
              }}>{filteredOrders.length}</span>
            </div>
            
            {/* Avatar */}
            <div
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: getAvatarGradient(user.email),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: showProfilePopup ? '0 0 0 3px rgba(34, 197, 94, 0.3)' : 'none'
              }}
            >
              {getInitials(user.email)}
            </div>
          </div>

          {/* Profile Popup */}
          <ProfilePopup
            user={user}
            isOpen={showProfilePopup}
            onClose={() => setShowProfilePopup(false)}
            onLogout={handleLogout}
            ordersCreatedCount={ordersCreatedCount}
            theme={theme}
            toggleTheme={toggleTheme}
          />

          {/* Stats Row - 4 cards */}
          <div style={{ padding: '0 16px 10px 16px', display: 'flex', gap: '6px' }}>
            <div style={{ flex: 1, background: isDark ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#22c55e', fontSize: '17px', fontWeight: '700', margin: 0 }}>{totalCompleted}</p>
              <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Toplam</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#22c55e', fontSize: '17px', fontWeight: '700', margin: 0 }}>₺{totalRevenue.toFixed(0)}</p>
              <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Gelir</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(102, 126, 234, 0.12)' : 'rgba(102, 126, 234, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#667eea', fontSize: '17px', fontWeight: '700', margin: 0 }}>{thisMonth}</p>
              <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Bu Ay</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#8b5cf6', fontSize: '17px', fontWeight: '700', margin: 0 }}>{thisWeek}</p>
              <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Bu Hafta</span>
            </div>
          </div>

          {/* Search Row */}
          <div style={{ padding: '0 16px 10px 16px', display: 'flex', gap: '8px' }}>
            <div style={{
              flex: 1,
              background: isDark ? 'rgba(26, 26, 46, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="İsim, telefon veya ürün ara..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: isDark ? '#fff' : '#1a1a2e',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{
              background: isDark ? 'rgba(26, 26, 46, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* SCROLLABLE ORDERS LIST */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '0 16px',
          paddingBottom: '100px'
        }}>
          {filteredOrders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#64748b', 
              padding: '60px 20px',
              background: isDark ? 'rgba(26, 26, 46, 0.4)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <p style={{ fontSize: '56px', marginBottom: '16px' }}>📭</p>
              <p style={{ fontSize: '16px', color: isDark ? '#64748b' : '#4a5568' }}>Tamamlanan sipariş yok</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <MobileCompletedCard key={order.id} order={order} isDark={isDark} onRepeat={handleRepeatOrder} searchTerm={searchName} />
            ))
          )}
        </div>

        {/* Bottom Tab Bar */}
        <BottomTabBar
          activeTab="completed"
          onTabChange={handleTabChange}
          onAddClick={() => setShowAddModal(true)}
          isDark={isDark}
        />

        {/* Add Order Modal */}
        <MobileAddOrderModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          handleAddOrder={handleAddOrder}
          turkeyData={turkeyData}
          isDark={isDark}
        />

        {/* Success Toast */}
        <SuccessToast show={showSuccessToast} message="Sipariş başarıyla oluşturuldu!" />

        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes slideDown {
            from { transform: translate(-50%, -20px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  // ========== DESKTOP VIEW (unchanged) ==========
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: c.bg, 
      fontFamily: 'Arial', 
      color: c.text, 
      margin: 0, 
      padding: 0, 
      display: 'flex', 
      flexDirection: 'column',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => router.push('/home')}
              style={{
                padding: '8px',
                background: c.bgSecondary,
                border: `1px solid ${c.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              title="Ana Sayfa"
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <HomeIcon size={22} />
            </button>
            <h1 
              onClick={() => router.push('/home')}
              style={{ 
                margin: 0, 
                fontSize: '24px', 
                color: c.text,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              📱 SiparişDefterim
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ padding: '8px 16px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: c.text }}
            >
              📋 Siparişler
            </button>
            <button
              style={{ padding: '8px 16px', background: '#95e1d3', border: '2px solid #1D9E75', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: '#085041' }}
            >
              ✓ Tamamlananlar
            </button>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: c.textSecondary, fontSize: '14px' }}>{user.email}</span>
            <button
              onClick={toggleTheme}
              style={{
                padding: '8px 12px',
                background: c.bgSecondary,
                border: `1px solid ${c.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = theme === 'light' ? '0 4px 15px rgba(102, 126, 234, 0.4)' : '0 4px 15px rgba(255, 193, 7, 0.5)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 15px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.5)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Çıkış
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, width: '100%', padding: '20px 24px', boxSizing: 'border-box' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>Toplam Tamamlanan</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: c.text }}>{totalCompleted}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>Toplam Gelir</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1D9E75' }}>₺{totalRevenue.toFixed(2)}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>Bu Ay</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: c.text }}>{thisMonth}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>Bu Hafta</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: c.text }}>{thisWeek}</p>
          </div>
        </div>

        {/* Search Box */}
        <div style={{ background: c.header, borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}`, overflow: 'hidden' }}>
          <div 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            style={{ 
              padding: '12px 15px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer',
              background: isSearchOpen ? c.bgSecondary : c.header,
              transition: 'background 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: c.text }}>🔍 Tamamlanan Siparişlerde Ara</span>
              {hasActiveSearch && (
                <span style={{ background: '#007bff', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Aktif</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: c.textSecondary }}>{filteredOrders.length} sonuç</span>
              <span style={{ fontSize: '12px', color: c.textSecondary, transform: isSearchOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
            </div>
          </div>

          {isSearchOpen && (
            <div style={{ padding: '15px', borderTop: `1px solid ${c.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı</label>
                  <input type="text" placeholder="Adı ara..." value={searchName} onChange={(e) => setSearchName(e.target.value)} style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
                  <input type="text" placeholder="Telefon ara..." value={searchPhone} onChange={(e) => setSearchPhone(e.target.value.replace(/\D/g, ''))} maxLength="10" style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Ürün</label>
                  <input type="text" placeholder="Ürün ara..." value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button onClick={(e) => { e.stopPropagation(); setSearchName(''); setSearchPhone(''); setSearchProduct('') }} style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', width: '100%' }}>Temizle</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div style={{ background: c.header, borderRadius: '8px', overflow: 'auto', border: `1px solid ${c.border}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Müşteri</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Telefon</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>Ürünler</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '100px', color: c.text }}>Fiyat</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '120px', color: c.text }}>Sipariş Tarihi</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', width: '120px', color: c.text }}>Tamamlanma Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order.id} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, color: c.text }}>
                    <div>{order.customer_name}</div>
                    {order.customer_city && order.customer_district && (
                      <div style={{ fontSize: '11px', color: '#667eea', marginTop: '4px' }}>📍 {order.customer_city} / {order.customer_district}</div>
                    )}
                  </td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, fontSize: '14px', color: c.textSecondary }}>📱 {order.customer_phone}</td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${c.border}`, color: c.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {order.product.split(', ').map((prod, idx) => (
                      <div key={idx} style={{ marginBottom: idx < order.product.split(', ').length - 1 ? '6px' : '0' }}>{prod}</div>
                    ))}
                    {order.note && <div style={{ fontSize: '12px', color: c.textSecondary, marginTop: '6px' }}>Not: {order.note}</div>}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}`, fontWeight: 'bold', color: '#1D9E75' }}>₺{order.price}</td>
                  <td style={{ padding: '12px', textAlign: 'center', borderRight: `1px solid ${c.border}`, fontSize: '12px', color: c.textSecondary }}>📅 {new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#1D9E75', fontWeight: 'bold' }}>✅ {new Date(order.updated_at).toLocaleDateString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', color: c.textSecondary, padding: '50px' }}>
              <p>📭 Tamamlanan sipariş bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}