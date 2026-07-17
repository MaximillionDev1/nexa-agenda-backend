import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/AppointmentService.js';

export class DashboardController {
  private appointmentService = new AppointmentService();

  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [stats, revenue, nextAppointment] = await Promise.all([
        this.appointmentService.getTodayStats(),
        this.appointmentService.getTodayRevenue(),
        this.appointmentService.getNextAppointment(),
      ]);

      res.status(200).json({
        success: true,
        data: {
          stats,
          revenue,
          nextAppointment,
          date: today,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}