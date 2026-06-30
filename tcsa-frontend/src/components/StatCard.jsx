import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

const deltaIcon = {
  up:     <TrendingUp  size={12} />,
  down:   <TrendingDown size={12} />,
  stable: <Minus       size={12} />,
};

export default function StatCard({ title, value, icon: Icon, color, bgColor, delta, deltaType, bar, index = 0 }) {
  const isUp   = deltaType === 'up';
  const isDown = deltaType === 'down';

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ borderColor: 'var(--border)', cursor: 'default' }}
    >
      {/* Glow blob */}
      <div className="stat-card-glow" style={{ background: color }} />
      <div className="stat-card-shimmer" />

      <div className="stat-top">
        <div>
          <div className="stat-label">{title}</div>
          <motion.div
            className="stat-value"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.07 + 0.2 }}
          >
            {formatNumber(value)}
          </motion.div>
        </div>
        <div className="stat-icon" style={{ background: bgColor }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>

      {delta && (
        <div className="stat-delta" style={{ color: isUp ? '#22c55e' : isDown ? '#ef4444' : '#64748b' }}>
          {deltaIcon[deltaType] || deltaIcon.stable}
          <span style={{ fontWeight: 700 }}>{delta}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>so với hôm qua</span>
        </div>
      )}

      {bar !== undefined && (
        <div className="stat-bar">
          <motion.div
            className="stat-bar-fill"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${bar}%` }}
            transition={{ delay: index * 0.07 + 0.3, duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      )}
    </motion.div>
  );
}
