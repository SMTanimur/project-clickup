'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Organization, TaskStatus } from '@/types';

interface TasksOverviewProps {
  organization: Organization | null;
}

export function TasksOverview({ organization }: TasksOverviewProps) {
  if (!organization) return null;
  const tasksByStatus = getTasksByStatus(organization);

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
                {status.replace('_', ' ')}
              </span>
              <span className='text-2xl font-bold'>{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getTasksByStatus(
  organization: Organization
): Record<TaskStatus, number> {
  const initial: Record<TaskStatus, number> = {
    TODO: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };

  if (!organization.tasks) return initial;

  return organization.tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, initial);
}
