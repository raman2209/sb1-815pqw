'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred during login');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}