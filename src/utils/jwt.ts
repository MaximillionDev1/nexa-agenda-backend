import * as jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { IJwtPayload } from '../types/index.js';

export const generateToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload as jwt.JwtPayload, env.jwtSecret as any, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): IJwtPayload => {
  return jwt.verify(token, env.jwtSecret as any) as IJwtPayload;
};