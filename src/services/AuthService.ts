import bcrypt from 'bcrypt';
import { AdminRepository } from '../repositories/AdminRepository.js';
import { generateToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../errors/AppError.js';
import { ERROR_MESSAGES } from '../config/constants.js';

export class AuthService {
  private adminRepository = new AdminRepository();

  async login(email: string, password: string) {
    const admin = await this.adminRepository.findByEmail(email);

    if (!admin) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        'INVALID_CREDENTIALS'
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        'INVALID_CREDENTIALS'
      );
    }

    const token = generateToken({ id: admin.id, email: admin.email });

    return {
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
      token,
    };
  }

  async getAdmin(adminId: string) {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED, 'UNAUTHORIZED');
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };
  }
}