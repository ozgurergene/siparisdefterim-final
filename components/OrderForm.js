'use client'

import { useState, useRef, useEffect } from 'react'
import { colors } from '../lib/theme'
import { cities, getDistricts } from '../lib/turkeyData'
import { calculateSubtotal, calculateKDVAmount, calculateLineTotal, calculateGrandTotal, calculateTotalKDV, calculateTotalSubtotal } from '../lib/calculations'

// === YENI: Kargo firmalari listesi ===
const cargoCompanyList = [
  'Yurtiçi Kargo',
  'Aras Kargo',
  'MNG Kargo',
  'PTT Kargo',
  'Sürat Kargo',
  'Sendeo',
  'HepsiJet',
  'Trendyol Express',
  'Diğer'
]

export default function OrderForm({ newOrder, setNewOrder, ordersCreatedCount, handleAddOrder, theme, isPro = false, userProducts = [] }) {
  const c = colors[theme]
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false)
  const [citySearch, setCitySearch] = useState('')
  const [districtSearch, setDistrictSearch] = useState('')
  const cityDropdownRef = useRef(null)
  const districtDropdownRef = useRef(null)

  // === YENI: Kargo firmasi dropdown state ===
  const [cargoDropdownOpen, setCargoDropdownOpen] = useState(false)
  const [cargoCustomMode, setCargoCustomMode] = useState(false)
  const cargoDropdownRef = useRef(null)

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
      // === YENI: Kargo dropdown disari tiklama ===
      if (cargoDropdownRef.current && !cargoDropdownRef.current.contains(event.target)) {
        setCargoDropdownOpen(false)
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

  // === YENI: Kargo firmasi secimi ===
  const handleCargoSelect = (cargo) => {
    if (cargo === 'Diğer') {
      // Custom mode: input alani gosterilir
      setCargoCustomMode(true)
      setNewOrder({ ...newOrder, cargo_company: '' })
    } else {
      setCargoCustomMode(false)
      setNewOrder({ ...newOrder, cargo_company: cargo })
    }
    setCargoDropdownOpen(false)
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

  // Ürün seçilince fiyat ve KDV otomatik dolar
  const handleProductSelect = (index, product) => {
    const updatedProducts = [...newOrder.products]
    updatedProducts[index] = {
      ...updatedProducts[index],
      product: product.name,
      unit_price: product.unit_price?.toString() || '',
      kdv_rate: product.kdv_rate?.toString() || ''
    }
    setNewOrder({ ...newOrder, products: updatedProducts })
  }

  const removeProductLine = (index) => {
    const updatedProducts = newOrder.products.filter((_, i) => i !== index)
    setNewOrder({ ...newOrder, products: updatedProducts })
  }

  return (
    <div style={{ background: c.header, padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}`, boxSizing: 'border-box' }}>
      <h3 style={{ margin: '0 0 15px 0', color: c.text, fontSize: '14px', fontWeight: 'bold' }}>📋 Sipariş Oluştur</h3>

      {/* Customer Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
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
                  onMouseOver={(e) => { if (newOrder.customer_city !== city) e.currentTarget.style.background = c.bgSecondary }}
                  onMouseOut={(e) => { if (newOrder.customer_city !== city) e.currentTarget.style.background = 'transparent' }}
                >
                  {city}
                </div>
              ))}
              {filteredCities.length === 0 && (
                <div style={{ padding: '10px 12px', color: c.textSecondary, fontSize: '13px' }}>Sonuç bulunamadı</div>
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
                  onMouseOver={(e) => { if (newOrder.customer_district !== district) e.currentTarget.style.background = c.bgSecondary }}
                  onMouseOut={(e) => { if (newOrder.customer_district !== district) e.currentTarget.style.background = 'transparent' }}
                >
                  {district}
                </div>
              ))}
              {filteredDistricts.length === 0 && (
                <div style={{ padding: '10px 12px', color: c.textSecondary, fontSize: '13px' }}>Sonuç bulunamadı</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* === YENI: Kargo Firması ve Takip No Row === */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        {/* Kargo Firmasi Dropdown */}
        <div ref={cargoDropdownRef} style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Kargo Firması (Opsiyonel)</label>

          {/* Diger secildi ise custom text input */}
          {cargoCustomMode ? (
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Kargo firması adı yazın..."
                value={newOrder.cargo_company || ''}
                onChange={(e) => setNewOrder({ ...newOrder, cargo_company: e.target.value })}
                style={{ flex: 1, padding: '8px 12px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
              />
              <button
                type="button"
                onClick={() => {
                  setCargoCustomMode(false)
                  setNewOrder({ ...newOrder, cargo_company: '' })
                }}
                style={{
                  padding: '8px 12px',
                  background: 'transparent',
                  border: `1px solid ${c.inputBorder}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: c.textSecondary,
                  fontSize: '12px'
                }}
                title="Listeden seç"
              >
                ↩
              </button>
            </div>
          ) : (
            <>
              <div
                onClick={() => setCargoDropdownOpen(!cargoDropdownOpen)}
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${cargoDropdownOpen ? '#667eea' : c.inputBorder}`,
                  borderRadius: '4px',
                  background: c.input,
                  color: newOrder.cargo_company ? c.text : c.textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '14px'
                }}
              >
                <span>{newOrder.cargo_company || 'Kargo Firması Seçin'}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: cargoDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke={c.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {cargoDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: c.input,
                  border: `1px solid #667eea`,
                  borderRadius: '4px',
                  marginTop: '4px',
                  maxHeight: '240px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {cargoCompanyList.map(cargo => (
                    <div
                      key={cargo}
                      onClick={() => handleCargoSelect(cargo)}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        background: newOrder.cargo_company === cargo ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                        borderLeft: newOrder.cargo_company === cargo ? '3px solid #667eea' : '3px solid transparent',
                        color: c.text,
                        fontSize: '14px',
                        transition: 'background 0.15s',
                        fontStyle: cargo === 'Diğer' ? 'italic' : 'normal'
                      }}
                      onMouseOver={(e) => { if (newOrder.cargo_company !== cargo) e.currentTarget.style.background = c.bgSecondary }}
                      onMouseOut={(e) => { if (newOrder.cargo_company !== cargo) e.currentTarget.style.background = 'transparent' }}
                    >
                      {cargo}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Takip No */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Takip No (Opsiyonel)</label>
          <input
            type="text"
            placeholder="Kargo takip numarası..."
            value={newOrder.tracking_number || ''}
            onChange={(e) => setNewOrder({ ...newOrder, tracking_number: e.target.value })}
            style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
          />
        </div>
      </div>

      {/* Product Lines Table */}
      <div style={{ marginBottom: '15px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: c.bgSecondary, borderBottom: `2px solid ${c.border}` }}>
              <th style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, color: c.text, width: '30%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Ürün {isPro && userProducts.length > 0 && <span style={{ fontSize: '10px', color: '#667eea', fontWeight: '600' }}>✨ otomatik tanıma</span>}</span>
                  <button
                    type="button"
                    onClick={addProductLine}
                    style={{
                      padding: '3px 6px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '11px',
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
                  >+</button>
                </div>
              </th>
              <th style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '8%', color: c.text }}>Adet</th>
              <th style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '12%', color: c.text }}>Birim Fiyatı</th>
              <th style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '10%', color: c.text }}>Tutar</th>
              <th style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '8%', color: c.text }}>KDV %</th>
              <th style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '10%', color: c.text }}>KDV Tutarı</th>
              <th style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '12%', color: c.text }}>Toplam</th>
              <th style={{ padding: '8px', textAlign: 'center', width: '5%', color: c.text }}></th>
            </tr>
          </thead>
          <tbody>
            {newOrder.products.map((product, index) => (
              <tr key={index} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                <td style={{ padding: '6px', borderRight: `1px solid ${c.border}` }}>
                  <ProductCombobox
                    value={product.product}
                    onChange={(val) => updateProductLine(index, 'product', val)}
                    onSelect={(p) => handleProductSelect(index, p)}
                    products={userProducts}
                    isPro={isPro}
                    theme={theme}
                  />
                </td>
                <td style={{ padding: '6px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                  <input type="number" placeholder="1" min="1" value={product.quantity} onChange={(e) => updateProductLine(index, 'quantity', e.target.value)} style={{ width: '100%', padding: '5px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                </td>
                <td style={{ padding: '6px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                  <input type="number" placeholder="0" min="0" value={product.unit_price} onChange={(e) => updateProductLine(index, 'unit_price', e.target.value)} style={{ width: '100%', padding: '5px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                </td>
                <td style={{ padding: '6px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: c.text, fontSize: '12px' }}>₺{calculateSubtotal(product)}</td>
                <td style={{ padding: '6px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                  <input type="number" placeholder="0" min="0" value={product.kdv_rate} onChange={(e) => updateProductLine(index, 'kdv_rate', e.target.value)} style={{ width: '100%', padding: '5px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                </td>
                <td style={{ padding: '6px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: c.text, fontSize: '12px' }}>₺{calculateKDVAmount(product)}</td>
                <td style={{ padding: '6px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: '#007bff', fontSize: '12px' }}>₺{calculateLineTotal(product)}</td>
                <td style={{ padding: '6px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => removeProductLine(index)}
                    disabled={newOrder.products.length === 1}
                    style={{
                      padding: '3px 5px',
                      background: newOrder.products.length === 1 ? '#ccc' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: newOrder.products.length === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
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
        style={{
          width: '100%',
          padding: '12px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.5)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >✓ Onayla</button>
    </div>
  )
}

// === ProductCombobox: Yazma + Pro icin oneri dropdown ===
function ProductCombobox({ value, onChange, onSelect, products, isPro, theme }) {
  const c = colors[theme]
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // Disari tiklayinca kapat
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Filtrele: yazılana göre fuzzy match
  const filtered = (() => {
    if (!isPro || !products || products.length === 0) return []
    if (!value || value.trim() === '') return products.slice(0, 10)
    const q = value.toLowerCase().trim()
    return products
      .filter(p => (p.name || '').toLowerCase().includes(q))
      .slice(0, 10)
  })()

  const showDropdown = isPro && isOpen && filtered.length > 0

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder={isPro && products.length > 0 ? 'Ürün adı (öneriler için yaz)' : 'Ürün adı'}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          if (isPro) setIsOpen(true)
        }}
        onFocus={() => isPro && setIsOpen(true)}
        style={{
          width: '100%',
          padding: '5px',
          border: `1px solid ${c.inputBorder}`,
          borderRadius: '4px',
          fontSize: '13px',
          boxSizing: 'border-box',
          background: c.input,
          color: c.text
        }}
      />

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: c.input,
          border: `1px solid #667eea`,
          borderRadius: '4px',
          marginTop: '2px',
          maxHeight: '220px',
          overflowY: 'auto',
          zIndex: 1500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              onMouseDown={(e) => {
                // onMouseDown kullaniyoruz ki blur input'tan once tetiklensin
                e.preventDefault()
                onSelect(p)
                setIsOpen(false)
              }}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                borderBottom: `1px solid ${c.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                transition: 'background 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = c.bgSecondary}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ flex: 1, minWidth: 0, color: c.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {(p.times_sold || 0) >= 5 && <span style={{ marginRight: '4px' }}>🔥</span>}
                <span style={{ fontWeight: '500' }}>{p.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
                <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '12px' }}>
                  ₺{parseFloat(p.unit_price || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                </span>
                {parseFloat(p.kdv_rate) > 0 && (
                  <span style={{ color: c.textMuted, fontSize: '10px' }}>%{p.kdv_rate}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}