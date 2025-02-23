'use client';

import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { useProjectStore } from '@/lib/store/project-store';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspaceId } = useParams();
  const { setCurrentWorkspace } = useProjectStore();

  useEffect(() => {
    if (workspaceId) {
      setCurrentWorkspace(workspaceId as string);
    }
  }, [workspaceId, setCurrentWorkspace]);

  return (
    <div className='h-screen flex flex-col'>
      <WorkspaceHeader />
      <div className='flex-1 flex'>
        <WorkspaceSidebar />
        <main className='flex-1 overflow-auto bg-background'>{children}</main>
      </div>
    </div>
  );
}
