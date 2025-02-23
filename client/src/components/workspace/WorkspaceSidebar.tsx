'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/lib/store/project-store';
import { useParams, usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Settings,
  Users,
  FolderKanban,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { workspaceId } = useParams();
  const { currentWorkspace } = useProjectStore();

  const navItems = [
    {
      title: 'Overview',
      icon: LayoutGrid,
      href: `/${workspaceId}`,
    },
    {
      title: 'Projects',
      icon: FolderKanban,
      href: `/${workspaceId}/projects`,
    },
    {
      title: 'Calendar',
      icon: Calendar,
      href: `/${workspaceId}/calendar`,
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      href: `/${workspaceId}/messages`,
    },
  ];

  const bottomNavItems = [
    {
      title: 'Members',
      icon: Users,
      href: `/${workspaceId}/members`,
    },
    {
      title: 'Settings',
      icon: Settings,
      href: `/${workspaceId}/settings`,
    },
  ];

  return (
    <div className='w-60 border-r bg-card flex flex-col'>
      <div className='flex-1 p-4 space-y-4'>
        {navItems.map(item => (
          <Link key={item.href} href={item.href}>
            <Button
              variant='ghost'
              className={cn(
                'w-full justify-start gap-2',
                pathname === item.href && 'bg-accent'
              )}
            >
              <item.icon className='h-4 w-4' />
              {item.title}
            </Button>
          </Link>
        ))}

        <div className='pt-4 border-t'>
          <h3 className='text-sm font-medium mb-2 px-2'>Projects</h3>
          {currentWorkspace?.spaces.map(space => (
            <Link key={space.id} href={`/${workspaceId}/space/${space.id}`}>
              <Button
                variant='ghost'
                className={cn(
                  'w-full justify-start gap-2 pl-6',
                  pathname === `/${workspaceId}/space/${space.id}` &&
                    'bg-accent'
                )}
              >
                <div
                  className='w-2 h-2 rounded-full'
                  style={{ backgroundColor: space.color }}
                />
                {space.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className='p-4 border-t space-y-2'>
        {bottomNavItems.map(item => (
          <Link key={item.href} href={item.href}>
            <Button
              variant='ghost'
              className={cn(
                'w-full justify-start gap-2',
                pathname === item.href && 'bg-accent'
              )}
            >
              <item.icon className='h-4 w-4' />
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
