// Calculate subtotal for a single product line (quantity * unit_price)
export const calculateSubtotal = (product) => {
  const quantity = parseFloat(product.quantity) || 0
  const unitPrice = parseFloat(product.unit_price) || 0
  return (quantity * unitPrice).toFixed(2)
}

// Calculate KDV amount for a single product line
export const calculateKDVAmount = (product) => {
  const subtotal = parseFloat(calculateSubtotal(product))
  const kdvRate = parseFloat(product.kdv_rate) || 0
  return (subtotal * kdvRate / 100).toFixed(2)
}

// Calculate line total (subtotal + KDV) for a single product line
export const calculateLineTotal = (product) => {
  const subtotal = parseFloat(calculateSubtotal(product))
  const kdvAmount = parseFloat(calculateKDVAmount(product))
  return (subtotal + kdvAmount).toFixed(2)
}

// Calculate total subtotal for all products
export const calculateTotalSubtotal = (products) => {
  return products.reduce((sum, product) => {
    return sum + parseFloat(calculateSubtotal(product))
  }, 0).toFixed(2)
}

// Calculate total KDV for all products
export const calculateTotalKDV = (products) => {
  return products.reduce((sum, product) => {
    return sum + parseFloat(calculateKDVAmount(product))
  }, 0).toFixed(2)
}

// Calculate grand total for all products
export const calculateGrandTotal = (products) => {
  return products.reduce((sum, product) => {
    return sum + parseFloat(calculateLineTotal(product))
  }, 0).toFixed(2)
}

// Parse products string to array (for display)
export const parseProducts = (productString) => {
  if (!productString) return []
  return productString.split(', ')
}