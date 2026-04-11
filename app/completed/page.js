'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, getAvatarGradient, getInitials } from '../../lib/theme'
import { calculateGrandTotal } from '../../lib/calculations'
import { turkeyData } from '../../lib/turkeyData'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OrderForm from '../../components/OrderForm'
import OrderTable from '../../components/OrderTable'
import SearchBox from '../../components/SearchBox'
import EditModal from '../../components/EditModal'
import { StatsCardsSkeleton, SearchBoxSkeleton, TableSkeleton } from '../../components/Loading'

// Gradient Home Icon SVG Component
function HomeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" stroke="url(#homeGradientMobile)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="url(#homeGradientMobile)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// WhatsApp Icon Component - 30px
function WhatsAppIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// Edit Icon Component - 30px
function EditIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
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
        {/* Profile Header */}
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

        {/* Order Quota */}
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

        {/* Menu Items */}
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

// Mobile Order Card Component with Swipe
function MobileOrderCard({ order, onEdit, onDelete, onWhatsApp, statusColor, isDark = true, searchTerm = '' }) {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [swiped, setSwiped] = useState(false)
  const cardRef = useRef(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) setSwiped(true)
    else if (distance < -minSwipeDistance) setSwiped(false)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setSwiped(false)
      }
    }
    document.addEventListener('touchstart', handleClickOutside)
    return () => document.removeEventListener('touchstart', handleClickOutside)
  }, [])

  const getStatusText = (status) => {
    switch (status) {
      case 'payment_pending': return 'Ödeme Bekleniyor'
      case 'paid': return 'Ödeme Alındı'
      case 'preparing': return 'Hazırlanıyor'
      case 'shipped': return 'Kargoda'
      default: return status
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'payment_pending': return 'rgba(59, 130, 246, 0.15)'
      case 'paid': return 'rgba(34, 197, 94, 0.15)'
      case 'preparing': return 'rgba(245, 158, 11, 0.15)'
      case 'shipped': return 'rgba(139, 92, 246, 0.15)'
      default: return 'rgba(107, 114, 128, 0.15)'
    }
  }

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'payment_pending': return '#60a5fa'
      case 'paid': return '#4ade80'
      case 'preparing': return '#fbbf24'
      case 'shipped': return '#a78bfa'
      default: return '#9ca3af'
    }
  }

  return (
    <div ref={cardRef} style={{ position: 'relative', overflow: 'hidden', marginBottom: '8px', borderRadius: '12px' }}>
      {/* Swipe Delete Button */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '70px',
        background: '#ef4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0 12px 12px 0'
      }}>
        <div 
          onClick={() => { onDelete(order.id); setSwiped(false) }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <span style={{ color: '#fff', fontSize: '10px', fontWeight: '600' }}>Sil</span>
        </div>
      </div>

      {/* Card Content */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          background: isDark ? 'rgba(26, 26, 46, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '12px 14px',
          borderLeft: `3px solid ${statusColor}`,
          position: 'relative',
          zIndex: 2,
          transform: swiped ? 'translateX(-70px)' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.08)'
        }}
      >
        {/* Row 1: Name + Status + Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '14px', fontWeight: '600' }}>
              <HighlightText text={order.customer_name} searchTerm={searchTerm} />
            </span>
            <span style={{
              background: getStatusBgColor(order.status),
              color: getStatusTextColor(order.status),
              fontSize: '8px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '500'
            }}>
              {getStatusText(order.status)}
            </span>
          </div>
          <span style={{ color: '#22c55e', fontSize: '16px', fontWeight: '700' }}>₺{order.price}</span>
        </div>

        {/* Row 2: Product + Location */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ color: isDark ? '#cbd5e1' : '#4a5568', fontSize: '12px' }}>
            <HighlightText text={order.product} searchTerm={searchTerm} />
          </span>
          {order.customer_city && order.customer_district && (
            <span style={{ color: '#6b7280', fontSize: '11px' }}>📍 {order.customer_city}/{order.customer_district}</span>
          )}
        </div>

        {/* Row 3: Phone + Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}>
          <span style={{ color: '#64748b', fontSize: '11px' }}>
            📱 <HighlightText text={order.customer_phone} searchTerm={searchTerm} />
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* WhatsApp Button - 35x35 */}
            <button
              onClick={() => onWhatsApp(order)}
              style={{
                width: '35px',
                height: '35px',
                background: '#22c55e',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <WhatsAppIcon />
            </button>
            {/* Edit Button - 35x35 */}
            <button
              onClick={() => onEdit(order)}
              style={{
                width: '35px',
                height: '35px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <EditIcon />
            </button>
          </div>
        </div>
      </div>
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

// Mobile Edit Modal with Status Dropdown
function MobileEditModal({ isOpen, editingData, setEditingData, saveEdit, cancelEdit, deleteOrder, editingId, turkeyData, isDark = true }) {
  if (!isOpen || !editingData) return null

  const cities = turkeyData ? Object.keys(turkeyData).sort((a, b) => a.localeCompare(b, 'tr')) : []
  const districts = editingData.customer_city && turkeyData 
    ? (turkeyData[editingData.customer_city] || []).slice().sort((a, b) => a.localeCompare(b, 'tr')) 
    : []

  const statusOptions = [
    { value: 'payment_pending', label: 'Ödeme Bekleniyor', color: '#3b82f6', icon: '💳' },
    { value: 'paid', label: 'Ödeme Alındı', color: '#22c55e', icon: '✅' },
    { value: 'preparing', label: 'Paketlendi', color: '#f59e0b', icon: '📦' },
    { value: 'shipped', label: 'Kargoda', color: '#8b5cf6', icon: '🚚' },
    { value: 'completed', label: 'Teslim Edildi', color: '#10b981', icon: '🎉' }
  ]

  const currentStatus = statusOptions.find(s => s.value === editingData.status) || statusOptions[0]

  // Calculate totals
  const calculateTotals = () => {
    const product = editingData.products[0] || {}
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
            ✏️ Siparişi Düzenle
          </h2>
          <button
            onClick={cancelEdit}
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
              value={editingData.customer_name}
              onChange={(e) => setEditingData({ ...editingData, customer_name: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Telefon</label>
            <input
              type="tel"
              value={editingData.customer_phone}
              onChange={(e) => setEditingData({ ...editingData, customer_phone: e.target.value.replace(/\D/g, '') })}
              style={inputStyle}
              maxLength="10"
            />
          </div>
        </div>

        {/* Adres */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Adres</label>
          <input
            type="text"
            value={editingData.customer_address}
            onChange={(e) => setEditingData({ ...editingData, customer_address: e.target.value })}
            style={inputStyle}
          />
        </div>

        {/* İl ve İlçe */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>İl</label>
            <select
              value={editingData.customer_city}
              onChange={(e) => setEditingData({ ...editingData, customer_city: e.target.value, customer_district: '' })}
              style={{ 
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
              }}
            >
              <option value="" style={{ color: '#000', backgroundColor: '#fff' }}>İl Seçin</option>
              {cities.map(city => (
                <option key={city} value={city} style={{ color: '#000', backgroundColor: '#fff' }}>{city}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>İlçe</label>
            <select
              value={editingData.customer_district}
              onChange={(e) => setEditingData({ ...editingData, customer_district: e.target.value })}
              style={{ 
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
              }}
              disabled={!editingData.customer_city}
            >
              <option value="" style={{ color: '#000', backgroundColor: '#fff' }}>İlçe Seçin</option>
              {districts.map(district => (
                <option key={district} value={district} style={{ color: '#000', backgroundColor: '#fff' }}>{district}</option>
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
              value={editingData.products[0]?.product || ''}
              onChange={(e) => {
                const updatedProducts = [...editingData.products]
                updatedProducts[0] = { ...updatedProducts[0], product: e.target.value }
                setEditingData({ ...editingData, products: updatedProducts })
              }}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Adet</label>
            <input
              type="number"
              value={editingData.products[0]?.quantity || 1}
              onChange={(e) => {
                const updatedProducts = [...editingData.products]
                updatedProducts[0] = { ...updatedProducts[0], quantity: parseInt(e.target.value) || 1 }
                setEditingData({ ...editingData, products: updatedProducts })
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
              value={editingData.products[0]?.unit_price || ''}
              onChange={(e) => {
                const updatedProducts = [...editingData.products]
                updatedProducts[0] = { ...updatedProducts[0], unit_price: e.target.value }
                setEditingData({ ...editingData, products: updatedProducts })
              }}
              style={{ ...inputStyle, textAlign: 'center' }}
              placeholder="₺"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>KDV %</label>
            <input
              type="number"
              value={editingData.products[0]?.kdv_rate || ''}
              onChange={(e) => {
                const updatedProducts = [...editingData.products]
                updatedProducts[0] = { ...updatedProducts[0], kdv_rate: e.target.value }
                setEditingData({ ...editingData, products: updatedProducts })
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

        {/* Sipariş Durumu */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Sipariş Durumu</label>
          <select
            value={editingData.status}
            onChange={(e) => setEditingData({ ...editingData, status: e.target.value })}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: `rgba(${currentStatus.value === 'paid' ? '34, 197, 94' : currentStatus.value === 'payment_pending' ? '59, 130, 246' : currentStatus.value === 'preparing' ? '245, 158, 11' : currentStatus.value === 'shipped' ? '139, 92, 246' : '16, 185, 129'}, 0.2)`,
              border: `1px solid ${currentStatus.color}`,
              borderRadius: '10px',
              color: currentStatus.color,
              fontSize: '14px',
              fontWeight: '600',
              boxSizing: 'border-box',
              appearance: 'none',
              cursor: 'pointer'
            }}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.icon} {option.label}</option>
            ))}
          </select>
        </div>

        {/* Not */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Not (Opsiyonel)</label>
          <textarea
            value={editingData.note}
            onChange={(e) => setEditingData({ ...editingData, note: e.target.value })}
            style={{
              ...inputStyle,
              minHeight: '60px',
              resize: 'none'
            }}
            placeholder="Özel notlar..."
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { deleteOrder(editingId); cancelEdit() }}
            style={{
              flex: 1,
              padding: '14px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              borderRadius: '12px',
              color: '#ef4444',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🗑️ Sil
          </button>
          <button
            onClick={saveEdit}
            style={{
              flex: 2,
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
            ✓ Kaydet
          </button>
        </div>
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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [theme, setTheme] = useState('light')
  const [ordersCreatedCount, setOrdersCreatedCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')
  
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    customer_city: '',
    customer_district: '',
    products: [{ product: '', quantity: 1, unit_price: '', kdv_rate: '' }],
    note: ''
  })
  
  const [editingId, setEditingId] = useState(null)
  const [editingData, setEditingData] = useState(null)

  const c = colors[theme]

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
        await fetchUserData(data.session.user.id)
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  useEffect(() => {
    let filtered = orders
    
    // Single search input searches across name, phone, and product
    if (searchName.trim()) {
      const searchTerm = searchName.toLowerCase().trim()
      filtered = filtered.filter(order => 
        order.customer_name.toLowerCase().includes(searchTerm) ||
        order.customer_phone.includes(searchTerm) ||
        order.product.toLowerCase().includes(searchTerm)
      )
    }
    if (statusFilter !== 'all') filtered = filtered.filter(order => order.status === statusFilter)
    setFilteredOrders(filtered)
  }, [searchName, statusFilter, orders])

  const fetchUserData = async (userId) => {
    try {
      const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', userId).single()
      if (userError && userError.code === 'PGRST116') {
        await supabase.from('users').insert([{ id: userId, orders_created_count: 0 }])
      }
      const { data: ordersData } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      const allOrders = ordersData || []
      setOrders(allOrders.filter(o => o.status !== 'completed'))
      setOrdersCreatedCount(allOrders.length)
    } catch (error) {
      console.error('fetchUserData error:', error)
    }
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
    const { data, error } = await supabase.from('orders').insert([orderData]).select()
    if (error) {
      console.error('Order error:', error)
      alert('Sipariş oluşturulamadı.')
      return
    }
    await supabase.from('users').update({ orders_created_count: ordersCreatedCount + 1 }).eq('id', user.id)
    setOrders([data[0], ...orders])
    setOrdersCreatedCount(ordersCreatedCount + 1)
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
  }

  const deleteOrder = async (orderId) => {
    if (!confirm('Siparişi silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('orders').delete().eq('id', orderId)
    if (error) { alert('Sipariş silinemedi.'); return }
    setOrders(orders.filter(o => o.id !== orderId))
    setOrdersCreatedCount(ordersCreatedCount - 1)
    await supabase.from('users').update({ orders_created_count: ordersCreatedCount - 1 }).eq('id', user.id)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    if (error) { alert('Durum güncellenemedi.'); return }
    if (newStatus === 'completed') setOrders(orders.filter(o => o.id !== orderId))
    else setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  const startEditing = (order) => {
    const productParts = order.product.split(', ')
    // Toplam fiyatı ürün sayısına bölerek tahmini birim fiyat hesapla
    const totalPrice = parseFloat(order.price) || 0
    const totalQuantity = productParts.reduce((sum, part) => {
      const match = part.match(/(.+) x(\d+)/)
      return sum + (match ? parseInt(match[2]) : 1)
    }, 0)
    const estimatedUnitPrice = totalQuantity > 0 ? (totalPrice / totalQuantity).toFixed(2) : ''
    
    const products = productParts.map(part => {
      const match = part.match(/(.+) x(\d+)/)
      if (match) return { product: match[1], quantity: parseInt(match[2]), unit_price: estimatedUnitPrice, kdv_rate: '0' }
      return { product: part, quantity: 1, unit_price: estimatedUnitPrice, kdv_rate: '0' }
    })
    setEditingId(order.id)
    setEditingData({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address || '',
      customer_city: order.customer_city || '',
      customer_district: order.customer_district || '',
      products: products.length > 0 ? products : [{ product: '', quantity: 1, unit_price: '', kdv_rate: '0' }],
      note: order.note || '',
      status: order.status
    })
  }

  const saveEdit = async () => {
    const productString = editingData.products.filter(p => p.product).map(p => `${p.product} x${p.quantity}`).join(', ')
    const totalPrice = calculateGrandTotal(editingData.products)
    const updateData = {
      customer_name: editingData.customer_name,
      customer_phone: editingData.customer_phone,
      customer_address: editingData.customer_address,
      customer_city: editingData.customer_city,
      customer_district: editingData.customer_district,
      product: productString,
      price: totalPrice,
      note: editingData.note,
      status: editingData.status
    }
    const { error } = await supabase.from('orders').update(updateData).eq('id', editingId)
    if (error) { alert('Sipariş güncellenemedi.'); return }
    if (editingData.status === 'completed') {
      setOrders(orders.filter(o => o.id !== editingId))
    } else {
      setOrders(orders.map(o => o.id === editingId ? { ...o, ...updateData } : o))
    }
    setEditingId(null)
    setEditingData(null)
  }

  const cancelEdit = () => { setEditingId(null); setEditingData(null) }

  const handleWhatsApp = (order) => {
    const phone = order.customer_phone.startsWith('0') ? order.customer_phone.slice(1) : order.customer_phone
    const message = `Merhaba ${order.customer_name}, siparişiniz hakkında bilgi vermek istiyorum.`
    window.open(`https://wa.me/90${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'completed') router.push('/completed')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'payment_pending': return '#3b82f6'
      case 'paid': return '#22c55e'
      case 'preparing': return '#f59e0b'
      case 'shipped': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const activeOrders = orders.filter(o => o.status !== 'completed').length
  const pendingPayments = orders.filter(o => o.status === 'payment_pending').length
  const toShipOrders = orders.filter(o => o.status === 'paid' || o.status === 'preparing').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length

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
        <div style={{ padding: '20px' }}>
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
              <span style={{ color: isDark ? '#fff' : '#1a1a2e', fontSize: '18px', fontWeight: '600' }}>Siparişler</span>
              <span style={{
                background: isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.15)',
                color: '#667eea',
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
              <p style={{ color: '#22c55e', fontSize: '17px', fontWeight: '700', margin: 0 }}>{activeOrders}</p>
              <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Aktif</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(251, 191, 36, 0.12)' : 'rgba(251, 191, 36, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#fbbf24', fontSize: '17px', fontWeight: '700', margin: 0 }}>{pendingPayments}</p>
              <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Bekleyen</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(102, 126, 234, 0.12)' : 'rgba(102, 126, 234, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#667eea', fontSize: '17px', fontWeight: '700', margin: 0 }}>{toShipOrders}</p>
              <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Verilecek</span>
            </div>
            <div style={{ flex: 1, background: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.15)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ color: '#8b5cf6', fontSize: '17px', fontWeight: '700', margin: 0 }}>{shippedOrders}</p>
              <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Kargo</span>
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
              <p style={{ fontSize: '16px', color: isDark ? '#64748b' : '#4a5568' }}>Henüz sipariş yok</p>
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#4a5568' }}>+ butonuna basarak yeni sipariş ekle</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <MobileOrderCard
                key={order.id}
                order={order}
                onEdit={startEditing}
                onDelete={deleteOrder}
                onWhatsApp={handleWhatsApp}
                statusColor={getStatusColor(order.status)}
                isDark={isDark}
                searchTerm={searchName}
              />
            ))
          )}
        </div>

        {/* Bottom Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
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

        {/* Mobile Edit Modal */}
        <MobileEditModal
          isOpen={editingId !== null}
          editingData={editingData}
          setEditingData={setEditingData}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          deleteOrder={deleteOrder}
          editingId={editingId}
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
      <Header user={user} ordersCreatedCount={ordersCreatedCount} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} />

      <div style={{ flex: 1, width: '100%', padding: '20px 24px', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>📦 Aktif Siparişler</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: c.text }}>{activeOrders}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>💰 Ödeme Bekleyen</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#f39c12' }}>{pendingPayments}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>📦 Kargoya Verilecek</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>{toShipOrders}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>🚚 Kargo Sürecinde</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#9b59b6' }}>{shippedOrders}</p>
          </div>
        </div>

        <OrderForm newOrder={newOrder} setNewOrder={setNewOrder} ordersCreatedCount={ordersCreatedCount} handleAddOrder={handleAddOrder} theme={theme} />
        <SearchBox searchName={searchName} setSearchName={setSearchName} searchPhone={searchPhone} setSearchPhone={setSearchPhone} searchProduct={searchProduct} setSearchProduct={setSearchProduct} filteredCount={filteredOrders.length} theme={theme} />
        <OrderTable filteredOrders={filteredOrders} user={user} theme={theme} startEditing={startEditing} deleteOrder={deleteOrder} updateOrderStatus={updateOrderStatus} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      </div>

      <EditModal editingId={editingId} editingData={editingData} setEditingData={setEditingData} saveEdit={saveEdit} cancelEdit={cancelEdit} deleteOrder={deleteOrder} theme={theme} />
      <Footer theme={theme} />
    </div>
  )
}