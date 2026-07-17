import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[ERROR]', {
    name: err.name,
    message: err.message,
    timestamp: new Date().toISOString(),
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code || 'ERROR',
      ...(env.nodeEnv === 'development' && { stack: err.stack }),
    });
  }

  // Erros não capturados
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
    ...(env.nodeEnv === 'development' && { 
      error: err.message,
      stack: err.stack 
    }),
  });
};