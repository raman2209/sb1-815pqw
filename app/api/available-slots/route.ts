import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { addDays, setHours, setMinutes, isBefore, isAfter } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get('doctorId');
  const date = searchParams.get('date');

  if (!doctorId || !date) {
    return NextResponse.json({ error: 'Missing doctorId or date' }, { status: 400 });
  }

  const startDate = new Date(date);
  const endDate = addDays(startDate, 1);

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    const availableSlots = [];
    let currentSlot = setMinutes(setHours(startDate, 9), 0); // Start at 9:00 AM
    const endTime = setMinutes(setHours(startDate, 17), 0); // End at 5:00 PM

    while (isBefore(currentSlot, endTime)) {
      const isSlotAvailable = !appointments.some(
        (appointment) => appointment.date.getTime() === currentSlot.getTime()
      );

      if (isSlotAvailable) {
        availableSlots.push(currentSlot);
      }

      currentSlot = addDays(currentSlot, 30); // 30-minute slots
    }

    return NextResponse.json(availableSlots);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching available slots' }, { status: 500 });
  }
}