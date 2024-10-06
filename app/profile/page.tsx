'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const { register, handleSubmit, setValue } = useForm<User>();

  useEffect(() => {
    fetch('/api/user-profile')
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setValue('name', data.name);
        setValue('role', data.role);
      });
  }, [setValue]);

  const onSubmit = async (data: Partial<User>) => {
    try {
      const response = await fetch('/api/user-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register('name')} placeholder="Name" />
        <Select {...register('role')}>
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
          <option value="ADMIN">Admin</option>
        </Select>
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  );
}