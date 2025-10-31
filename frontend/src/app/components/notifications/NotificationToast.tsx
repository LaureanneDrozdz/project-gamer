'use client';
import React from 'react';
import { useNotifications } from '../lib/useNotifications';

export default function NotificationsToast() {
  const { notifications, connected, markRead } = useNotifications();

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, width: 320 }}>
      <div style={{ fontSize: 12, color: connected ? 'green' : 'gray' }}>
        Notifications — {connected ? 'online' : 'offline'}
      </div>
      {notifications.slice(0, 6).map((n) => (
        <div key={n.id ?? `${n.actor_id}-${n.target_id}`} style={{ background: '#fff', margin: 6, padding: 8, borderRadius: 8 }}>
          <div>
            <strong>{n.actor_id}</strong> {n.action.toLowerCase()} your {n.target_type.toLowerCase()}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>{new Date(n.created_at || Date.now()).toLocaleString()}</div>
          {!n.read && n.id && <button onClick={() => markRead(n.id)}>Mark read</button>}
        </div>
      ))}
    </div>
  );
}