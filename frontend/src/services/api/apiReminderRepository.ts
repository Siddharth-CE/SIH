import type { IReminderRepository } from '../interfaces/IReminderRepository';
import type { Reminder, ReminderStatus, Medication } from '../../types';
import { apiClient } from './apiClient';

export class ApiReminderRepository implements IReminderRepository {
  async getReminders(patientId: string, date?: string): Promise<Reminder[]> {
    const query = date ? `?date=${date}` : '';
    return apiClient.get<Reminder[]>(`/patients/${patientId}/reminders${query}`);
  }

  async getReminderById(id: string): Promise<Reminder | null> {
    try {
      return await apiClient.get<Reminder>(`/reminders/${id}`);
    } catch {
      return null;
    }
  }

  async createReminder(reminder: Omit<Reminder, 'id'>): Promise<Reminder> {
    return apiClient.post<Reminder>('/reminders', reminder);
  }

  async updateReminderStatus(id: string, status: ReminderStatus): Promise<Reminder> {
    return apiClient.patch<Reminder>(`/reminders/${id}/status?status=${status}`);
  }

  async updateReminder(id: string, data: Partial<Reminder>): Promise<Reminder> {
    return apiClient.patch<Reminder>(`/reminders/${id}`, data);
  }

  async deleteReminder(id: string): Promise<boolean> {
    const res = await apiClient.delete<{ success: boolean }>(`/reminders/${id}`);
    return res.success;
  }

  async getMedications(patientId: string): Promise<Medication[]> {
    return apiClient.get<Medication[]>(`/patients/${patientId}/medications`);
  }
}

export const apiReminderRepository = new ApiReminderRepository();
