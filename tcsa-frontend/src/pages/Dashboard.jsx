import { motion } from 'framer-motion';
import {
  MessageCircle, ShieldAlert, ThumbsUp, ThumbsDown, Minus,
  TrendingUp, TrendingDown, Activity, BarChart2,
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import StatCard from '../components/StatCard';
import PieChart from '../components/charts/PieChart';
import AreaChart from '../components/charts/AreaChart';
import {
  statsData, sentimentData, toxicLineData,
  topNegativeKeywords, recentActivity, recentDetections,
} from '../data/mockData';
import { formatScore } from '../utils/formatters';

const stats = [
  {
    title: 'Tổng tin nhắn',
    value: statsData.totalMessages,
    icon: MessageCircle,
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.12)',
    delta: '+2.4%', deltaType: 'up',
    bar: 100,
  },
  {
    title: 'Nội dung độc hại',
    value: statsData.toxicMessages,
    icon: ShieldAlert,
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.12)',
    delta: '+8.1%', deltaType: 'up',
    bar: (statsData.toxicMessages / statsData.totalMessages) * 100,
  },
  {
    title: 'Tích cực',
    value: statsData.positive,
    icon: ThumbsUp,
    color: '#22c55e',
    bgColor: 'rgba(34,197,94,0.12)',
    delta: '+1.2%', deltaType: 'up',
    bar: (statsData.positive / statsData.totalMessages) * 100,
  },
  {
    title: 'Tiêu cực',
    value: statsData.negative,
    icon: ThumbsDown,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    delta: '-3.5%', deltaType: 'down',
    bar: (statsData.negative / statsData.totalMessages) * 100,
  },
  {
    title: 'Trung tính',
    value: statsData.neutral,
    icon: Minus,
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.12)',
    delta: '+0.8%', deltaType: 'up',
    bar: (statsData.neutral / statsData.totalMessages) * 100,
  },
];

const trendIcon = t => {
  if (t === 'up') return <TrendingUp size={13} style={{ color: '#ef4444' }} />;
  if (t === 'down') return <TrendingDown size={13} style={{ color: '#22c55e' }} />;
  return <Minus size={13} style={{ color: '#64748b' }} />;
};

export default function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Tổng quan hệ thống kiểm duyệt nội dung AI · Thời gian thực"
    >
      <div className="page-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <StatCard key={s.title} {...s} index={i} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          <PieChart
            data={sentimentData}
            title="Phân phối Sentiment"
            badge="Hôm nay"
          />
          <AreaChart
            data={toxicLineData}
            title="Biểu đồ Toxic theo giờ"
            badge="24 giờ qua"
            series={[
              { key: 'toxic', name: 'Toxic', color: '#ef4444' },
              { key: 'clean', name: 'An toàn', color: '#22c55e' },
            ]}
          />
        </div>

        {/* Bottom Row */}
        <div className="charts-row-2">
          {/* Top Toxic Keywords */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Top 10 Từ khóa Độc hại</span>
              <span className="card-badge">Cập nhật mỗi giờ</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Từ khóa</th>
                    <th>Số lần</th>
                    <th>Xu hướng</th>
                    <th>Mức độ</th>
                  </tr>
                </thead>
                <tbody>
                  {topNegativeKeywords.map(kw => (
                    <tr key={kw.rank}>
                      <td>
                        <span className={`rank-badge rank-${kw.rank <= 3 ? kw.rank : 'rest'}`}>{kw.rank}</span>
                      </td>
                      <td>
                        <span className="keyword-chip">{kw.keyword}</span>
                      </td>
                      <td className="count-cell">{kw.count.toLocaleString('vi-VN')}</td>
                      <td>{trendIcon(kw.trend)}</td>
                      <td>
                        <div className="kw-bar-wrap">
                          <motion.div
                            className="kw-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${(kw.count / topNegativeKeywords[0].count) * 100}%` }}
                            transition={{ duration: 0.8, delay: kw.rank * 0.05 }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Hoạt động gần đây</span>
                <span className="card-badge"><Activity size={10} style={{ marginRight: 4 }} />Live</span>
              </div>
              <div className="activity-list">
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="activity-item"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="activity-dot" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                    <div className="activity-content">
                      <div className="activity-title">{item.text}</div>
                      <div className="activity-time">{item.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Detections */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Phát hiện gần nhất</span>
                <span className="card-badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}>
                  {recentDetections.length} toxic
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentDetections.map((det, i) => (
                  <motion.div
                    key={det.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px',
                      background: 'rgba(239,68,68,0.05)',
                      border: '1px solid rgba(239,68,68,0.15)',
                      borderRadius: 10,
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: det.avatarColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                      {det.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{det.user}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {det.content}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>
                        {formatScore(det.score)}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{det.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
