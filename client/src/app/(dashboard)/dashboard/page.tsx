'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Organization } from '@/types';

export default function DashboardPage() {
  const { currentOrganization } = useProjectStore();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

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
          value={getTotalActiveTasks(currentOrganization)}
          icon={<CheckCircle className='h-4 w-4 text-green-500' />}
        />
        <MetricCard
          title='Team Members'
          value={currentOrganization?.members?.length || 0}
          icon={<Users className='h-4 w-4 text-blue-500' />}
        />
        <MetricCard
          title='Total Teams'
          value={currentOrganization?.teams?.length || 0}
          icon={<Clock className='h-4 w-4 text-purple-500' />}
        />
        <MetricCard
          title='Overdue Tasks'
          value={getOverdueTasks(currentOrganization)}
          icon={<AlertCircle className='h-4 w-4 text-red-500' />}
        />
      </div>

      {/* Teams Overview */}
      <section>
        <h2 className='text-xl font-semibold mb-4'>Teams</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {currentOrganization?.teams?.map(team => (
            <Card key={team.id} className='p-4'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-lg font-semibold'>
                  {team.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className='font-semibold'>{team.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {team.members?.length || 0} Members
                  </p>
                </div>
              </div>
              {team.description && (
                <p className='text-sm text-muted-foreground'>
                  {team.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Tasks Overview */}
      <section>
        <h2 className='text-xl font-semibold mb-4'>Recent Tasks</h2>
        <div className='grid gap-4'>
          {currentOrganization?.tasks?.map(task => (
            <Card key={task.id} className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='font-medium'>{task.title}</h4>
                  {task.description && (
                    <p className='text-sm text-muted-foreground'>
                      {task.description}
                    </p>
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      task.status === 'TODO'
                        ? 'bg-yellow-100 text-yellow-800'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : task.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {task.status}
                  </span>
                  {task.dueDate && (
                    <span className='text-sm text-muted-foreground'>
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {showNewProjectModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
          <Card className='w-full max-w-md p-6'>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Project creation form will go here</p>
              <div className='mt-4 flex justify-end'>
                <Button
                  variant='outline'
                  onClick={() => setShowNewProjectModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function MetricCard({ title, value, icon }: MetricCardProps) {
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

function getTotalActiveTasks(organization: Organization | null): number {
  if (!organization?.tasks) return 0;
  return organization.tasks.filter(
    task => task.status === 'TODO' || task.status === 'IN_PROGRESS'
  ).length;
}

function getOverdueTasks(organization: Organization | null): number {
  if (!organization?.tasks) return 0;
  const now = new Date();
  return organization.tasks.filter(
    task =>
      (task.status === 'TODO' || task.status === 'IN_PROGRESS') &&
      task.dueDate &&
      new Date(task.dueDate) < now
  ).length;
}
