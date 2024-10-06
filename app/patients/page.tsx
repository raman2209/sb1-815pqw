'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  dateOfBirth: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
});

type FormData = z.infer<typeof schema>;

type Patient = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const response = await fetch('/api/patients');
    if (response.ok) {
      const data = await response.json();
      setPatients(data);
    }
  };

  const onSubmit = async (data: FormData) => {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      reset();
      fetchPatients();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Patients</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Patient</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
            {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth.message}</p>}
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" {...register('phoneNumber')} />
            {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>
        </div>
        <Button type="submit" className="mt-4">Add Patient</Button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Patient List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.user.name}</TableCell>
              <TableCell>{patient.user.email}</TableCell>
              <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
              <TableCell>{patient.phoneNumber}</TableCell>
              <TableCell>{patient.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}