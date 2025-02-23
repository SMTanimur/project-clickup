'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/lib/store/project-store';
import { useParams } from 'next/navigation';
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

export function SpaceSidebar() {
  const { spaceId } = useParams();
  const { currentWorkspace } = useProjectStore();
  const space = currentWorkspace?.spaces.find(s => s.id === spaceId);

  const buttonClasses = (isActive: boolean) =>
    cn('w-full justify-start gap-2', isActive && 'bg-accent');

  return (
    <div className='w-60 border-r bg-card flex flex-col'>
      {/* Space Info */}
      <div className='p-4 border-b'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className={`w-2 h-2 rounded-full bg-${space?.color}-500`} />
            <h2 className='font-semibold truncate'>{space?.name}</h2>
          </div>
          <Button variant='ghost' size='icon'>
            <ChevronDown className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Views */}
      <div className='flex-1 p-4 space-y-2'>
        <div className='space-y-1'>
          <Link href={`/space/${spaceId}`}>
            <Button variant='ghost' className={buttonClasses(true)}>
              <LayoutGrid className='h-4 w-4' />
              Board View
            </Button>
          </Link>
          <Link href={`/space/${spaceId}/list`}>
            <Button variant='ghost' className='w-full justify-start gap-2'>
              <List className='h-4 w-4' />
              List View
            </Button>
          </Link>
          <Link href={`/space/${spaceId}/calendar`}>
            <Button variant='ghost' className='w-full justify-start gap-2'>
              <Calendar className='h-4 w-4' />
              Calendar
            </Button>
          </Link>
        </div>

        <div className='pt-4'>
          <h3 className='text-sm font-medium mb-2'>Lists</h3>
          {space?.lists.map(list => (
            <Link key={list.id} href={`/space/${spaceId}/list/${list.id}`}>
              <Button
                variant='ghost'
                className='w-full justify-start gap-2 pl-6'
              >
                <div
                  className='w-2 h-2 rounded-full'
                  style={{ backgroundColor: list.color }}
                />
                {list.name}
              </Button>
            </Link>
          ))}
          <Button
            variant='ghost'
            className='w-full justify-start gap-2 pl-6 text-muted-foreground'
          >
            <Plus className='h-4 w-4' />
            Add List
          </Button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className='p-4 border-t space-y-2'>
        <Button variant='ghost' className='w-full justify-start gap-2'>
          <Users className='h-4 w-4' />
          Members
        </Button>
        <Button variant='ghost' className='w-full justify-start gap-2'>
          <Settings className='h-4 w-4' />
          Settings
        </Button>
      </div>
    </div>
  );
}
