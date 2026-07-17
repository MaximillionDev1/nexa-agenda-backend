import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  description: z.string().max(500).optional(),
  duration: z.number().int().positive('Duração deve ser positiva'),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), 'Preço inválido'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
});

export const updateServiceSchema = createServiceSchema.partial();

export type ICreateServiceRequest = z.infer<typeof createServiceSchema>;
export type IUpdateServiceRequest = z.infer<typeof updateServiceSchema>;