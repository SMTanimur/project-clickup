'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function WorkspacePage() {
  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Projects</h1>
        <Button >
          <Plus className='h-4 w-4 mr-2' />
          New Project
        </Button>
      </div>
    </div>
  );
}
