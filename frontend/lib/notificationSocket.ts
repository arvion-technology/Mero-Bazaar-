'use client';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export type NotificationPayload = {
  id: string;
  category: string;
  type: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
};

export type SecurityEventPayload = {
  id: string;
  type: string;
  read: boolean;
  createdAt: string;
};

type Handlers = {
  onNotification?: (n: NotificationPayload) => void;
  onSecurityEvent?: (a: SecurityEventPayload) => void;
  onConnect?: () => void;
};

export function useNotificationSocket(
  token: string | null | undefined,
  handlers: Handlers,
) {
  const ref = useRef<Handlers>(handlers);

  // keep the latest handlers without re-creating the socket
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    if (!token) return;
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
      auth: { token },
      transports: ['websocket'],
    });
    socket.on('notification', (n: NotificationPayload) =>
      ref.current.onNotification?.(n),
    );
    socket.on('security-event', (a: SecurityEventPayload) =>
      ref.current.onSecurityEvent?.(a),
    );
    socket.on('connect', () => ref.current.onConnect?.());
    return () => {
      socket.disconnect();
    };
  }, [token]);
}