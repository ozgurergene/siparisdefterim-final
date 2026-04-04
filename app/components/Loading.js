'use client'

import { colors } from '../lib/theme'

// Spinner Component
export function Spinner({ size = 40, color = '#007bff' }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `3px solid rgba(0,0,0,0.1)`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Full Page Loading
export function PageLoader({ theme = 'light', message = 'Yükleniyor...' }) {
  const c = colors[theme]
  
  return (
    <div style={{
      minHeight: '100vh',
      background: c.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial',
      gap: '20px'
    }}>
      <Spinner size={50} color="#007bff" />
      <p style={{ color: c.textSecondary, fontSize: '16px', margin: 0 }}>{message}</p>
    </div>
  )
}

// Skeleton Box
export function SkeletonBox({ width = '100%', height = 20, borderRadius = 4, theme = 'light' }) {
  const c = colors[theme]
  const bgColor = theme === 'light' ? '#e0e0e0' : '#3a3a3a'
  const shimmerColor = theme === 'light' ? '#f0f0f0' : '#4a4a4a'
  
  return (
    <div style={{
      width,
      height,
      borderRadius,
      background: `linear-gradient(90deg, ${bgColor} 25%, ${shimmerColor} 50%, ${bgColor} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite'
    }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

// Stats Cards Skeleton
export function StatsCardsSkeleton({ theme = 'light' }) {
  const c = colors[theme]
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ background: c.header, padding: '15px', borderRadius: '8px', border: `1px solid ${c.border}`, textAlign: 'center' }}>
          <SkeletonBox width={80} height={12} theme={theme} />
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
            <SkeletonBox width={60} height={28} theme={theme} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Form Skeleton
export function FormSkeleton({ theme = 'light' }) {
  const c = colors[theme]
  
  return (
    <div style={{ background: c.header, padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}` }}>
      <SkeletonBox width={150} height={16} theme={theme} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '15px' }}>
        <div>
          <SkeletonBox width={100} height={14} theme={theme} />
          <div style={{ marginTop: '8px' }}><SkeletonBox height={38} theme={theme} /></div>
        </div>
        <div>
          <SkeletonBox width={60} height={14} theme={theme} />
          <div style={{ marginTop: '8px' }}><SkeletonBox height={38} theme={theme} /></div>
        </div>
      </div>
      <div style={{ marginTop: '15px' }}>
        <SkeletonBox width={50} height={14} theme={theme} />
        <div style={{ marginTop: '8px' }}><SkeletonBox height={38} theme={theme} /></div>
      </div>
      <div style={{ marginTop: '15px' }}><SkeletonBox height={100} theme={theme} /></div>
      <div style={{ marginTop: '15px' }}><SkeletonBox height={44} borderRadius={6} theme={theme} /></div>
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({ rows = 5, theme = 'light' }) {
  const c = colors[theme]
  
  return (
    <div style={{ background: c.header, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${c.border}` }}>
      {/* Header */}
      <div style={{ background: c.bgSecondary, padding: '12px 15px', borderBottom: `2px solid ${c.border}`, display: 'flex', gap: '15px' }}>
        <SkeletonBox width={100} height={14} theme={theme} />
        <SkeletonBox width={80} height={14} theme={theme} />
        <SkeletonBox width={150} height={14} theme={theme} />
        <SkeletonBox width={60} height={14} theme={theme} />
        <SkeletonBox width={100} height={14} theme={theme} />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ 
          padding: '12px 15px', 
          borderBottom: `1px solid ${c.border}`, 
          display: 'flex', 
          gap: '15px',
          background: i % 2 === 0 ? c.header : c.bgSecondary
        }}>
          <SkeletonBox width={100} height={16} theme={theme} />
          <SkeletonBox width={80} height={16} theme={theme} />
          <SkeletonBox width={150} height={16} theme={theme} />
          <SkeletonBox width={60} height={16} theme={theme} />
          <SkeletonBox width={100} height={28} borderRadius={4} theme={theme} />
        </div>
      ))}
    </div>
  )
}

// Search Box Skeleton
export function SearchBoxSkeleton({ theme = 'light' }) {
  const c = colors[theme]
  
  return (
    <div style={{ background: c.header, padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${c.border}` }}>
      <SkeletonBox width={80} height={14} theme={theme} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '15px' }}>
        {[1, 2, 3].map(i => (
          <div key={i}>
            <SkeletonBox width={80} height={12} theme={theme} />
            <div style={{ marginTop: '8px' }}><SkeletonBox height={36} theme={theme} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Dashboard Full Skeleton
export function DashboardSkeleton({ theme = 'light' }) {
  const c = colors[theme]
  
  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'Arial' }}>
      {/* Header Skeleton */}
      <div style={{ background: c.header, borderBottom: `1px solid ${c.border}`, padding: '15px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SkeletonBox width={180} height={28} theme={theme} />
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <SkeletonBox width={150} height={16} theme={theme} />
            <SkeletonBox width={40} height={36} borderRadius={6} theme={theme} />
            <SkeletonBox width={60} height={36} borderRadius={6} theme={theme} />
          </div>
        </div>
      </div>
      
      <div style={{ padding: '20px' }}>
        <StatsCardsSkeleton theme={theme} />
        <FormSkeleton theme={theme} />
        <SearchBoxSkeleton theme={theme} />
        <TableSkeleton rows={4} theme={theme} />
      </div>
    </div>
  )
}