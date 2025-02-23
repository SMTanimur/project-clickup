'use client';


import { Button } from '@/components/ui/button';


import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-accent'>
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center space-y-6'>
          <h1 className='text-6xl font-bold tracking-tighter'>
            Project Management, <span className='text-primary'>Reimagined</span>
          </h1>

          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Streamline your workflow with our powerful project management tool.
            Built for teams who want to move faster and work smarter.
          </p>

          <div className='flex items-center justify-center gap-4 pt-8'>
            <Link href='/signup'>
              <Button size='lg' className='text-lg'>
                Get Started Free
              </Button>
            </Link>
            <Link href='/demo'>
              <Button size='lg' variant='outline' className='text-lg'>
                View Demo
              </Button>
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-20'>
            <FeatureCard
              title='Workspaces & Projects'
              description='Organize your work with customizable workspaces and projects'
            />
            <FeatureCard
              title='Task Management'
              description='Powerful Kanban boards with real-time updates and smooth animations'
            />
            <FeatureCard
              title='Team Collaboration'
              description='Real-time comments, file sharing, and team communication'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className='p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow'>
      <h3 className='text-xl font-semibold mb-2'>{title}</h3>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
}
