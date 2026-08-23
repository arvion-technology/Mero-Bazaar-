"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

interface SidebarBadgesContextType {
  unreadLeads: number | null;
  notifCount: number | null;
  pendingOrders: number | null;
  refetchBadges: () => void;
}

const SidebarBadgesContext = createContext<SidebarBadgesContextType | undefined>(undefined);

const POLL_INTERVAL_MS = 30000;

export function SidebarBadgesProvider({ children }: { children: React.ReactNode }) {
  const [unreadLeads, setUnreadLeads] = useState<number | null>(null);
  const [notifCount, setNotifCount] = useState<number | null>(null);
  const [pendingOrders, setPendingOrders] = useState<number | null>(null);
  const pathname = usePathname();

  // Bumped on every call; a response only gets applied if it's still the latest request in flight.
  const requestIdRef = useRef(0);

  const fetchBadges = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    try {
      const [leadsRes, notifRes, ordersRes] = await Promise.all([
        fetch("/api/leads/mine/unread-count"),
        fetch("/api/user/notifications/unread-count"),
        fetch("/api/orders/seller/unread-count"),
      ]);

      // A newer call was kicked off (nav, poll, or event) while this one was in flight — drop this result.
      if (requestId !== requestIdRef.current) return;

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        if (requestId === requestIdRef.current) setUnreadLeads(data.count);
      }
      if (notifRes.ok) {
        const data = await notifRes.json();
        if (requestId === requestIdRef.current) setNotifCount(data.count);
      }
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        if (requestId === requestIdRef.current) setPendingOrders(data.count);
      }
    } catch {
      // network hiccup — keep previous values on screen, next poll/nav/event will retry
    }
  }, []);

  // Baseline poll — keeps counts fresh even if the seller sits on one page with no navigation or actions.
  useEffect(() => {
    fetchBadges();
    const interval = setInterval(fetchBadges, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchBadges]);

  // Refetch every time the seller navigates to a different page in the shell.
  useEffect(() => {
    fetchBadges();
  }, [pathname, fetchBadges]);

  return (
    <SidebarBadgesContext.Provider
      value={{ unreadLeads, notifCount, pendingOrders, refetchBadges: fetchBadges }}
    >
      {children}
    </SidebarBadgesContext.Provider>
  );
}

export function useSidebarBadges() {
  const ctx = useContext(SidebarBadgesContext);
  if (!ctx) {
    throw new Error("useSidebarBadges must be used within a SidebarBadgesProvider");
  }
  return ctx;
}