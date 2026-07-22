import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '../errors/AppError.js';
import type { IJwtPayload } from '../types/index.js';
import { verifyToken } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      admin?: IJwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError(
        'Token não fornecido',
        'NO_TOKEN'
      );
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      throw new UnauthorizedError(
        'Token não fornecido',
        'NO_TOKEN'
      );
    }

    req.admin = verifyToken(token);

    next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError(
        'Token expirado',
        'EXPIRED_TOKEN'
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError(
        'Token inválido',
        'INVALID_TOKEN'
      );
    }

    throw error;
  }
};