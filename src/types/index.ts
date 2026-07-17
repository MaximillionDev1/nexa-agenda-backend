import { AppointmentStatus } from '@prisma/client';

export type IAppointmentStatus = AppointmentStatus;

export interface IAdmin {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IService {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointment {
  id: string;
  publicCode: string;
  customerName: string;
  customerPhone: string;
  service: IService;
  appointmentDate: Date;
  startTime: Date;
  endTime: Date;
  notes?: string;
  status: IAppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJwtPayload {
  id: string;
  email: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}