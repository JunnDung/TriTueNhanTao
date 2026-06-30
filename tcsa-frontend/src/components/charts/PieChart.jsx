import { PieChart as RechartsPie, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="chart-tooltip">
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{item.name}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: item.payload.color }}>{item.value}%</div>
      </div>
    );
  }
  return null;
};

export default function PieChart({ data, title, badge }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        {badge && <span className="card-badge">{badge}</span>}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </RechartsPie>
      </ResponsiveContainer>
      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
