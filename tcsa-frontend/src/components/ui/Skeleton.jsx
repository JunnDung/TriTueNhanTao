export default function Skeleton({ width = '100%', height = 16, rounded = 8, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: rounded }}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Skeleton width={40} height={40} rounded={50} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={11} />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '70%' : '100%'} height={13} />
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton width={80} height={11} />
          <Skeleton width={60} height={28} />
        </div>
        <Skeleton width={42} height={42} rounded={12} />
      </div>
      <Skeleton width={100} height={11} />
      <div style={{ marginTop: 14 }}>
        <Skeleton width="100%" height={3} />
      </div>
    </div>
  );
}
