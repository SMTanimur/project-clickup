'use client';

import * as React from 'react';

import { useProjectStore } from '@/lib/store/project-store';
import { useParams} from 'next/navigation';

import {

  SidebarInset,
  SidebarProvider,

} from '@/components/ui/sidebar';
import { OrganizationHeader, OrganizationSidebar } from '@/components';





export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organizationId } = useParams();
  const { setCurrentOrganization } = useProjectStore();

  React.useEffect(() => {
    if (organizationId) {
      setCurrentOrganization(organizationId as string);
    }
  }, [organizationId, setCurrentOrganization]);

  return (
    <SidebarProvider>
      <OrganizationSidebar />
      <SidebarInset>
        <OrganizationHeader/>
        <main className='flex-1 overflow-auto relative'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
