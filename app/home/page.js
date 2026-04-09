'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, metricGradients, glowEffects, buttonGradients, keyframesCSS, getAvatarGradient, getInitials } from '../../lib/theme'
import { calculateGrandTotal } from '../../lib/calculations'
import { turkeyData } from '../../lib/turkeyData'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

// Gradient Home Icon SVG Component
function HomeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGradientHome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" stroke="url(#homeGradientHome)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="url(#homeGradientHome)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

// Mobile Add Order Modal
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

// Bottom Tab Bar Component
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

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shipped: 0,
    completed: 0,
    todayRevenue: 0,
    monthlyRevenue: 0
  })
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('siparisdefterim-theme')
    if (savedTheme) setTheme(savedTheme)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.replace('/login')
      return
    }
    setUser(session.user)
    await fetchStats(session.user.id)
    setLoading(false)
  }

  const fetchStats = async (userId) => {
    const { data: allOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)

    const orders = allOrders || []
    setOrdersCreatedCount(orders.length)

    const activeOrders = orders.filter(o => o.status !== 'completed')
    const completedOrders = orders.filter(o => o.status === 'completed')
    
    // Ödeme Bekleyen = sadece payment_pending durumundakiler
    const pending = activeOrders.filter(o => o.status === 'payment_pending').length
    // Kargoda = preparing + shipped durumundakiler
    const shipped = activeOrders.filter(o => o.status === 'preparing' || o.status === 'shipped').length
    
    // Günlük ve aylık kazanç teslim edilen siparişlerden hesaplanır
    const today = new Date().toISOString().split('T')[0]
    const todayCompleted = completedOrders.filter(o => o.updated_at?.startsWith(today))
    const todayRevenue = todayCompleted.reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0)
    
    const thisMonth = new Date().toISOString().slice(0, 7)
    const monthlyCompleted = completedOrders.filter(o => o.updated_at?.startsWith(thisMonth))
    const monthlyRevenue = monthlyCompleted.reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0)

    setStats({
      total: activeOrders.length,
      pending,
      shipped,
      completed: completedOrders.length,
      todayRevenue,
      monthlyRevenue
    })
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('siparisdefterim-theme', newTheme)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
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
    
    // Refresh stats
    await fetchStats(user.id)
    setOrdersCreatedCount(ordersCreatedCount + 1)
  }

  const handleTabChange = (tabId) => {
    if (tabId === 'orders') router.push('/dashboard')
    else if (tabId === 'completed') router.push('/completed')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📱</div>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const metricCards = [
    { label: 'Aktif Siparişler', value: stats.total, icon: '📦', gradient: metricGradients.active, glow: glowEffects.primary },
    { label: 'Ödeme Bekleyen', value: stats.pending, icon: '💰', gradient: metricGradients.pending, glow: glowEffects.danger },
    { label: 'Kargo Sürecinde', value: stats.shipped, icon: '🚚', gradient: metricGradients.shipped, glow: glowEffects.info },
    { label: 'Tamamlanan', value: stats.completed, icon: '✅', gradient: metricGradients.completed, glow: glowEffects.primary },
  ]

  // ========== MOBILE VIEW ==========
  if (isMobile) {
    const isDark = theme === 'dark'
    
    // Türkçe ay adları
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    const currentMonth = monthNames[new Date().getMonth()]
    
    return (
      <div style={{
        height: '100vh',
        background: isDark 
          ? 'linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)' 
          : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        fontFamily: 'Arial, sans-serif',
        color: isDark ? '#fff' : '#1a1a2e',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
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
            <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '18px', fontWeight: '600' }}>Ana Sayfa</span>
          </div>
          
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

        {/* Welcome Section */}
        <div style={{ textAlign: 'center', padding: '12px 20px 20px 20px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 6px 0', color: isDark ? '#fff' : '#1a1a2e' }}>
            Hoş Geldin! 👋
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            İşte güncel sipariş durumun
          </p>
        </div>

        {/* Metric Cards - 2x2 Grid */}
        <div style={{ 
          padding: '0 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '14px'
        }}>
          {metricCards.map((card) => (
            <div
              key={card.label}
              onClick={() => router.push('/dashboard')}
              style={{
                background: isDark ? 'rgba(26, 26, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                borderRadius: '14px',
                padding: '12px 14px',
                borderTop: `3px solid transparent`,
                borderImage: `${card.gradient} 1`,
                cursor: 'pointer',
                boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)'
              }}
            >
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 4px 0' }}>{card.label}</p>
              <p style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                margin: 0,
                background: card.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Revenue Cards */}
        <div style={{ 
          padding: '0 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '14px'
        }}>
          <div style={{
            background: isDark ? 'rgba(26, 26, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(67, 233, 123, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              💵
            </div>
            <div>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Bugünün Geliri</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#43e97b' }}>
                ₺{stats.todayRevenue.toFixed(0)}
              </p>
            </div>
          </div>

          <div style={{
            background: isDark ? 'rgba(26, 26, 46, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(102, 126, 234, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              📊
            </div>
            <div>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>{currentMonth} Geliri</p>
              <p style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                margin: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ₺{stats.monthlyRevenue.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Slim */}
        <div style={{ padding: '0 20px', flex: 1 }}>
          <div style={{
            background: isDark ? 'rgba(26, 26, 46, 0.6)' : 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '14px 16px',
            boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#fff' : '#1a1a2e' }}>
              <span>⚡</span> Hızlı İşlemler
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  padding: '12px 6px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '20px' }}>➕</span>
                <span style={{ lineHeight: '1.2', textAlign: 'center' }}>Yeni<br/>Sipariş Ekle</span>
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '12px 6px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.4)'}`,
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(102, 126, 234, 0.08)',
                  color: isDark ? '#fff' : '#1a1a2e',
                  fontSize: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '20px' }}>📦</span>
                <span style={{ lineHeight: '1.2', textAlign: 'center' }}>Siparişleri<br/>Görüntüle</span>
              </button>

              <button
                onClick={() => router.push('/completed')}
                style={{
                  padding: '12px 6px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.4)'}`,
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(102, 126, 234, 0.08)',
                  color: isDark ? '#fff' : '#1a1a2e',
                  fontSize: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '20px' }}>✅</span>
                <span style={{ lineHeight: '1.2', textAlign: 'center' }}>Tamamlananları<br/>Gör</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          textAlign: 'center',
          marginBottom: '70px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px', 
            marginBottom: '8px',
            flexWrap: 'wrap'
          }}>
            <a href="/gizlilik" style={{ color: '#64748b', fontSize: '11px', textDecoration: 'none' }}>Gizlilik Politikası</a>
            <a href="/kullanim" style={{ color: '#64748b', fontSize: '11px', textDecoration: 'none' }}>Kullanım Koşulları</a>
            <a href="/kvkk" style={{ color: '#64748b', fontSize: '11px', textDecoration: 'none' }}>KVKK Aydınlatma</a>
          </div>
          <p style={{ color: '#4a5568', fontSize: '10px', margin: 0 }}>
            © 2026 Deftertut.com - Tüm hakları saklıdır.
          </p>
        </div>

        {/* Bottom Tab Bar */}
        <BottomTabBar
          activeTab="home"
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
      background: c.bgGradient,
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
    }}>
      <Header 
        user={user} 
        ordersCreatedCount={ordersCreatedCount}
        theme={theme} 
        toggleTheme={toggleTheme} 
        handleLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: '32px 24px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Welcome Section */}
          <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeIn 0.5s ease-out' }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: c.text, marginBottom: 8 }}>
              Hoş Geldin! 👋
            </h1>
            <p style={{ color: c.textSecondary, fontSize: 16 }}>
              İşte güncel sipariş durumun
            </p>
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
            {metricCards.map((card, index) => (
              <div
                key={card.label}
                style={{
                  background: c.bgCard,
                  backdropFilter: 'blur(20px)',
                  borderRadius: 20,
                  padding: 24,
                  border: `1px solid ${c.border}`,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = card.glow
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onClick={() => router.push('/dashboard')}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: card.gradient,
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 13, color: c.textMuted, margin: '0 0 8px 0', fontWeight: 500 }}>
                      {card.label}
                    </p>
                    <p style={{ 
                      fontSize: 36, 
                      fontWeight: 700, 
                      margin: 0,
                      background: card.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {card.value}
                    </p>
                  </div>
                  <span style={{ fontSize: 32 }}>{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            <div style={{
              background: c.bgCard,
              backdropFilter: 'blur(20px)',
              borderRadius: 20,
              padding: 28,
              border: `1px solid ${c.border}`,
              animation: 'slideUp 0.5s ease-out 0.4s both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'rgba(67, 233, 123, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}>
                  💵
                </div>
                <div>
                  <p style={{ fontSize: 13, color: c.textMuted, margin: 0 }}>Bugünün Geliri</p>
                  <p style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#43e97b' }}>
                    ₺{stats.todayRevenue.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: c.bgCard,
              backdropFilter: 'blur(20px)',
              borderRadius: 20,
              padding: 28,
              border: `1px solid ${c.border}`,
              animation: 'slideUp 0.5s ease-out 0.5s both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'rgba(102, 126, 234, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}>
                  📊
                </div>
                <div>
                  <p style={{ fontSize: 13, color: c.textMuted, margin: 0 }}>Bu Ayki Gelir</p>
                  <p style={{ 
                    fontSize: 28, 
                    fontWeight: 700, 
                    margin: 0,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    ₺{stats.monthlyRevenue.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: c.bgCard,
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            padding: 28,
            border: `1px solid ${c.border}`,
            animation: 'slideUp 0.5s ease-out 0.6s both',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: c.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>⚡</span>
              Hızlı İşlemler
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  border: 'none',
                  background: buttonGradients.primary,
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)'
                  e.currentTarget.style.boxShadow = glowEffects.primary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{ fontSize: 28 }}>➕</span>
                Yeni Sipariş Ekle
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  border: `1px solid ${c.border}`,
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: c.text,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = '#667eea'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                  e.currentTarget.style.borderColor = c.border
                }}
              >
                <span style={{ fontSize: 28 }}>📦</span>
                Siparişleri Görüntüle
              </button>

              <button
                onClick={() => router.push('/completed')}
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  border: `1px solid ${c.border}`,
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: c.text,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = '#43e97b'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                  e.currentTarget.style.borderColor = c.border
                }}
              >
                <span style={{ fontSize: 28 }}>✅</span>
                Tamamlananları Gör
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer theme={theme} />

      <style jsx global>{`
        ${keyframesCSS}
      `}</style>
    </div>
  )
}