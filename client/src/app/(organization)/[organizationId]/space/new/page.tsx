'use client';

import { useProjectStore } from '@/lib/store/project-store';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { NewSpaceForm } from '@/components/space/NewSpaceForm';

export default function NewSpacePage() {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { addSpace } = useProjectStore();

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>Create New Space</h1>
      <Card className='max-w-md'>
        <NewSpaceForm
          onSubmit={data => {
            addSpace({
              ...data,
              lists: [],
            });
            router.push(`/${workspaceId}/space/${data.id}`);
          }}
        />
      </Card>
    </div>
  );
}
