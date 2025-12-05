/**
 * Middleware de CORS
 * Permite que el panel web haga requests a las Cloud Functions
 */

import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';

/**
 * Type para función next de middleware
 */
type NextFunction = () => void;

/**
 * Configuración de CORS para permitir requests del frontend
 */
export const corsMiddleware = (
  req: Request,
  res: Response,
  next?: NextFunction
): void => {
  // Permitir requests desde cualquier origen (ajustar en producción)
  res.set('Access-Control-Allow-Origin', '*');

  // Métodos permitidos
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Headers permitidos
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (next) {
    next();
  }
};
