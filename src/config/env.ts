import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3333', 10),
  nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production',
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

if (env.nodeEnv === 'production' && env.jwtSecret === 'your_secret_key') {
  throw new Error('JWT_SECRET must be defined in production');
}