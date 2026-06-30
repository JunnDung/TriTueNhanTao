import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio, Pause, Play, Users, ShieldAlert, ShieldCheck,
  MessageSquare, Zap, TrendingUp, Eye, BarChart2
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import { chatMessages, newChatMessages } from '../data/mockData';
import { getTimeNow } from '../utils/formatters';

function maskToxic(text, words) {
  if (!words || words.length === 0) return '*** *** ***';
  let m = text;
  words.forEach(w => {
    m = m.replace(new RegExp(w, 'gi'), '*'.repeat(w.length));
  });
  return m;
}

function ChatBubble({ msg }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`chat-msg ${msg.isToxic ? 'chat-msg-toxic' : ''}`}
    >
      <div className="chat-avatar" style={{ background: msg.avatarColor }}>
        {msg.avatar}
      </div>
      <div className="chat-body">
        <div className="chat-meta">
          <span className="chat-user">{msg.user}</span>
          <span className="chat-ts">{msg.time}</span>
          {msg.isToxic ? (
            <span className="badge badge-toxic" style={{ fontSize: 10, padding: '2px 7px' }}>
              <ShieldAlert size={9} /> Độc hại
            </span>
          ) : (
            <span className="badge badge-clean" style={{ fontSize: 10, padding: '2px 7px' }}>
              <ShieldCheck size={9} /> An toàn
            </span>
          )}
        </div>
        {msg.isToxic ? (
          <p className="chat-text-masked">{maskToxic(msg.content, msg.toxicWords)}</p>
        ) : (
          <p className="chat-text">{msg.content}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function LiveChat() {
  const [messages, setMessages] = useState(chatMessages.map(m => ({ ...m, time: m.time || getTimeNow() })));
  const [paused, setPaused] = useState(false);
  const [viewers, setViewers] = useState(1_248);
  const feedRef = useRef(null);
  const queueRef = useRef([...newChatMessages]);
  const intervalRef = useRef(null);

  // Stats
  const totalMsgs = messages.length;
  const toxicMsgs = messages.filter(m => m.isToxic).length;
  const toxicRate = totalMsgs > 0 ? (toxicMsgs / totalMsgs) * 100 : 0;

  const addMessage = useCallback(() => {
    if (queueRef.current.length === 0) {
      // Reshuffle
      queueRef.current = [...newChatMessages].map(m => ({
        ...m,
        id: Date.now() + Math.random(),
      }));
    }
    const next = queueRef.current.shift();
    setMessages(prev => [...prev.slice(-60), { ...next, time: getTimeNow() }]);
    // Random viewer count drift
    setViewers(v => Math.max(800, v + Math.floor((Math.random() - 0.4) * 20)));
  }, []);

  useEffect(() => {
    if (!paused) {
      const delay = 1800 + Math.random() * 1200;
      intervalRef.current = setInterval(addMessage, delay);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused, addMessage]);

  // Auto-scroll
  useEffect(() => {
    if (feedRef.current && !paused) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, paused]);

  return (
    <AppLayout
      title="Live Chat Moderation"
      subtitle="Kiểm duyệt chat livestream theo thời gian thực · AI tự động"
    >
      <div className="page-content" style={{ paddingBottom: 0 }}>
        <div className="live-layout">
          {/* ── Chat Stream Panel ── */}
          <div className="stream-panel">
            {/* Stream Header */}
            <div className="stream-header">
              <div className="live-pill">
                <div className="live-dot" />
                LIVE
              </div>
              <div className="stream-info">
                <div className="stream-title">Livestream: Giới thiệu sản phẩm TCSA v2.0</div>
                <div className="stream-subtitle">Platform: YouTube · {viewers.toLocaleString('vi-VN')} đang xem</div>
              </div>
              <button
                onClick={() => setPaused(p => !p)}
                className={`btn btn-sm btn-ghost ${paused ? 'btn-outline-success' : ''}`}
                style={{ gap: 6 }}
              >
                {paused ? <><Play size={14} /> Tiếp tục</> : <><Pause size={14} /> Tạm dừng</>}
              </button>
            </div>

            {/* Chat Feed */}
            <div className="chat-feed" ref={feedRef}>
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <ChatBubble key={msg.id} msg={msg} />
                ))}
              </AnimatePresence>

              {paused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center', padding: '12px',
                    fontSize: 12, color: 'var(--text-muted)',
                    background: 'rgba(245,158,11,0.06)',
                    border: '1px solid rgba(245,158,11,0.15)',
                    borderRadius: 8, margin: '8px 0',
                  }}
                >
                  <Pause size={13} style={{ display: 'inline', marginRight: 5, color: '#f59e0b' }} />
                  Feed đang tạm dừng — nhấn Tiếp tục để cập nhật
                </motion.div>
              )}
            </div>

            {/* Bottom bar */}
            <div style={{
              padding: '10px 16px', borderTop: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <MessageSquare size={13} />
                <span><strong style={{ color: 'var(--text)' }}>{totalMsgs}</strong> tin nhắn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#ef4444' }}>
                <ShieldAlert size={13} />
                <span><strong>{toxicMsgs}</strong> vi phạm</span>
              </div>
              <div style={{ flex: 1, height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'linear-gradient(90deg, #ef4444, #f59e0b)', borderRadius: 3 }}
                  animate={{ width: `${toxicRate}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#ef4444' }}>
                {toxicRate.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="live-sidebar">
            {/* Live Stats */}
            <div className="live-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <BarChart2 size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Thống kê Live</span>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', animation: 'pulseDot 1.2s infinite', marginLeft: 'auto' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Tổng tin nhắn', value: totalMsgs, color: 'var(--text)' },
                  { label: 'Tin độc hại', value: toxicMsgs, color: '#ef4444' },
                  { label: 'Tin an toàn', value: totalMsgs - toxicMsgs, color: '#22c55e' },
                  { label: 'Đang xem', value: viewers.toLocaleString('vi-VN'), color: '#3b82f6' },
                ].map(row => (
                  <div key={row.label} className="live-stat-row">
                    <span>{row.label}</span>
                    <span className="live-stat-val" style={{ color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tỷ lệ vi phạm</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>
                    {toxicRate.toFixed(1)}%
                  </span>
                </div>
                <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: 'linear-gradient(90deg, #ef4444, #f59e0b)', borderRadius: 4 }}
                    animate={{ width: `${toxicRate}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            </div>

            {/* Real-time Gauge */}
            <div className="live-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <TrendingUp size={16} style={{ color: '#22c55e' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Phân tích nhanh</span>
              </div>
              {[
                { label: 'Tích cực', pct: Math.round((1 - toxicRate / 100) * 68), color: '#22c55e' },
                { label: 'Trung tính', pct: Math.round((1 - toxicRate / 100) * 22), color: '#3b82f6' },
                { label: 'Tiêu cực', pct: Math.round(toxicRate), color: '#ef4444' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: item.color, borderRadius: 3 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="live-stat-card">
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                Chú thích
              </div>
              {[
                { color: '#22c55e', label: 'Tin nhắn an toàn — hiện bình thường', dot: 'clean' },
                { color: '#ef4444', label: 'Tin nhắn độc hại — ẩn nội dung ***', dot: 'toxic' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, marginTop: 3, flexShrink: 0 }} />
                  {item.label}
                </div>
              ))}
            </div>

            {/* AI Engine Status */}
            <div className="live-stat-card">
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
                <Zap size={12} style={{ display: 'inline', marginRight: 5 }} />
                AI Engine
              </div>
              {[
                { label: 'Model', value: 'TCSA-Pro v2.4' },
                { label: 'Latency', value: '< 50ms' },
                { label: 'Accuracy', value: '97.3%' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulseDot 1.5s infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>Online · Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
