// Calculate product totals with KDV
export function calculateProductTotal(product) {
  const quantity = parseInt(product.quantity) || 0
  const unitPrice = parseFloat(product.unit_price) || 0
  const kdvRate = parseFloat(product.kdv_rate) || 0
  
  const subtotal = quantity * unitPrice
  const kdvAmount = subtotal * (kdvRate / 100)
  const total = subtotal + kdvAmount
  
  return {
    subtotal,
    kdvAmount,
    total
  }
}

// Calculate order totals from products array
export function calculateOrderTotals(products) {
  if (!products || products.length === 0) {
    return { subtotal: 0, kdv: 0, total: 0 }
  }
  
  return products.reduce((acc, product) => {
    const { subtotal, kdvAmount, total } = calculateProductTotal(product)
    return {
      subtotal: acc.subtotal + subtotal,
      kdv: acc.kdv + kdvAmount,
      total: acc.total + total
    }
  }, { subtotal: 0, kdv: 0, total: 0 })
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2
  }).format(amount || 0)
}

// Format date
export function formatDate(dateString) {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}