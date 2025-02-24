'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SpaceSettingsPage() {
  const { spaceId } = useParams();
  const { currentWorkspace, updateSpace } = useProjectStore();
  const space = currentWorkspace?.spaces.find(s => s.id === spaceId);

  if (!space) return null;

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Space Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Space Name</Label>
            <Input
              id='name'
              value={space.name}
              onChange={e => {
                if (currentWorkspace) {
                  updateSpace(currentWorkspace.id, space.id, {
                    name: e.target.value,
                  });
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
