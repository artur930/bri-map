'use client';

import { X, Bell } from 'lucide-react';
import { CalendarEvent } from './types';

const GOLD = '#c9a84c';

interface Props {
  reminders: CalendarEvent[];
  onDismiss: (id: string) => void;
}

export default function ReminderToast({ reminders, onDismiss }: Props) {
  if (reminders.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 900,
      display: 'flex', flexDirection: 'column', gap: 8,
      maxWidth: 320,
    }}>
      {reminders.map(event => (
        <div
          key={event.id}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            background: '#111', borderRadius: 16,
            padding: '14px 16px',
            border: `1px solid ${GOLD}44`,
            boxShadow: `0 0 30px ${GOLD}18, 0 20px 40px rgba(0,0,0,0.6)`,
            animation: 'mj-slide-in 0.3s ease-out',
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: `${GOLD}18`, border: `1px solid ${GOLD}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bell size={13} color={GOLD} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 3px' }}>
              Reminder
            </p>
            <p style={{ color: '#f0f0f0', fontSize: 13, fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.title}
            </p>
            <p style={{ color: '#777', fontSize: 11, margin: 0 }}>
              {event.allDay ? 'All day' : `${event.startTime} – ${event.endTime}`} · {event.date}
            </p>
          </div>
          <button
            onClick={() => onDismiss(event.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#555', padding: 2, flexShrink: 0,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#aaa')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
