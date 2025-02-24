'use client';

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
import { useUserStore } from '@/lib/store/user-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import { Organization } from '@/types';
import { OrganizationDialog } from '../organizations';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    displayName: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [showOrganizationDialog, setShowOrganizationDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup } = useUserStore();
  const router = useRouter();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language.split('-')[0],
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        name: data.name,
        displayName: data.displayName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        timezone: data.timezone,
        language: data.language,
      });
      setShowOrganizationDialog(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    }
  };

  const handleOrganizationCreated = (organization: Organization) => {
    router.push(`/${organization.id}`);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your full name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='displayName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your display name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter your email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type='tel'
                    placeholder='Enter your phone number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Create a password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Confirm your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className='text-sm text-red-500 text-center'>{error}</div>
          )}

          <Button type='submit' className='w-full'>
            Sign up
          </Button>

          <div className='text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link href='/login' className='text-primary hover:underline'>
              Log in
            </Link>
          </div>
        </form>
      </Form>

      <OrganizationDialog
        open={showOrganizationDialog}
        onOpenChange={setShowOrganizationDialog}
        onComplete={handleOrganizationCreated}
      />
    </>
  );
}
