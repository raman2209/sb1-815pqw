import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  let appointments;
  if (user.role === 'ADMIN') {
    appointments = await prisma.appointment.findMany({
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });
  } else if (user.role === 'DOCTOR') {
    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor?.id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });
  } else {
    const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
    appointments = await prisma.appointment.findMany({
      where: { patientId: patient?.id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });
  }

  return NextResponse.json(appointments);
}

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'DOCTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { patientId, doctorId, date, status, notes } = await req.json();

  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date: new Date(date),
        status,
        notes,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 });
  }
}