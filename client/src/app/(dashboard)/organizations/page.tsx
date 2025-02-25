'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  RainbowButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import { Search, Plus, Users, Calendar, Settings } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Organization } from '@/types';
import { OrganizationDialog } from '@/components';

export default function OrganizationsPage() {
  const { organizations } = useProjectStore();
  const [search, setSearch] = useState('');

  const [open, setOpen] = useState(false);

  const myOrganizations =
    organizations.filter(o =>
      o.members?.some(m => m.role === 'OWNER' || m.role === 'ADMIN')
    ) || [];
  const joinedOrganizations =
    organizations.filter(o =>
      o.members?.some(m => m.role === 'MEMBER' || m.role === 'GUEST')
    ) || [];

  const filteredMyOrganizations = myOrganizations.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredJoinedOrganizations = joinedOrganizations.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='p-6  mx-auto'>
      <OrganizationDialog open={open} onOpenChange={setOpen} />
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold'>Organizations</h1>

        <RainbowButton className='text-primary' onClick={() => setOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          New Organization
        </RainbowButton>
      </div>

      <div className='mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search organizations...'
            className='pl-10'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue='my-organizations'>
        <TabsList className='mb-6'>
          <TabsTrigger value='my-organizations'>
            My Organizations ({filteredMyOrganizations.length})
          </TabsTrigger>
          <TabsTrigger value='joined'>
            Joined Organizations ({filteredJoinedOrganizations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='my-organizations'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredMyOrganizations.map(organization => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value='joined'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredJoinedOrganizations.map(organization => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface OrganizationCardProps {
  organization: Organization;
}

function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Card className='p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-lg font-semibold'>
            {organization.name[0].toUpperCase()}
          </div>
          <div>
            <h3 className='font-semibold'>{organization.name}</h3>
            <p className='text-sm text-muted-foreground'>
              {organization.teams?.length || 0} Teams
            </p>
          </div>
        </div>
        <Link href={`/organizations/${organization.id}/settings`}>
          <Button variant='ghost' size='icon'>
            <Settings className='h-4 w-4' />
          </Button>
        </Link>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Users className='h-4 w-4' />
          <span>{organization.members?.length || 0} Members</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Calendar className='h-4 w-4' />
          <span>
            Created {new Date(organization.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className='mt-4 pt-4 border-t flex justify-end'>
        <Link href={`/organizations/${organization.id}`}>
          <Button>Open Organization</Button>
        </Link>
      </div>
    </Card>
  );
}
