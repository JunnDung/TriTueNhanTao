import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, MessageSquare,
  Radio, BarChart2, Zap, Settings, HelpCircle, ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/',                  label: 'Dashboard',           icon: LayoutDashboard, badge: null },
  { path: '/post-moderation',   label: 'Post Moderation',     icon: FileText,        badge: null },
  { path: '/comment-moderation',label: 'Comment Moderation',  icon: MessageSquare,   badge: '12' },
  { path: '/live-chat',         label: 'Live Chat',           icon: Radio,           badge: 'LIVE' },
  { path: '/analytics',         label: 'Analytics',           icon: BarChart2,       badge: null },
];

const bottomItems = [
  { path: '/settings', label: 'Cài đặt', icon: Settings },
  { path: '/help',     label: 'Trợ giúp', icon: HelpCircle },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <Zap size={20} />
        </div>
        <div className="logo-text">
          <span className="logo-name">TCSA</span>
          <span className="logo-tagline">AI Moderation</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-body">
        <div className="nav-section-label">Điều hướng</div>

        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bar"
                  className="nav-active-bar"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <item.icon size={17} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span
                  className="nav-badge"
                  style={item.badge === 'LIVE' ? {
                    background: 'rgba(239,68,68,0.2)',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.3)',
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                  } : {}}
                >
                  {item.badge}
                </span>
              )}
              {!item.badge && (
                <ChevronRight
                  size={13}
                  style={{
                    color: 'var(--text-muted)',
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.2s',
                  }}
                />
              )}
            </NavLink>
          );
        })}

        <div className="divider" style={{ margin: '12px 0 8px' }} />
        <div className="nav-section-label">Hệ thống</div>

        {bottomItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
          >
            <item.icon size={17} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="system-status-card">
          <div className="status-pulse-dot" />
          <div className="status-info">
            <span className="status-label">AI Engine Active</span>
            <span className="status-sub">v2.4.1 · Model: TCSA-Pro</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">MK</div>
          <div className="user-info">
            <span className="user-name">Minh Khang</span>
            <span className="user-role">Administrator</span>
          </div>
          <Settings size={14} style={{ color: 'var(--text-muted)' }} />
        </div>

        <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right', paddingRight: 4 }}>
          TCSA v1.0.0
        </div>
      </div>
    </aside>
  );
}
