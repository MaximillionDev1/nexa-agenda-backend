import { prisma } from '../config/database.js';
import { Appointment, AppointmentStatus } from '@prisma/client';

export interface FindAppointmentsFilters {
  date?: string; // formato "yyyy-MM-dd"
  status?: AppointmentStatus;
  serviceId?: string;
  customerName?: string;
  customerPhone?: string;
  limit?: number;
  offset?: number;
}

export class AppointmentRepository {
  async findAll(filters: FindAppointmentsFilters = {}) {
    const {
      date,
      status,
      serviceId,
      customerName,
      customerPhone,
      limit = 10,
      offset = 0,
    } = filters;

    const where: any = {};

    if (date) {
      // Parse seguro "yyyy-MM-dd" sem passar por new Date(string), que o JS
      // interpreta como UTC meia-noite e pode deslocar o dia em um em
      // timezones atrás do UTC (mesma causa raiz já corrigida em
      // AppointmentService.createAppointment).
      const [year, month, day] = date.split('-').map(Number);

      const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

      where.appointmentDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (status) {
      where.status = status;
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (customerName) {
      where.customerName = {
        contains: customerName,
        mode: 'insensitive',
      };
    }

    if (customerPhone) {
      where.customerPhone = customerPhone;
    }

    const [data, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: { service: true },
        orderBy: { startTime: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.appointment.count({ where }),
    ]);

    return { data, total, limit, offset };
  }

  async findById(id: string): Promise<Appointment | null> {
    return prisma.appointment.findUnique({
      where: { id },
      include: { service: true },
    });
  }

  async findByPublicCode(publicCode: string): Promise<Appointment | null> {
    return prisma.appointment.findUnique({
      where: { publicCode },
      include: { service: true },
    });
  }

  async create(data: {
    publicCode: string;
    customerName: string;
    customerPhone: string;
    serviceId: string;
    appointmentDate: Date;
    startTime: Date;
    endTime: Date;
    notes?: string;
  }): Promise<Appointment> {
    return prisma.appointment.create({
      data: {
        ...data,
        status: 'SCHEDULED',
      },
      include: { service: true },
    });
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus
  ): Promise<Appointment> {
    return prisma.appointment.update({
      where: { id },
      data: { status },
      include: { service: true },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.appointment.delete({
      where: { id },
    });
  }

  /**
   * Verifica se existe agendamento com conflito de horário
   */
  async hasConflict(startTime: Date, endTime: Date): Promise<boolean> {
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
  }

  /**
   * Encontra agendamentos do dia
   */
  async findByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: { service: true },
      orderBy: { startTime: 'asc' },
    });
  }

  /**
   * Calcula o faturamento de um dia
   */
  async getRevenueByDate(date: Date) {
    const appointments = await this.findByDate(date);

    const completed = appointments
      .filter((apt) => apt.status === 'COMPLETED')
      .reduce((sum, apt) => sum + apt.service.price.toNumber(), 0);

    const projected = appointments
      .filter((apt) => apt.status !== 'CANCELED')
      .reduce((sum, apt) => sum + apt.service.price.toNumber(), 0);

    // Soma do valor de TODOS os agendamentos do dia (incluindo cancelados),
    // representando o volume total movimentado no dia.
    const total = appointments.reduce(
      (sum, apt) => sum + apt.service.price.toNumber(),
      0
    );

    return { completed, projected, total };
  }

  /**
   * Obtém estatísticas do dia
   */
  async getDayStats(date: Date) {
    const appointments = await this.findByDate(date);

    return {
      total: appointments.length,
      scheduled: appointments.filter((apt) => apt.status === 'SCHEDULED').length,
      confirmed: appointments.filter((apt) => apt.status === 'CONFIRMED').length,
      completed: appointments.filter((apt) => apt.status === 'COMPLETED').length,
      canceled: appointments.filter((apt) => apt.status === 'CANCELED').length,
    };
  }
}