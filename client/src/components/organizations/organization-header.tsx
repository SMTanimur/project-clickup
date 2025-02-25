'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { Search, Bell, HelpCircle, Settings, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function OrganizationHeader() {
  const { currentOrganization } = useProjectStore();

  return (
    <div className='h-11  border-b bg-card flex items-center justify-between px-4 sticky top-0 z-10'>
      <div className='flex items-center gap-4'>
        <h1 className='text-lg font-semibold'>{currentOrganization?.name}</h1>
      </div>

      <div className='flex  items-center gap-4'>
        <div className='relative w-64'>
          <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input placeholder='Search...' className='pl-8' />
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon'>
            <Bell className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon'>
            <HelpCircle className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon'>
            <Settings className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon'>
            <User className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  );
}
