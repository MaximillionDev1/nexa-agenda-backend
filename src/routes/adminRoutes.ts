import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { AuthController } from '../controllers/AuthController.js';
import { ServiceController } from '../controllers/ServiceController.js';
import { AppointmentController } from '../controllers/AppointmentController.js';
import { DashboardController } from '../controllers/DashboardController.js';

const router = Router();

const authController = new AuthController();
const serviceController = new ServiceController();
const appointmentController = new AppointmentController();
const dashboardController = new DashboardController();

// ============================================
// AUTENTICAÇÃO (NÃO PROTEGIDA)
// ============================================

/**
 * POST /api/auth/login
 * Faz login e retorna token JWT
 * Body: { email, password }
 */
router.post('/auth/login', (req, res, next) => 
  authController.login(req, res, next)
);

// ============================================
// MIDDLEWARES PROTEGIDOS
// ============================================

// Aplicar middleware de autenticação em todas as rotas abaixo
router.use(authMiddleware);

/**
 * GET /api/auth/me
 * Retorna dados do admin autenticado
 */
router.get('/auth/me', (req, res, next) => 
  authController.getMe(req, res, next)
);

// ============================================
// DASHBOARD
// ============================================

/**
 * GET /api/admin/dashboard
 * Retorna dados do dashboard (stats, revenue, next appointment)
 */
router.get('/admin/dashboard', (req, res, next) => 
  dashboardController.getDashboard(req, res, next)
);

// ============================================
// AGENDAMENTOS (ADMINISTRATIVAS)
// ============================================

/**
 * GET /api/appointments
 * Lista todos os agendamentos com filtros
 * Query params: ?date=&status=&serviceId=&customerName=&customerPhone=&limit=10&offset=0
 */
router.get('/appointments', (req, res, next) => 
  appointmentController.list(req, res, next)
);

/**
 * GET /api/appointments/:id
 * Obtém um agendamento específico
 */
router.get('/appointments/:id', (req, res, next) => 
  appointmentController.getById(req, res, next)
);

/**
 * PATCH /api/appointments/:id/status
 * Atualiza o status de um agendamento
 * Body: { status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELED" }
 */
router.patch('/appointments/:id/status', (req, res, next) => 
  appointmentController.updateStatus(req, res, next)
);

/**
 * PATCH /api/appointments/:id/cancel
 * Cancela um agendamento
 */
router.patch('/appointments/:id/cancel', (req, res, next) => 
  appointmentController.cancel(req, res, next)
);

/**
 * DELETE /api/appointments/:id
 * Deleta um agendamento
 */
router.delete('/appointments/:id', (req, res, next) => 
  appointmentController.delete(req, res, next)
);

/**
 * GET /api/appointments/stats/today
 * Retorna estatísticas de hoje
 */
router.get('/appointments/stats/today', (req, res, next) => 
  appointmentController.getTodayStats(req, res, next)
);

/**
 * GET /api/appointments/revenue/today
 * Retorna faturamento de hoje
 */
router.get('/appointments/revenue/today', (req, res, next) => 
  appointmentController.getTodayRevenue(req, res, next)
);

// ============================================
// SERVIÇOS (ADMINISTRATIVAS)
// ============================================

/**
 * POST /api/services
 * Cria um novo serviço
 * Body: { name, description?, duration, price, icon }
 */
router.post('/services', (req, res, next) => 
  serviceController.create(req, res, next)
);

/**
 * PATCH /api/services/:id
 * Atualiza um serviço
 * Body: { name?, description?, duration?, price?, icon? }
 */
router.patch('/services/:id', (req, res, next) => 
  serviceController.update(req, res, next)
);

/**
 * PATCH /api/services/:id/toggle
 * Ativa ou desativa um serviço
 */
router.patch('/services/:id/toggle', (req, res, next) => 
  serviceController.toggleStatus(req, res, next)
);

/**
 * DELETE /api/services/:id
 * Exclui um serviço definitivamente.
 * Bloqueado (409) se houver agendamentos vinculados — nesse caso, usar toggle para desativar.
 */
router.delete('/services/:id', (req, res, next) => 
  serviceController.delete(req, res, next)
);

export { router as adminRoutes };