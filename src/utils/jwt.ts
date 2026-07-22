import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { IJwtPayload } from '../types/index.js';

export const generateToken = (payload: IJwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string): IJwtPayload => {
  return jwt.verify(token, env.jwtSecret) as IJwtPayload;
};