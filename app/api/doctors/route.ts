import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { user: true },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching doctors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { specialty } = await request.json();
    const doctor = await prisma.doctor.create({
      data: {
        userId,
        specialty,
      },
    });
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating doctor' }, { status: 500 });
  }
}