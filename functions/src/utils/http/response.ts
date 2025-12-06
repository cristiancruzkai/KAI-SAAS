/**
 * Utilidades para Respuestas HTTP
 * Estandariza las respuestas de las APIs
 */

import type { Response } from "express";
import type { ApiResponse, ValidationError } from "../../types/index.js";

/**
 * Respuesta exitosa
 */
export const success = <T = any>(
  res: Response,
  data: T,
  statusCode: number = 200,
): any => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Respuesta de error
 */
export const error = (
  res: Response,
  message: string,
  statusCode: number = 500,
  details: string | null = null,
): any => {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code: statusCode,
      ...(details && { details }),
    },
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Respuesta de validación fallida
 */
export const validationError = (
  res: Response,
  errors: ValidationError[],
): any => {
  const response: ApiResponse = {
    success: false,
    error: {
      message: "Validation failed",
      code: 400,
      validationErrors: errors,
    },
    timestamp: new Date().toISOString(),
  };

  return res.status(400).json(response);
};

/**
 * Respuesta de no encontrado
 */
export const notFound = (res: Response, resource: string = "Resource"): any => {
  return error(res, `${resource} not found`, 404);
};
