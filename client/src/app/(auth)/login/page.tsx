'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className='mt-4 text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link href='/signup' className='text-primary hover:underline'>
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
