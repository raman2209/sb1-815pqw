import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'DOCTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  return NextResponse.json(patient);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { name, email, dateOfBirth, phoneNumber, address } = await req.json();

  try {
    const updatedPatient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        address,
        user: {
          update: {
            name,
            email,
          },
        },
      },
      include: { user: true },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating patient' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await prisma.patient.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting patient' }, { status: 500 });
  }
}