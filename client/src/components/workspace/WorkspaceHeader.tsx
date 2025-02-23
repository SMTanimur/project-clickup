'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function WorkspaceHeader() {
  const { currentWorkspace } = useProjectStore();

  return (
    <div className='h-14 border-b bg-card flex items-center justify-between px-4'>
      <div className='flex items-center gap-4'>
        <h1 className='text-lg font-semibold'>{currentWorkspace?.name}</h1>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative w-64'>
          <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input placeholder='Search...' className='pl-8' />
        </div>
      </div>
    </div>
  );
}
