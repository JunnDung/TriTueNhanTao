import { Eye, EyeOff, AlertTriangle, CheckCircle, MinusCircle } from "lucide-react";
import { useState } from "react";

const sentimentConfig = {
  positive: { label: "Positive", color: "#22c55e", bg: "rgba(34,197,94,0.12)", icon: CheckCircle },
  neutral: { label: "Neutral", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", icon: MinusCircle },
  negative: { label: "Negative", color: "#ef4444", bg: "rgba(239,68,68,0.12)", icon: AlertTriangle },
};

export default function CommentCard({ comment }) {
  const [revealed, setRevealed] = useState(false);
  const cfg = sentimentConfig[comment.sentiment];
  const SentIcon = cfg.icon;

  return (
    <div className={`comment-card ${comment.isToxic ? "comment-card-toxic" : ""}`}>
      <div className="comment-header">
        <div className="comment-avatar" style={{ background: comment.avatarColor }}>
          {comment.avatar}
        </div>
        <div className="comment-meta">
          <span className="comment-username">{comment.user}</span>
          <span className="comment-time">{comment.time}</span>
        </div>
        <div className="comment-badges">
          <div
            className="sentiment-tag"
            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}
          >
            <SentIcon size={11} />
            <span>{cfg.label}</span>
          </div>
          {comment.isToxic && (
            <div className="toxic-badge">
              <AlertTriangle size={11} />
              <span>Toxic</span>
            </div>
          )}
        </div>
      </div>

      <div className="comment-body">
        {comment.isToxic && !revealed ? (
          <div className="comment-hidden">
            <EyeOff size={15} />
            <span>Bình luận đã bị ẩn do vi phạm tiêu chuẩn cộng đồng</span>
            <button className="reveal-btn" onClick={() => setRevealed(true)}>
              <Eye size={13} /> Xem
            </button>
          </div>
        ) : (
          <p className="comment-text">{comment.content}</p>
        )}
      </div>

      <div className="comment-footer">
        <div className="toxic-score-row">
          <span className="score-label">Toxic Score</span>
          <div className="score-bar-wrap">
            <div
              className="score-bar-fill"
              style={{
                width: `${comment.toxicScore * 100}%`,
                background: comment.toxicScore > 0.7 ? "#ef4444" : comment.toxicScore > 0.4 ? "#f59e0b" : "#22c55e",
              }}
            />
          </div>
          <span
            className="score-num"
            style={{ color: comment.toxicScore > 0.7 ? "#ef4444" : comment.toxicScore > 0.4 ? "#f59e0b" : "#22c55e" }}
          >
            {(comment.toxicScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
