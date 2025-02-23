'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Workspace } from '@/lib/store/project-store';
import { TaskStatus } from '@/lib/store/project-store';

interface TasksOverviewProps {
  workspace: Workspace | null;
}

export function TasksOverview({ workspace }: TasksOverviewProps) {
  if (!workspace) return null;
  const tasksByStatus = getTasksByStatus(workspace);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {Object.entries(tasksByStatus).map(([status, count]) => (
            <div key={status} className='flex flex-col'>
              <span className='text-sm font-medium text-muted-foreground capitalize'>
                {status.replace('-', ' ')}
              </span>
              <span className='text-2xl font-bold'>{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getTasksByStatus(workspace?: Workspace): Record<TaskStatus, number> {
  const initial: Record<TaskStatus, number> = {
    todo: 0,
    'in-progress': 0,
    review: 0,
    completed: 0,
    blocked: 0,
  };

  if (!workspace) return initial;

  return workspace.spaces.reduce((acc, space) => {
    space.lists.forEach(list => {
      list.tasks.forEach(task => {
        acc[task.status] = (acc[task.status] || 0) + 1;
      });
    });
    return acc;
  }, initial);
}
