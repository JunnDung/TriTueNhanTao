import { motion } from 'framer-motion';
import {
  BarChart2, TrendingUp, PieChart as PieIcon, Calendar,
  ShieldAlert, ShieldCheck, Users, FileText, Flame
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import HeatmapChart from '../components/charts/HeatmapChart';
import {
  sentimentData, weeklyData, analyticsHeatmap,
  categoryData, recentLogs, topActiveUsers, topNegativeKeywords,
} from '../data/mockData';

const topWords = [
  { word: 'ghét', size: 28, count: 1842 },
  { word: 'ngu', size: 26, count: 1537 },
  { word: 'xấu xa', size: 22, count: 1204 },
  { word: 'lừa đảo', size: 20, count: 983 },
  { word: 'tệ', size: 19, count: 876 },
  { word: 'vô dụng', size: 18, count: 692 },
  { word: 'kinh khủng', size: 17, count: 445 },
  { word: 'phản bội', size: 16, count: 983 },
  { word: 'thất vọng', size: 15, count: 578 },
  { word: 'chán', size: 14, count: 631 },
  { word: 'tức giận', size: 13, count: 410 },
  { word: 'khinh', size: 12, count: 312 },
];

const wordColors = ['#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#8b5cf6'];

const statusStyle = {
  blocked: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'Đã chặn' },
  flagged: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Đã đánh dấu' },
  approved: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', label: 'Đã duyệt' },
  warned: { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', label: 'Cảnh báo' },
};

const userStatusStyle = {
  banned:  { color: '#ef4444', label: 'Bị cấm' },
  flagged: { color: '#f59e0b', label: 'Theo dõi' },
  warned:  { color: '#8b5cf6', label: 'Cảnh báo' },
};

export default function Analytics() {
  return (
    <AppLayout
      title="Analytics"
      subtitle="Phân tích chuyên sâu · Dữ liệu 7 ngày gần nhất"
    >
      <div className="page-content">

        {/* Summary Mini Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Tổng phân tích', value: '48,320', icon: FileText, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
            { label: 'Vi phạm phát hiện', value: '3,847', icon: ShieldAlert, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
            { label: 'Người dùng bị cấm', value: '142', icon: Users, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
            { label: 'Độ chính xác AI', value: '97.3%', icon: Flame, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Row 1: Pie + Line */}
        <div className="charts-row">
          <PieChart
            data={sentimentData}
            title="Phân phối Sentiment"
            badge="7 ngày"
          />
          <LineChart
            data={weeklyData}
            title="Xu hướng 7 ngày"
            badge="Tuần này"
            xKey="day"
            series={[
              { key: 'toxic',    name: 'Độc hại',   color: '#ef4444' },
              { key: 'clean',    name: 'An toàn',   color: '#22c55e' },
              { key: 'positive', name: 'Tích cực',  color: '#3b82f6' },
            ]}
          />
        </div>

        {/* Row 2: Bar + Heatmap */}
        <div className="charts-row-2">
          <BarChart
            data={categoryData}
            dataKey="count"
            nameKey="name"
            title="Vi phạm theo Danh mục"
            badge="Top 6"
            colorField="color"
          />
          <HeatmapChart
            data={analyticsHeatmap}
            title="Bản đồ hoạt động (Giờ × Ngày)"
            badge="7 ngày"
          />
        </div>

        {/* Row 3: Top Words + Logs + Top Users */}
        <div className="charts-row-3">
          {/* Word Cloud */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Top Từ khóa Độc hại</span>
              <span className="card-badge">Word Cloud</span>
            </div>
            <div className="word-cloud">
              {topWords.map((w, i) => (
                <motion.span
                  key={w.word}
                  className="word-tag"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 20 }}
                  whileHover={{ scale: 1.1 }}
                  style={{
                    fontSize: w.size,
                    background: `${wordColors[i]}18`,
                    color: wordColors[i],
                    border: `1px solid ${wordColors[i]}30`,
                  }}
                  title={`${w.word}: ${w.count.toLocaleString('vi-VN')} lần`}
                >
                  {w.word}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Recent Logs */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Nhật ký gần đây</span>
              <span className="card-badge">Real-time</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              {recentLogs.map((log, i) => {
                const st = statusStyle[log.status] || statusStyle.flagged;
                return (
                  <motion.div
                    key={log.id}
                    className="log-row"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <span className="log-time">{log.time}</span>
                    <span className="log-user">{log.user}</span>
                    <span className="log-content" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.content}
                    </span>
                    <span
                      className="log-score"
                      style={{ color: log.score > 0.7 ? '#ef4444' : log.score > 0.4 ? '#f59e0b' : '#22c55e' }}
                    >
                      {Math.round(log.score * 100)}%
                    </span>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                        background: st.bg, color: st.color, whiteSpace: 'nowrap',
                      }}
                    >
                      {st.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Top Active Users */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Người dùng Vi phạm Nhiều</span>
              <span className="card-badge">Top 5</span>
            </div>
            <div>
              {topActiveUsers.map((u, i) => {
                const us = userStatusStyle[u.status] || userStatusStyle.warned;
                return (
                  <motion.div
                    key={u.rank}
                    className="top-user-row"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <span className="top-user-rank">#{u.rank}</span>
                    <div className="top-user-avatar" style={{ background: u.avatarColor }}>{u.avatar}</div>
                    <div className="top-user-info">
                      <div className="top-user-name">{u.name}</div>
                      <div className="top-user-meta">
                        <span style={{ color: us.color, fontWeight: 600, fontSize: 11 }}>{us.label}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="top-user-count" style={{ color: '#ef4444' }}>{u.violations}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>vi phạm</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sentiment breakdown */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tỷ lệ Sentiment tổng
              </div>
              {sentimentData.map(s => (
                <div key={s.name} style={{ marginBottom: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                    <span style={{ fontWeight: 700, color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.value}%</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: s.color, borderRadius: 3 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
