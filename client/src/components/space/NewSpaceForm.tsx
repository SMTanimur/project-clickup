'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { nanoid } from 'nanoid';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.enum(['purple', 'blue', 'green', 'yellow', 'red', 'pink'] as const),
});

type FormData = z.infer<typeof formSchema>;

interface NewSpaceFormProps {
  onSubmit: (data: FormData & { id: string }) => void;
}

export function NewSpaceForm({ onSubmit }: NewSpaceFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: 'blue',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      id: nanoid(),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-4 p-4'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Space Name</FormLabel>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a color' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='purple'>Purple</SelectItem>
                  <SelectItem value='blue'>Blue</SelectItem>
                  <SelectItem value='green'>Green</SelectItem>
                  <SelectItem value='yellow'>Yellow</SelectItem>
                  <SelectItem value='red'>Red</SelectItem>
                  <SelectItem value='pink'>Pink</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-2 pt-4'>
          <Button type='submit'>Create Space</Button>
        </div>
      </form>
    </Form>
  );
}
