'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { useParams } from 'next/navigation';
import { BoardView } from '@/components/space/BoardView';

export default function SpacePage() {
  const { spaceId } = useParams();
  const { currentWorkspace } = useProjectStore();
  const space = currentWorkspace?.spaces.find(s => s.id === spaceId);

  if (!space) return null;

  return (
    <div className='p-6'>
      <BoardView space={space} />
    </div>
  );
}
