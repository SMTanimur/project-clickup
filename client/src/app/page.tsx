'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Plus,
  Star,
  Clock,
  CheckCircle2,
  Calendar,
  Users,
  Folder,
} from 'lucide-react';
import { WorkspaceDialog } from '@/components/workspace/WorkspaceDialog';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const { workspaces, currentWorkspace } = useProjectStore();
  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);

  return (
    <main className='container mx-auto py-8 space-y-8'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold'>Welcome back!</h1>
          <p className='text-muted-foreground mt-1'>
            Here&apos;s what&apos;s happening in your workspaces
          </p>
        </div>
        <Button onClick={() => setIsWorkspaceDialogOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Create Workspace
        </Button>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>My Tasks</CardTitle>
            <Star className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-xs text-muted-foreground'>
              4 due today, 8 upcoming
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Recent</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24</div>
            <p className='text-xs text-muted-foreground'>
              Tasks updated in last 24h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Completed</CardTitle>
            <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>89</div>
            <p className='text-xs text-muted-foreground'>
              Tasks completed this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Due Soon</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>7</div>
            <p className='text-xs text-muted-foreground'>
              Tasks due in next 48h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces Section */}
      <div>
        <h2 className='text-2xl font-bold mb-4'>Your Workspaces</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {workspaces.map(workspace => (
            <Card key={workspace.id} className='group'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2'>
                    <Folder className='h-5 w-5' />
                    {workspace.name}
                  </CardTitle>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
                <CardDescription className='flex items-center gap-2'>
                  <Users className='h-4 w-4' />
                  {workspace.members.length} members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {workspace.spaces.map(space => (
                    <div key={space.id} className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`w-2 h-2 rounded-full bg-${space.color}-500`}
                        />
                        <h3 className='font-medium'>{space.name}</h3>
                      </div>
                      <div className='pl-4 space-y-1'>
                        {space.lists.map(list => (
                          <div
                            key={list.id}
                            className='text-sm text-muted-foreground flex items-center justify-between'
                          >
                            <span>{list.name}</span>
                            <span>{list.tasks.length} tasks</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {workspace.spaces.length === 0 && (
                    <p className='text-sm text-muted-foreground'>
                      No spaces created yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create Workspace Card */}
          <Card
            className='flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-accent/50 transition-colors'
            onClick={() => setIsWorkspaceDialogOpen(true)}
          >
            <Plus className='h-12 w-12 text-muted-foreground mb-4' />
            <p className='font-medium'>Create New Workspace</p>
            <p className='text-sm text-muted-foreground'>
              Get started with a new workspace
            </p>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className='text-2xl font-bold mb-4'>Recent Activity</h2>
        <Card>
          <CardContent className='p-6 space-y-4'>
            {currentWorkspace?.spaces.flatMap(space =>
              space.lists.flatMap(list =>
                list.tasks.slice(0, 5).map(task => (
                  <div
                    key={task.id}
                    className='flex items-center justify-between'
                  >
                    <div>
                      <p className='font-medium'>{task.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        in {space.name} / {list.name}
                      </p>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {formatDistanceToNow(new Date(task.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                ))
              )
            ) || (
              <p className='text-center text-muted-foreground'>
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <WorkspaceDialog
        open={isWorkspaceDialogOpen}
        onOpenChange={setIsWorkspaceDialogOpen}
      />
    </main>
  );
}
