'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  List,
  Calendar,
  Settings,
  Plus,
  ChevronDown,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Team, TaskList } from '@/types';

interface TeamSidebarProps {
  team: Team;
  lists: TaskList[];
  currentView: 'board' | 'list' | 'calendar';
  onAddList?: () => void;
}

export function TeamSidebar({
  team,
  lists,
  currentView,
  onAddList,
}: TeamSidebarProps) {
  const buttonClasses = (isActive: boolean) =>
    cn('w-full justify-start gap-2', isActive && 'bg-accent');

  return (
    <div className='w-60 border-r bg-card flex flex-col'>
      {/* Team Info */}
      <div className='p-4 border-b'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h2 className='font-semibold truncate'>{team.name}</h2>
          </div>
          <Button variant='ghost' size='icon'>
            <ChevronDown className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Views */}
      <div className='flex-1 p-4 space-y-2'>
        <div className='space-y-1'>
          <Link href={`/teams/${team.id}`}>
            <Button
              variant='ghost'
              className={buttonClasses(currentView === 'board')}
            >
              <LayoutGrid className='h-4 w-4' />
              Board View
            </Button>
          </Link>
          <Link href={`/teams/${team.id}/list`}>
            <Button
              variant='ghost'
              className={buttonClasses(currentView === 'list')}
            >
              <List className='h-4 w-4' />
              List View
            </Button>
          </Link>
          <Link href={`/teams/${team.id}/calendar`}>
            <Button
              variant='ghost'
              className={buttonClasses(currentView === 'calendar')}
            >
              <Calendar className='h-4 w-4' />
              Calendar
            </Button>
          </Link>
        </div>

        <div className='pt-4'>
          <h3 className='text-sm font-medium mb-2'>Lists</h3>
          {lists.map(list => (
            <Link key={list.id} href={`/teams/${team.id}/list/${list.id}`}>
              <Button
                variant='ghost'
                className='w-full justify-start gap-2 pl-6'
              >
                {list.color && (
                  <div
                    className='w-2 h-2 rounded-full'
                    style={{ backgroundColor: list.color }}
                  />
                )}
                {list.name}
              </Button>
            </Link>
          ))}
          <Button
            variant='ghost'
            className='w-full justify-start gap-2 pl-6 text-muted-foreground'
            onClick={onAddList}
          >
            <Plus className='h-4 w-4' />
            Add List
          </Button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className='p-4 border-t space-y-2'>
        <Link href={`/teams/${team.id}/members`}>
          <Button variant='ghost' className='w-full justify-start gap-2'>
            <Users className='h-4 w-4' />
            Members
          </Button>
        </Link>
        <Link href={`/teams/${team.id}/settings`}>
          <Button variant='ghost' className='w-full justify-start gap-2'>
            <Settings className='h-4 w-4' />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  );
}
