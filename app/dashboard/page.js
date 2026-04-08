'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { colors, getAvatarGradient, getInitials } from '../../lib/theme'
import { calculateGrandTotal } from '../../lib/calculations'
import turkeyData from '../../lib/turkeyData'
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

// Profile Popup Component
function ProfilePopup({ user, isOpen, onClose, onLogout, ordersCreatedCount }) {
  if (!isOpen) return null

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
        background: '#1a1a2e',
        borderRadius: '14px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        zIndex: 999,
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease'
      }}>
        {/* Profile Header */}
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
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
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                {user.email.split('@')[0]}
              </p>
              <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0 0' }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Order Quota */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px' }}>Toplam Sipariş</span>
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600' }}>{ordersCreatedCount} / 50</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.03)'
          }}>
            <span style={{ fontSize: '16px' }}>🌙</span>
            <span style={{ color: '#e2e8f0', fontSize: '13px' }}>Tema: Koyu</span>
            <div style={{
              marginLeft: 'auto',
              width: '32px',
              height: '18px',
              background: '#667eea',
              borderRadius: '9px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                right: '2px',
                top: '2px',
                width: '14px',
                height: '14px',
                background: '#fff',
                borderRadius: '50%'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>✏️</span>
            <span style={{ color: '#e2e8f0', fontSize: '13px' }}>Profili Düzenle</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>⭐</span>
            <span style={{ color: '#e2e8f0', fontSize: '13px' }}>Pro'ya Yükselt</span>
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

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '6px 0' }} />

          <div onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>Çıkış Yap</span>
          </div>
        </div>
      </div>
    </>
  )
}

// Mobile Order Card Component with Swipe
function MobileOrderCard({ order, onEdit, onDelete, onWhatsApp, statusColor }) {
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
          background: 'rgba(26, 26, 46, 0.85)',
          borderRadius: '12px',
          padding: '12px 14px',
          borderLeft: `3px solid ${statusColor}`,
          position: 'relative',
          zIndex: 2,
          transform: swiped ? 'translateX(-70px)' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}
      >
        {/* Row 1: Name + Status + Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{order.customer_name}</span>
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
          <span style={{ color: '#cbd5e1', fontSize: '12px' }}>{order.product}</span>
          {order.customer_city && order.customer_district && (
            <span style={{ color: '#6b7280', fontSize: '11px' }}>📍 {order.customer_city}/{order.customer_district}</span>
          )}
        </div>

        {/* Row 3: Phone + Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: '#64748b', fontSize: '11px' }}>📱 {order.customer_phone}</span>
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

// Mobile Add Order Modal
function MobileAddOrderModal({ isOpen, onClose, newOrder, setNewOrder, handleAddOrder, turkeyData }) {
  if (!isOpen) return null

  const cities = turkeyData ? Object.keys(turkeyData).sort((a, b) => a.localeCompare(b, 'tr')) : []
  const districts = newOrder.customer_city && turkeyData ? turkeyData[newOrder.customer_city] || [] : []

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: '#0d0d1a',
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        paddingTop: '60px',
        animation: 'slideUp 0.3s ease'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '24px' }}>Yeni Sipariş</h2>

        {/* Müşteri Adı Soyadı ve Telefon */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>Müşteri Adı Soyadı</label>
            <input
              type="text"
              value={newOrder.customer_name}
              onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Adı Soyadı"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>Telefon</label>
            <input
              type="tel"
              value={newOrder.customer_phone}
              onChange={(e) => setNewOrder({ ...newOrder, customer_phone: e.target.value.replace(/\D/g, '') })}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="5XX XXX XX XX"
              maxLength="10"
            />
          </div>
        </div>

        {/* Adres */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>Adres</label>
          <input
            type="text"
            value={newOrder.customer_address}
            onChange={(e) => setNewOrder({ ...newOrder, customer_address: e.target.value })}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Mahalle, sokak, bina no..."
          />
        </div>

        {/* İl ve İlçe */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>İl</label>
            <select
              value={newOrder.customer_city}
              onChange={(e) => setNewOrder({ ...newOrder, customer_city: e.target.value, customer_district: '' })}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">İl Seçin</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>İlçe</label>
            <select
              value={newOrder.customer_district}
              onChange={(e) => setNewOrder({ ...newOrder, customer_district: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box',
                appearance: 'none',
                cursor: 'pointer'
              }}
              disabled={!newOrder.customer_city}
            >
              <option value="">İlçe Seçin</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ürün */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>Ürün</label>
          <input
            type="text"
            value={newOrder.products[0]?.product || ''}
            onChange={(e) => {
              const updatedProducts = [...newOrder.products]
              updatedProducts[0] = { ...updatedProducts[0], product: e.target.value }
              setNewOrder({ ...newOrder, products: updatedProducts })
            }}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Ürün adı"
          />
        </div>

        {/* Adet, Birim Fiyat, KDV */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>Adet</label>
            <input
              type="number"
              value={newOrder.products[0]?.quantity || 1}
              onChange={(e) => {
                const updatedProducts = [...newOrder.products]
                updatedProducts[0] = { ...updatedProducts[0], quantity: parseInt(e.target.value) || 1 }
                setNewOrder({ ...newOrder, products: updatedProducts })
              }}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box',
                textAlign: 'center'
              }}
              min="1"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>Birim Fiyat</label>
            <input
              type="number"
              value={newOrder.products[0]?.unit_price || ''}
              onChange={(e) => {
                const updatedProducts = [...newOrder.products]
                updatedProducts[0] = { ...updatedProducts[0], unit_price: e.target.value }
                setNewOrder({ ...newOrder, products: updatedProducts })
              }}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box',
                textAlign: 'center'
              }}
              placeholder="₺"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>KDV %</label>
            <input
              type="number"
              value={newOrder.products[0]?.kdv_rate || ''}
              onChange={(e) => {
                const updatedProducts = [...newOrder.products]
                updatedProducts[0] = { ...updatedProducts[0], kdv_rate: e.target.value }
                setNewOrder({ ...newOrder, products: updatedProducts })
              }}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box',
                textAlign: 'center'
              }}
              placeholder="0"
            />
          </div>
        </div>

        {/* Not */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>Not (Opsiyonel)</label>
          <input
            type="text"
            value={newOrder.note}
            onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Özel talep, açıklama..."
          />
        </div>

        <button
          onClick={() => { handleAddOrder(); onClose() }}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '14px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
          }}
        >
          ✓ Sipariş Ekle
        </button>
      </div>
    </div>
  )
}

// Bottom Tab Bar Component
function BottomTabBar({ activeTab, onTabChange, onAddClick }) {
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
      background: 'rgba(13, 13, 26, 0.98)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '8px 0 24px 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      zIndex: 1000,
      borderTop: '1px solid rgba(102, 126, 234, 0.2)',
      boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3)'
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
                  border: '3px solid #0d0d1a',
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
    if (searchName.trim()) filtered = filtered.filter(order => order.customer_name.toLowerCase().startsWith(searchName.toLowerCase()))
    if (searchPhone.trim()) filtered = filtered.filter(order => order.customer_phone.startsWith(searchPhone))
    if (searchProduct.trim()) filtered = filtered.filter(order => {
      const products = order.product.split(', ')
      return products.some(prod => prod.toLowerCase().startsWith(searchProduct.toLowerCase()))
    })
    if (statusFilter !== 'all') filtered = filtered.filter(order => order.status === statusFilter)
    setFilteredOrders(filtered)
  }, [searchName, searchPhone, searchProduct, statusFilter, orders])

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
  const shippedOrders = orders.filter(o => o.status === 'shipped').length
  const completedCount = ordersCreatedCount - activeOrders

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
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)',
        fontFamily: 'Arial, sans-serif',
        color: '#fff',
        paddingBottom: '100px',
        position: 'relative'
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
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HomeIcon size={18} />
            </button>
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>Siparişler</span>
            <span style={{
              background: 'rgba(102, 126, 234, 0.2)',
              color: '#a5b4fc',
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
        />

        {/* Stats Row - 4 cards */}
        <div style={{ padding: '0 16px 10px 16px', display: 'flex', gap: '6px' }}>
          <div style={{ flex: 1, background: 'rgba(34, 197, 94, 0.12)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
            <p style={{ color: '#22c55e', fontSize: '17px', fontWeight: '700', margin: 0 }}>{activeOrders}</p>
            <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Aktif</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(251, 191, 36, 0.12)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
            <p style={{ color: '#fbbf24', fontSize: '17px', fontWeight: '700', margin: 0 }}>{pendingPayments}</p>
            <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Bekleyen</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(139, 92, 246, 0.12)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
            <p style={{ color: '#8b5cf6', fontSize: '17px', fontWeight: '700', margin: 0 }}>{shippedOrders}</p>
            <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Kargo</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(102, 126, 234, 0.12)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
            <p style={{ color: '#667eea', fontSize: '17px', fontWeight: '700', margin: 0 }}>{completedCount}</p>
            <span style={{ color: '#6b7280', fontSize: '8px', textTransform: 'uppercase' }}>Bitti</span>
          </div>
        </div>

        {/* Search Row */}
        <div style={{ padding: '0 16px 10px 16px', display: 'flex', gap: '8px' }}>
          <div style={{
            flex: 1,
            background: 'rgba(26, 26, 46, 0.7)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Ara..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
          <div style={{
            background: 'rgba(26, 26, 46, 0.7)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
          </div>
        </div>

        {/* Orders List */}
        <div style={{ padding: '0 16px' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#64748b', 
              padding: '60px 20px',
              background: 'rgba(26, 26, 46, 0.4)',
              borderRadius: '20px',
              marginTop: '20px'
            }}>
              <p style={{ fontSize: '56px', marginBottom: '16px' }}>📭</p>
              <p style={{ fontSize: '16px' }}>Henüz sipariş yok</p>
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
              />
            ))
          )}
        </div>

        {/* Bottom Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onAddClick={() => setShowAddModal(true)}
        />

        {/* Add Order Modal */}
        <MobileAddOrderModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          handleAddOrder={handleAddOrder}
          turkeyData={turkeyData}
        />

        {/* Edit Modal */}
        <EditModal
          editingId={editingId}
          editingData={editingData}
          setEditingData={setEditingData}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          deleteOrder={deleteOrder}
          theme={theme}
        />

        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
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
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>🚚 Kargoda</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#9b59b6' }}>{shippedOrders}</p>
          </div>
          <div style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: c.textSecondary }}>📅 Bugün Eklenen</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1D9E75' }}>{orders.filter(o => {
              const orderDate = new Date(o.created_at)
              const today = new Date()
              return orderDate.toDateString() === today.toDateString()
            }).length}</p>
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