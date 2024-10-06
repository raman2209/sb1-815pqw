'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const schema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  date: z.string(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Appointment = {
  id: string;
  patient: { user: { name: string } };
  doctor: { user: { name: string } };
  date: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<{ id: string; name: string }[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    const response = await fetch('/api/appointments');
    if (response.ok) {
      const data = await response.json();
      setAppointments(data);
    }
  };

  const fetchPatients = async () => {
    const response = await fetch('/api/patients');
    if (response.ok) {
      const data = await response.json();
      setPatients(data.map((p: any) => ({ id: p.id, name: p.user.name })));
    }
  };

  const fetchDoctors = async () => {
    const response = await fetch('/api/doctors');
    if (response.ok) {
      const data = await response.json();
      setDoctors(data.map((d: any) => ({ id: d.id, name: d.user.name })));
    }
  };

  const onSubmit = async (data: FormData) => {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      reset();
      fetchAppointments();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Appointments</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Schedule New Appointment</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientId">Patient</Label>
            <Select id="patientId" {...register('patientId')}>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
            </Select>
            {errors.patientId && <p className="text-red-500">{errors.patientId.message}</p>}
          </div>
          <div>
            <Label htmlFor="doctorId">Doctor</Label>
            <Select id="doctorId" {...register('doctorId')}>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </Select>
            {errors.doctorId && <p className="text-red-500">{errors.doctorId.message}</p>}
          </div>
          <div>
            <Label htmlFor="date">Date and Time</Label>
            <Input id="date" type="datetime-local" {...register('date')} />
            {errors.date && <p className="text-red-500">{errors.date.message}</p>}
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" {...register('status')}>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
            {errors.status && <p className="text-red-500">{errors.status.message}</p>}
          </div>
          <div className="col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...register('notes')} />
            {errors.notes && <p className="text-red-500">{errors.notes.message}</p>}
          </div>
        </div>
        <Button type="submit" className="mt-4">Schedule Appointment</Button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Appointment List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.patient.user.name}</TableCell>
              <TableCell>{appointment.doctor.user.name}</TableCell>
              <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>{appointment.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}