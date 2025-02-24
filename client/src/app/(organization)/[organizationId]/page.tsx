'use client';

import { useProjectStore } from '@/lib/store/project-store';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { NewProjectModal } from '@/components/dashboard/NewProjectModal';


export default function WorkspacePage() {
  const { currentWorkspace } = useProjectStore();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Projects</h1>
        <Button onClick={() => setShowNewProjectModal(true)}>
          <Plus className='h-4 w-4 mr-2' />
          New Project
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {currentWorkspace?.spaces.map(space => (
          <ProjectCard key={space.id} space={space} />
        ))}
      </div>

      <NewProjectModal
        open={showNewProjectModal}
        setOpen={setShowNewProjectModal}
      />
    </div>
  );
}
