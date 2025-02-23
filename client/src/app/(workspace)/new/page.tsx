'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { useUserStore } from '@/lib/store/user-store';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { NewWorkspaceForm } from '@/components/workspace/NewWorkspaceForm';

export default function NewWorkspacePage() {
  const router = useRouter();
  const { createWorkspace } = useProjectStore();
  const { currentUser } = useUserStore();

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>Create New Workspace</h1>
      <Card className='max-w-md'>
        <NewWorkspaceForm
          onSubmit={data => {
            const workspace = createWorkspace(data, currentUser);
            router.push(`/${workspace.id}`);
          }}
        />
      </Card>
    </div>
  );
}
