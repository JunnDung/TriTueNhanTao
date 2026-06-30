import { useState } from 'react';

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}h`);

function getColor(value, max) {
  const intensity = Math.min(1, value / max);
  if (intensity === 0) return 'rgba(30,45,69,0.5)';
  if (intensity < 0.2) return 'rgba(59,130,246,0.15)';
  if (intensity < 0.4) return 'rgba(59,130,246,0.3)';
  if (intensity < 0.6) return 'rgba(245,158,11,0.4)';
  if (intensity < 0.8) return 'rgba(239,68,68,0.5)';
  return 'rgba(239,68,68,0.85)';
}

export default function HeatmapChart({ data, title, badge }) {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data.flat().map(d => d.value));

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        {badge && <span className="card-badge">{badge}</span>}
      </div>

      {/* Hour labels */}
      <div style={{ display: 'grid', gridTemplateColumns: '36px repeat(24, 1fr)', gap: 3, marginBottom: 3 }}>
        <div />
        {HOURS.map(h => (
          <div key={h} style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center' }}>
            {h.replace('h', '')}
          </div>
        ))}
      </div>

      {/* Heatmap rows */}
      {data.map((row, dayIdx) => (
        <div key={dayIdx} style={{ display: 'grid', gridTemplateColumns: '36px repeat(24, 1fr)', gap: 3, marginBottom: 3 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
            {DAYS[dayIdx]}
          </div>
          {row.map((cell, hourIdx) => (
            <div
              key={hourIdx}
              style={{
                height: 22,
                borderRadius: 4,
                background: getColor(cell.value, max),
                cursor: 'default',
                transition: 'all 0.15s',
                transform: hovered?.day === dayIdx && hovered?.hour === hourIdx ? 'scale(1.15)' : 'scale(1)',
                outline: hovered?.day === dayIdx && hovered?.hour === hourIdx ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}
              onMouseEnter={() => setHovered({ day: dayIdx, hour: hourIdx, value: cell.value })}
              onMouseLeave={() => setHovered(null)}
              title={`${DAYS[dayIdx]} ${HOURS[hourIdx]}: ${cell.value} tin nhắn`}
            />
          ))}
        </div>
      ))}

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Ít</span>
        {['rgba(30,45,69,0.5)', 'rgba(59,130,246,0.25)', 'rgba(245,158,11,0.4)', 'rgba(239,68,68,0.5)', 'rgba(239,68,68,0.85)'].map((c, i) => (
          <div key={i} style={{ width: 18, height: 14, borderRadius: 3, background: c }} />
        ))}
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Nhiều</span>
      </div>

      {hovered && (
        <div style={{
          marginTop: 8, textAlign: 'center',
          fontSize: 12, color: 'var(--text-secondary)',
        }}>
          <span style={{ color: 'var(--text)', fontWeight: 700 }}>{DAYS[hovered.day]} {HOURS[hovered.hour]}</span>
          {' — '}
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)', fontWeight: 700 }}>{hovered.value}</span>
          {' tin nhắn'}
        </div>
      )}
    </div>
  );
}
