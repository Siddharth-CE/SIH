import { alertRepository } from './repositories';
import type { Alert } from '../types';

export const alertService = {
  async getAlerts(patientId?: string): Promise<Alert[]> {
    return await alertRepository.getAlerts(patientId);
  },

  async markAsRead(id: string): Promise<Alert> {
    return await alertRepository.markAsRead(id);
  },

  async resolveAlert(id: string): Promise<Alert> {
    return await alertRepository.resolveAlert(id);
  },

  async createAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> {
    return await alertRepository.createAlert(alert);
  }
};
