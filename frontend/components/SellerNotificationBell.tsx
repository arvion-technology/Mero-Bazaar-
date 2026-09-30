"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiBell } from "react-icons/fi";
import { useSidebarBadges } from "./SidebarBadgesContext";
import { activityLabel, isKnownActivity } from "@/lib/activityLabel";

type NotificationItem = {
  id: string;
  category: string;
  type: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
};

type ActivityItem = {
  id: string;
  type: string;
  createdAt: string;
  read: boolean;
};

type DisplayItem = {
  key: string;
  id: string;
  source: "notification" | "activity";
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
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const token = session?.accessToken;
  const headers = token ? { Authorization: `Bearer ${token}` } : null;

  function fetchActivity() {
    if (!headers) return;
    fetch("/api/user/notifications/security", { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ActivityItem[]) =>
        setActivity((data ?? []).filter((a) => isKnownActivity(a.type)))
      )
      .catch(() => {});
  }

  function fetchList() {
    if (!headers) return;
    setLoadingList(true);
    fetch("/api/user/notifications", { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: NotificationItem[]) => {
        setNotifications(data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }

  // load security events on mount
  useEffect(() => {
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function toggleOpen() {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) {
      fetchList();
      fetchActivity();
    }
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
    fetch("/api/user/notifications/security/mark-read", { method: "POST", headers })
      .then((r) => {
        if (!r.ok) return;
        setActivity((prev) => prev.map((a) => ({ ...a, read: true })));
      })
      .catch(() => {});
  }

  function markOneRead(item: DisplayItem) {
    if (!headers || item.read) return;
    // security events have no single-item endpoint yet; use "Mark all read"
    if (item.source === "activity") return;
    fetch(`/api/user/notifications/${item.id}/mark-read`, { method: "POST", headers })
      .then((r) => {
        if (!r.ok) return;
        setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
        refetchBadges();
      })
      .catch(() => {});
  }

  const merged: DisplayItem[] = [
    ...notifications.map<DisplayItem>((n) => ({
      key: `n-${n.id}`,
      id: n.id,
      source: "notification",
      title: n.title,
      description: n.description,
      read: n.read,
      createdAt: n.createdAt,
    })),
    ...activity.map<DisplayItem>((a) => ({
      key: `a-${a.id}`,
      id: a.id,
      source: "activity",
      title: activityLabel(a.type),
      description: "Security activity on your account",
      read: a.read,
      createdAt: a.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const unreadActivity = activity.filter((a) => !a.read).length;
  const totalCount = (notifCount ?? 0) + unreadActivity;

  return (
    <>
      <style>{`
        @keyframes snotifDropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative">
        <button
          type="button"
          className="w-10 h-10 rounded-[10px] bg-white border-[1.5px] border-[#e2e8f0] flex items-center justify-center text-[#64748b] cursor-pointer [transition:all_0.2s] relative shrink-0 hover:bg-[#f8fafc] hover:border-[#cbd5e1] hover:text-[#334155]"
          onClick={toggleOpen}
          aria-label="Notifications"
        >
          <FiBell size={18} />
          {totalCount > 0 && (
            <span className="absolute -top-[3px] -right-[3px] min-w-[18px] h-[18px] px-[3px] bg-[#C0392B] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {totalCount > 9 ? "9+" : totalCount}
            </span>
          )}
        </button>
        {open && (
          <div className="absolute top-[calc(100%+8px)] right-0 bg-white border border-[#e2e8f0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] w-[320px] max-w-[90vw] z-[999] overflow-hidden animate-[snotifDropdownIn_0.15s_ease] max-[767px]:w-[280px]">
            <div className="flex items-center justify-between py-3 px-4 border-b border-[#f1f5f9]">
              <span className="text-[14px] font-bold text-[#1e293b]">Notifications</span>
              {totalCount > 0 && (
                <button
                  type="button"
                  className="text-[12px] font-semibold text-[#C0392B] bg-transparent border-0 cursor-pointer"
                  onClick={markAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {loadingList && merged.length === 0 ? (
                <div className="py-6 px-4 text-center text-[13px] text-[#94a3b8]">Loading...</div>
              ) : merged.length === 0 ? (
                <div className="py-6 px-4 text-center text-[13px] text-[#94a3b8]">No notifications yet</div>
              ) : (
                merged.map((n) => (
                  <div
                    key={n.key}
                    className={`flex flex-col gap-[3px] py-3 px-4 border-b border-[#f8fafc] cursor-pointer [transition:background_0.15s] last:border-b-0 ${
                      !n.read ? "bg-[#fef6f5]" : "hover:bg-[#f8fafc]"
                    }`}
                    onClick={() => markOneRead(n)}
                  >
                    <div className="text-[13px] font-semibold text-[#1e293b] flex items-center gap-1.5">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B] shrink-0" />}
                      {n.title}
                    </div>
                    <div className="text-[12px] text-[#64748b]">{n.description}</div>
                    <div className="text-[11px] text-[#a1a1aa]">{timeAgo(n.createdAt)}</div>
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