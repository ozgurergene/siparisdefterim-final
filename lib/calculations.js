// Calculate KDV amount (percentage-based)
export const calculateKDVAmount = (product) => {
  const quantity = parseInt(product.quantity) || 1
  const unitPrice = parseFloat(product.unit_price) || 0
  const subtotal = quantity * unitPrice
  const kdvRate = parseFloat(product.kdv_rate) || 0
  const kdvAmount = (subtotal * kdvRate) / 100
  return kdvAmount.toFixed(2)
}

// Calculate subtotal
export const calculateSubtotal = (product) => {
  const quantity = parseInt(product.quantity) || 1
  const unitPrice = parseFloat(product.unit_price) || 0
  return (quantity * unitPrice).toFixed(2)
}

// Calculate line total with KDV
export const calculateLineTotal = (product) => {
  const subtotal = parseFloat(calculateSubtotal(product))
  const kdvAmount = parseFloat(calculateKDVAmount(product))
  return (subtotal + kdvAmount).toFixed(2)
}

// Calculate grand total
export const calculateGrandTotal = (products) => {
  return products.reduce((sum, product) => {
    return sum + parseFloat(calculateLineTotal(product))
  }, 0).toFixed(2)
}

// Calculate total KDV
export const calculateTotalKDV = (products) => {
  return products.reduce((sum, product) => {
    return sum + parseFloat(calculateKDVAmount(product))
  }, 0).toFixed(2)
}

// Calculate total subtotal
export const calculateTotalSubtotal = (products) => {
  return products.reduce((sum, product) => {
    return sum + parseFloat(calculateSubtotal(product))
  }, 0).toFixed(2)
}

// Parse products from JSON or old format
export const parseProducts = (order) => {
  if (order.products_json) {
    try {
      return JSON.parse(order.products_json)
    } catch (e) {
      console.log('Failed to parse products_json')
    }
  }
  try {
    const products = order.product.split(', ').map(p => {
      const match = p.match(/^(.+?)\s+x(\d+)\s+\(₺([\d.]+)\)/)
      if (match) {
        return {
          product: match[1],
          quantity: parseInt(match[2]),
          unit_price: (parseFloat(match[3]) / parseInt(match[2])).toFixed(2),
          kdv_rate: 0
        }
      }
      return { product: p, quantity: 1, unit_price: 0, kdv_rate: 0 }
    })
    return products
  } catch (e) {
    return [{ product: order.product, quantity: 1, unit_price: 0, kdv_rate: 0 }]
  }
}