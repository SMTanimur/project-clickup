'use client';

import { Space } from '@/lib/store/project-store';

interface CalendarViewProps {
  space: Space;
}

export function CalendarView({ space }: CalendarViewProps) {
  return <div>Calendar view for {space.name}</div>;
}
