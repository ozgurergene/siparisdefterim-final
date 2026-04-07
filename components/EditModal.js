'use client'

import { useState, useRef, useEffect } from 'react'
import { colors } from '../lib/theme'
import { cities, getDistricts } from '../lib/turkeyData'
import { calculateSubtotal, calculateKDVAmount, calculateLineTotal, calculateGrandTotal, calculateTotalKDV, calculateTotalSubtotal } from '../lib/calculations'

export default function EditModal({ editingId, editingData, setEditingData, saveEdit, cancelEdit, theme }) {
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

  if (!editingId) return null

  // Filter cities based on search
  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  )

  // Get districts for selected city and filter
  const districts = getDistricts(editingData.customer_city)
  const filteredDistricts = districts.filter(district =>
    district.toLowerCase().includes(districtSearch.toLowerCase())
  )

  const handleCitySelect = (city) => {
    setEditingData({ ...editingData, customer_city: city, customer_district: '' })
    setCityDropdownOpen(false)
    setCitySearch('')
  }

  const handleDistrictSelect = (district) => {
    setEditingData({ ...editingData, customer_district: district })
    setDistrictDropdownOpen(false)
    setDistrictSearch('')
  }

  const addProductLine = () => {
    setEditingData({
      ...editingData,
      products: [...editingData.products, { product: '', quantity: 1, unit_price: '', kdv_rate: '' }]
    })
  }

  const updateProductLine = (index, field, value) => {
    const updatedProducts = [...editingData.products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setEditingData({ ...editingData, products: updatedProducts })
  }

  const removeProductLine = (index) => {
    const updatedProducts = editingData.products.filter((_, i) => i !== index)
    setEditingData({ ...editingData, products: updatedProducts })
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: c.header,
        padding: '25px',
        borderRadius: '12px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: `1px solid ${c.border}`,
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: c.text, fontSize: '18px', fontWeight: 'bold' }}>✏️ Siparişi Düzenle</h3>
        
        {/* Customer Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Müşteri Adı Soyadı</label>
            <input
              type="text"
              value={editingData.customer_name}
              onChange={(e) => setEditingData({ ...editingData, customer_name: e.target.value })}
              style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Telefon</label>
            <input
              type="text"
              value={editingData.customer_phone}
              onChange={(e) => setEditingData({ ...editingData, customer_phone: e.target.value.replace(/\D/g, '') })}
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
            value={editingData.customer_address}
            onChange={(e) => setEditingData({ ...editingData, customer_address: e.target.value })}
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
                color: editingData.customer_city ? c.text : c.textSecondary,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px'
              }}
            >
              <span>{editingData.customer_city || 'İl Seçin'}</span>
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
                      background: editingData.customer_city === city ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                      borderLeft: editingData.customer_city === city ? '3px solid #667eea' : '3px solid transparent',
                      color: c.text,
                      fontSize: '14px',
                      transition: 'background 0.15s'
                    }}
                    onMouseOver={(e) => {
                      if (editingData.customer_city !== city) {
                        e.currentTarget.style.background = c.bgSecondary
                      }
                    }}
                    onMouseOut={(e) => {
                      if (editingData.customer_city !== city) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* İlçe Dropdown */}
          <div ref={districtDropdownRef} style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>İlçe</label>
            <div
              onClick={() => {
                if (editingData.customer_city) {
                  setDistrictDropdownOpen(!districtDropdownOpen)
                  setCityDropdownOpen(false)
                }
              }}
              style={{
                padding: '8px 12px',
                border: `1px solid ${districtDropdownOpen ? '#667eea' : c.inputBorder}`,
                borderRadius: '4px',
                background: c.input,
                color: editingData.customer_district ? c.text : c.textSecondary,
                cursor: editingData.customer_city ? 'pointer' : 'not-allowed',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                opacity: editingData.customer_city ? 1 : 0.6
              }}
            >
              <span>{editingData.customer_district || (editingData.customer_city ? 'İlçe Seçin' : 'Önce İl Seçin')}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: districtDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke={c.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {districtDropdownOpen && editingData.customer_city && (
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
                      background: editingData.customer_district === district ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                      borderLeft: editingData.customer_district === district ? '3px solid #667eea' : '3px solid transparent',
                      color: c.text,
                      fontSize: '14px',
                      transition: 'background 0.15s'
                    }}
                    onMouseOver={(e) => {
                      if (editingData.customer_district !== district) {
                        e.currentTarget.style.background = c.bgSecondary
                      }
                    }}
                    onMouseOut={(e) => {
                      if (editingData.customer_district !== district) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {district}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Lines Table */}
        <div style={{ marginBottom: '15px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px', fontSize: '14px' }}>
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
                        fontSize: '12px'
                      }}
                    >➕</button>
                  </div>
                </th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '70px', color: c.text }}>Adet</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '90px', color: c.text }}>Birim Fiyatı</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '70px', color: c.text }}>KDV %</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRight: `1px solid ${c.border}`, width: '80px', color: c.text }}>Toplam</th>
                <th style={{ padding: '10px', textAlign: 'center', width: '40px', color: c.text }}></th>
              </tr>
            </thead>
            <tbody>
              {editingData.products.map((product, index) => (
                <tr key={index} style={{ borderBottom: `1px solid ${c.border}`, background: index % 2 === 0 ? c.header : c.bgSecondary }}>
                  <td style={{ padding: '8px', borderRight: `1px solid ${c.border}` }}>
                    <input type="text" value={product.product} onChange={(e) => updateProductLine(index, 'product', e.target.value)} style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
                  </td>
                  <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                    <input type="number" min="1" value={product.quantity} onChange={(e) => updateProductLine(index, 'quantity', e.target.value)} style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                    <input type="number" min="0" value={product.unit_price} onChange={(e) => updateProductLine(index, 'unit_price', e.target.value)} style={{ width: '100%', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                    <input type="number" min="0" value={product.kdv_rate} onChange={(e) => updateProductLine(index, 'kdv_rate', e.target.value)} style={{ width: '50px', padding: '6px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text, textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '8px', borderRight: `1px solid ${c.border}`, textAlign: 'center', fontWeight: 'bold', color: '#007bff' }}>₺{calculateLineTotal(product)}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <button 
                      type="button" 
                      onClick={() => removeProductLine(index)} 
                      disabled={editingData.products.length === 1} 
                      style={{ 
                        padding: '4px 6px', 
                        background: editingData.products.length === 1 ? '#ccc' : '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: editingData.products.length === 1 ? 'not-allowed' : 'pointer', 
                        fontWeight: 'bold', 
                        fontSize: '14px',
                        opacity: editingData.products.length === 1 ? 0.5 : 1
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
            <div style={{ fontWeight: 'bold', color: c.text }}>₺{calculateTotalSubtotal(editingData.products)}</div>
          </div>
          <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: c.textSecondary, marginBottom: '5px' }}>KDV</div>
            <div style={{ fontWeight: 'bold', color: c.text }}>₺{calculateTotalKDV(editingData.products)}</div>
          </div>
          <div style={{ padding: '10px', background: c.bgSecondary, border: `1px solid ${c.border}`, borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: c.textSecondary, marginBottom: '5px' }}>Toplam</div>
            <div style={{ fontWeight: 'bold', color: c.text }}>₺{calculateGrandTotal(editingData.products)}</div>
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold', color: c.text }}>Not (Opsiyonel)</label>
          <input type="text" value={editingData.note || ''} onChange={(e) => setEditingData({ ...editingData, note: e.target.value })} style={{ width: '100%', padding: '8px', border: `1px solid ${c.inputBorder}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: c.input, color: c.text }} />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={cancelEdit}
            style={{
              padding: '12px 25px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(108, 117, 125, 0.5)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            İptal
          </button>
          <button
            onClick={saveEdit}
            style={{
              padding: '12px 25px',
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
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.5)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            ✓ Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}