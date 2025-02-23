'use client';

import { useProjectStore } from '@/lib/store/project-store';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProjectSettingsProps {
  projectId: string;
}

export function ProjectSettings({ projectId }: ProjectSettingsProps) {
  const { updateProjectTheme, toggleViewMode, updateNotificationSettings } =
    useProjectStore();

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
                  updateProjectTheme(projectId, {
                    primary: e.target.value,
                    background: '#ffffff',
                    accent: '#f3f4f6',
                  })
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
            <Switch onCheckedChange={() => toggleViewMode(projectId)} />
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
                updateNotificationSettings(projectId, { email: checked })
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label>Desktop Notifications</Label>
            <Switch
              onCheckedChange={checked =>
                updateNotificationSettings(projectId, { desktop: checked })
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label>In-App Notifications</Label>
            <Switch
              onCheckedChange={checked =>
                updateNotificationSettings(projectId, { inApp: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
