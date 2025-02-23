'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { useProjectStore } from '@/lib/store/project-store';
import { Search } from 'lucide-react';

interface CommandPaletteProps {
  onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const { workspaces, currentWorkspace } = useProjectStore();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='p-0'>
        <Command className='rounded-lg border shadow-md'>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList>
            <CommandGroup heading='Quick Actions'>
              <CommandItem>Create New Task</CommandItem>
              <CommandItem>Create New Project</CommandItem>
              <CommandItem>View All Tasks</CommandItem>
            </CommandGroup>
            <CommandGroup heading='Recent'>
              {currentWorkspace?.spaces.map(space => (
                <CommandItem key={space.id}>{space.name}</CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
