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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore, SpaceColor } from '@/lib/store/project-store';

const spaceFormSchema = z.object({
  name: z.string().min(1, 'Space name is required').max(100),
  color: z.enum(['purple', 'blue', 'green', 'yellow', 'red', 'pink']),
});

type SpaceFormValues = z.infer<typeof spaceFormSchema>;

interface SpaceDialogProps {
  workspaceId: string;
  spaceId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLOR_OPTIONS: { label: string; value: SpaceColor; bg: string }[] = [
  { label: 'Purple', value: 'purple', bg: 'bg-purple-500' },
  { label: 'Blue', value: 'blue', bg: 'bg-blue-500' },
  { label: 'Green', value: 'green', bg: 'bg-green-500' },
  { label: 'Yellow', value: 'yellow', bg: 'bg-yellow-500' },
  { label: 'Red', value: 'red', bg: 'bg-red-500' },
  { label: 'Pink', value: 'pink', bg: 'bg-pink-500' },
];

export function SpaceDialog({
  workspaceId,
  spaceId,
  open,
  onOpenChange,
}: SpaceDialogProps) {
  const { currentWorkspace, addSpace, updateSpace } = useStore();
  const existingSpace = spaceId
    ? currentWorkspace?.spaces.find(s => s.id === spaceId)
    : undefined;

  const form = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: {
      name: existingSpace?.name || '',
      color: existingSpace?.color || 'purple',
    },
  });

  function onSubmit(data: SpaceFormValues) {
    if (spaceId && currentWorkspace) {
      updateSpace(currentWorkspace.id, spaceId, data);
    } else {
      addSpace(workspaceId, {
        ...data,
        lists: [],
      });
    }
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{spaceId ? 'Edit Space' : 'Create Space'}</DialogTitle>
          <DialogDescription>
            {spaceId
              ? 'Edit your space details below.'
              : 'Create a new space to organize your lists and tasks.'}
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
                    <Input placeholder='Enter space name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a color' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COLOR_OPTIONS.map(option => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className='flex items-center gap-2'
                        >
                          <div
                            className={`w-4 h-4 rounded-full ${option.bg}`}
                          />
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {spaceId ? 'Update Space' : 'Create Space'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
