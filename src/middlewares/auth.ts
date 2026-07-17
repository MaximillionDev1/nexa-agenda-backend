import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../errors/AppError.js';
import { IJwtPayload } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      admin?: IJwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token não fornecido', 'NO_TOKEN');
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, env.jwtSecret) as IJwtPayload;

    req.admin = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Token inválido', 'INVALID_TOKEN');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expirado', 'EXPIRED_TOKEN');
    }
    throw error;
  }
};