'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual signup logic
    router.push('/dashboard');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='w-full max-w-md space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>Create your account</h2>
          <p className='text-muted-foreground mt-2'>
            Get started with your free account today
          </p>
        </div>

        <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
          <div className='space-y-4'>
            <Input
              type='text'
              placeholder='Full Name'
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              type='email'
              placeholder='Email address'
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              type='password'
              placeholder='Password'
              value={formData.password}
              onChange={e =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <Button type='submit' className='w-full'>
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
}
