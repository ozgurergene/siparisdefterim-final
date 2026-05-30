// === Sipariş detayı PDF üretici ===
// OrderDetailModal'daki "PDF İndir" butonu bunu çağırır.
// Türkçe karakterler için Roboto fontu gömülüdür (bkz. pdfFont.js).

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { registerTurkishFont } from './pdfFont'

// Para formatla (modal ile aynı mantık)
function fmt(n) {
  return parseFloat(n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Tarih + saat (modal ile aynı)
function fmtDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

// Telefon formatla: +90 535 464 04 92 (10 hane ise grupla, degilse oldugu gibi)
function formatPhone(raw) {
  let digits = (raw || '').replace(/\D/g, '')
  if (digits.startsWith('0')) digits = digits.slice(1)
  if (digits.startsWith('90')) digits = digits.slice(2)
  if (digits.length === 10) {
    return `+90 ${digits.slice(0,3)} ${digits.slice(3,6)} ${digits.slice(6,8)} ${digits.slice(8,10)}`
  }
  return `+90 ${digits}`
}

const STATUS_LABELS = {
  payment_pending: 'Ödeme Bekleniyor',
  paid: 'Ödeme Alındı',
  preparing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  completed: 'Tamamlandı'
}

export function generateOrderPdf(order, businessInfo = {}) {
  if (!order) return

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  registerTurkishFont(doc)

  const pageW = doc.internal.pageSize.getWidth()
  const marginX = 14
  let y = 18

  const orderNo = order.id ? order.id.slice(0, 8) : '-'
  const statusLabel = STATUS_LABELS[order.status] || STATUS_LABELS.payment_pending

  // === Üst başlık: isletme adi (varsa) yoksa marka + siparis no ===
  const bizName = (businessInfo.business_name || '').trim()
  const bizPhone = (businessInfo.business_phone || '').trim()
  const bizInstagram = (businessInfo.business_instagram || '').trim()

  doc.setFont('Roboto', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(102, 126, 234) // #667eea
  doc.text(bizName || 'SiparişDefterim', marginX, y)

  // Isletme iletisim bilgisi (varsa) - baslik altinda, alt alta
  doc.setFont('Roboto', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  if (bizName) {
    let cy = y + 5.5
    if (bizInstagram) {
      doc.text(`instagram.com/${bizInstagram}`, marginX, cy)
      cy += 4.5
    }
    if (bizPhone) {
      doc.text(`Tel: ${formatPhone(bizPhone)}`, marginX, cy)
    }
    if (!bizInstagram && !bizPhone) {
      doc.setFontSize(10)
      doc.text('Sipariş Fişi', marginX, y + 6)
    }
  } else {
    doc.setFontSize(10)
    doc.text('Sipariş Fişi', marginX, y + 6)
  }

  // Sağ üst: sipariş no + durum
  doc.setFont('Roboto', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(40, 40, 40)
  doc.text(`#${orderNo}`, pageW - marginX, y, { align: 'right' })
  doc.setFont('Roboto', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text(statusLabel, pageW - marginX, y + 6, { align: 'right' })

  y += 17
  doc.setDrawColor(220, 220, 220)
  doc.line(marginX, y, pageW - marginX, y)
  y += 8

  // === Sipariş oluşturma tarihi + müşteri (iki sütun) ===
  doc.setFontSize(9)
  doc.setTextColor(140, 140, 140)
  doc.text('SİPARİŞ OLUŞTURMA TARİHİ', marginX, y)
  doc.text('MÜŞTERİ ADI SOYADI', pageW / 2, y)

  doc.setFont('Roboto', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  doc.text(fmtDate(order.created_at), marginX, y + 6)
  doc.text(order.customer_name || '-', pageW / 2, y + 6)

  doc.setFont('Roboto', 'normal')
  if (order.customer_phone) {
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(order.customer_phone, pageW / 2, y + 12)
    y += 6
  }
  y += 14

  // === Ürünler ===
  const hasDetail = Array.isArray(order.products_detail) && order.products_detail.length > 0

  let products = []
  if (hasDetail) {
    products = order.products_detail
  } else if (order.product) {
    products = order.product.split(', ').map(part => {
      const m = part.match(/(.+) x(\d+)/)
      return m
        ? { product: m[1], quantity: parseInt(m[2]), unit_price: '', kdv_rate: '' }
        : { product: part, quantity: 1, unit_price: '', kdv_rate: '' }
    })
  }

  let subtotal = 0
  let totalKdv = 0

  if (hasDetail) {
    const rows = products.map(p => {
      const qty = parseInt(p.quantity) || 1
      const price = parseFloat(p.unit_price) || 0
      const kdvRate = parseFloat(p.kdv_rate) || 0
      const lineSub = qty * price
      const lineKdv = lineSub * kdvRate / 100
      subtotal += lineSub
      totalKdv += lineKdv
      return [
        p.product || '-',
        String(qty),
        `₺${fmt(price)}`,
        `%${kdvRate}`,
        `₺${fmt(lineSub + lineKdv)}`
      ]
    })

    autoTable(doc, {
      startY: y,
      head: [[
        { content: 'Ürün', styles: { halign: 'left' } },
        { content: 'Adet', styles: { halign: 'center' } },
        { content: 'Birim Fiyat', styles: { halign: 'right' } },
        { content: 'KDV', styles: { halign: 'right' } },
        { content: 'Toplam', styles: { halign: 'right' } }
      ]],
      body: rows,
      margin: { left: marginX, right: marginX },
      styles: { font: 'Roboto', fontSize: 10, cellPadding: 3, textColor: [40, 40, 40] },
      headStyles: { font: 'Roboto', fontStyle: 'bold', fillColor: [102, 126, 234], textColor: [255, 255, 255] },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    })
    y = doc.lastAutoTable.finalY + 6
  } else {
    // Basit mod: KDV bilgisi yok, sade liste
    const rows = products.map(p => [p.product || '-', `× ${p.quantity || 1}`])
    autoTable(doc, {
      startY: y,
      head: [[
        { content: 'Ürün', styles: { halign: 'left' } },
        { content: 'Adet', styles: { halign: 'center' } }
      ]],
      body: rows,
      margin: { left: marginX, right: marginX },
      styles: { font: 'Roboto', fontSize: 10, cellPadding: 3, textColor: [40, 40, 40] },
      headStyles: { font: 'Roboto', fontStyle: 'bold', fillColor: [102, 126, 234], textColor: [255, 255, 255] },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'center' } }
    })
    y = doc.lastAutoTable.finalY + 6
  }

  const grandTotal = parseFloat(order.price) || (subtotal + totalKdv)

  // === Toplamlar (sağa hizalı) ===
  const totalsX = pageW - marginX
  const labelX = pageW - marginX - 62
  doc.setFontSize(10)

  if (hasDetail) {
    doc.setFont('Roboto', 'normal')
    doc.setTextColor(120, 120, 120)
    doc.text('Ara Toplam', labelX, y)
    doc.setTextColor(40, 40, 40)
    doc.text(`₺${fmt(subtotal)}`, totalsX, y, { align: 'right' })
    y += 6

    doc.setTextColor(120, 120, 120)
    doc.text('Toplam KDV', labelX, y)
    doc.setTextColor(40, 40, 40)
    doc.text(`₺${fmt(totalKdv)}`, totalsX, y, { align: 'right' })
    y += 7
  }

  doc.setDrawColor(220, 220, 220)
  doc.line(labelX, y - 3, totalsX, y - 3)
  doc.setFont('Roboto', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(40, 40, 40)
  doc.text('Genel Toplam', labelX, y + 3)
  doc.setTextColor(34, 197, 94) // #22c55e
  doc.text(`₺${fmt(grandTotal)}`, totalsX, y + 3, { align: 'right' })
  if (!hasDetail) {
    doc.setFont('Roboto', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(140, 140, 140)
    doc.text('KDV dahil', labelX, y + 8)
  }
  y += 14

  // === Teslimat adresi ===
  if (order.customer_address || order.customer_city || order.customer_district) {
    doc.setFont('Roboto', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(140, 140, 140)
    doc.text('TESLİMAT ADRESİ', marginX, y)
    y += 6
    doc.setFont('Roboto', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    if (order.customer_address) {
      const lines = doc.splitTextToSize(order.customer_address, pageW - marginX * 2)
      doc.text(lines, marginX, y)
      y += lines.length * 5
    }
    const loc = [order.customer_district, order.customer_city].filter(Boolean).join(' / ')
    if (loc) {
      doc.setTextColor(120, 120, 120)
      doc.text(loc, marginX, y)
      y += 6
    }
    y += 4
  }

  // === Kargo bilgisi ===
  if (order.cargo_company || order.tracking_number) {
    doc.setFont('Roboto', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(140, 140, 140)
    doc.text('KARGO BİLGİSİ', marginX, y)
    y += 6
    doc.setFont('Roboto', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    if (order.cargo_company) {
      doc.text(`Kargo Firması: ${order.cargo_company}`, marginX, y)
      y += 6
    }
    if (order.tracking_number) {
      doc.text(`Takip No: ${order.tracking_number}`, marginX, y)
      y += 6
    }
    y += 4
  }

  // === Not ===
  if (order.note) {
    doc.setFont('Roboto', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(140, 140, 140)
    doc.text('NOT', marginX, y)
    y += 6
    doc.setFont('Roboto', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    const noteLines = doc.splitTextToSize(order.note, pageW - marginX * 2)
    doc.text(noteLines, marginX, y)
    y += noteLines.length * 5 + 4
  }

  // === Alt bilgi ===
  const pageH = doc.internal.pageSize.getHeight()
  doc.setFont('Roboto', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(170, 170, 170)
  doc.text('Bu fiş SiparişDefterim ile oluşturulmuştur · deftertut.com', pageW / 2, pageH - 10, { align: 'center' })

  // === İndir ===
  doc.save(`siparis-${orderNo}.pdf`)
}