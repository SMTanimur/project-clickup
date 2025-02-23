import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useUserStore } from '@/lib/store/user-store';
import { useProjectStore, Workspace } from '@/lib/store/project-store';

const workspaceFormSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100),
  description: z.string().max(500).optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;

interface WorkspaceDialogProps {
  workspaceId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (workspace: Workspace) => void;
}

export function WorkspaceDialog({
  workspaceId,
  open,
  onOpenChange,
  onComplete,
}: WorkspaceDialogProps) {
  const { workspaces, updateWorkspace,createWorkspace } = useProjectStore();
  const { currentUser } = useUserStore();
  const existingWorkspace = workspaceId
    ? workspaces.find(w => w.id === workspaceId)
    : undefined;

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: existingWorkspace?.name || '',
      description: existingWorkspace?.description || '',
    },
  });

  function onSubmit(data: WorkspaceFormValues) {
    if (workspaceId) {
      updateWorkspace(workspaceId, data);
    } else if (currentUser) {
      const workspace = createWorkspace({
        ...data,
        description: data.description || '', // Ensure description is never undefined
      }, currentUser);
      onComplete?.(workspace);
    }
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {workspaceId ? 'Edit Workspace' : 'Create Workspace'}
          </DialogTitle>
          <DialogDescription>
            {workspaceId
              ? 'Edit your workspace details below.'
              : 'Create a new workspace to organize your projects and tasks.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter workspace name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter workspace description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>
                {workspaceId ? 'Update Workspace' : 'Create Workspace'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
