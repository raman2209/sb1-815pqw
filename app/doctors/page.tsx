import { Suspense } from 'react';
import DoctorList from '@/components/DoctorList';
import AddDoctorForm from '@/components/AddDoctorForm';

export default function DoctorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Doctors</h1>
      <AddDoctorForm />
      <Suspense fallback={<div>Loading doctors...</div>}>
        <DoctorList />
      </Suspense>
    </div>
  );
}