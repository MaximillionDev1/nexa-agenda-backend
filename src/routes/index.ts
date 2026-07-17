import { Router } from 'express';
import { publicRoutes } from './publicRoutes.js';
import { adminRoutes } from './adminRoutes.js';

const routes = Router();

// Rotas públicas
routes.use('/', publicRoutes);

// Rotas administrativas
routes.use('/', adminRoutes);

export { routes };