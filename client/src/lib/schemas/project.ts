import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  template: z.enum(['agile', 'waterfall', 'custom'], {
    required_error: 'Please select a project template',
  }),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
