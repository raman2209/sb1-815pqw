'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PatientFormData = {
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
};

export default function AddPatientForm() {
  const { register, handleSubmit, reset } = useForm<PatientFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: PatientFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        reset();
        // You might want to refresh the patient list here
      }
    } catch (error) {
      console.error('Error adding patient:', error);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="date"
        {...register('dateOfBirth', { required: true })}
        placeholder="Date of Birth"
      />
      <Input
        type="tel"
        {...register('phoneNumber', { required: true })}
        placeholder="Phone Number"
      />
      <Input
        {...register('address', { required: true })}
        placeholder="Address"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Patient'}
      </Button>
    </form>
  );
}