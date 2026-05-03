'use client'

import { colors } from '../lib/theme'

// Spinner Loading Component
export function LoadingSpinner({ size = 40, color = '#007bff' }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `4px solid #f3f3f3`,
      borderTop: `4px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Skeleton Box
export function SkeletonBox({ width, height, borderRadius = 4, theme = 'light' }) {
  const c = colors[theme]
  return (
    <div style={{
      width,
      height,
      backgroundImage: `linear-gradient(90deg, ${c.bgSecondary} 25%, ${c.border} 50%, ${c.bgSecondary} 75%)`,
      backgroundSize: '200% 100%',
      backgroundRepeat: 'no-repeat',
      animation: 'shimmer 1.5s infinite',
      borderRadius
    }}>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}

// Stats Cards Skeleton
export function StatsCardsSkeleton({ theme = 'light' }) {
  const c = colors[theme]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '20px' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ background: c.header, padding: '20px', borderRadius: '8px', border: `1px solid ${c.border}` }}>
          <SkeletonBox width="80px" height="14px" theme={theme} />
          <div style={{ marginTop: '10px' }}>
            <SkeletonBox width="60px" height="28px" theme={theme} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Search Box Skeleton
export function SearchBoxSkeleton({ theme = 'light' }) {
  const c = colors[theme]
  return (
    <div style={{ background: c.header, padding: '15px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}` }}>
      <SkeletonBox width="200px" height="20px" theme={theme} />
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({ rows = 5, theme = 'light' }) {
  const c = colors[theme]
  return (
    <div style={{ background: c.header, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${c.border}` }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px', background: c.bgSecondary, borderBottom: `1px solid ${c.border}` }}>
        <SkeletonBox width="100px" height="16px" theme={theme} />
        <SkeletonBox width="80px" height="16px" theme={theme} />
        <SkeletonBox width="150px" height="16px" theme={theme} />
        <SkeletonBox width="60px" height="16px" theme={theme} />
        <SkeletonBox width="100px" height="16px" theme={theme} />
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', padding: '15px', borderBottom: `1px solid ${c.border}` }}>
          <SkeletonBox width="100px" height="14px" theme={theme} />
          <SkeletonBox width="80px" height="14px" theme={theme} />
          <SkeletonBox width="150px" height="14px" theme={theme} />
          <SkeletonBox width="60px" height="14px" theme={theme} />
          <SkeletonBox width="100px" height="14px" theme={theme} />
        </div>
      ))}
    </div>
  )
}

// Full Page Loading
export default function Loading({ theme = 'light', message = 'Yükleniyor...' }) {
  const c = colors[theme]
  return (
    <div style={{
      minHeight: '100vh',
      background: c.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial'
    }}>
      <LoadingSpinner size={50} />
      <p style={{ marginTop: '20px', color: c.textSecondary, fontSize: '16px' }}>{message}</p>
    </div>
  )
}