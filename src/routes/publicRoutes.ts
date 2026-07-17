import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController.js';
import { AppointmentController } from '../controllers/AppointmentController.js';

const router = Router();

const serviceController = new ServiceController();
const appointmentController = new AppointmentController();

// ============================================
// SERVIÇOS (PÚBLICAS)
// ============================================

/**
 * GET /api/services
 * Lista todos os serviços ativos
 */
router.get('/services', (req, res, next) => 
  serviceController.list(req, res, next)
);

/**
 * GET /api/services/:id
 * Obtém um serviço específico
 */
router.get('/services/:id', (req, res, next) => 
  serviceController.getById(req, res, next)
);

// ============================================
// AGENDAMENTOS (PÚBLICOS)
// ============================================

/**
 * GET /api/availability?date=2026-08-10&serviceId=SERVICE_ID
 * Obtém horários disponíveis para uma data e serviço
 */
router.get('/availability', (req, res, next) => 
  appointmentController.getAvailability(req, res, next)
);

/**
 * GET /api/next-available-slot
 * Obtém o próximo horário disponível
 */
router.get('/next-available-slot', (req, res, next) => 
  appointmentController.getNextAvailable(req, res, next)
);

/**
 * POST /api/appointments
 * Cria um novo agendamento
 * Body: { customerName, customerPhone, serviceId, appointmentDate, startTime, notes? }
 */
router.post('/appointments', (req, res, next) => 
  appointmentController.create(req, res, next)
);

/**
 * POST /api/appointments/lookup
 * Busca um agendamento pelo código público
 * Body: { publicCode, customerPhone }
 */
router.post('/appointments/lookup', (req, res, next) => 
  appointmentController.lookup(req, res, next)
);

export { router as publicRoutes };