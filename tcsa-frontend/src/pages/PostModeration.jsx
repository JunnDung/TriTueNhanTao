import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Sparkles, Send, AlertTriangle,
  ShieldAlert, ShieldCheck, Loader2, Eye, RotateCcw
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import { useGlobalToast } from '../layouts/AppLayout';
import { analyzeText, highlightToxicWords } from '../utils/toxicAnalyzer';
import { formatScore, getSentimentColor, getSentimentLabel } from '../utils/formatters';

const PLACEHOLDER = `Nhập nội dung bài đăng tại đây...

Ví dụ: Đây là sản phẩm tuyệt vời nhất tôi từng dùng! Chất lượng vượt trội, dịch vụ tận tâm, sẽ quay lại mua tiếp.`;

export default function PostModeration() {
  const [content, setContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [published, setPublished] = useState(false);
  const toast = useGlobalToast();
  const textareaRef = useRef(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast?.warning('Vui lòng nhập nội dung trước khi phân tích');
      return;
    }
    setAnalyzing(true);
    setResult(null);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1400 + Math.random() * 600));
    const res = analyzeText(content);
    setResult(res);
    setAnalyzing(false);
    if (res?.isToxic) {
      toast?.error('⚠ Phát hiện nội dung độc hại!', { title: 'AI Alert' });
    } else {
      toast?.success('Nội dung an toàn — sẵn sàng đăng', { title: 'Phân tích hoàn tất' });
    }
  };

  const handlePublish = async () => {
    if (!result || result.isToxic) return;
    setPublished(true);
    toast?.success('Bài đăng đã được xuất bản thành công!', { title: 'Đã đăng' });
    setTimeout(() => {
      setContent('');
      setResult(null);
      setPublished(false);
    }, 2000);
  };

  const handleReset = () => {
    setContent('');
    setResult(null);
    setPublished(false);
  };

  const segments = result ? highlightToxicWords(content, result.foundToxicWords) : [];

  return (
    <AppLayout title="Post Moderation" subtitle="Kiểm duyệt bài đăng bằng AI trước khi xuất bản">
      <div className="page-content">
        <div className="post-layout">
          {/* Editor Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Toxic Alert */}
            <AnimatePresence>
              {result?.isToxic && (
                <motion.div
                  className="toxic-alert-banner"
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <AlertTriangle size={22} className="alert-icon" />
                  <div className="alert-content">
                    <div className="alert-title">⚠ Phát hiện nội dung vi phạm!</div>
                    <div className="alert-desc">
                      AI đã phát hiện {result.foundToxicWords.length} từ khóa độc hại. Nội dung này không thể xuất bản. Vui lòng chỉnh sửa trước khi đăng.
                    </div>
                    <div className="alert-chips">
                      {result.foundToxicWords.map(w => (
                        <span key={w} className="alert-chip">{w}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Editor Card */}
            <div className="editor-card">
              <div className="editor-topbar">
                <div className="editor-label">
                  <FileText size={15} />
                  Soạn thảo bài đăng
                </div>
                <div className="editor-meta">
                  <span className="char-count">{content.length} / 2000 ký tự</span>
                  {content && (
                    <button onClick={handleReset} className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }}>
                      <RotateCcw size={13} /> Xóa
                    </button>
                  )}
                </div>
              </div>

              <textarea
                ref={textareaRef}
                className="post-editor"
                value={content}
                onChange={e => {
                  setContent(e.target.value.slice(0, 2000));
                  if (result) setResult(null);
                }}
                placeholder={PLACEHOLDER}
                rows={10}
                style={{ minHeight: 260 }}
              />

              {/* Highlight Preview */}
              <AnimatePresence>
                {result && content && (
                  <motion.div
                    className="preview-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="preview-label">
                      <Eye size={11} style={{ display: 'inline', marginRight: 4 }} />
                      Xem trước với highlight
                    </div>
                    <div className="preview-content">
                      {segments.map((seg, i) =>
                        seg.toxic
                          ? <mark key={i} className="toxic-highlight">{seg.text}</mark>
                          : <span key={i}>{seg.text}</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="editor-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {result
                      ? <span style={{ color: result.isToxic ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
                          {result.isToxic ? '⚠ Không an toàn' : '✓ An toàn'}
                        </span>
                      : 'Chưa phân tích'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="btn btn-ghost btn-md"
                    onClick={handleAnalyze}
                    disabled={analyzing || !content.trim()}
                  >
                    {analyzing
                      ? <><Loader2 size={15} className="animate-spin" /> Đang phân tích...</>
                      : <><Sparkles size={15} /> AI Phân tích</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="results-panel">
            <div className="results-panel-title">
              <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              Kết quả AI
            </div>

            {!result && !analyzing && (
              <div className="results-empty">
                <div className="results-empty-icon">🤖</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Chờ phân tích</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                  Nhập nội dung và nhấn <strong style={{ color: 'var(--primary)' }}>AI Phân tích</strong> để xem kết quả
                </div>
              </div>
            )}

            {analyzing && (
              <div className="results-empty">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={36} style={{ color: 'var(--primary)' }} />
                </motion.div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>Đang phân tích...</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>AI đang xử lý nội dung</div>
                {/* Fake progress bar */}
                <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
                  <motion.div
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--purple))', borderRadius: 2 }}
                    initial={{ width: '0%' }}
                    animate={{ width: '90%' }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence>
              {result && !analyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
                >
                  {/* Toxic Score */}
                  <div className="result-section">
                    <div className="result-section-label">Điểm độc hại</div>
                    <div className="confidence-row">
                      <div
                        className="confidence-circle"
                        style={{
                          background: result.isToxic
                            ? 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))'
                            : 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
                          border: `2px solid ${result.isToxic ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
                        }}
                      >
                        <div className="confidence-pct" style={{ color: result.isToxic ? '#ef4444' : '#22c55e' }}>
                          {Math.round(result.toxicScore * 100)}
                        </div>
                        <div className="confidence-text">%</div>
                      </div>
                      <div className="confidence-bar-wrap" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          {result.isToxic
                            ? <ShieldAlert size={16} style={{ color: '#ef4444' }} />
                            : <ShieldCheck size={16} style={{ color: '#22c55e' }} />}
                          <span style={{ fontSize: 14, fontWeight: 700, color: result.isToxic ? '#ef4444' : '#22c55e' }}>
                            {result.isToxic ? 'Nội dung vi phạm' : 'Nội dung an toàn'}
                          </span>
                        </div>
                        <div className="confidence-bar">
                          <motion.div
                            className="confidence-bar-fill"
                            style={{ background: result.isToxic ? 'linear-gradient(90deg, #ef4444, #f59e0b)' : '#22c55e' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${result.toxicScore * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="result-section">
                    <div className="result-section-label">Độ chính xác</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <motion.div
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--purple))', borderRadius: 4 }}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', minWidth: 44 }}>
                        {formatScore(result.confidence)}
                      </span>
                    </div>
                  </div>

                  {/* Sentiment */}
                  <div className="result-section">
                    <div className="result-section-label">Cảm xúc</div>
                    <span
                      className={`badge badge-${result.sentiment}`}
                      style={{ fontSize: 14, padding: '8px 18px', borderRadius: 10 }}
                    >
                      {getSentimentLabel(result.sentiment)}
                    </span>
                  </div>

                  {/* Toxic Words */}
                  {result.foundToxicWords.length > 0 && (
                    <div className="result-section">
                      <div className="result-section-label">Từ khóa vi phạm ({result.foundToxicWords.length})</div>
                      <div className="toxic-words-chips">
                        {result.foundToxicWords.map(w => (
                          <span key={w} className="toxic-word-chip">{w}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="divider" />

                  {/* Publish Button */}
                  <button
                    className={`publish-btn ${result.isToxic ? 'btn-outline-danger' : 'btn-success'}`}
                    onClick={handlePublish}
                    disabled={result.isToxic || published}
                    style={{
                      width: '100%', padding: '13px',
                      borderRadius: 'var(--radius)', border: result.isToxic ? '1px solid rgba(239,68,68,0.3)' : 'none',
                      background: result.isToxic ? 'rgba(239,68,68,0.08)' : '#22c55e',
                      color: result.isToxic ? '#ef4444' : 'white',
                      fontSize: 14, fontWeight: 700, cursor: result.isToxic ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontFamily: 'inherit', transition: 'all 0.2s',
                    }}
                  >
                    {result.isToxic
                      ? <><AlertTriangle size={16} /> Không thể xuất bản</>
                      : published
                        ? <><ShieldCheck size={16} /> Đã xuất bản!</>
                        : <><Send size={16} /> Xuất bản bài đăng</>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
