'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  Clock,
  Building2,
  Plus,
  Search,
  UserPlus,
} from 'lucide-react';
import { useProjectStore } from '@/lib/store/project-store';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentOrganization } = useProjectStore();

  const navItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      title: 'Time Tracker',
      icon: Clock,
      href: '/dashboard/time-tracker',
    },
    {
      title: 'Organizations',
      icon: Building2,
      href: '/organizations',
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className='p-4 border-b'>
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

        {currentOrganization && (
          <div className='py-2'>
            <div className='flex items-center justify-between px-2 mb-2'>
              <h3 className='text-sm font-medium'>Teams</h3>
              <Button
                variant='ghost'
                size='icon'
                onClick={() =>
                  router.push(
                    `/organizations/${currentOrganization.id}/teams/new`
                  )
                }
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            {currentOrganization.teams?.map(team => (
              <Link
                key={team.id}
                href={`/organizations/${currentOrganization.id}/teams/${team.id}`}
              >
                <Button
                  variant='ghost'
                  className='w-full justify-start gap-2'
                  data-active={
                    pathname ===
                    `/organizations/${currentOrganization.id}/teams/${team.id}`
                  }
                >
                  <div className='w-6 h-6 rounded bg-accent flex items-center justify-center'>
                    {team.name[0].toUpperCase()}
                  </div>
                  <span className='truncate'>{team.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className='p-4 border-t'>
        <Button variant='outline' className='w-full justify-start gap-2'>
          <UserPlus className='h-4 w-4' />
          Join Organization
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <main className='flex-1 overflow-auto relative'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
