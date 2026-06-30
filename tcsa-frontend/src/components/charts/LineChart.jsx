import {
  LineChart as RechartsLine, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.name}:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function LineChart({ data, title, badge, series, xKey = 'day' }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {series.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
              {s.name}
            </div>
          ))}
          {badge && <span className="card-badge">{badge}</span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RechartsLine data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,69,0.8)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
          <Tooltip content={<CustomTooltip />} />
          {series.map(s => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: s.color, stroke: 'var(--card)', strokeWidth: 2 }}
            />
          ))}
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  );
}
