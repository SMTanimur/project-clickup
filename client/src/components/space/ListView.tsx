'use client';

import { Space } from '@/lib/store/project-store';

interface ListViewProps {
  space: Space;
}

export function ListView({ space }: ListViewProps) {
  return <div>List view for {space.name}</div>;
}
