'use client'

export function Spinner({ size = 40, color = '#667eea' }) {
  return (
    <div style={{
      width: size, height: size, border: `3px solid rgba(102, 126, 234, 0.1)`,
      borderTop: `3px solid ${color}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite',
    }} />
  )
}

export function SkeletonBox({ width = '100%', height = 20, borderRadius = 8 }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.1) 25%, rgba(118, 75, 162, 0.15) 50%, rgba(102, 126, 234, 0.1) 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite',
    }} />
  )
}

export function DashboardSkeleton() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: '#16161f', borderRadius: 16, padding: 20 }}>
            <SkeletonBox width={80} height={14} borderRadius={4} />
            <div style={{ marginTop: 12 }}><SkeletonBox width={60} height={32} borderRadius={6} /></div>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export function PageLoading() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, zIndex: 9999,
    }}>
      <Spinner size={50} />
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>Yükleniyor...</p>
      <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}