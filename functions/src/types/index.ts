import type { Response } from 'express';

/**
 * Estructura estándar de respuesta de API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: number;
    details?: string;
    validationErrors?: ValidationError[];
  };
  timestamp: string;
}

/**
 * Error de validación de campos
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Agente de IA
 */
export interface Agent {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'draft';
  collections?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

/**
 * Usuario del sistema
 */
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
}

/**
 * Type helper para Response de Firebase Functions
 */
export type HttpResponse = Response;
