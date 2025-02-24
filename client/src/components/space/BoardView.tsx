'use client';

import { Space } from '@/lib/store/project-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BoardViewProps {
  space: Space;
}

export function BoardView({ space }: BoardViewProps) {
  return (
    <div className='flex gap-4'>
      {space.lists.map(list => (
        <div key={list.id} className='w-80'>
          <Card>
            <CardHeader className='p-3'>
              <CardTitle className='text-sm font-medium flex items-center justify-between'>
                {list.name}
                <span className='text-xs text-muted-foreground'>
                  {list.tasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-3 space-y-2'>
              {list.tasks.map(task => (
                <Card key={task.id} className='p-3'>
                  <h3 className='font-medium'>{task.title}</h3>
                  {task.description && (
                    <p className='text-sm text-muted-foreground mt-1'>
                      {task.description}
                    </p>
                  )}
                </Card>
              ))}
              <Button variant='ghost' className='w-full justify-start'>
                <Plus className='h-4 w-4 mr-2' />
                Add Task
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}
      <div className='w-80'>
        <Button variant='outline' className='w-full'>
          <Plus className='h-4 w-4 mr-2' />
          Add List
        </Button>
      </div>
    </div>
  );
}
