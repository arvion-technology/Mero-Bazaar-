"use client";

const ACCENT = "#3b82f6";
const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const DANGER = "#ef4444";

const messages = [
  { initials: "RS", name: "Ramesh Store", msg: "Hello, is the product still available?", time: "10:30 AM", color: ACCENT, unread: true },
  { initials: "PS", name: "Prakash Suppliers", msg: "When will my order be shipped?", time: "09:15 AM", color: DANGER, unread: true },
  { initials: "SK", name: "Sneha Kadka", msg: "Thank you for the fast delivery!", time: "Yesterday", color: SUCCESS, unread: false },
  { initials: "AK", name: "Amit Khadka", msg: "Can you provide a discount?", time: "Yesterday", color: WARNING, unread: false },
];

export default function SellerClientsPage() {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Clients</h3>
      </div>
      <div className="dash-msg-list">
        {messages.map((msg) => (
          <div key={msg.name} className="dash-msg-item">
            <div className="dash-msg-avatar" style={{ background: msg.color }}>
              {msg.initials}
              {msg.unread && <span className="dash-msg-unread" />}
            </div>
            <div className="dash-msg-content">
              <div className="dash-msg-name">
                {msg.name}
                {msg.unread && (
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: DANGER, display: "inline-block", flexShrink: 0 }} />
                )}
              </div>
              <div className="dash-msg-text">{msg.msg}</div>
            </div>
            <div className="dash-msg-time">{msg.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}