export type ProjectTemplate = 'agile' | 'waterfall' | 'custom';

export interface Project {
  id: string;
  name: string;
  description: string;
  template: ProjectTemplate;
  createdAt: Date;
  updatedAt: Date;
  teamMembers: string[]; // User IDs
  status: 'active' | 'completed' | 'archived';
}
