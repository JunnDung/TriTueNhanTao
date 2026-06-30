import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Trash2, CheckCircle, EyeOff, Eye,
  RefreshCw, MessageSquare, ShieldAlert, ShieldCheck,
  ChevronDown, SlidersHorizontal
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import { useGlobalToast } from '../layouts/AppLayout';
import { commentsData } from '../data/mockData';
import { formatScore, getSentimentLabel } from '../utils/formatters';

const FILTERS = [
  { key: 'all',      label: 'Tất cả' },
  { key: 'toxic',    label: 'Độc hại' },
  { key: 'clean',    label: 'An toàn' },
  { key: 'positive', label: 'Tích cực' },
  { key: 'negative', label: 'Tiêu cực' },
  { key: 'neutral',  label: 'Trung tính' },
];

const sentimentStyle = {
  positive: { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e', border: 'rgba(34,197,94,0.25)' },
  negative: { bg: 'rgba(239,68,68,0.1)',  color: '#ef4444', border: 'rgba(239,68,68,0.25)' },
  neutral:  { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
};

function CommentCard({ comment, onDelete, onApprove, onToggleHide }) {
  const [revealed, setRevealed] = useState(false);
  const s = sentimentStyle[comment.sentiment] || sentimentStyle.neutral;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -8 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={`comment-card ${comment.isToxic ? 'comment-card-toxic' : ''}`}
    >
      {/* Header */}
      <div className="comment-header">
        <div
          className="comment-avatar"
          style={{ background: comment.avatarColor }}
        >
          {comment.avatar}
        </div>
        <div className="comment-info">
          <div className="comment-username">{comment.user}</div>
          <div className="comment-time">{comment.time} · {comment.platform}</div>
        </div>
        <div className="comment-badges">
          {/* Sentiment Badge */}
          <span
            className="badge"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 11 }}
          >
            {getSentimentLabel(comment.sentiment)}
          </span>
          {/* Toxic Badge */}
          {comment.isToxic && (
            <span className="badge badge-toxic">
              <ShieldAlert size={10} /> Độc hại
            </span>
          )}
          {!comment.isToxic && (
            <span className="badge badge-clean">
              <ShieldCheck size={10} /> An toàn
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="comment-body">
        {comment.isToxic && !revealed ? (
          <div className="comment-hidden-overlay">
            <ShieldAlert size={15} />
            <span style={{ flex: 1 }}>Nội dung bị ẩn do vi phạm chính sách</span>
            <button
              onClick={() => setRevealed(true)}
              className="btn btn-sm"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '3px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
            >
              <Eye size={12} /> Hiển thị
            </button>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <p className="comment-text">{comment.content}</p>
            {comment.isToxic && revealed && (
              <button
                onClick={() => setRevealed(false)}
                style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}
              >
                <EyeOff size={11} /> Ẩn lại
              </button>
            )}
          </div>
        )}
      </div>

      {/* Score Bar */}
      <div className="score-row">
        <span className="score-label">Toxic Score</span>
        <div className="score-bar">
          <motion.div
            className="score-bar-fill"
            style={{
              background: comment.toxicScore > 0.7
                ? 'linear-gradient(90deg, #ef4444, #f59e0b)'
                : comment.toxicScore > 0.4
                  ? '#f59e0b'
                  : '#22c55e'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${comment.toxicScore * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span
          className="score-pct"
          style={{ color: comment.toxicScore > 0.5 ? '#ef4444' : '#22c55e' }}
        >
          {formatScore(comment.toxicScore)}
        </span>
      </div>

      {/* Actions */}
      <div className="comment-actions">
        <button
          onClick={() => onApprove(comment.id)}
          className="btn btn-sm btn-outline-success"
          style={{ flex: 1 }}
        >
          <CheckCircle size={13} /> Duyệt
        </button>
        <button
          onClick={() => onToggleHide(comment.id)}
          className="btn btn-sm btn-ghost"
          style={{ flex: 1 }}
        >
          <EyeOff size={13} /> Ẩn
        </button>
        <button
          onClick={() => onDelete(comment.id)}
          className="btn btn-sm btn-outline-danger"
          style={{ flex: 1 }}
        >
          <Trash2 size={13} /> Xóa
        </button>
      </div>
    </motion.div>
  );
}

export default function CommentModeration() {
  const [comments, setComments] = useState(commentsData);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const toast = useGlobalToast();

  const filtered = useMemo(() => {
    return comments.filter(c => {
      const matchFilter =
        filter === 'all'     ? true :
        filter === 'toxic'   ? c.isToxic :
        filter === 'clean'   ? !c.isToxic :
        c.sentiment === filter;
      const matchSearch = search
        ? c.content.toLowerCase().includes(search.toLowerCase()) ||
          c.user.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchFilter && matchSearch;
    });
  }, [comments, filter, search]);

  const toxicCount = comments.filter(c => c.isToxic).length;

  const handleDelete = id => {
    setComments(prev => prev.filter(c => c.id !== id));
    toast?.success('Đã xóa bình luận vi phạm');
  };

  const handleApprove = id => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, isToxic: false, toxicScore: 0.02 } : c));
    toast?.success('Đã duyệt bình luận');
  };

  const handleToggleHide = id => {
    toast?.info('Đã ẩn bình luận');
  };

  const handleRefresh = () => {
    setComments(commentsData);
    toast?.info('Đã tải lại danh sách bình luận');
  };

  return (
    <AppLayout
      title="Comment Moderation"
      subtitle="Quản lý và kiểm duyệt bình luận theo thời gian thực"
    >
      <div className="page-content">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="filter-chips">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`chip ${filter === f.key ? 'chip-active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                {f.key === 'toxic' && (
                  <span style={{ marginLeft: 4, background: 'rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 20, padding: '0 5px', fontSize: 10, fontWeight: 700 }}>
                    {toxicCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="search-field">
            <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              placeholder="Tìm kiếm bình luận, người dùng..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button onClick={handleRefresh} className="icon-btn" title="Tải lại">
            <RefreshCw size={16} />
          </button>
          <button className="icon-btn" title="Lọc nâng cao">
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Stats Summary */}
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', padding: '0 2px' }}>
          <span>
            Hiển thị <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> / {comments.length} bình luận
          </span>
          <span style={{ color: 'var(--danger)', fontWeight: 600 }}>
            <ShieldAlert size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            {toxicCount} vi phạm
          </span>
          <span style={{ color: 'var(--success)', fontWeight: 600 }}>
            <ShieldCheck size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            {comments.length - toxicCount} an toàn
          </span>
        </div>

        {/* Comments Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={48} style={{ opacity: 0.3 }} />
            <div className="empty-state-title">Không tìm thấy bình luận</div>
            <div className="empty-state-desc">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
          </div>
        ) : (
          <motion.div className="comments-grid" layout>
            <AnimatePresence mode="popLayout">
              {filtered.map(comment => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDelete}
                  onApprove={handleApprove}
                  onToggleHide={handleToggleHide}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
