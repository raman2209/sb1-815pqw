import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const patients = await prisma.patient.findMany({
    include: { user: true },
  });
  return NextResponse.json(patients);
}

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { name, email, password, dateOfBirth, phoneNumber, address } = await req.json();

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Note: In a real application, you should hash this password
        role: 'PATIENT',
      },
    });

    const patient = await prisma.patient.create({
      data: {
        userId: newUser.id,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        address,
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating patient' }, { status: 500 });
  }
}