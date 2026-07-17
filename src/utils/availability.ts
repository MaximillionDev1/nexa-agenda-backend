import { addMinutes, isBefore, format } from 'date-fns';
import { prisma } from '../config/database';
import { DEFAULT_BUSINESS_HOURS, TIME_SLOT_INTERVAL } from '../config/constants.js';

interface TimeSlot {
  time: string;
  available: boolean;
}

/**
 * Retorna os horários disponíveis para um dia e serviço
 */
export const getAvailableSlots = async (
  date: Date,
  serviceDurationMinutes: number
): Promise<string[]> => {
  const dayOfWeek = date.getDay();
  
  // Obter horário de funcionamento do dia
  const businessHours = await prisma.businessHours.findUnique({
    where: { dayOfWeek },
  });

  if (!businessHours || !businessHours.isOpen) {
    return [];
  }

 
  const [startHour, startMin] = businessHours.startTime.split(':').map(Number);
  const [endHour, endMin] = businessHours.endTime.split(':').map(Number);

  const dayStart = new Date(date);
  dayStart.setHours(startHour, startMin, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(endHour, endMin, 0, 0);

  const slots: string[] = [];
  let currentSlot = new Date(dayStart);

  
  while (isBefore(currentSlot, dayEnd)) {
    const slotEnd = addMinutes(currentSlot, serviceDurationMinutes);

    
    if (!isBefore(slotEnd, dayEnd) && slotEnd.getTime() !== dayEnd.getTime()) {
      break;
    }

    // Verificar se o slot está no passado
    const now = new Date();
    if (isBefore(currentSlot, now)) {
      currentSlot = addMinutes(currentSlot, TIME_SLOT_INTERVAL);
      continue;
    }


    const hasConflict = await checkTimeSlotConflict(currentSlot, slotEnd);

    if (!hasConflict) {
      slots.push(format(currentSlot, 'HH:mm'));
    }

    currentSlot = addMinutes(currentSlot, TIME_SLOT_INTERVAL);
  }

  return slots;
};


export const checkTimeSlotConflict = async (
  startTime: Date,
  endTime: Date
): Promise<boolean> => {
  const conflict = await prisma.appointment.findFirst({
    where: {
      status: { not: 'CANCELED' },
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
  });

  return !!conflict;
};


export const getNextAvailableSlot = async (serviceDurationMinutes: number) => {
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);


  for (let i = 0; i < 30; i++) {
    const slots = await getAvailableSlots(currentDate, serviceDurationMinutes);

    if (slots.length > 0) {
      const [hours, minutes] = slots[0].split(':').map(Number);
      const slotDate = new Date(currentDate);
      slotDate.setHours(hours, minutes, 0, 0);

      return {
        date: currentDate,
        time: slots[0],
        formatted: formatNextSlot(currentDate, slots[0]),
      };
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return null;
};

const formatNextSlot = (date: Date, time: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const slotDate = new Date(date);
  slotDate.setHours(0, 0, 0, 0);

  if (slotDate.getTime() === today.getTime()) {
    return `Hoje às ${time}`;
  }

  if (slotDate.getTime() === tomorrow.getTime()) {
    return `Amanhã às ${time}`;
  }

  return `${format(date, 'dd/MM')} às ${time}`;
};