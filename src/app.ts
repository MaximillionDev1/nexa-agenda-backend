import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';

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
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Muitas requisições. Tente novamente mais tarde.',
});

app.use(limiter);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    code: 'NOT_FOUND',
  });
});



app.use(errorHandler);

export { app };