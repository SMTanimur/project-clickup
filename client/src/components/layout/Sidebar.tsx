'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/store/project-store';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Layout,
  Calendar,
  Clock,
  CheckSquare,
  BarChart2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

function SidebarItem({ icon, label, href, isActive }: SidebarItemProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors',
          isActive && 'bg-accent'
        )}
      >
        {icon}
        <span className='text-sm font-medium'>{label}</span>
      </div>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const { currentWorkspace } = useProjectStore();
  const [expandedSpaces, setExpandedSpaces] = useState<Record<string, boolean>>(
    {}
  );

  const toggleSpace = (spaceId: string) => {
    setExpandedSpaces(prev => ({
      ...prev,
      [spaceId]: !prev[spaceId],
    }));
  };

  return (
    <div className='w-64 h-screen bg-background border-r flex flex-col'>
      {/* Workspace Selector */}
      <div className='p-4 border-b'>
        <Button variant='ghost' className='w-full justify-start gap-2'>
          <Layout className='h-4 w-4' />
          <span className='font-medium truncate'>
            {currentWorkspace?.name || 'Select Workspace'}
          </span>
          <ChevronDown className='h-4 w-4 ml-auto' />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className='p-2'>
        <SidebarItem
          icon={<CheckSquare className='h-4 w-4' />}
          label='My Tasks'
          href='/my-tasks'
          isActive={pathname === '/my-tasks'}
        />
        <SidebarItem
          icon={<Calendar className='h-4 w-4' />}
          label='Calendar'
          href='/calendar'
          isActive={pathname === '/calendar'}
        />
        <SidebarItem
          icon={<Clock className='h-4 w-4' />}
          label='Time Tracking'
          href='/time'
          isActive={pathname === '/time'}
        />
        <SidebarItem
          icon={<BarChart2 className='h-4 w-4' />}
          label='Dashboard'
          href='/dashboard'
          isActive={pathname === '/dashboard'}
        />
      </div>

      <div className='flex-1 overflow-y-auto p-2'>
        {/* Spaces */}
        {currentWorkspace?.spaces.map(space => (
          <div key={space.id} className='mb-2'>
            <div
              className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/50 cursor-pointer'
              onClick={() => toggleSpace(space.id)}
            >
              <div
                className={cn('w-2 h-2 rounded-full', `bg-${space.color}-500`)}
              />
              {expandedSpaces[space.id] ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
              <span className='text-sm font-medium'>{space.name}</span>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 ml-auto opacity-0 group-hover:opacity-100'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            {/* Lists */}
            {expandedSpaces[space.id] && (
              <div className='ml-9 mt-1 space-y-1'>
                {space.lists.map(list => (
                  <Link
                    key={list.id}
                    href={`/space/${space.id}/list/${list.id}`}
                    className={cn(
                      'block px-3 py-1 text-sm rounded-lg hover:bg-accent/50',
                      params?.listId === list.id && 'bg-accent'
                    )}
                  >
                    {list.name}
                  </Link>
                ))}
                <Button
                  variant='ghost'
                  size='sm'
                  className='w-full justify-start text-muted-foreground'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Add List
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className='p-4 border-t'>
        <Button variant='ghost' className='w-full justify-start gap-2'>
          <Settings className='h-4 w-4' />
          <span className='font-medium'>Settings</span>
        </Button>
      </div>
    </div>
  );
}
