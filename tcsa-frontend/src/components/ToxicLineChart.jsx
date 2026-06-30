import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value" style={{ color: "#ef4444" }}>
          {payload[0].value} toxic comments
        </p>
      </div>
    );
  }
  return null;
};

export default function ToxicLineChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.toxic));
  const maxEntry = data.find((d) => d.toxic === maxVal);

  return (
    <div className="chart-card chart-card-wide">
      <div className="chart-card-header">
        <h3 className="chart-title">Toxic Comments theo thời gian</h3>
        <div className="chart-legend">
          <span className="legend-dot" style={{ background: "#ef4444" }}></span>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>Toxic Count</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="toxicGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          {maxEntry && (
            <ReferenceLine x={maxEntry.time} stroke="#ef4444" strokeDasharray="4 4" opacity={0.5} />
          )}
          <Area
            type="monotone"
            dataKey="toxic"
            stroke="#ef4444"
            strokeWidth={2.5}
            fill="url(#toxicGradient)"
            dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
