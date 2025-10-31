'use client';
import React from 'react';
import { useNotifications } from '@/lib/useNotification';
import type { NotificationPayload } from '@/lib/useNotification';
import formatDate from '@/lib/formatDate';

export default function NotificationsToast() {
  const { notifications, connected, markRead } = useNotifications();

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, width: 320 }}>
      <div style={{ fontSize: 12, color: connected ? 'green' : 'gray' }}>
        Notifications — {connected ? 'online' : 'offline'}
      </div>
      {notifications.slice(0, 6).map((n: NotificationPayload) => (
        <div key={n.id ?? `${n.actor_id}-${n.target_id}`} style={{ background: '#fff', margin: 6, padding: 8, borderRadius: 8 }}>
          <div>
            <strong>{n.actor_id}</strong> {n.action.toLowerCase()} your {n.target_type.toLowerCase()}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>{formatDate(n.created_at || Date.now(), {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          }, 'fr-FR', '')}</div>
          {!n.read && n.id && <button onClick={() => n.id && markRead(n.id)}>Mark read</button>}
        </div>
      ))}
    </div>
  );
}