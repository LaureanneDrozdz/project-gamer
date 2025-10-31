import { useEffect, useRef, useState, useCallback } from 'react';
import type { Socket } from 'socket.io-client';

export type NotificationPayload = {
  id?: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  created_at?: string;
  read?: boolean;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const fetchUnread = useCallback(async () => {
    try {
      // make sure this URL points to your backend notifications endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/notifications?onlyUnread=true`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = (await res.json()) as NotificationPayload[];
      setNotifications((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const merged = [...data.filter((n: NotificationPayload) => !ids.has(n.id)), ...prev];
        return merged;
      });
    } catch (err) {
      // handle error
    }
  }, []);

  useEffect(() => {
    // only run in browser
    if (typeof window === 'undefined') return;

  let mounted = true;
  let socket: Socket | null = null;

    // dynamic import to avoid SSR problems
    import('socket.io-client').then(({ io }) => {
      if (!mounted) return;

      // If your backend is same-origin and cookies are used automatically, you can call io('/notifications')
      // If backend is on a different origin: use full URL and set withCredentials: true
      const base = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '';
      socket = io(base + '/notifications', {
        transports: ['websocket', 'polling'],
        withCredentials: true, // ensure cookies are sent on cross-origin handshake
        // auth: { token }, // optional: send token in auth if you prefer
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setConnected(true);
        // If your gateway expects an explicit join, emit join (server must verify token/handshake)
        // socket.emit('join'); // optional

        // On connect, re-sync unread from DB
        fetchUnread();
      });

      socket.on('disconnect', () => {
        setConnected(false);
      });

      socket.on('notification', (payload: NotificationPayload) => {
        setNotifications((prev) => {
          if (payload.id && prev.some((p) => p.id === payload.id)) return prev;
          return [payload, ...prev].slice(0, 300);
        });
      });

      socket.on('connect_error', (err: unknown) => {
        // optional debug
        // console.warn('socket connect_error', err);
      });

      socket.on('reconnect', () => {
        fetchUnread();
      });
    });

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.off('notification');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fetchUnread]);

  const markRead = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/notifications/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('mark read failed');
      const updated = await res.json();
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      return updated;
    } catch (err) {
      // handle error
      return null;
    }
  }, []);

  return {
    notifications,
    connected,
    markRead,
    fetchUnread,
    socket: socketRef.current,
  };
}