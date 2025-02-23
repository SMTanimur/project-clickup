'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { useParams } from 'next/navigation';
import { CalendarView } from '@/components/space/CalendarView';

export default function SpaceCalendarPage() {
  const { spaceId } = useParams();
  const { currentWorkspace } = useProjectStore();
  const space = currentWorkspace?.spaces.find(s => s.id === spaceId);

  if (!space) return null;

  return (
    <div className='p-6'>
      <CalendarView space={space} />
    </div>
  );
}
