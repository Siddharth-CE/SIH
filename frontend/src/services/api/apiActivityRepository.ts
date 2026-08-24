import type { IActivityRepository } from '../interfaces/IActivityRepository';
import type { DailyActivity } from '../../types';
import { apiClient } from './apiClient';

export class ApiActivityRepository implements IActivityRepository {
  async getActivities(patientId: string): Promise<DailyActivity[]> {
    return apiClient.get<DailyActivity[]>(`/patients/${patientId}/activities`);
  }

  async toggleActivityCompletion(activityId: string, completed: boolean): Promise<DailyActivity> {
    return apiClient.patch<DailyActivity>(`/activities/${activityId}/toggle?completed=${completed}`);
  }

  async createActivity(activity: Omit<DailyActivity, 'id'>): Promise<DailyActivity> {
    return apiClient.post<DailyActivity>('/activities', activity);
  }

  async updateActivity(id: string, data: Partial<DailyActivity>): Promise<DailyActivity> {
    return apiClient.patch<DailyActivity>(`/activities/${id}`, data);
  }

  async deleteActivity(id: string): Promise<boolean> {
    const res = await apiClient.delete<{ success: boolean }>(`/activities/${id}`);
    return res.success;
  }
}

export const apiActivityRepository = new ApiActivityRepository();
