'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Space } from '@/lib/store/project-store';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useProjectStore } from '@/lib/store/project-store';

interface ProjectCardProps {
  space: Space;
}

export function ProjectCard({ space }: ProjectCardProps) {
  const { currentWorkspace } = useProjectStore();
  const totalTasks = space.lists.reduce(
    (acc, list) => acc + list.tasks.length,
    0
  );
  const completedTasks = space.lists.reduce(
    (acc, list) =>
      acc + list.tasks.filter(task => task.status === 'completed').length,
    0
  );
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Link href={`/${currentWorkspace?.id}/space/${space.id}`}>
      <Card className='hover:shadow-md transition-shadow cursor-pointer'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <div className={`w-2 h-2 rounded-full bg-${space.color}-500`} />
            {space.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <Progress value={progress} />
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>
                {completedTasks} of {totalTasks} tasks completed
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
