'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Analytics = {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  appointmentsByStatus: Record<string, number>;
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(setAnalytics);
  }, []);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analytics.totalPatients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analytics.totalDoctors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analytics.totalAppointments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(analytics.appointmentsByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between">
                <span>{status}:</span>
                <span>{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}