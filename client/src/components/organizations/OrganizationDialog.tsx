'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProjectStore } from '@/lib/store/project-store';
import { useUserStore } from '@/lib/store/user-store';
import { Organization } from '@/types';

const formSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  domain: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface OrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (organization: Organization) => void;
}

export function OrganizationDialog({
  open,
  onOpenChange,
  onComplete,
}: OrganizationDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { createOrganization } = useProjectStore();
  const { currentUser } = useUserStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      domain: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const organization = createOrganization(data, currentUser);
      onComplete(organization);
      onOpenChange(false);
      form.reset();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create organization. Please try again.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to start collaborating with your team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter organization name' {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter organization description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='domain'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter organization domain' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className='text-sm text-red-500 text-center'>{error}</div>
            )}

            <div className='flex justify-end gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Create Organization</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
