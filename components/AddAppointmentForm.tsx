'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

type AppointmentFormData = {
  patientId: string;
  doctorId: string;
  date: string;
  status: string;
  notes: string;
};

export default function AddAppointmentForm() {
  const { register, handleSubmit, watch, setValue } = useForm<AppointmentFormData>();
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const selectedDoctor = watch('doctorId');
  const selectedDate = watch('date');

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then(setDoctors);
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetch(`/api/available-slots?doctorId=${selectedDoctor}&date=${selectedDate}`)
        .then((res) => res.json())
        .then(setAvailableSlots);
    }
  }, [selectedDoctor, selectedDate]);

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        // Handle successful appointment creation
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select {...register('doctorId', { required: true })}>
        <option value="">Select a doctor</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.user.name} - {doctor.specialty}
          </option>
        ))}
      </Select>
      <Input type="date" {...register('date', { required: true })} />
      <Select {...register('status', { required: true })}>
        <option value="SCHEDULED">Scheduled</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </Select>
      <Input {...register('notes')} placeholder="Notes" />
      <Button type="submit">Create Appointment</Button>
    </form>
  );
}