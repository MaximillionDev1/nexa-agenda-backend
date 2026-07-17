import { prisma } from '../config/database.js';
import { Admin } from '@prisma/client';

export class AdminRepository {
  async findById(id: string): Promise<Admin | null> {
    return prisma.admin.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return prisma.admin.findUnique({ where: { email } });
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<Admin> {
    return prisma.admin.create({ data });
  }
}