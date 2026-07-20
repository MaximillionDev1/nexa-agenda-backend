import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/AppointmentService.js';
import {
  createAppointmentSchema,
  lookupAppointmentSchema,
  updateAppointmentStatusSchema,
} from '../schemas/appointment.js';
import { ValidationError } from '../errors/AppError.js';
import { AppointmentStatus } from '@prisma/client';

export class AppointmentController {
  private appointmentService = new AppointmentService();

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, status, serviceId, customerName, customerPhone, limit, offset } = req.query;

      const filters = {
        ...(date && { date: new Date(date as string) }),
        status: status as AppointmentStatus,
        serviceId: serviceId as string,
        customerName: customerName as string,
        customerPhone: customerPhone as string,
        limit: limit ? parseInt(limit as string) : 10,
        offset: offset ? parseInt(offset as string) : 0,
      };

      const result = await this.appointmentService.getAppointments(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const appointment = await this.appointmentService.getAppointmentById(id);

      res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createAppointmentSchema.safeParse(req.body);

      if (!parsed.success) {
        const message = parsed.error.errors[0]?.message || 'Validação falhou';
        throw new ValidationError(message, 'VALIDATION_ERROR');
      }

      const appointment = await this.appointmentService.createAppointment(parsed.data);

      res.status(201).json({
        success: true,
        data: appointment,
        message: 'Agendamento criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

 async lookup(req: Request, res: Response, next: NextFunction) {
  try {
    
    const parsed = lookupAppointmentSchema.safeParse(req.body);
    
    
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message || 'Validação falhou';
      throw new ValidationError(message, 'VALIDATION_ERROR');
    }

    const appointment = await this.appointmentService.lookupAppointment(
      parsed.data.publicCode,
      parsed.data.customerPhone
    );

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

  async getAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, serviceId } = req.query;

      if (!date || !serviceId) {
        throw new ValidationError(
          'Data e serviço são obrigatórios',
          'MISSING_PARAMS'
        );
      }

      const result = await this.appointmentService.getAvailability(
        date as string,
        serviceId as string
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getNextAvailable(req: Request, res: Response, next: NextFunction) {
    try {
      const nextSlot = await this.appointmentService.getNextAvailable();

      res.status(200).json({
        success: true,
        data: nextSlot,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const parsed = updateAppointmentStatusSchema.safeParse(req.body);

      if (!parsed.success) {
        const message = parsed.error.errors[0]?.message || 'Validação falhou';
        throw new ValidationError(message, 'VALIDATION_ERROR');
      }

      const { status } = parsed.data;

      const appointment = await this.appointmentService.updateAppointmentStatus(
        id,
        status
      );

      res.status(200).json({
        success: true,
        data: appointment,
        message: 'Status atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const appointment = await this.appointmentService.cancelAppointment(id);

      res.status(200).json({
        success: true,
        data: appointment,
        message: 'Agendamento cancelado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.appointmentService.deleteAppointment(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getTodayStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.appointmentService.getTodayStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTodayRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const revenue = await this.appointmentService.getTodayRevenue();

      res.status(200).json({
        success: true,
        data: revenue,
      });
    } catch (error) {
      next(error);
    }
  }

  async getNextAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await this.appointmentService.getNextAppointment();

      res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }
}