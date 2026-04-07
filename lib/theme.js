export const colors = {
  light: {
    bg: '#f5f5f5',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
    bgCard: 'rgba(255, 255, 255, 0.95)',
    bgCardHover: 'rgba(255, 255, 255, 1)',
    header: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#e0e0e0',
    borderLight: '#f0f0f0',
    input: '#ffffff',
    inputBorder: '#cccccc',
    bgSecondary: '#f0f0f0',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  dark: {
    bg: '#0d0d1a',
    bgGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 20%, #2d1b4e 40%, #4a1942 50%, #2d1b4e 60%, #1a1a2e 80%, #0d0d1a 100%)',
    bgCard: 'rgba(26, 26, 46, 0.8)',
    bgCardHover: 'rgba(26, 26, 46, 0.95)',
    header: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    textMuted: '#888888',
    border: '#333355',
    borderLight: '#2a2a4a',
    input: '#252540',
    inputBorder: '#444466',
    bgSecondary: '#252540',
    shadow: 'rgba(0, 0, 0, 0.3)'
  }
}

export const statusColors = {
  payment_pending: '#f39c12',
  paid: '#2ecc71',
  preparing: '#3498db',
  shipped: '#9b59b6',
  completed: '#1D9E75'
}

export const metricGradients = {
  active: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  pending: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  today: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  shipped: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  completed: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  revenue: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
}

export const glowEffects = {
  primary: '0 8px 32px rgba(102, 126, 234, 0.4)',
  success: '0 8px 32px rgba(67, 233, 123, 0.4)',
  danger: '0 8px 32px rgba(245, 87, 108, 0.4)',
  warning: '0 8px 32px rgba(243, 156, 18, 0.4)',
  info: '0 8px 32px rgba(79, 172, 254, 0.4)'
}

export const buttonGradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  danger: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
}

export const keyframesCSS = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
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

export const getAvatarGradient = (name) => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ]
  const index = (name || '').charCodeAt(0) % gradients.length
  return gradients[index]
}

export const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}