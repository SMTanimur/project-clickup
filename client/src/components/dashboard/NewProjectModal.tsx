'use client';

import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useProjectStore } from '@/lib/store/project-store';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useUserStore } from '@/lib/store/user-store';

const formSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  template: z.enum(['agile', 'waterfall', 'custom'], {
    required_error: 'Please select a template',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface NewProjectModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NewProjectModal({ open, setOpen }: NewProjectModalProps) {
  const router = useRouter();
  const { currentWorkspace, createWorkspace, addSpace } = useProjectStore();
  const { currentUser } = useUserStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      template: 'agile',
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!currentWorkspace) {
      if (!currentUser) return;
      // Create a workspace if none exists
      // createWorkspace({
      //   name: 'My Workspace',
      //   description: 'Default workspace',
      // }, currentUser);
      return;
    }

    const newSpaceId = nanoid();
    addSpace({
      id: newSpaceId,
      name: data.name,
      color: 'blue',
      lists: [],
    });

    setOpen(false);
    form.reset();
    router.push(`/${currentWorkspace.id}/space/${newSpaceId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter project name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='template'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a template' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='agile'>Agile</SelectItem>
                      <SelectItem value='waterfall'>Waterfall</SelectItem>
                      <SelectItem value='custom'>Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-2 pt-4'>
              <Button
                variant='outline'
                type='button'
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Create Project</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
