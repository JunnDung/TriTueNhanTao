import {
  BarChart as RechartsBar, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: p.fill || p.color }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.name}:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function BarChart({ data, dataKey, nameKey = 'name', title, badge, colors: colorMap, colorField }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        {badge && <span className="card-badge">{badge}</span>}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RechartsBar data={data} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,69,0.8)" vertical={false} />
          <XAxis dataKey={nameKey} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={dataKey} name={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={colorField ? entry[colorField] : (colorMap ? colorMap[i % colorMap.length] : '#3b82f6')}
              />
            ))}
          </Bar>
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}
