"use client"

import {
  LayoutGrid,
  Settings,
  Users,
  FolderKanban,
  Calendar,
  MessageSquare,
  Search,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectStore } from '@/lib/store/project-store';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui';
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
    <Sidebar>
      <SidebarHeader className='p-4 border-b'>
        <h1 className='text-lg font-semibold'>{currentWorkspace?.name}</h1>
        <div className='relative mt-4'>
          <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input placeholder='Search...' className='pl-8' />
        </div>
      </SidebarHeader>

      <SidebarContent className='px-2'>
        <div className='space-y-1 py-2'>
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>
              <Button
                variant='ghost'
                className='w-full justify-start gap-2'
                data-active={pathname === item.href}
              >
                <item.icon className='h-4 w-4' />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>

        <div className='py-2'>
          <div className='px-2 mb-2'>
            <h3 className='text-sm font-medium'>Projects</h3>
          </div>
          {currentWorkspace?.spaces.map(space => (
            <Link key={space.id} href={`/${workspaceId}/space/${space.id}`}>
              <Button
                variant='ghost'
                className='w-full justify-start gap-2 pl-6'
                data-active={pathname === `/${workspaceId}/space/${space.id}`}
              >
                <div
                  className='w-2 h-2 rounded-full'
                  style={{ backgroundColor: space.color }}
                />
                <span className='truncate'>{space.name}</span>
              </Button>
            </Link>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className='p-4 border-t space-y-2'>
        {bottomNavItems.map(item => (
          <Link key={item.href} href={item.href}>
            <Button
              variant='ghost'
              className='w-full justify-start gap-2'
              data-active={pathname === item.href}
            >
              <item.icon className='h-4 w-4' />
              {item.title}
            </Button>
          </Link>
        ))}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}