import { AlertTriangle, CheckCircle } from "lucide-react";

function maskToxicWords(content, toxicWordsList) {
  if (!toxicWordsList || toxicWordsList.length === 0) return content;
  let result = content;
  toxicWordsList.forEach((word) => {
    const stars = "*".repeat(word.length);
    result = result.replace(new RegExp(word, "gi"), stars);
  });
  return result;
}

export default function ChatMessage({ message }) {
  const displayContent = message.isToxic
    ? maskToxicWords(message.content, message.toxicWords)
    : message.content;

  return (
    <div className={`chat-msg ${message.isToxic ? "chat-msg-toxic" : ""}`}>
      <div className="chat-avatar" style={{ background: message.avatarColor }}>
        {message.avatar}
      </div>
      <div className="chat-body">
        <div className="chat-meta">
          <span className="chat-username">{message.user}</span>
          {message.time && <span className="chat-time">{message.time}</span>}
          <div
            className={`chat-badge ${message.isToxic ? "chat-badge-toxic" : "chat-badge-clean"}`}
          >
            {message.isToxic ? (
              <>
                <AlertTriangle size={10} /> Toxic
              </>
            ) : (
              <>
                <CheckCircle size={10} /> Clean
              </>
            )}
          </div>
        </div>
        <p className={`chat-content ${message.isToxic ? "chat-content-toxic" : ""}`}>
          {displayContent}
        </p>
      </div>
    </div>
  );
}
