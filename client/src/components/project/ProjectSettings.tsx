/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '../ui';

interface ProjectSettingsProps {
  projectId: string;
}

export function ProjectSettings({ projectId }: ProjectSettingsProps) {
 

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-3 gap-4'>
            <div>
              <Label>Primary Color</Label>
              <Input
                type='color'
                onChange={e =>
                  console.log(e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Settings</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>Compact View</Label>
            <Switch onCheckedChange={() => console.log('toggleViewMode')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>Email Notifications</Label>
            <Switch
              onCheckedChange={checked =>
                console.log(checked)
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label>Desktop Notifications</Label>
            <Switch
              onCheckedChange={checked =>
                console.log(checked)
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label>In-App Notifications</Label>
            <Switch
              onCheckedChange={checked =>
                console.log(checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
