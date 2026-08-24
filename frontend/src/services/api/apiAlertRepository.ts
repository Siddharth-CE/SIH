import type { IAlertRepository } from '../interfaces';
import type { Alert } from '../../types';
import { apiClient } from './apiClient';

export class ApiAlertRepository implements IAlertRepository {
  async getAlerts(patientId?: string): Promise<Alert[]> {
    const query = patientId ? `?patient_id=${patientId}` : '';
    return apiClient.get<Alert[]>(`/alerts${query}`);
  }

  async markAsRead(id: string): Promise<Alert> {
    return apiClient.patch<Alert>(`/alerts/${id}/read`);
  }

  async resolveAlert(id: string): Promise<Alert> {
    return apiClient.patch<Alert>(`/alerts/${id}/resolve`);
  }

  async createAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> {
    return apiClient.post<Alert>('/alerts', alert);
  }
}

export const apiAlertRepository = new ApiAlertRepository();
