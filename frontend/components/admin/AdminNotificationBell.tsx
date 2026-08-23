"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiBell } from "react-icons/fi";

const SITE_PRIMARY = "#C0392B";

type NotificationItem = {
  id: string;
  category: string;
  type: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminNotificationBell({
  bg = "#f8f5f5",
}: {
  bg?: string;
}) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [fetchedList, setFetchedList] = useState(false);

  const headers = session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
    : null;

  // fetch unread count once session is ready
  useEffect(() => {
    if (!headers) return;
    fetch("/api/user/notifications/unread-count", { headers })
      .then((r) => (r.ok ? r.json() : { count: 0 }))
      .then((d: { count: number }) => setUnreadCount(d?.count ?? 0))
      .catch(() => setUnreadCount(0));
  }, [session?.accessToken]);

  function toggleOpen() {
    setOpen((v) => !v);
    if (!fetchedList && headers) {
      fetch("/api/user/notifications", { headers })
        .then((r) => (r.ok ? r.json() : []))
        .then((data: NotificationItem[]) => {
          setNotifications((data ?? []).slice(0, 8));
          setFetchedList(true);
        })
        .catch(() => {});
    }
  }

  function markAllRead() {
    if (!headers) return;
    fetch("/api/user/notifications/mark-all-read", { method: "POST", headers })
      .then(() => {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      })
      .catch(() => {});
  }

  function markOneRead(id: string) {
    if (!headers) return;
    fetch(`/api/user/notifications/${id}/mark-read`, { method: "POST", headers })
      .then(() => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        setUnreadCount((c) => Math.max(0, (c ?? 1) - 1));
      })
      .catch(() => {});
  }

  return (
    <>
      <style>{`
        .notif-icon-btn { width: 40px; height: 40px; border-radius: 50%; background: transparent; border: none; display: flex; align-items: center; justify-content: center; color: #333; cursor: pointer; transition: all 0.2s; position: relative; }
        .notif-icon-btn:hover { background: #eee; }
        .notif-badge { position: absolute; top: 2px; right: 2px; min-width: 16px; height: 16px; padding: 0 3px; background: ${SITE_PRIMARY}; color: #fff; font-size: 9px; font-weight: 700; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 2px solid ${bg}; }
        .notif-wrap { position: relative; }
        .notif-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); width: 320px; max-width: 90vw; z-index: 999; overflow: hidden; animation: notifDropdownIn 0.15s ease; }
        @keyframes notifDropdownIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .notif-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
        .notif-title { font-size: 14px; font-weight: 700; color: #1e293b; }
        .notif-markall { font-size: 12px; font-weight: 600; color: ${SITE_PRIMARY}; background: none; border: none; cursor: pointer; }
        .notif-list { max-height: 320px; overflow-y: auto; }
        .notif-item { display: flex; flex-direction: column; gap: 3px; padding: 12px 16px; border-bottom: 1px solid #f8fafc; cursor: pointer; transition: background 0.15s; }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: #f8fafc; }
        .notif-item.unread { background: #fef6f5; }
        .notif-item-title { font-size: 13px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 6px; }
        .notif-item-desc { font-size: 12px; color: #64748b; }
        .notif-item-time { font-size: 11px; color: #a1a1aa; }
        .notif-dot { width: 6px; height: 6px; border-radius: 50%; background: ${SITE_PRIMARY}; flex-shrink: 0; }
        .notif-empty { padding: 24px 16px; text-align: center; font-size: 13px; color: #94a3b8; }
        @media (max-width: 767px) {
          .notif-dropdown { width: 280px; }
        }
      `}</style>

      <div className="notif-wrap">
        <button type="button" className="notif-icon-btn" onClick={toggleOpen} aria-label="Notifications">
          <FiBell size={20} />
          {!!unreadCount && (
            <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </button>
        {open && (
          <div className="notif-dropdown">
            <div className="notif-header">
              <span className="notif-title">Notifications</span>
              {!!unreadCount && (
                <button type="button" className="notif-markall" onClick={markAllRead}>
                  Mark all read
                </button>
              )}
            </div>
            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="notif-empty">No notifications yet</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? "unread" : ""}`}
                    onClick={() => !n.read && markOneRead(n.id)}
                  >
                    <div className="notif-item-title">
                      {!n.read && <span className="notif-dot" />}
                      {n.title}
                    </div>
                    <div className="notif-item-desc">{n.description}</div>
                    <div className="notif-item-time">{timeAgo(n.createdAt)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
} 