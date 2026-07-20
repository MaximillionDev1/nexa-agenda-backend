import { z } from 'zod';

// Função auxiliar para normalizar telefone
const normalizePhoneForSchema = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const createAppointmentSchema = z
  .object({
    customerName: z
      .string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    customerPhone: z
      .string()
      .min(1, 'Telefone é obrigatório')
      .transform(normalizePhoneForSchema)
      .refine(
        (val) => /^\d{10,11}$/.test(val),
        'Telefone inválido. Use 10 ou 11 dígitos'
      ),
    serviceId: z.string().min(1, 'Serviço é obrigatório'),
    appointmentDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, 'Horário inválido (HH:mm)'),
    notes: z
      .string()
      .max(500, 'Observação deve ter no máximo 500 caracteres')
      .optional(),
  })
  .transform((data) => ({
    ...data,
    // Garantir que customerPhone já está normalizado após transform
  }));

export const lookupAppointmentSchema = z.object({
  publicCode: z.string().min(1, 'Código obrigatório'),
  customerPhone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine(
      (val) => /^\d{10,11}$/.test(val),
      'Telefone inválido'
    ),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELED']),
});

export type ICreateAppointmentRequest = z.infer<typeof createAppointmentSchema>;
export type ILookupAppointmentRequest = z.infer<typeof lookupAppointmentSchema>;
export type IUpdateAppointmentStatusRequest = z.infer<typeof updateAppointmentStatusSchema>;