'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { useParams } from 'next/navigation';
import { ListView } from '@/components/space/ListView';

export default function SpaceListPage() {
  const { spaceId } = useParams();
  const { currentWorkspace } = useProjectStore();
  const space = currentWorkspace?.spaces.find(s => s.id === spaceId);

  if (!space) return null;

  return (
    <div className='p-6'>
      <ListView space={space} />
    </div>
  );
}
