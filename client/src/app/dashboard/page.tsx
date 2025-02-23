'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const { currentWorkspace } = useProjectStore();

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          New Project
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>
              {currentWorkspace?.spaces.reduce(
                (acc, space) =>
                  acc +
                  space.lists.reduce(
                    (acc, list) =>
                      acc +
                      list.tasks.filter(task => task.status !== 'completed')
                        .length,
                    0
                  ),
                0
              ) || 0}
            </div>
          </CardContent>
        </Card>
        {/* Add more dashboard cards */}
      </div>
    </div>
  );
}
