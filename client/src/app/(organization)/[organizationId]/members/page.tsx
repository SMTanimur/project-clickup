'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function WorkspaceMembersPage() {
  const { currentWorkspace } = useProjectStore();

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Members</h1>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {currentWorkspace?.members.map(member => (
              <div
                key={member.id}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-full bg-accent' />
                  <div>
                    <div className='font-medium'>{member.name}</div>
                    <div className='text-sm text-muted-foreground'>
                      {member.email}
                    </div>
                  </div>
                </div>
                <Button variant='outline'>Remove</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
