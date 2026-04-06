'use client'

// Spinner Component
export function Spinner({ size = 40, color = '#667eea' }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid rgba(102, 126, 234, 0.1)`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  )
}

// Skeleton Box
export function SkeletonBox({ width = '100%', height = 20, borderRadius = 8 }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.1) 25%, rgba(118, 75, 162, 0.15) 50%, rgba(102, 126, 234, 0.1) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  )
}

// Stats Cards Skeleton
export function StatsCardsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 16,
            padding: 20,
            backdropFilter: 'blur(10px)',
          }}
        >
          <SkeletonBox width={80} height={14} borderRadius={4} />
          <div style={{ marginTop: 12 }}>
            <SkeletonBox width={60} height={32} borderRadius={6} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Search Box Skeleton
export function SearchBoxSkeleton() {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        backdropFilter: 'blur(10px)',
      }}
    >
      <SkeletonBox width={200} height={20} borderRadius={6} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <SkeletonBox height={44} borderRadius={10} />
        <SkeletonBox height={44} borderRadius={10} />
      </div>
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '50px 2fr 1.5fr 1fr 1fr 120px',
          gap: 16,
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <SkeletonBox height={16} borderRadius={4} />
        <SkeletonBox height={16} borderRadius={4} />
        <SkeletonBox height={16} borderRadius={4} />
        <SkeletonBox height={16} borderRadius={4} />
        <SkeletonBox height={16} borderRadius={4} />
        <SkeletonBox height={16} borderRadius={4} />
      </div>
      
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '50px 2fr 1.5fr 1fr 1fr 120px',
            gap: 16,
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
            alignItems: 'center',
          }}
        >
          <SkeletonBox width={36} height={36} borderRadius={18} />
          <div>
            <SkeletonBox width={120} height={14} borderRadius={4} />
            <div style={{ marginTop: 6 }}>
              <SkeletonBox width={90} height={12} borderRadius={4} />
            </div>
          </div>
          <SkeletonBox width={150} height={14} borderRadius={4} />
          <SkeletonBox width={60} height={14} borderRadius={4} />
          <SkeletonBox width={100} height={28} borderRadius={14} />
          <div style={{ display: 'flex', gap: 8 }}>
            <SkeletonBox width={32} height={32} borderRadius={8} />
            <SkeletonBox width={32} height={32} borderRadius={8} />
            <SkeletonBox width={32} height={32} borderRadius={8} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Full Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <StatsCardsSkeleton />
      <SearchBoxSkeleton />
      <TableSkeleton rows={5} />
      
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Metric Card Skeleton (for home page)
export function MetricCardSkeleton() {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        backdropFilter: 'blur(10px)',
      }}
    >
      <SkeletonBox width={60} height={12} borderRadius={4} />
      <div style={{ marginTop: 10 }}>
        <SkeletonBox width={50} height={28} borderRadius={6} />
      </div>
    </div>
  )
}

// Button Loading State
export function ButtonSpinner({ size = 18, color = 'white' }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid rgba(255, 255, 255, 0.3)`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
        display: 'inline-block',
      }}
    />
  )
}

// Page Loading Overlay
export function PageLoading() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 20%, #2d1b4e 40%, #4a1942 50%, #2d1b4e 60%, #1a1a2e 80%, #0d0d1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
        zIndex: 9999,
      }}
    >
      <Spinner size={50} />
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>Yükleniyor...</p>
      
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}