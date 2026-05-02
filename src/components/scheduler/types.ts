export type ViewMode = 'month' | 'week' | 'day';
export type EventColor = 'gold' | 'silver' | 'rose' | 'emerald';
export type ReminderMinutes = 5 | 15 | 30 | 60 | 1440;

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:MM
  endTime: string;    // HH:MM
  description: string;
  color: EventColor;
  reminder: ReminderMinutes | null;
  allDay: boolean;
}
