'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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

export function OrganizationSidebar() {
  const pathname = usePathname();
  const { organizationId } = useParams();


  const navItems = [
    {
      title: 'Overview',
      icon: LayoutGrid,
      href: `/${organizationId}`,
    },
    {
      title: 'Projects',
      icon: FolderKanban,
      href: `/${organizationId}/projects`,
    },
    {
      title: 'Calendar',
      icon: Calendar,
      href: `/${organizationId}/calendar`,
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      href: `/${organizationId}/messages`,
    },
  ];

  const bottomNavItems = [
    {
      title: 'Members',
      icon: Users,
      href: `/${organizationId}/members`,
    },
    {
      title: 'Settings',
      icon: Settings,
      href: `/${organizationId}/settings`,
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
