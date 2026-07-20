export interface IService {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELED";

export interface IAppointment {
  id: string;
  publicCode: string;
  customerName: string;
  customerPhone: string;
  service: IService;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IAdmin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  admin: IAdmin;
  token: string;
}

export interface ICreateAppointmentRequest {
  customerName: string;
  customerPhone: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  notes?: string;
}

export interface ILookupAppointmentRequest {
  publicCode: string;
  customerPhone: string;
}

export interface IDashboardStats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  canceled: number;
}

export interface IDashboardRevenue {
  completed: number;
  projected: number;
  total: number;
}

export interface IDashboardData {
  stats: IDashboardStats;
  revenue: IDashboardRevenue;
  nextAppointment?: IAppointment;
  date: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface IAvailabilityResponse {
  slots: string[];
}

export interface INextAvailableSlot {
  date: string;
  time: string;
  formatted: string;
}

// Verificar se IAppointment tem customerEmail. Se não tiver, adicionar:

export interface IAppointment {
  id: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string; // Adicionar se não existir
  appointmentDate: string;
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELED";
  service: IService;
  createdAt: string;
  updatedAt: string;
}