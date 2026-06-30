import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import ChatMessage from "../components/ChatMessage";
import { chatMessages, newChatMessages } from "../data/mockData";
import { Radio, Users, AlertTriangle, CheckCircle, Pause, Play } from "lucide-react";

export default function LiveChatModeration() {
  const [messages, setMessages] = useState(chatMessages.map((m) => ({
    ...m,
    time: m.time || new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  })));
  const [isPaused, setIsPaused] = useState(false);
  const [newMsgQueue, setNewMsgQueue] = useState([...newChatMessages]);
  const [toxicCount, setToxicCount] = useState(chatMessages.filter(m => m.isToxic).length);
  const [cleanCount, setCleanCount] = useState(chatMessages.filter(m => !m.isToxic).length);
  const chatEndRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setNewMsgQueue((queue) => {
        if (queue.length === 0) return queue;
        const [next, ...rest] = queue;
        const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const msgWithTime = { ...next, time: now };
        setMessages((prev) => [...prev.slice(-40), msgWithTime]);
        if (msgWithTime.isToxic) setToxicCount((n) => n + 1);
        else setCleanCount((n) => n + 1);
        return rest.length === 0 ? [...newChatMessages] : rest;
      });
    }, 2500);
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  const total = toxicCount + cleanCount;
  const toxicPercent = total > 0 ? ((toxicCount / total) * 100).toFixed(1) : 0;

  return (
    <div className="page">
      <Header
        title="Live Chat Moderation"
        subtitle="Kiểm duyệt tin nhắn livestream theo thời gian thực"
      />
      <div className="page-content">
        <div className="live-layout">
          {/* Stream Panel */}
          <div className="stream-panel">
            <div className="stream-header">
              <div className="live-indicator">
                <span className="live-dot"></span>
                <span>LIVE</span>
              </div>
              <div className="stream-title">
                <Radio size={14} />
                Livestream AI Moderation Demo
              </div>
              <button
                className={`pause-btn ${isPaused ? "pause-btn-active" : ""}`}
                onClick={() => setIsPaused((p) => !p)}
              >
                {isPaused ? <><Play size={13} /> Resume</> : <><Pause size={13} /> Pause</>}
              </button>
            </div>

            {/* Chat Feed */}
            <div className="chat-feed">
              {messages.map((msg) => (
                <ChatMessage key={`${msg.id}-${msg.time}`} message={msg} />
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="live-sidebar">
            <div className="live-stat-card">
              <div className="live-stat-header">
                <Users size={16} style={{ color: "#3b82f6" }} />
                <span>Thống kê phiên</span>
              </div>
              <div className="live-stats">
                <div className="live-stat-row">
                  <span>Tổng tin nhắn</span>
                  <span className="live-stat-num">{total}</span>
                </div>
                <div className="live-stat-row">
                  <span style={{ color: "#22c55e" }}>Clean</span>
                  <span className="live-stat-num" style={{ color: "#22c55e" }}>{cleanCount}</span>
                </div>
                <div className="live-stat-row">
                  <span style={{ color: "#ef4444" }}>Toxic</span>
                  <span className="live-stat-num" style={{ color: "#ef4444" }}>{toxicCount}</span>
                </div>
              </div>

              {/* Toxic bar */}
              <div className="toxic-rate-wrap">
                <div className="toxic-rate-label">
                  <AlertTriangle size={12} style={{ color: "#ef4444" }} />
                  <span>Tỷ lệ vi phạm</span>
                  <span style={{ color: "#ef4444", marginLeft: "auto" }}>{toxicPercent}%</span>
                </div>
                <div className="toxic-rate-bar">
                  <div className="toxic-rate-fill" style={{ width: `${toxicPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="legend-card">
              <div className="legend-title">Chú thích</div>
              <div className="legend-item">
                <CheckCircle size={14} style={{ color: "#22c55e" }} />
                <span>Clean – Tin nhắn an toàn</span>
              </div>
              <div className="legend-item">
                <AlertTriangle size={14} style={{ color: "#ef4444" }} />
                <span>Toxic – Từ vi phạm đã được che</span>
              </div>
            </div>

            {/* Status */}
            <div className="ai-engine-card">
              <div className="engine-title">AI Engine</div>
              <div className="engine-row">
                <span>Model</span>
                <span className="engine-val">TCSA v2.4</span>
              </div>
              <div className="engine-row">
                <span>Latency</span>
                <span className="engine-val" style={{ color: "#22c55e" }}>~12ms</span>
              </div>
              <div className="engine-row">
                <span>Accuracy</span>
                <span className="engine-val" style={{ color: "#3b82f6" }}>97.3%</span>
              </div>
              <div className="engine-row">
                <span>Status</span>
                <span className="engine-status">
                  <span className="status-pulse"></span> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
