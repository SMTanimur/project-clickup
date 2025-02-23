'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function WorkspaceSettingsPage() {
  const { currentWorkspace, updateWorkspace } = useProjectStore();

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Workspace Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Workspace Name</Label>
            <Input
              id='name'
              value={currentWorkspace?.name}
              onChange={e =>
                currentWorkspace &&
                updateWorkspace(currentWorkspace.id, { name: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Input
              id='description'
              value={currentWorkspace?.description}
              onChange={e =>
                currentWorkspace &&
                updateWorkspace(currentWorkspace.id, {
                  description: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
