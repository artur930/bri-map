'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react';
import { CalendarEvent, ViewMode, EventColor } from './types';
import EventModal from './EventModal';
import ReminderToast from './ReminderToast';

// ─── Theme ───────────────────────────────────────────────────────
const GOLD = '#c9a84c';
const GOLD_LIGHT = '#e8c96d';

const EVENT_COLORS: Record<EventColor, string> = {
  gold:    '#c9a84c',
  silver:  '#9ea3a8',
  rose:    '#d4627a',
  emerald: '#4da07a',
};

// ─── Date helpers ────────────────────────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAYS_S = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function pad(n: number) { return n.toString().padStart(2, '0'); }

/** m is 0-indexed (JS Date convention) */
function toDStr(y: number, m: number, d: number): string {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function todayStr(): string {
  const d = new Date();
  return toDStr(d.getFullYear(), d.getMonth(), d.getDate());
}

function fmtHour(h: number): string {
  if (h === 0)  return '12am';
  if (h < 12)  return `${h}am`;
  if (h === 12) return '12pm';
  return `${h - 12}pm`;
}

// ─── Sample events (May 2026) ────────────────────────────────────
const SAMPLES: CalendarEvent[] = [
  {
    id: 's1', title: 'Thriller Night',
    date: '2026-05-03', startTime: '20:00', endTime: '22:30',
    description: 'Annual Thriller anniversary performance',
    color: 'gold', reminder: 60, allDay: false,
  },
  {
    id: 's2', title: 'Beat It Rehearsal',
    date: '2026-05-06', startTime: '14:00', endTime: '16:00',
    description: 'Dance rehearsal session',
    color: 'silver', reminder: 30, allDay: false,
  },
  {
    id: 's3', title: 'Studio Session',
    date: '2026-05-10', startTime: '10:00', endTime: '18:00',
    description: 'Recording and mixing',
    color: 'gold', reminder: null, allDay: false,
  },
  {
    id: 's4', title: 'Moonwalk Workshop',
    date: '2026-05-14', startTime: '11:00', endTime: '13:00',
    description: '',
    color: 'emerald', reminder: 15, allDay: false,
  },
  {
    id: 's5', title: 'Off The Wall Day',
    date: '2026-05-20', startTime: '00:00', endTime: '23:59',
    description: 'Celebrate the album release anniversary',
    color: 'rose', reminder: 1440, allDay: true,
  },
  {
    id: 's6', title: 'Black & White Shoot',
    date: '2026-05-27', startTime: '09:00', endTime: '17:00',
    description: 'Music video production day',
    color: 'silver', reminder: 60, allDay: false,
  },
];

// ─── Scheduler (root component) ──────────────────────────────────
export default function Scheduler() {
  const [events, setEvents]       = useState<CalendarEvent[]>([]);
  const [view, setView]           = useState<ViewMode>('month');
  const [curDate, setCurDate]     = useState(() => new Date());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<CalendarEvent | null>(null);
  const [preDate, setPreDate]     = useState('');
  const [activeRem, setActiveRem] = useState<CalendarEvent[]>([]);
  const firedRef = useRef(new Set<string>());

  const today = useMemo(todayStr, []);

  // Stable sparkle positions (seeded-random)
  const sparkles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: (i * 37 + 11) % 100,
      y: (i * 53 + 7)  % 100,
      delay: ((i * 0.4) % 4).toFixed(2),
      dur:   (2 + (i * 0.3) % 2).toFixed(2),
      size:  8 + (i * 3) % 8,
    })),
  []);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem('mj-schedule-v2');
      const parsed: CalendarEvent[] = raw ? JSON.parse(raw) : [];
      setEvents(parsed.length > 0 ? parsed : SAMPLES);
    } catch {
      setEvents(SAMPLES);
    }
  }, []);

  // Persist
  useEffect(() => {
    if (events.length) localStorage.setItem('mj-schedule-v2', JSON.stringify(events));
  }, [events]);

  // Reminder check (every 30s)
  useEffect(() => {
    const check = () => {
      const now = Date.now();
      events.forEach(ev => {
        if (!ev.reminder || firedRef.current.has(ev.id)) return;
        const evMs = new Date(`${ev.date}T${ev.allDay ? '08:00' : ev.startTime}`).getTime();
        const remAt = evMs - ev.reminder * 60_000;
        if (now >= remAt && now < remAt + 30_000) {
          firedRef.current.add(ev.id);
          setActiveRem(prev => prev.find(e => e.id === ev.id) ? prev : [...prev, ev]);
        }
      });
    };
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, [events]);

  const dismissRem = useCallback((id: string) => {
    setActiveRem(prev => prev.filter(e => e.id !== id));
  }, []);

  // Navigation
  const goToday = () => setCurDate(new Date());
  const nav = (dir: number) => {
    setCurDate(prev => {
      const d = new Date(prev);
      if      (view === 'month') d.setMonth(d.getMonth() + dir);
      else if (view === 'week')  d.setDate(d.getDate() + dir * 7);
      else                       d.setDate(d.getDate() + dir);
      return d;
    });
  };

  // Modal helpers
  const openCreate = useCallback((date?: string) => {
    setPreDate(date || today);
    setEditing(null);
    setShowModal(true);
  }, [today]);

  const openEdit = useCallback((ev: CalendarEvent) => {
    setEditing(ev);
    setShowModal(true);
  }, []);

  const handleSave = useCallback((ev: CalendarEvent) => {
    setEvents(prev => {
      const idx = prev.findIndex(e => e.id === ev.id);
      return idx >= 0 ? prev.map(e => e.id === ev.id ? ev : e) : [...prev, ev];
    });
    setShowModal(false);
    setEditing(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setShowModal(false);
    setEditing(null);
  }, []);

  const periodLabel = useMemo(() => {
    const y = curDate.getFullYear();
    const m = curDate.getMonth();
    if (view === 'month') return `${MONTHS[m]} ${y}`;
    if (view === 'week') {
      const sun = new Date(curDate);
      sun.setDate(sun.getDate() - sun.getDay());
      const sat = new Date(sun);
      sat.setDate(sat.getDate() + 6);
      return sun.getMonth() === sat.getMonth()
        ? `${MONTHS[m]} ${y}`
        : `${MONTHS[sun.getMonth()]} – ${MONTHS[sat.getMonth()]} ${y}`;
    }
    return `${MONTHS[m]} ${curDate.getDate()}, ${y}`;
  }, [curDate, view]);

  // ── render ──
  return (
    <div
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        background: '#080808', color: '#f0f0f0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Sparkles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {sparkles.map(s => (
          <span
            key={s.id}
            style={{
              position: 'absolute',
              left: `${s.x}%`, top: `${s.y}%`,
              fontSize: s.size, color: GOLD, opacity: 0,
              animation: `sparkle-pulse ${s.dur}s ${s.delay}s infinite`,
            }}
          >✦</span>
        ))}
        {/* Subtle radial glow top-right */}
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 500, height: 500, borderRadius: '50%',
          background: `radial-gradient(circle, ${GOLD}08 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      </div>

      <ReminderToast reminders={activeRem} onDismiss={dismissRem} />

      {/* ── Header ── */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 24px',
        position: 'relative', zIndex: 10,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 11,
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
              boxShadow: `0 0 16px ${GOLD}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, color: '#0a0a0a', fontWeight: 900,
            }}>✦</div>
            <div>
              <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', color: '#f0f0f0' }}>
                Schedule
              </span>
              <span style={{ fontSize: 10, color: '#555', marginLeft: 8, letterSpacing: '0.05em' }}>
                MJ EDITION
              </span>
            </div>
          </div>

          {/* View toggle */}
          <div style={{
            display: 'flex', gap: 2, padding: 4, borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {(['month', 'week', 'day'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '6px 16px', borderRadius: 8,
                  fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', border: 'none', textTransform: 'capitalize',
                  background: view === v ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : 'transparent',
                  color: view === v ? '#0a0a0a' : '#777',
                  transition: 'all 0.15s',
                }}
              >{v}</button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              href="/"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                color: '#777', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ccc'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.22)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#777'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              <MapPin size={12} />
              Map
            </Link>
            <button
              onClick={() => openCreate()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', border: 'none',
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                color: '#0a0a0a',
                boxShadow: `0 0 16px ${GOLD}44`,
                transition: 'filter 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              <Plus size={13} strokeWidth={2.5} />
              New Event
            </button>
          </div>
        </div>
      </header>

      {/* ── Nav bar ── */}
      <div style={{
        padding: '10px 24px', position: 'relative', zIndex: 10,
        maxWidth: 1280, margin: '0 auto', width: '100%',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button
          onClick={goToday}
          style={{
            padding: '5px 14px', borderRadius: 8,
            fontSize: 12, fontWeight: 500,
            cursor: 'pointer', border: '1px solid rgba(255,255,255,0.11)',
            background: 'transparent', color: '#999', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${GOLD}55`; e.currentTarget.style.color = GOLD; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)'; e.currentTarget.style.color = '#999'; }}
        >Today</button>

        <div style={{ display: 'flex', gap: 2 }}>
          {([-1, 1] as const).map(dir => (
            <button
              key={dir}
              onClick={() => nav(dir)}
              style={{
                width: 30, height: 30, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: 'none',
                background: 'transparent', color: '#666', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#ccc'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#666'; }}
            >
              {dir === -1 ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          ))}
        </div>

        <h2 style={{
          fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em',
          color: '#f0f0f0', margin: 0,
        }}>
          {periodLabel}
        </h2>

        <div style={{ marginLeft: 'auto', fontSize: 11, color: '#444' }}>
          {events.length} event{events.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Calendar body ── */}
      <div style={{
        flex: 1, padding: '0 24px 24px',
        maxWidth: 1280, margin: '0 auto', width: '100%',
        minHeight: 0, display: 'flex', flexDirection: 'column',
        position: 'relative', zIndex: 10,
      }}>
        {view === 'month' && (
          <MonthView curDate={curDate} today={today} events={events}
            onDayClick={openCreate} onEventClick={openEdit} />
        )}
        {view === 'week' && (
          <WeekView curDate={curDate} today={today} events={events}
            onSlotClick={openCreate} onEventClick={openEdit} />
        )}
        {view === 'day' && (
          <DayView curDate={curDate} today={today} events={events}
            onAddClick={() => openCreate(toDStr(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()))}
            onEventClick={openEdit} />
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <EventModal
          event={editing}
          defaultDate={preDate || today}
          onSave={handleSave}
          onDelete={editing ? handleDelete : undefined}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MONTH VIEW
// ═══════════════════════════════════════════════════════════════════
interface MonthViewProps {
  curDate: Date;
  today: string;
  events: CalendarEvent[];
  onDayClick: (date: string) => void;
  onEventClick: (ev: CalendarEvent) => void;
}

function MonthView({ curDate, today, events, onDayClick, onEventClick }: MonthViewProps) {
  const cells = useMemo(() => {
    const y = curDate.getFullYear();
    const m = curDate.getMonth();
    const firstDay    = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrev  = new Date(y, m, 0).getDate();
    const arr: { date: string; day: number; curr: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const d  = daysInPrev - i;
      const pm = m === 0 ? 11 : m - 1;
      const py = m === 0 ? y - 1 : y;
      arr.push({ date: toDStr(py, pm, d), day: d, curr: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push({ date: toDStr(y, m, d), day: d, curr: true });
    }
    const rem = 42 - arr.length;
    for (let d = 1; d <= rem; d++) {
      const nm = m === 11 ? 0 : m + 1;
      const ny = m === 11 ? y + 1 : y;
      arr.push({ date: toDStr(ny, nm, d), day: d, curr: false });
    }
    return arr;
  }, [curDate]);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18,
      overflow: 'hidden', background: 'rgba(255,255,255,0.018)',
      minHeight: 0,
    }}>
      {/* Day headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        {DAYS_S.map(d => (
          <div key={d} style={{
            padding: '10px 0', textAlign: 'center',
            fontSize: 10, fontWeight: 700, color: '#4a4a4a',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        minHeight: 0,
      }}>
        {cells.map((cell, i) => {
          const evs     = events.filter(e => e.date === cell.date);
          const visible = evs.slice(0, 3);
          const more    = evs.length - 3;
          return (
            <MonthCell
              key={i}
              cell={cell}
              isToday={cell.date === today}
              visible={visible}
              more={more}
              noBorderRight={(i + 1) % 7 === 0}
              noBorderBottom={i >= 35}
              onDayClick={onDayClick}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
}

interface MonthCellProps {
  cell: { date: string; day: number; curr: boolean };
  isToday: boolean;
  visible: CalendarEvent[];
  more: number;
  noBorderRight: boolean;
  noBorderBottom: boolean;
  onDayClick: (d: string) => void;
  onEventClick: (ev: CalendarEvent) => void;
}

function MonthCell({ cell, isToday, visible, more, noBorderRight, noBorderBottom, onDayClick, onEventClick }: MonthCellProps) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={() => onDayClick(cell.date)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '5px 4px 4px',
        cursor: 'pointer',
        borderRight:  noBorderRight  ? 'none' : '1px solid rgba(255,255,255,0.04)',
        borderBottom: noBorderBottom ? 'none' : '1px solid rgba(255,255,255,0.04)',
        background: hov ? `${GOLD}06` : 'transparent',
        transition: 'background 0.15s',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Billie Jean tile glow */}
      {hov && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          boxShadow: `inset 0 0 24px ${GOLD}0a`,
        }} />
      )}

      {/* Day number */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
        <span style={{
          width: 24, height: 24, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: isToday ? 800 : 400,
          background: isToday ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : 'transparent',
          color:  isToday ? '#0a0a0a' : cell.curr ? '#d0d0d0' : '#2d2d2d',
          boxShadow: isToday ? `0 0 12px ${GOLD}66` : 'none',
          transition: 'box-shadow 0.2s',
        }}>
          {cell.day}
        </span>
      </div>

      {/* Event pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visible.map(ev => {
          const c = EVENT_COLORS[ev.color];
          return (
            <button
              key={ev.id}
              onClick={e => { e.stopPropagation(); onEventClick(ev); }}
              style={{
                width: '100%', textAlign: 'left',
                padding: '2px 5px', borderRadius: 4,
                fontSize: 9.5, fontWeight: 600, cursor: 'pointer',
                background: `${c}18`, border: `1px solid ${c}28`, color: c,
                overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                transition: 'filter 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.25)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              {ev.allDay ? '● ' : `${ev.startTime.slice(0,5)} `}{ev.title}
            </button>
          );
        })}
        {more > 0 && (
          <span style={{ fontSize: 9, color: '#444', paddingLeft: 4 }}>+{more} more</span>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// WEEK VIEW
// ═══════════════════════════════════════════════════════════════════
const W_HOUR_H = 54;
const W_START  = 6;
const W_END    = 22;
const W_HOURS  = Array.from({ length: W_END - W_START }, (_, i) => W_START + i);

interface WeekViewProps {
  curDate: Date;
  today: string;
  events: CalendarEvent[];
  onSlotClick: (date: string) => void;
  onEventClick: (ev: CalendarEvent) => void;
}

function WeekView({ curDate, today, events, onSlotClick, onEventClick }: WeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = (8 - W_START) * W_HOUR_H;
  }, []);

  const days = useMemo(() => {
    const sun = new Date(curDate);
    sun.setDate(sun.getDate() - sun.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sun);
      d.setDate(d.getDate() + i);
      return { date: toDStr(d.getFullYear(), d.getMonth(), d.getDate()), d };
    });
  }, [curDate]);

  const totalH = W_HOURS.length * W_HOUR_H;

  function toPx(t: string) {
    const [h, m] = t.split(':').map(Number);
    return (h - W_START) * W_HOUR_H + (m / 60) * W_HOUR_H;
  }

  const hasAllDay = days.some(({ date }) => events.some(e => e.date === date && e.allDay));

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18,
      overflow: 'hidden', background: 'rgba(255,255,255,0.018)',
    }}>
      {/* Day headers */}
      <div style={{
        display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
      }}>
        <div style={{ width: 58, flexShrink: 0 }} />
        {days.map(({ date, d }) => {
          const isT = date === today;
          return (
            <div key={date} style={{
              flex: 1, padding: '10px 0', textAlign: 'center',
              borderLeft: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {DAYS_S[d.getDay()]}
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', margin: '4px auto 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: isT ? 800 : 400,
                background: isT ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : 'transparent',
                color: isT ? '#0a0a0a' : '#d0d0d0',
                boxShadow: isT ? `0 0 12px ${GOLD}66` : 'none',
              }}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* All-day row */}
      {hasAllDay && (
        <div style={{
          display: 'flex', flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{
            width: 58, flexShrink: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'flex-end', paddingRight: 10,
            fontSize: 9, color: '#444', letterSpacing: '0.05em',
          }}>ALL DAY</div>
          {days.map(({ date }) => {
            const ads = events.filter(e => e.date === date && e.allDay);
            return (
              <div key={date} style={{
                flex: 1, padding: '4px 3px', minHeight: 30,
                borderLeft: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', flexDirection: 'column', gap: 2,
              }}>
                {ads.map(ev => {
                  const c = EVENT_COLORS[ev.color];
                  return (
                    <button key={ev.id} onClick={() => onEventClick(ev)} style={{
                      padding: '2px 5px', borderRadius: 4, fontSize: 9.5, fontWeight: 600,
                      background: `${c}18`, border: `1px solid ${c}28`, color: c,
                      cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                      textAlign: 'left', width: '100%', transition: 'filter 0.1s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.2)')}
                      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >{ev.title}</button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="mj-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ position: 'relative', display: 'flex', height: totalH }}>
          {/* Time axis */}
          <div style={{ width: 58, flexShrink: 0, position: 'relative' }}>
            {W_HOURS.map(h => (
              <div key={h} style={{
                position: 'absolute', width: '100%',
                top: (h - W_START) * W_HOUR_H - 8,
                height: W_HOUR_H,
                display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
                paddingRight: 12, paddingTop: 10,
                fontSize: 10, color: '#3a3a3a',
              }}>
                {fmtHour(h)}
              </div>
            ))}
          </div>

          {/* Columns */}
          {days.map(({ date }) => {
            const dayEvs = events.filter(e => e.date === date && !e.allDay);
            return (
              <div key={date} style={{
                flex: 1, position: 'relative',
                borderLeft: '1px solid rgba(255,255,255,0.04)',
              }}>
                {W_HOURS.map(h => (
                  <div
                    key={h}
                    onClick={() => onSlotClick(date)}
                    style={{
                      position: 'absolute', width: '100%',
                      top: (h - W_START) * W_HOUR_H, height: W_HOUR_H,
                      borderTop: '1px solid rgba(255,255,255,0.03)',
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${GOLD}04`)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  />
                ))}
                {dayEvs.map(ev => {
                  const top    = toPx(ev.startTime);
                  const bottom = toPx(ev.endTime);
                  const height = Math.max(bottom - top, 22);
                  if (top < 0 || top > totalH) return null;
                  const c = EVENT_COLORS[ev.color];
                  return (
                    <button key={ev.id} onClick={() => onEventClick(ev)} style={{
                      position: 'absolute', top, height, left: 2, right: 2,
                      borderRadius: 6, padding: '3px 6px', textAlign: 'left',
                      background: `${c}18`, border: `1px solid ${c}30`,
                      borderLeft: `3px solid ${c}`,
                      color: c, fontSize: 10, fontWeight: 700,
                      cursor: 'pointer', overflow: 'hidden', zIndex: 1,
                      transition: 'filter 0.1s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.25)')}
                      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.title}
                      </div>
                      {height > 34 && (
                        <div style={{ opacity: 0.6, fontSize: 9, marginTop: 1 }}>
                          {ev.startTime}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DAY VIEW
// ═══════════════════════════════════════════════════════════════════
const D_HOUR_H = 70;
const D_START  = 6;
const D_END    = 22;
const D_HOURS  = Array.from({ length: D_END - D_START }, (_, i) => D_START + i);

interface DayViewProps {
  curDate: Date;
  today: string;
  events: CalendarEvent[];
  onAddClick: () => void;
  onEventClick: (ev: CalendarEvent) => void;
}

function DayView({ curDate, today, events, onAddClick, onEventClick }: DayViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = (8 - D_START) * D_HOUR_H;
  }, []);

  const dateStr = toDStr(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
  const isToday  = dateStr === today;
  const totalH   = D_HOURS.length * D_HOUR_H;

  const timed  = events.filter(e => e.date === dateStr && !e.allDay);
  const allDay = events.filter(e => e.date === dateStr && e.allDay);

  function toPx(t: string) {
    const [h, m] = t.split(':').map(Number);
    return (h - D_START) * D_HOUR_H + (m / 60) * D_HOUR_H;
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18,
      overflow: 'hidden', background: 'rgba(255,255,255,0.018)',
    }}>
      {/* Day header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 13, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 800,
          background: isToday ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : 'rgba(255,255,255,0.07)',
          color: isToday ? '#0a0a0a' : '#f0f0f0',
          boxShadow: isToday ? `0 0 20px ${GOLD}55` : 'none',
        }}>
          {curDate.getDate()}
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {DAYS_S[curDate.getDay()]}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: isToday ? GOLD : '#f0f0f0', letterSpacing: '-0.02em' }}>
            {isToday ? 'Today' : `${MONTHS[curDate.getMonth()]} ${curDate.getDate()}`}
          </div>
        </div>

        {allDay.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 4 }}>
            {allDay.map(ev => {
              const c = EVENT_COLORS[ev.color];
              return (
                <button key={ev.id} onClick={() => onEventClick(ev)} style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: `${c}18`, border: `1px solid ${c}30`, color: c,
                  cursor: 'pointer', transition: 'filter 0.1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.2)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                >● {ev.title}</button>
              );
            })}
          </div>
        )}

        <button
          onClick={onAddClick}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', border: 'none',
            background: `${GOLD}16`, color: GOLD,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = `${GOLD}28`)}
          onMouseLeave={e => (e.currentTarget.style.background = `${GOLD}16`)}
        >
          <Plus size={13} /> Add Event
        </button>
      </div>

      {/* Time grid */}
      <div ref={scrollRef} className="mj-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ position: 'relative', display: 'flex', height: totalH }}>
          {/* Time axis */}
          <div style={{ width: 74, flexShrink: 0, position: 'relative' }}>
            {D_HOURS.map(h => (
              <div key={h} style={{
                position: 'absolute', width: '100%',
                top: (h - D_START) * D_HOUR_H,
                height: D_HOUR_H,
                display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
                paddingRight: 16, paddingTop: 12,
                fontSize: 11, color: '#3a3a3a',
              }}>
                {fmtHour(h)}
              </div>
            ))}
          </div>

          {/* Events column */}
          <div style={{
            flex: 1, position: 'relative',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}>
            {D_HOURS.map(h => (
              <div
                key={h}
                onClick={onAddClick}
                style={{
                  position: 'absolute', width: '100%',
                  top: (h - D_START) * D_HOUR_H, height: D_HOUR_H,
                  borderTop: '1px solid rgba(255,255,255,0.03)',
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = `${GOLD}04`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              />
            ))}

            {timed.map(ev => {
              const top    = toPx(ev.startTime);
              const bottom = toPx(ev.endTime);
              const height = Math.max(bottom - top, 34);
              if (top < 0) return null;
              const c = EVENT_COLORS[ev.color];
              return (
                <button key={ev.id} onClick={() => onEventClick(ev)} style={{
                  position: 'absolute', top, height, left: 10, right: 10,
                  borderRadius: 11, padding: '9px 14px', textAlign: 'left',
                  background: `linear-gradient(135deg, ${c}1e, ${c}0d)`,
                  border: `1px solid ${c}30`,
                  borderLeft: `4px solid ${c}`,
                  color: c, cursor: 'pointer', zIndex: 1, overflow: 'hidden',
                  transition: 'filter 0.1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.2)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.title}
                  </div>
                  {height > 46 && (
                    <div style={{ fontSize: 11, opacity: 0.65, marginTop: 3 }}>
                      {ev.startTime} – {ev.endTime}
                    </div>
                  )}
                  {height > 72 && ev.description && (
                    <div style={{ fontSize: 10, opacity: 0.45, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ev.description}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
