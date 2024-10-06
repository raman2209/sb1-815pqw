import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const [
    totalPatients,
    totalDoctors,
    totalAppointments,
    appointmentsByStatus,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.count(),
    prisma.appointment.groupBy({
      by: ['status'],
      _count: true,
    }),
  ]);

  const analytics = {
    totalPatients,
    totalDoctors,
    totalAppointments,
    appointmentsByStatus: appointmentsByStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count;
      return acc;
    }, {} as Record<string, number>),
  };

  return NextResponse.json(analytics);
}