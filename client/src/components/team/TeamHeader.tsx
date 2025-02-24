'use client';

import { Button } from '@/components/ui/button';
import { Plus, Filter, SortAsc, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Team } from '@/types';

interface TeamHeaderProps {
  team: Team;
  onAddTask?: () => void;
  onFilter?: () => void;
  onSort?: () => void;
  onSearch?: (query: string) => void;
}

export function TeamHeader({
  team,
  onAddTask,
  onFilter,
  onSort,
  onSearch,
}: TeamHeaderProps) {
  return (
    <div className='h-14 border-b bg-card flex items-center justify-between px-4'>
      <div className='flex items-center gap-4'>
        <h2 className='font-semibold'>{team.name}</h2>
        <Button size='sm' onClick={onAddTask} title='Add new task'>
          <Plus className='h-4 w-4 mr-2' />
          Add Task
        </Button>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='sm' onClick={onFilter}>
            <Filter className='h-4 w-4 mr-2' />
            Filter
          </Button>
          <Button variant='ghost' size='sm' onClick={onSort}>
            <SortAsc className='h-4 w-4 mr-2' />
            Sort
          </Button>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative w-64'>
          <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search tasks...'
            className='pl-8'
            onChange={e => onSearch?.(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
