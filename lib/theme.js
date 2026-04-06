// Ultra-Pro Theme System for SiparişDefterim
// Font: Inter (via next/font)
// Design: Solid backgrounds, high contrast, professional look

export const colors = {
  light: {
    // Backgrounds - SOLID, no transparency
    bg: '#f8fafc',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bgSecondary: '#ffffff',
    bgTertiary: '#f1f5f9',
    bgCard: '#ffffff',
    bgCardHover: '#fafafa',
    bgInput: '#ffffff',
    
    // Text - High contrast
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    
    // Borders - Visible
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    borderFocus: '#667eea',
    
    // Components
    header: '#ffffff',
    headerBorder: '#e2e8f0',
    
    // Shadows
    shadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    shadowMd: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
    shadowLg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  },
  dark: {
    // Backgrounds - SOLID, no transparency for cards
    bg: '#0a0a0f',
    bgGradient: 'linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)',
    bgSecondary: '#12121f',
    bgTertiary: '#1a1a2e',
    bgCard: '#16161f',           // SOLID - no transparency
    bgCardHover: '#1c1c28',      // SOLID
    bgInput: '#1a1a2e',          // SOLID
    
    // Text - High contrast for readability
    text: '#f8fafc',             // Almost white
    textSecondary: '#cbd5e1',    // Light gray
    textMuted: '#94a3b8',        // Medium gray
    
    // Borders - More visible
    border: '#2a2a3e',           // Darker, more visible
    borderLight: '#232336',
    borderFocus: '#667eea',
    
    // Components
    header: '#12121f',
    headerBorder: '#2a2a3e',
    
    // Shadows
    shadow: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
    shadowMd: '0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
    shadowLg: '0 10px 25px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.3)',
  }
}

// Status colors - Clear and vibrant
export const statusColors = {
  payment_pending: {
    bg: '#2d1f2f',
    border: '#f5576c',
    text: '#ff6b7a',
    label: 'Ödeme Bekleniyor',
    icon: '💰'
  },
  paid: {
    bg: '#1a2e1f',
    border: '#43e97b',
    text: '#5ff592',
    label: 'Ödeme Alındı',
    icon: '✅'
  },
  preparing: {
    bg: '#1f1f3d',
    border: '#667eea',
    text: '#8b9cf4',
    label: 'Paketlendi',
    icon: '📦'
  },
  shipped: {
    bg: '#1a2a3e',
    border: '#4facfe',
    text: '#6fc3ff',
    label: 'Kargoda',
    icon: '🚚'
  },
  completed: {
    bg: '#1a2e1f',
    border: '#43e97b',
    text: '#5ff592',
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

// Glow effects for buttons (on hover)
export const glowEffects = {
  primary: '0 0 20px rgba(102, 126, 234, 0.4)',
  success: '0 0 20px rgba(67, 233, 123, 0.4)',
  danger: '0 0 20px rgba(245, 87, 108, 0.4)',
  info: '0 0 20px rgba(79, 172, 254, 0.4)',
  whatsapp: '0 0 20px rgba(37, 211, 102, 0.4)',
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

// Typography scale
export const typography = {
  // Font weights
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  // Font sizes
  sizes: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
  },
  // Line heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  }
}

// CSS keyframes string
export const keyframesCSS = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`