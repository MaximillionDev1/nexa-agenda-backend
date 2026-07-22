import express from 'express';
import helmet from 'helmet';
import cors, { type CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { routes } from './routes/index.js';

const app = express();

// ============================================
// SEGURANÇA
// ============================================

app.use(helmet());

const allowedOrigins = [
  env.frontendUrl,
  'http://localhost:5173',
  'http://localhost:3000',
];

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Permite requisições sem Origin:
    // Postman, Insomnia, Railway health checks e chamadas server-to-server.
    if (!origin) {
      return callback(null, true);
    }

    const isMainFrontend = allowedOrigins.includes(origin);

    const isVercelPreview =
      /^https:\/\/nexa-agenda-frontend(?:-[a-zA-Z0-9-]+)?\.vercel\.app$/.test(
        origin
      );

    if (isMainFrontend || isVercelPreview) {
      return callback(null, true);
    }

    console.warn(`CORS bloqueou a origem: ${origin}`);

    return callback(new Error('Origem não autorizada pelo CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ============================================
// RATE LIMIT
// ============================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente mais tarde.',
    code: 'TOO_MANY_REQUESTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// ============================================
// MIDDLEWARES DE PARSING
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROTA RAIZ
// ============================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Nexa Agenda API',
    healthCheck: '/api/health',
    environment: env.nodeEnv,
  });
});

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
// ERROR HANDLER
// ============================================

app.use(errorHandler);

export { app };