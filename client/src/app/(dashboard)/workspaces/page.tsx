'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Search, Plus, Users, Calendar, Settings } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function WorkspacesPage() {
  const { workspaces } = useProjectStore();
  const [search, setSearch] = useState('');

  const myWorkspaces = workspaces.filter(w => w.members.some(m => m.role === 'admin'));
  const joinedWorkspaces = workspaces.filter(w => w.members.some(m => m.role === 'member'));

  const filteredMyWorkspaces = myWorkspaces.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredJoinedWorkspaces = joinedWorkspaces.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold'>Workspaces</h1>
        <Link href='/new'>
          <Button>
            <Plus className='h-4 w-4 mr-2' />
            New Workspace
          </Button>
        </Link>
      </div>

      <div className='mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input 
            placeholder='Search workspaces...' 
            className='pl-10'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue='my-workspaces'>
        <TabsList className='mb-6'>
          <TabsTrigger value='my-workspaces'>
            My Workspaces ({myWorkspaces.length})
          </TabsTrigger>
          <TabsTrigger value='joined'>
            Joined Workspaces ({joinedWorkspaces.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='my-workspaces'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredMyWorkspaces.map(workspace => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value='joined'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredJoinedWorkspaces.map(workspace => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WorkspaceCard({ workspace }: { workspace: any }) {
  return (
    <Card className='p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-lg font-semibold'>
            {workspace.name[0].toUpperCase()}
          </div>
          <div>
            <h3 className='font-semibold'>{workspace.name}</h3>
            <p className='text-sm text-muted-foreground'>
              {workspace.spaces.length} Projects
            </p>
          </div>
        </div>
        <Link href={`/${workspace.id}/settings`}>
          <Button variant='ghost' size='icon'>
            <Settings className='h-4 w-4' />
          </Button>
        </Link>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Users className='h-4 w-4' />
          <span>{workspace.members.length} Members</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Calendar className='h-4 w-4' />
          <span>Created {new Date(workspace.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className='mt-4 pt-4 border-t flex justify-end'>
        <Link href={`/${workspace.id}`}>
          <Button>Open Workspace</Button>
        </Link>
      </div>
    </Card>
  );
}
