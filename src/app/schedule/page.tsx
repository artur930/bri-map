import type { Metadata } from 'next';
import Scheduler from '@/components/scheduler/Scheduler';

export const metadata: Metadata = {
  title: 'Schedule | BRI',
  description: 'Michael Jackson themed scheduling tool with calendar views and reminders.',
};

export default function SchedulePage() {
  return <Scheduler />;
}
