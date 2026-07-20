import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/ServiceService.js';
import { 
  createServiceSchema, 
  updateServiceSchema 
} from '../schemas/service.js';
import { ValidationError } from '../errors/AppError.js';

export class ServiceController {
  private serviceService = new ServiceService();

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { active } = req.query;
      const onlyActive = active === 'true';

      const services = await this.serviceService.getAllServices(onlyActive);

      res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const service = await this.serviceService.getServiceById(id);

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createServiceSchema.safeParse(req.body);

      if (!parsed.success) {
        const message = parsed.error.errors[0]?.message || 'Validação falhou';
        throw new ValidationError(message, 'VALIDATION_ERROR');
      }

      const service = await this.serviceService.createService(parsed.data);

      res.status(201).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const parsed = updateServiceSchema.safeParse(req.body);

      if (!parsed.success) {
        const message = parsed.error.errors[0]?.message || 'Validação falhou';
        throw new ValidationError(message, 'VALIDATION_ERROR');
      }

      const service = await this.serviceService.updateService(id, parsed.data);

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const service = await this.serviceService.toggleServiceStatus(id);

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.serviceService.deleteService(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}