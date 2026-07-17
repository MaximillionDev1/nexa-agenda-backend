import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { IJwtPayload } from '../types/index.js';

export const generateToken = (payload: IJwtPayload): string => {
  const token = jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as any);
  
  return token;
};

export const verifyToken = (token: string): IJwtPayload => {
  return jwt.verify(token, env.jwtSecret) as IJwtPayload;
};