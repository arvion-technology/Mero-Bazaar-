"use client";

import { useEffect, useState } from "react";
import { adaptLeadToClientMessage, ClientMessage,  LeadWithRelations  } from "@/lib/leads";

export default function SellerClientsPage() {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLeads() {
      try {
        const res = await fetch("/api/leads/mine");
        if (!res.ok) throw new Error("Failed to load clients");
        const data: LeadWithRelations[] = await res.json();
        if (!cancelled) setMessages(data.map(adaptLeadToClientMessage));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLeads();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleOpen(id: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
    try {
      await fetch(`/api/leads/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "VIEWED" }),
      });
    } catch {
      // non-critical; unread flag resyncs on next fetch
    }
  }

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Clients</h3>
      </div>

      {loading && <div className="dash-msg-empty">Loading clients...</div>}
      {!loading && error && <div className="dash-msg-empty">{error}</div>}
      {!loading && !error && messages.length === 0 && (
        <div className="dash-msg-empty">No client messages yet.</div>
      )}

      {!loading && !error && messages.length > 0 && (
        <div className="dash-msg-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="dash-msg-item"
              onClick={() => handleOpen(msg.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="dash-msg-avatar" style={{ background: msg.color }}>
                {msg.initials}
                {msg.unread && <span className="dash-msg-unread" />}
              </div>
              <div className="dash-msg-content">
                <div className="dash-msg-name">
                  {msg.name}
                  {msg.unread && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#ef4444",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
                <div className="dash-msg-text">{msg.msg}</div>
              </div>
              <div className="dash-msg-time">{msg.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}