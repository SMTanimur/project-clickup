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
import { useStore } from '@/lib/store/project-store';

const listFormSchema = z.object({
  name: z.string().min(1, 'List name is required').max(100),
});

type ListFormValues = z.infer<typeof listFormSchema>;

interface ListDialogProps {
  spaceId: string;
  listId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ListDialog({
  spaceId,
  listId,
  open,
  onOpenChange,
}: ListDialogProps) {
  const { currentSpace, addList, updateList } = useStore();
  const existingList = listId
    ? currentSpace?.lists.find(l => l.id === listId)
    : undefined;

  const form = useForm<ListFormValues>({
    resolver: zodResolver(listFormSchema),
    defaultValues: {
      name: existingList?.name || '',
    },
  });

  function onSubmit(data: ListFormValues) {
    if (listId && currentSpace) {
      updateList(currentSpace.id, listId, data);
    } else {
      addList(spaceId, {
        ...data,
        tasks: [],
      });
    }
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{listId ? 'Edit List' : 'Create List'}</DialogTitle>
          <DialogDescription>
            {listId
              ? 'Edit your list details below.'
              : 'Create a new list to organize your tasks.'}
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
                    <Input placeholder='Enter list name' {...field} />
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
                {listId ? 'Update List' : 'Create List'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
