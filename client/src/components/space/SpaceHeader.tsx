'use client';

import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/lib/store/project-store';
import { useParams } from 'next/navigation';
import { Plus, Filter, SortAsc, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SpaceHeader() {
  const { spaceId } = useParams();
  const { currentWorkspace } = useProjectStore();
  const space = currentWorkspace?.spaces.find(s => s.id === spaceId);

  return (
    <div className='h-14 border-b bg-card flex items-center justify-between px-4'>
      <div className='flex items-center gap-4'>
        <Button
          size='sm'
          disabled={!space}
          title={!space ? 'No space selected' : 'Add new task'}
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Task
        </Button>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='sm'>
            <Filter className='h-4 w-4 mr-2' />
            Filter
          </Button>
          <Button variant='ghost' size='sm'>
            <SortAsc className='h-4 w-4 mr-2' />
            Sort
          </Button>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative w-64'>
          <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input placeholder='Search tasks...' className='pl-8' />
        </div>
      </div>
    </div>
  );
}
