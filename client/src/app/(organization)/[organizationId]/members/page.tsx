'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function OrganizationMembersPage() {
  const { organizationId } = useParams();
  const { organizations } = useProjectStore();
  const organization = organizations.find(org => org.id === organizationId);

  if (!organization) {
    return null;
  }

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
          <CardTitle>Organization Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {organization.members?.map(member => (
              <div
                key={member.id}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium'>
                    {member.role[0]}
                  </div>
                  <div>
                    <div className='font-medium'>
                      {member.department || member.role}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {member.title || 'Member'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='text-sm text-muted-foreground'>
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                  <Button variant='outline'>Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
