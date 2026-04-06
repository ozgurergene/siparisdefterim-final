// Ultra-Pro Theme System for SiparişDefterim
export const colors = {
  light: {
    bg: '#f8fafc',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
    bgSecondary: '#ffffff',
    bgTertiary: '#f1f5f9',
    bgCard: 'rgba(255, 255, 255, 0.95)',
    bgCardHover: 'rgba(255, 255, 255, 1)',
    text: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    header: 'rgba(255, 255, 255, 0.95)',
    input: '#ffffff',
    inputBorder: '#e2e8f0',
    inputFocus: 'rgba(102, 126, 234, 0.5)',
    hover: '#f8fafc',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLg: 'rgba(0, 0, 0, 0.15)',
  },
  dark: {
    bg: '#0a0a14',
    bgGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 20%, #2d1b4e 40%, #4a1942 50%, #2d1b4e 60%, #1a1a2e 80%, #0d0d1a 100%)',
    bgSecondary: '#12121f',
    bgTertiary: '#1a1a2e',
    bgCard: 'rgba(18, 18, 31, 0.95)',
    bgCardHover: 'rgba(26, 26, 46, 1)',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.05)',
    header: 'rgba(18, 18, 31, 0.95)',
    input: '#1a1a2e',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    inputFocus: 'rgba(102, 126, 234, 0.5)',
    hover: '#1a1a2e',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLg: 'rgba(0, 0, 0, 0.5)',
  }
}

// Status colors with gradients for cards
export const statusColors = {
  payment_pending: {
    bg: 'linear-gradient(135deg, rgba(245, 87, 108, 0.15) 0%, rgba(240, 147, 251, 0.15) 100%)',
    bgSolid: 'rgba(245, 87, 108, 0.15)',
    border: 'rgba(245, 87, 108, 0.3)',
    text: '#f5576c',
    label: 'Ödeme Bekleniyor',
    icon: '💰'
  },
  paid: {
    bg: 'linear-gradient(135deg, rgba(67, 233, 123, 0.15) 0%, rgba(56, 249, 215, 0.15) 100%)',
    bgSolid: 'rgba(67, 233, 123, 0.15)',
    border: 'rgba(67, 233, 123, 0.3)',
    text: '#43e97b',
    label: 'Ödeme Alındı',
    icon: '✅'
  },
  preparing: {
    bg: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
    bgSolid: 'rgba(102, 126, 234, 0.15)',
    border: 'rgba(102, 126, 234, 0.3)',
    text: '#667eea',
    label: 'Paketlendi',
    icon: '📦'
  },
  shipped: {
    bg: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.15) 100%)',
    bgSolid: 'rgba(79, 172, 254, 0.15)',
    border: 'rgba(79, 172, 254, 0.3)',
    text: '#4facfe',
    label: 'Kargoda',
    icon: '🚚'
  },
  completed: {
    bg: 'linear-gradient(135deg, rgba(67, 233, 123, 0.15) 0%, rgba(56, 249, 215, 0.15) 100%)',
    bgSolid: 'rgba(67, 233, 123, 0.15)',
    border: 'rgba(67, 233, 123, 0.3)',
    text: '#43e97b',
    label: 'Teslim Edildi',
    icon: '✓'
  }
}

// Metric card gradients
export const metricGradients = {
  active: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  pending: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  shipped: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  today: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  revenue: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  completed: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

// Button gradients
export const buttonGradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  danger: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
  info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
}

// Glow effects for buttons
export const glowEffects = {
  primary: '0 0 20px rgba(102, 126, 234, 0.5), 0 0 40px rgba(118, 75, 162, 0.3)',
  success: '0 0 20px rgba(67, 233, 123, 0.5), 0 0 40px rgba(56, 249, 215, 0.3)',
  danger: '0 0 20px rgba(245, 87, 108, 0.5), 0 0 40px rgba(240, 147, 251, 0.3)',
  info: '0 0 20px rgba(79, 172, 254, 0.5), 0 0 40px rgba(0, 242, 254, 0.3)',
  whatsapp: '0 0 20px rgba(37, 211, 102, 0.5), 0 0 40px rgba(37, 211, 102, 0.3)',
}

// Avatar colors for customers
export const avatarGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
]

// Get avatar gradient based on name
export const getAvatarGradient = (name) => {
  if (!name) return avatarGradients[0]
  const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0)
  return avatarGradients[charCode % avatarGradients.length]
}

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// CSS keyframes string (add to global styles)
export const keyframesCSS = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
`