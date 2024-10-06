'use client';

import { useEffect, useState } from 'react';
import { Patient } from '@prisma/client';

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetch('/api/patients')
      .then((res) => res.json())
      .then(setPatients);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Patient List</h2>
      <ul className="space-y-4">
        {patients.map((patient) => (
          <li key={patient.id} className="bg-white shadow rounded-lg p-4">
            <p className="font-semibold">{patient.user.name}</p>
            <p>Date of Birth: {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
            <p>Phone: {patient.phoneNumber}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}