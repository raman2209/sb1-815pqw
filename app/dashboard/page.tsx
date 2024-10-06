'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.role === 'ADMIN' && (
          <>
            <DashboardCard title="Manage Patients" href="/patients">
              View and manage patient records
            </DashboardCard>
            <DashboardCard title="Manage Doctors" href="/doctors">
              View and manage doctor information
            </DashboardCard>
          </>
        )}
        {(user.role === 'ADMIN' || user.role === 'DOCTOR') && (
          <DashboardCard title="Appointments" href="/appointments">
            Schedule and manage appointments
          </DashboardCard>
        )}
        {user.role === 'PATIENT' && (
          <DashboardCard title="My Appointments" href="/my-appointments">
            View and manage your appointments
          </DashboardCard>
        )}
        <DashboardCard title="Profile" href="/profile">
          View and edit your profile
        </DashboardCard>
        {user.role === 'ADMIN' && (
          <DashboardCard title="Analytics" href="/analytics">
            View clinic analytics and reports
          </DashboardCard>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, children, href }: { title: string; children: React.ReactNode; href: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{children}</p>
        <Button asChild>
          <Link href={href}>Go to {title}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}