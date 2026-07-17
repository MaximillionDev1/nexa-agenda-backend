import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { routes } from './routes/index.js';

const app = express();

// ============================================
// SEGURANÇA
// ============================================

app.use(helmet());

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// ============================================
// MIDDLEWARE DE PARSING
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// ============================================
// ROTAS DA API
// ============================================

app.use('/api', routes);

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path,
    code: 'NOT_FOUND',
  });
});

// ============================================
// ERROR HANDLER (deve ser o último middleware)
// ============================================

app.use(errorHandler);

export { app };