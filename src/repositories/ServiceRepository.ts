import { prisma } from '../config/database.js';
import { Service } from '@prisma/client';

export class ServiceRepository {
  async findAll(onlyActive = false): Promise<Service[]> {
    return prisma.service.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Service | null> {
    return prisma.service.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    description?: string;
    duration: number;
    price: string;
    icon: string;
  }): Promise<Service> {
    return prisma.service.create({
      data: {
        ...data,
        price: parseFloat(data.price),
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description?: string;
      duration: number;
      price: string;
      icon: string;
    }>
  ): Promise<Service> {
    return prisma.service.update({
      where: { id },
      data: {
        ...data,
        ...(data.price && { price: parseFloat(data.price) }),
      },
    });
  }

  async toggleActive(id: string): Promise<Service> {
    const service = await this.findById(id);
    
    if (!service) {
      throw new Error('Service not found');
    }

    return prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
    });
  }
}