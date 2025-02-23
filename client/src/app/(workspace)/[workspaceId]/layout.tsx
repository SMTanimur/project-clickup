'use client';

import * as React from 'react';

import { useProjectStore } from '@/lib/store/project-store';
import { useParams} from 'next/navigation';

import {

  SidebarInset,
  SidebarProvider,

} from '@/components/ui/sidebar';

import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { WorkspaceSidebar } from '@/components';



export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspaceId } = useParams();
  const { setCurrentWorkspace } = useProjectStore();

  React.useEffect(() => {
    if (workspaceId) {
      setCurrentWorkspace(workspaceId as string);
    }
  }, [workspaceId, setCurrentWorkspace]);

  return (
    <SidebarProvider>
      <WorkspaceSidebar />
      <SidebarInset>
        <WorkspaceHeader/>
        <main className='flex-1 overflow-auto relative'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
