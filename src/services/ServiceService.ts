import { ServiceRepository } from '../repositories/ServiceRepository.js';
import { NotFoundError, ValidationError } from '../errors/AppError.js';
import { ERROR_MESSAGES } from '../config/constants.js';

export class ServiceService {
  private serviceRepository = new ServiceRepository();

  async getAllServices(onlyActive = false) {
    return this.serviceRepository.findAll(onlyActive);
  }

  async getServiceById(id: string) {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundError(
        ERROR_MESSAGES.SERVICE_NOT_FOUND,
        'SERVICE_NOT_FOUND'
      );
    }

    return service;
  }

  async createService(data: {
    name: string;
    description?: string;
    duration: number;
    price: string;
    icon: string;
  }) {
    return this.serviceRepository.create(data);
  }

  async updateService(
    id: string,
    data: Partial<{
      name: string;
      description?: string;
      duration: number;
      price: string;
      icon: string;
    }>
  ) {
    const service = await this.getServiceById(id);

    return this.serviceRepository.update(id, data);
  }

  async toggleServiceStatus(id: string) {
    const service = await this.getServiceById(id);

    return this.serviceRepository.toggleActive(id);
  }
}