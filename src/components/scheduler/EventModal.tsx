'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Clock, Bell, AlignLeft } from 'lucide-react';
import { CalendarEvent, EventColor, ReminderMinutes } from './types';

const GOLD = '#c9a84c';

const COLOR_OPTIONS: { value: EventColor; hex: string; label: string }[] = [
  { value: 'gold',    hex: '#c9a84c', label: 'Gold'    },
  { value: 'silver',  hex: '#9ea3a8', label: 'Silver'  },
  { value: 'rose',    hex: '#d4627a', label: 'Rose'    },
  { value: 'emerald', hex: '#4da07a', label: 'Emerald' },
];

const REMINDER_OPTS: { value: ReminderMinutes | null; label: string }[] = [
  { value: null,  label: 'No reminder'     },
  { value: 5,     label: '5 min before'   },
  { value: 15,    label: '15 min before'  },
  { value: 30,    label: '30 min before'  },
  { value: 60,    label: '1 hour before'  },
  { value: 1440,  label: '1 day before'   },
];

const COLOR_MAP: Record<EventColor, string> = {
  gold: '#c9a84c', silver: '#9ea3a8', rose: '#d4627a', emerald: '#4da07a',
};

function blank(date: string): CalendarEvent {
  return {
    id: '', title: '', date,
    startTime: '09:00', endTime: '10:00',
    description: '', color: 'gold', reminder: 15, allDay: false,
  };
}

interface Props {
  event: CalendarEvent | null;
  defaultDate: string;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export default function EventModal({ event, defaultDate, onSave, onDelete, onClose }: Props) {
  const [form, setForm] = useState<CalendarEvent>(() => event ? { ...event } : blank(defaultDate));
  const [titleErr, setTitleErr] = useState('');

  useEffect(() => {
    setForm(event ? { ...event } : blank(defaultDate));
    setTitleErr('');
  }, [event, defaultDate]);

  const set = <K extends keyof CalendarEvent>(k: K, v: CalendarEvent[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setTitleErr('Title is required'); return; }
    onSave({ ...form, id: form.id || String(Date.now()) });
  };

  const inputBase: React.CSSProperties = {
    background: 'transparent', border: 'none', outline: 'none',
    color: '#d0d0d0', fontSize: 13, width: '100%',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
  };

  const accentColor = COLOR_MAP[form.color] ?? GOLD;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(14px)',
        animation: 'mj-fade-in 0.2s ease-out',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 440,
        background: '#111', borderRadius: 22,
        border: `1px solid ${accentColor}30`,
        boxShadow: `0 0 60px ${accentColor}12, 0 30px 70px rgba(0,0,0,0.7)`,
        overflow: 'hidden',
        animation: 'mj-scale-in 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}99`,
            }} />
            <h2 style={{
              fontSize: 15, fontWeight: 600, color: '#f0f0f0',
              letterSpacing: '-0.01em', margin: 0,
            }}>
              {event ? 'Edit Event' : 'New Event'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
              color: '#888', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#888'; }}
          >
            <X size={13} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '14px 20px 18px' }}>
          {/* Title */}
          <div style={{ marginBottom: 4 }}>
            <input
              type="text"
              placeholder="Event title..."
              value={form.title}
              onChange={e => { set('title', e.target.value); setTitleErr(''); }}
              autoFocus
              style={{
                ...inputBase,
                fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em',
                color: '#f0f0f0', paddingBottom: 10,
                borderBottom: `1px solid ${titleErr ? '#d4627a' : 'rgba(255,255,255,0.1)'}`,
              }}
            />
            {titleErr && <p style={{ color: '#d4627a', fontSize: 11, marginTop: 4 }}>{titleErr}</p>}
          </div>

          {/* Date */}
          <div style={rowStyle}>
            <Calendar size={14} color={GOLD} style={{ flexShrink: 0 }} />
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="mj-input"
              style={{ ...inputBase, colorScheme: 'dark' }}
            />
          </div>

          {/* All day toggle */}
          <div
            style={{ ...rowStyle, cursor: 'pointer', userSelect: 'none' }}
            onClick={() => set('allDay', !form.allDay)}
          >
            <div style={{ width: 14, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#888', flex: 1 }}>All day</span>
            <div style={{
              width: 38, height: 21, borderRadius: 11, position: 'relative', flexShrink: 0,
              background: form.allDay ? `linear-gradient(135deg, ${GOLD}, #e8c96d)` : 'rgba(255,255,255,0.1)',
              transition: 'background 0.2s',
              cursor: 'pointer',
            }}>
              <div style={{
                position: 'absolute', top: 2.5, width: 16, height: 16,
                borderRadius: '50%', background: '#fff',
                transform: form.allDay ? 'translateX(19px)' : 'translateX(2.5px)',
                transition: 'transform 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }} />
            </div>
          </div>

          {/* Times */}
          {!form.allDay && (
            <div style={rowStyle}>
              <Clock size={14} color={GOLD} style={{ flexShrink: 0 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={e => set('startTime', e.target.value)}
                  className="mj-input"
                  style={{ ...inputBase, width: 'auto', colorScheme: 'dark' }}
                />
                <span style={{ color: '#555' }}>–</span>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={e => set('endTime', e.target.value)}
                  className="mj-input"
                  style={{ ...inputBase, width: 'auto', colorScheme: 'dark' }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div style={{ ...rowStyle, alignItems: 'flex-start' }}>
            <AlignLeft size={14} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
            <textarea
              placeholder="Add description..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={2}
              style={{ ...inputBase, resize: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {/* Reminder */}
          <div style={rowStyle}>
            <Bell size={14} color={GOLD} style={{ flexShrink: 0 }} />
            <select
              value={form.reminder ?? ''}
              onChange={e => set('reminder', e.target.value === '' ? null : Number(e.target.value) as ReminderMinutes)}
              style={{ ...inputBase, cursor: 'pointer', colorScheme: 'dark' }}
            >
              {REMINDER_OPTS.map(o => (
                <option key={String(o.value)} value={o.value ?? ''} style={{ background: '#1a1a1a' }}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0' }}>
            <span style={{ fontSize: 13, color: '#666' }}>Color</span>
            <div style={{ display: 'flex', gap: 10 }}>
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => set('color', c.value)}
                  title={c.label}
                  style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: c.hex, border: 'none', cursor: 'pointer',
                    outline: form.color === c.value ? `2.5px solid ${c.hex}` : '2.5px solid transparent',
                    outlineOffset: 2.5,
                    transform: form.color === c.value ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.15s, outline 0.15s',
                    boxShadow: form.color === c.value ? `0 0 10px ${c.hex}66` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 6, paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              {event && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(event.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#774', fontSize: 12, fontWeight: 500,
                    padding: '6px 10px', borderRadius: 8, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#d4627a'; e.currentTarget.style.background = 'rgba(212,98,122,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#774'; e.currentTarget.style.background = 'none'; }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                  background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
                  color: '#888', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#ccc'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#888'; }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: `linear-gradient(135deg, ${GOLD}, #e8c96d)`,
                  border: 'none', cursor: 'pointer', color: '#0a0a0a',
                  boxShadow: `0 0 14px ${GOLD}44`,
                  transition: 'filter 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
              >
                {event ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
