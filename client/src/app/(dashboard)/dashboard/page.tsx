'use client';

import { useProjectStore, Workspace } from '@/lib/store/project-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { TasksOverview } from '@/components/dashboard/TasksOverview';
import { NewProjectModal } from '@/components/dashboard/NewProjectModal';

import { useState } from 'react';

export default function DashboardPage() {
  const { currentWorkspace } = useProjectStore();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  console.log({ showNewProjectModal });
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <Button
          onClick={() => setShowNewProjectModal(true)}
          type='button'
          className='z-50'
        >
          <Plus className='h-4 w-4 mr-2' />
          New Project
        </Button>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <MetricCard
          title='Active Tasks'
          value={getTotalActiveTasks(currentWorkspace)}
          icon={<CheckCircle className='h-4 w-4 text-green-500' />}
        />
        <MetricCard
          title='Team Members'
          value={currentWorkspace?.members.length || 0}
          icon={<Users className='h-4 w-4 text-blue-500' />}
        />
        <MetricCard
          title='Hours Tracked'
          value={getTotalHoursTracked(currentWorkspace)}
          icon={<Clock className='h-4 w-4 text-purple-500' />}
        />
        <MetricCard
          title='Overdue Tasks'
          value={getOverdueTasks(currentWorkspace)}
          icon={<AlertCircle className='h-4 w-4 text-red-500' />}
        />
      </div>

      {/* Projects Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {currentWorkspace?.spaces.map(space => (
          <ProjectCard key={space.id} space={space} />
        ))}
      </div>

      {/* Tasks Overview */}
      <TasksOverview workspace={currentWorkspace} />

      <NewProjectModal
        open={showNewProjectModal}
        setOpen={setShowNewProjectModal}
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
      </CardContent>
    </Card>
  );
}

function getTotalActiveTasks(workspace: Workspace | null): number {
  if (!workspace) return 0;
  return workspace.spaces.reduce(
    (acc, space) =>
      acc +
      space.lists.reduce(
        (acc, list) =>
          acc + list.tasks.filter(task => task.status !== 'completed').length,
        0
      ),
    0
  );
}

function getTotalHoursTracked(workspace: Workspace | null): number {
  if (!workspace) return 0;
  return Math.floor(
    workspace.spaces.reduce(
      (acc, space) =>
        acc +
        space.lists.reduce(
          (acc, list) =>
            acc +
            list.tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0),
          0
        ),
      0
    ) / 60
  );
}

function getOverdueTasks(workspace: Workspace | null): number {
  if (!workspace) return 0;
  const now = new Date();
  return workspace.spaces.reduce(
    (acc, space) =>
      acc +
      space.lists.reduce(
        (acc, list) =>
          acc +
          list.tasks.filter(
            task =>
              task.status !== 'completed' &&
              task.dueDate &&
              new Date(task.dueDate) < now
          ).length,
        0
      ),
    0
  );
}
