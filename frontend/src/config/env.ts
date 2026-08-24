/**
 * NER CognitiveCare - Centralized Environment Configuration
 * Safe for Vite browser runtime (VITE_ prefixed only, no secrets)
 */

export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
};

export const isMockEnabled = (): boolean => {
  return import.meta.env.VITE_USE_MOCK === 'true';
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};
