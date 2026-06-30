// ============================================================
// Formatters Utility
// ============================================================

export function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString('vi-VN');
}

export function formatPercent(val, decimals = 1) {
  return `${(val * 100).toFixed(decimals)}%`;
}

export function formatScore(val) {
  return `${Math.round(val * 100)}%`;
}

export function getTimeNow() {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function getSentimentColor(sentiment) {
  switch (sentiment) {
    case 'positive': return '#22c55e';
    case 'negative': return '#ef4444';
    case 'neutral':  return '#3b82f6';
    default:         return '#94a3b8';
  }
}

export function getSentimentLabel(sentiment) {
  switch (sentiment) {
    case 'positive': return 'Tích cực';
    case 'negative': return 'Tiêu cực';
    case 'neutral':  return 'Trung tính';
    default:         return sentiment;
  }
}

export function getToxicColor(score) {
  if (score >= 0.7) return '#ef4444';
  if (score >= 0.4) return '#f59e0b';
  return '#22c55e';
}

export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}
