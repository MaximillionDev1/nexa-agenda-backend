import { addMinutes, parseISO, format } from 'date-fns';
import { AppointmentRepository, FindAppointmentsFilters } from '../repositories/AppointmentRepository.js';
import { ServiceRepository } from '../repositories/ServiceRepository.js';
import { 
  ValidationError, 
  NotFoundError, 
  ConflictError 
} from '../errors/AppError.js';
import { 
  ERROR_MESSAGES, 
  APPOINTMENT_STATUSES 
} from '../config/constants.js';
import { 
  getAvailableSlots, 
  checkTimeSlotConflict,
  getNextAvailableSlot 
} from '../utils/availability.js';
import { 
  normalizePhone, 
  formatPhone 
} from '../utils/phone.js';
import { generatePublicCode } from '../utils/publicCode.js';
import { prisma } from '../config/database.js';

export class AppointmentService {
  private appointmentRepository = new AppointmentRepository();
  private serviceRepository = new ServiceRepository();

  /**
   * Obtém agendamentos com filtros
   */
  async getAppointments(filters: FindAppointmentsFilters) {
    return this.appointmentRepository.findAll(filters);
  }

  /**
   * Obtém um agendamento por ID
   */
  async getAppointmentById(id: string) {
    const appointment = await this.appointmentRepository.findById(id);

    if (!appointment) {
      throw new NotFoundError(
        ERROR_MESSAGES.APPOINTMENT_NOT_FOUND,
        'APPOINTMENT_NOT_FOUND'
      );
    }

    return appointment;
  }

  /**
   * Busca um agendamento pelo código público
   */
  async lookupAppointment(publicCode: string, customerPhone: string) {
    const normalizedPhone = normalizePhone(customerPhone);

    const appointment = await this.appointmentRepository.findByPublicCode(
      publicCode
    );

    if (!appointment || appointment.customerPhone !== normalizedPhone) {
      throw new NotFoundError(
        ERROR_MESSAGES.APPOINTMENT_NOT_FOUND,
        'APPOINTMENT_NOT_FOUND'
      );
    }

    return appointment;
  }

  /**
   * Cria um novo agendamento com validações completas
   */
/**
 * Cria um novo agendamento com validações completas
 */
async createAppointment(data: {
  customerName: string;
  customerPhone: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  notes?: string;
}) {
  // 1. Validar serviço
  const service = await this.serviceRepository.findById(data.serviceId);
  if (!service) {
    throw new NotFoundError(
      ERROR_MESSAGES.SERVICE_NOT_FOUND,
      'SERVICE_NOT_FOUND'
    );
  }
  if (!service.isActive) {
    throw new ValidationError(
      ERROR_MESSAGES.SERVICE_INACTIVE,
      'SERVICE_INACTIVE'
    );
  }

  // 2. Validar e normalizar data (CORREÇÃO DO TIMEZONE)
  let appointmentDate: Date;
  
  // Se receber ISO string, fazer parse sem timezone shift
  if (data.appointmentDate.includes('T')) {
    appointmentDate = new Date(data.appointmentDate);
  } else {
    // Se receber apenas data (YYYY-MM-DD), fazer parse seguro
    const [year, month, day] = data.appointmentDate.split('-').map(Number);
    appointmentDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  }

  // Validar se não é data passada
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (appointmentDate < today) {
    throw new ValidationError(
      ERROR_MESSAGES.INVALID_DATE,
      'INVALID_DATE'
    );
  }

  // 3. Construir startTime completo (CORREÇÃO: usar a data normalizada)
  const [hours, minutes] = data.startTime.split(':').map(Number);
  const startTimeDateTime = new Date(
    appointmentDate.getFullYear(),
    appointmentDate.getMonth(),
    appointmentDate.getDate(),
    hours,
    minutes,
    0,
    0
  );

  // 4. Validar se não está no passado
  if (startTimeDateTime < new Date()) {
    throw new ValidationError(
      ERROR_MESSAGES.INVALID_DATE,
      'PAST_TIME'
    );
  }

  // 5. Calcular endTime
  const endTime = addMinutes(startTimeDateTime, service.duration);

  // 6. Usar transação para evitar conflitos
  const appointment = await prisma.$transaction(async (tx) => {
    // Verificar conflito dentro da transação
    const hasConflict = await tx.appointment.findFirst({
      where: {
        serviceId: data.serviceId,
        status: { not: 'CANCELED' },
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTimeDateTime } },
        ],
      }
    });

    if (hasConflict) {
      throw new ConflictError(
        ERROR_MESSAGES.TIME_SLOT_UNAVAILABLE,
        'TIME_SLOT_UNAVAILABLE'
      );
    }

    // Criar agendamento
    const normalizedPhone = normalizePhone(data.customerPhone);
    const publicCode = generatePublicCode();

    return tx.appointment.create({
      data: {
        publicCode,
        customerName: data.customerName,
        customerPhone: normalizedPhone,
        serviceId: data.serviceId,
        appointmentDate: new Date(
          appointmentDate.getFullYear(),
          appointmentDate.getMonth(),
          appointmentDate.getDate()
        ),
        startTime: startTimeDateTime,
        endTime,
        notes: data.notes,
        status: 'SCHEDULED',
      },
      include: { service: true },
    });
  });

  return appointment;
}

  /**
   * Obtém horários disponíveis para uma data e serviço
   */
  async getAvailability(date: string, serviceId: string) {
    const service = await this.serviceRepository.findById(serviceId);

    if (!service) {
      throw new NotFoundError(
        ERROR_MESSAGES.SERVICE_NOT_FOUND,
        'SERVICE_NOT_FOUND'
      );
    }

    const appointmentDate = parseISO(date);
    const slots = await getAvailableSlots(appointmentDate, service.duration);

    return { slots };
  }

  /**
   * Obtém o próximo horário disponível
   */
  async getNextAvailable() {
    // Assumir duração padrão de 45 minutos
    const nextSlot = await getNextAvailableSlot(45);

    return nextSlot;
  }

  /**
   * Atualiza o status de um agendamento
   */
  async updateAppointmentStatus(id: string, status: string) {
    const appointment = await this.getAppointmentById(id);

    // Validar status válido
    const validStatuses = Object.values(APPOINTMENT_STATUSES);
    if (!validStatuses.includes(status as any)) {
      throw new ValidationError('Status inválido', 'INVALID_STATUS');
    }

    return this.appointmentRepository.updateStatus(id, status as any);
  }

  /**
   * Cancela um agendamento
   */
  async cancelAppointment(id: string) {
    const appointment = await this.getAppointmentById(id);

    if (appointment.status === 'CANCELED') {
      throw new ValidationError(
        'Agendamento já está cancelado',
        'ALREADY_CANCELED'
      );
    }

    if (appointment.status === 'COMPLETED') {
      throw new ValidationError(
        'Não é possível cancelar um agendamento concluído',
        'CANNOT_CANCEL_COMPLETED'
      );
    }

    return this.appointmentRepository.updateStatus(id, 'CANCELED');
  }

  /**
   * Deleta um agendamento (apenas admin)
   */
  async deleteAppointment(id: string) {
    const appointment = await this.getAppointmentById(id);
    await this.appointmentRepository.delete(id);
  }

  /**
   * Obtém estatísticas do dia
   */
  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.appointmentRepository.getDayStats(today);
  }

  /**
   * Obtém faturamento do dia
   */
  async getTodayRevenue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.appointmentRepository.getRevenueByDate(today);
  }

  /**
   * Obtém próximo atendimento
   */
  async getNextAppointment() {
    const now = new Date();

    const appointment = await prisma.appointment.findFirst({
      where: {
        startTime: { gte: now },
        status: { not: 'CANCELED' },
      },
      include: { service: true },
      orderBy: { startTime: 'asc' },
    });

    return appointment;
  }
}