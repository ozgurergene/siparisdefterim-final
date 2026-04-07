'use client'

import { useState, useRef, useEffect } from 'react'
import { colors } from '../lib/theme'
import { cities, getDistricts } from '../lib/turkeyData'
import { calculateSubtotal, calculateKDVAmount, calculateLineTotal, calculateGrandTotal, calculateTotalKDV, calculateTotalSubtotal } from '../lib/calculations'

export default function OrderForm({ newOrder, setNewOrder, ordersCreatedCount, handleAddOrder, theme }) {
  const c = colors[theme]
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false)
  const [citySearch, setCitySearch] = useState('')
  const [districtSearch, setDistrictSearch] = useState('')
  const cityDropdownRef = useRef(null)
  const districtDropdownRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setCityDropdownOpen(false)
        setCitySearch('')
      }
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
        setDistrictDropdownOpen(false)
        setDistrictSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter cities based on search
  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  )

  // Get districts for selected city and filter
  const districts = getDistricts(newOrder.customer_city)
  const filteredDistricts = districts.filter(district =>
    district.toLowerCase().includes(districtSearch.toLowerCase())
  )

  const handleCitySelect = (city) => {
    setNewOrder({ ...newOrder, customer_city: city, customer_district: '' })
    setCityDropdownOpen(false)
    setCitySearch('')
  }

  const handleDistrictSelect = (district) => {
    setNewOrder({ ...newOrder, customer_district: district })
    setDistrictDropdownOpen(false)
    setDistrictSearch('')
  }

  const addProductLine = () => {
    setNewOrder({
      ...newOrder,
      products: [...newOrder.products, { product: '', quantity: 1, unit_price: '', kdv_rate: '' }]
    })
  }

  const updateProductLine = (index, field, value) => {
    const updatedProducts = [...newOrder.products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setNewOrder({ ...newOrder, products: updatedProducts })
  }

  const removeProductLine = (index) => {
    const updatedProducts = newOrder.products.filter((_, i) => i !== index)
    setNewOrder({ ...newOrder, products: updatedProducts })
  }

  return (
    <div style={{ background: c.header, padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}` }}>
      <h3 style={{ margin: '0 0 15px 0', color: c.text, fontSize: '14px', fontWeight: 'bold' }}>📋 Sipariş Oluştur</h3>
      
      {/* Customer Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı Soyadı</label>
          <input
            type="text"
            placeholder="Adı Soyadı"
            value={newOrder.customer_name}
            onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
            style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
          <input
            type="text"
            placeholder="5551234567"
            value={newOrder.customer_phone}
            onChange={(e) => setNewOrder({ ...newOrder, customer_phone: e.target.value.replace(/\D/g, '') })}
            maxLength="10"
            style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
      </div>

      {/* Address Row */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Adres</label>
        <input
          type="text"
          placeholder="Mahalle, Sokak, Bina No, Daire No"
          value={newOrder.customer_address}
          onChange={(e) => setNewOrder({ ...newOrder, customer_address: e.target.value })}
          style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
        />
      </div>

      {/* İl ve İlçe Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        {/* İl Dropdown */}
        <div ref={cityDropdownRef} style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>İl</label>
          <div
            onClick={() => {
              setCityDropdownOpen(!cityDropdownOpen)
              setDistrictDropdownOpen(false)
            }}
            style={{
              padding: '8px 12px',
              border: `1px solid ${cityDropdownOpen ? '#667eea' : c.inputBorder}`,
              borderRadius: '4px',
              background: c.input,
              color: newOrder.customer_city ? c.text : c.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px'
            }}
          >
            <span>{newOrder.customer_city || 'İl Seçin'}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: cityDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke={c.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {cityDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: c.input,
              border: `1px solid #667eea`,
              borderRadius: '4px',
              marginTop: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {/* Search Input */}
              <div style={{ padding: '8px', borderBottom: `1px solid ${c.border}`, position: 'sticky', top: 0, background: c.input }}>
                <input
                  type="text"
                  placeholder="İl ara..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: `1px solid ${c.inputBorder}`,
                    borderRadius: '4px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    background: c.bgSecondary,
                    color: c.text
                  }}
                />
              </div>
              {filteredCities.map(city => (
                <div
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    background: newOrder.customer_city === city ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                    borderLeft: newOrder.customer_city === city ? '3px solid #667eea' : '3px solid transparent',
                    color: c.text,
                    fontSize: '14px',
                    transition: 'background 0.15s'
                  }}
                  onMouseOver={(e) => {
                    if (newOrder.customer_city !== city) {
                      e.currentTarget.style.background = c.bgSecondary
                    }
                  }}
                  onMouseOut={(e) => {
                    if (newOrder.customer_city !== city) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {city}
                </div>
              ))}
              {filteredCities.length === 0 && (
                <div style={{ padding: '10px 12px', color: c.textSecondary, fontSize: '13px' }}>
                  Sonuç bulunamadı
                </div>
              )}
            </div>
          )}
        </div>

        {/* İlçe Dropdown */}
        <div ref={districtDropdownRef} style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>İlçe</label>
          <div
            onClick={() => {
              if (newOrder.customer_city) {
                setDistrictDropdownOpen(!districtDropdownOpen)
                setCityDropdownOpen(false)
              }
            }}
            style={{
              padding: '8px 12px',
              border: `1px solid ${districtDropdownOpen ? '#667eea' : c.inputBorder}`,
              borderRadius: '4px',
              background: c.input,
              color: newOrder.customer_district ? c.text : c.textSecondary,
              cursor: newOrder.customer_city ? 'pointer' : 'not-allowed',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              opacity: newOrder.customer_city ? 1 : 0.6
            }}
          >
            <span>{newOrder.customer_district || (newOrder.customer_city ? 'İlçe Seçin' : 'Önce İl Seçin')}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: districtDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke={c.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {districtDropdownOpen && newOrder.customer_city && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: c.input,
              border: `1px solid #667eea`,
              borderRadius: '4px',
              marginTop: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {/* Search Input */}
              <div style={{ padding: '8px', borderBottom: `1px solid ${c.border}`, position: 'sticky', top: 0, background: c.input }}>
                <input
                  type="text"
                  placeholder="İlçe ara..."
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: `1px solid ${c.inputBorder}`,
                    borderRadius: '4px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    background: c.bgSecondary,
                    color: c.text
                  }}
                />
              </div>
              {filteredDistricts.map(district => (
                <div
                  key={district}
                  onClick={() => handleDistrictSelect(district)}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    background: newOrder.customer_district === district ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                    borderLeft: newOrder.customer_district === district ? '3px solid #667eea' : '3px solid transparent',
                    color: c.text,
                    fontSize: '14px',
                    transition: 'background 0.15s'
                  }}
                  onMouseOver={(e) => {
                    if (newOrder.customer_district !== district) {
                      e.currentTarget.style.background = c.bgSecondary
                    }
                  }}
                  onMouseOut={(e) => {
                    if (newOrder.customer_district !== district) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {district}
                </div>
              ))}
              {filteredDistricts.length === 0 && (
                <div style={{ padding: '10px 12px', color: c.textSecondary, fontSize: '13px' }}>
                  Sonuç bulunamadı
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Lines Table */}
      <div style={{ marginBottom: '15px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Ürün</span>
                  <button 
                    type="button" 
                    onClick={addProductLine} 
                    style={{ 
                      padding: '4px 8px', 
                      background: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold', 
                      fontSize: '12px', 
                      lineHeight: '1',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.5)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >➕</button>
                </div>
              </th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '70px', color: c.text }}>Adet</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '100px', color: c.text }}>Birim Fiyatı</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>Tutar</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>KDV %</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>KDV Tutarı</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '100px', color: c.text }}>Toplam</th>
              <th style={{ padding: '10px', textAlign: 'center', width: '40px', color: c.text }}></th>
            </tr>
          </thead>
          <tbody>
            {newOrder.products.map((product, index) => (
              <tr key={index} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}` }}>
                  <input type="text" placeholder="Ürün adı" value={product.product} onChange={(e) => updateProductLine(index, 'product', e.target.value)} style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                </td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                  <input type="number" placeholder="1" min="1" value={product.quantity} onChange={(e) => updateProductLine(index, 'quantity', e.target.value)} style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                </td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                  <input type="number" placeholder="0" min="0" value={product.unit_price} onChange={(e) => updateProductLine(index, 'unit_price', e.target.value)} style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                </td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: c.text }}>₺{calculateSubtotal(product)}</td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                  <input type="number" placeholder="0" min="0" value={product.kdv_rate} onChange={(e) => updateProductLine(index, 'kdv_rate', e.target.value)} style={{ width: '50px', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                </td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: c.text }}>₺{calculateKDVAmount(product)}</td>
                <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: '#007bff' }}>₺{calculateLineTotal(product)}</td>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => removeProductLine(index)} 
                    disabled={newOrder.products.length === 1} 
                    style={{ 
                      padding: '4px 6px', 
                      background: newOrder.products.length === 1 ? '#ccc' : '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: newOrder.products.length === 1 ? 'not-allowed' : 'pointer', 
                      fontWeight: 'bold', 
                      fontSize: '14px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      opacity: newOrder.products.length === 1 ? 0.5 : 1
                    }}
                    onMouseOver={(e) => {
                      if (newOrder.products.length > 1) {
                        e.currentTarget.style.transform = 'scale(1.1)'
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.5)'
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px', fontSize: '14px' }}>
        <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ color: c.textSecondary, marginBottom: '5px' }}>Tutar</div>
          <div style={{ fontWeight: 'bold', color: c.text, fontSize: '14px' }}>₺{calculateTotalSubtotal(newOrder.products)}</div>
        </div>
        <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ color: c.textSecondary, marginBottom: '5px' }}>KDV</div>
          <div style={{ fontWeight: 'bold', color: c.text, fontSize: '14px' }}>₺{calculateTotalKDV(newOrder.products)}</div>
        </div>
        <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ color: c.textSecondary, marginBottom: '5px', fontSize: '14px' }}>Toplam</div>
          <div style={{ fontWeight: 'bold', color: c.text, fontSize: '14px' }}>₺{calculateGrandTotal(newOrder.products)}</div>
        </div>
      </div>

      {/* Note */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Not (Opsiyonel)</label>
        <input type="text" placeholder="Özel talep, açıklama..." value={newOrder.note} onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })} style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
      </div>

      <button 
        onClick={handleAddOrder} 
        disabled={ordersCreatedCount >= 50} 
        style={{ 
          width: '100%', 
          padding: '12px', 
          background: ordersCreatedCount >= 50 ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: ordersCreatedCount >= 50 ? 'not-allowed' : 'pointer', 
          fontWeight: 'bold', 
          fontSize: '14px',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={(e) => {
          if (ordersCreatedCount < 50) {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.5)'
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >✓ Onayla</button>
    </div>
  )
}