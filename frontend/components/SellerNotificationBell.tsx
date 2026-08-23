"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FiBell } from "react-icons/fi";
import { useSidebarBadges } from "./SidebarBadgesContext";

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

export default function SellerNotificationBell({
  bg = "#f8fafc",
}: {
  bg?: string;
}) {
  const { data: session } = useSession();
  const { notifCount, refetchBadges } = useSidebarBadges();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const headers = session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
    : null;

  function fetchList() {
    if (!headers) return;
    setLoadingList(true);
    fetch("/api/user/notifications", { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: NotificationItem[]) => {
        setNotifications((data ?? []).slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }

  function toggleOpen() {
    const willOpen = !open;
    setOpen(willOpen);
    // Refetch every time it opens — the badge count can change (poll/nav/other
    // actions) while the dropdown is closed, so a cached list would silently go stale.
    if (willOpen) fetchList();
  }

  function markAllRead() {
    if (!headers) return;
    fetch("/api/user/notifications/mark-all-read", { method: "POST", headers })
      .then((r) => {
        if (!r.ok) return;
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        refetchBadges();
      })
      .catch(() => {});
  }

  function markOneRead(id: string) {
    if (!headers) return;
    fetch(`/api/user/notifications/${id}/mark-read`, { method: "POST", headers })
      .then((r) => {
        if (!r.ok) return;
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        refetchBadges();
      })
      .catch(() => {});
  }

  return (
    <>
      <style>{`
        .snotif-icon-btn { width: 40px; height: 40px; border-radius: 10px; background: #fff; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.2s; position: relative; flex-shrink: 0; }
        .snotif-icon-btn:hover { background: #f8fafc; border-color: #cbd5e1; color: #334155; }
        .snotif-badge { position: absolute; top: -3px; right: -3px; min-width: 18px; height: 18px; padding: 0 3px; background: ${SITE_PRIMARY}; color: #fff; font-size: 10px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }
        .snotif-wrap { position: relative; }
        .snotif-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); width: 320px; max-width: 90vw; z-index: 999; overflow: hidden; animation: snotifDropdownIn 0.15s ease; }
        @keyframes snotifDropdownIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .snotif-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
        .snotif-title { font-size: 14px; font-weight: 700; color: #1e293b; }
        .snotif-markall { font-size: 12px; font-weight: 600; color: ${SITE_PRIMARY}; background: none; border: none; cursor: pointer; }
        .snotif-list { max-height: 320px; overflow-y: auto; }
        .snotif-item { display: flex; flex-direction: column; gap: 3px; padding: 12px 16px; border-bottom: 1px solid #f8fafc; cursor: pointer; transition: background 0.15s; }
        .snotif-item:last-child { border-bottom: none; }
        .snotif-item:hover { background: #f8fafc; }
        .snotif-item.unread { background: #fef6f5; }
        .snotif-item-title { font-size: 13px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 6px; }
        .snotif-item-desc { font-size: 12px; color: #64748b; }
        .snotif-item-time { font-size: 11px; color: #a1a1aa; }
        .snotif-dot { width: 6px; height: 6px; border-radius: 50%; background: ${SITE_PRIMARY}; flex-shrink: 0; }
        .snotif-empty { padding: 24px 16px; text-align: center; font-size: 13px; color: #94a3b8; }
        @media (max-width: 767px) {
          .snotif-dropdown { width: 280px; }
        }
      `}</style>

      <div className="snotif-wrap">
        <button type="button" className="snotif-icon-btn" onClick={toggleOpen} aria-label="Notifications">
          <FiBell size={18} />
          {notifCount !== null && notifCount > 0 && (
            <span className="snotif-badge">{notifCount > 9 ? "9+" : notifCount}</span>
          )}
        </button>
        {open && (
          <div className="snotif-dropdown">
            <div className="snotif-header">
              <span className="snotif-title">Notifications</span>
              {notifCount !== null && notifCount > 0 && (
                <button type="button" className="snotif-markall" onClick={markAllRead}>
                  Mark all read
                </button>
              )}
            </div>
            <div className="snotif-list">
              {loadingList ? (
                <div className="snotif-empty">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="snotif-empty">No notifications yet</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`snotif-item ${!n.read ? "unread" : ""}`}
                    onClick={() => !n.read && markOneRead(n.id)}
                  >
                    <div className="snotif-item-title">
                      {!n.read && <span className="snotif-dot" />}
                      {n.title}
                    </div>
                    <div className="snotif-item-desc">{n.description}</div>
                    <div className="snotif-item-time">{timeAgo(n.createdAt)}</div>
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