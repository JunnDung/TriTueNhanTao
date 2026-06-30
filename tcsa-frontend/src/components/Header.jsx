import { useState } from 'react';
import { Bell, Search, Zap, Settings, ChevronDown, X, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const notifications = [
  { id: 1, type: 'danger',  icon: AlertTriangle, title: 'Toxic spike detected', desc: 'Tỷ lệ toxic tăng 24% trong 10 phút', time: '2 phút trước' },
  { id: 2, type: 'success', icon: CheckCircle,   title: 'Bài đăng được duyệt', desc: 'Post #2841 đã pass kiểm duyệt', time: '5 phút trước' },
  { id: 3, type: 'warning', icon: Shield,        title: '3 comment bị flag', desc: 'Cần review thủ công trước khi xóa', time: '12 phút trước' },
  { id: 4, type: 'info',    icon: Info,          title: 'AI Model updated', desc: 'TCSA-Pro v2.4.1 đã được cập nhật', time: '1 giờ trước' },
];

const typeColors = {
  danger:  '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  info:    '#3b82f6',
};

export default function Header({ title, subtitle }) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifRead, setNotifRead] = useState([]);
  const unread = notifications.filter(n => !notifRead.includes(n.id)).length;

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="search-wrap">
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input className="search-input" placeholder="Tìm kiếm..." />
          <span className="search-kbd">⌘K</span>
        </div>

        {/* AI Status */}
        <div className="ai-status-pill">
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulseDot 2s infinite' }} />
          <Zap size={12} />
          AI Active
        </div>

        {/* Notification */}
        <div style={{ position: 'relative' }}>
          <button
            className="header-icon-btn"
            onClick={() => setShowNotif(v => !v)}
            id="notif-btn"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="notif-badge">{unread}</span>
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: 340, background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200, overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 10px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Thông báo</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {unread > 0 && (
                      <button
                        onClick={() => setNotifRead(notifications.map(n => n.id))}
                        style={{ fontSize: 11, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                    <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {notifications.map(n => {
                    const isRead = notifRead.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => setNotifRead(prev => [...prev, n.id])}
                        style={{
                          display: 'flex', gap: 12, padding: '12px 16px',
                          borderBottom: '1px solid rgba(30,45,69,0.4)',
                          background: isRead ? 'transparent' : 'rgba(59,130,246,0.04)',
                          cursor: 'pointer', transition: 'background 0.15s',
                        }}
                      >
                        <div style={{
                          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                          background: `rgba(${typeColors[n.type] === '#ef4444' ? '239,68,68' : typeColors[n.type] === '#22c55e' ? '34,197,94' : typeColors[n.type] === '#f59e0b' ? '245,158,11' : '59,130,246'},0.12)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: typeColors[n.type],
                        }}>
                          <n.icon size={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{n.title}</span>
                            {!isRead && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4 }} />}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.desc}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding: '10px 16px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                  <button style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    Xem tất cả thông báo →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <button className="header-icon-btn">
          <Settings size={18} />
        </button>

        {/* Avatar */}
        <button className="header-avatar-btn">MK</button>
      </div>
    </header>
  );
}
