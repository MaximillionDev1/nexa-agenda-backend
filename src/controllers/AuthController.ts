import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';
import { loginSchema } from '../schemas/auth.js';
import { ValidationError } from '../errors/AppError.js';

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        const message = parsed.error.errors[0]?.message || 'Validação falhou';
        throw new ValidationError(message, 'VALIDATION_ERROR');
      }

      const { email, password } = parsed.data;

      const result = await this.authService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.admin?.id;

      if (!adminId) {
        throw new ValidationError('Admin ID não fornecido', 'NO_ADMIN_ID');
      }

      const admin = await this.authService.getAdmin(adminId);

      res.status(200).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  }
}