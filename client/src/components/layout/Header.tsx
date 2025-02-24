'use client';

import * as React from 'react';
import { useProjectStore } from '@/lib/store/project-store';
import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  List,
  Calendar,
  GanttChart,
  GitBranch,
  Plus,
  Filter,
  SlidersHorizontal,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ViewType } from '@/types';

const viewOptions: {
  icon: React.ReactElement;
  type: ViewType;
  label: string;
}[] = [
  { icon: <List className='h-4 w-4' />, type: 'list', label: 'List' },
  { icon: <LayoutGrid className='h-4 w-4' />, type: 'board', label: 'Board' },
  {
    icon: <Calendar className='h-4 w-4' />,
    type: 'calendar',
    label: 'Calendar',
  },
  {
    icon: <GanttChart className='h-4 w-4' />,
    type: 'gantt',
    label: 'Gantt',
  },
  {
    icon: <GitBranch className='h-4 w-4' />,
    type: 'timeline',
    label: 'Timeline',
  },
];

export function Header() {
  const { currentView, setCurrentView } = useProjectStore();

  return (
    <div className='h-16 border-b flex items-center justify-between px-4'>
      <div className='flex items-center gap-2'>
        {/* View Switcher */}
        <div className='flex items-center bg-accent/50 p-1 rounded-lg'>
          {viewOptions.map(option => (
            <Button
              key={option.type}
              variant='ghost'
              size='sm'
              className={cn(
                'px-3',
                currentView === option.type && 'bg-background shadow-sm'
              )}
              onClick={() => setCurrentView(option.type)}
            >
              {option.icon}
              <span className='ml-2'>{option.label}</span>
            </Button>
          ))}
        </div>

        {/* Filters */}
        <Button variant='outline' size='sm' className='gap-2'>
          <Filter className='h-4 w-4' />
          Filter
        </Button>

        <Button variant='outline' size='sm' className='gap-2'>
          <SlidersHorizontal className='h-4 w-4' />
          Sort
        </Button>
      </div>

      <div className='flex items-center gap-4'>
        {/* Search */}
        <div className='relative w-64'>
          <Search className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input placeholder='Search tasks...' className='pl-8' />
        </div>

        {/* Add Task Button */}
        <Button className='gap-2'>
          <Plus className='h-4 w-4' />
          Add Task
        </Button>
      </div>
    </div>
  );
}
