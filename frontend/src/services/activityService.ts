import { activityRepository, syncService } from './repositories';
import type { DailyActivity } from '../types';

export const activityService = {
  async getActivities(patientId: string): Promise<DailyActivity[]> {
    return await activityRepository.getActivities(patientId);
  },

  async toggleActivity(id: string, completed: boolean): Promise<DailyActivity> {
    const updated = await activityRepository.toggleActivityCompletion(id, completed);
    await syncService.queueEvent({
      entityType: 'activity',
      action: 'update',
      payload: updated,
    });
    return updated;
  },

  async createActivity(activity: Omit<DailyActivity, 'id'>): Promise<DailyActivity> {
    const created = await activityRepository.createActivity(activity);
    await syncService.queueEvent({
      entityType: 'activity',
      action: 'create',
      payload: created,
    });
    return created;
  },

  async updateActivity(id: string, data: Partial<DailyActivity>): Promise<DailyActivity> {
    const updated = await activityRepository.updateActivity(id, data);
    await syncService.queueEvent({
      entityType: 'activity',
      action: 'update',
      payload: updated,
    });
    return updated;
  },

  async deleteActivity(id: string): Promise<boolean> {
    const success = await activityRepository.deleteActivity(id);
    await syncService.queueEvent({
      entityType: 'activity',
      action: 'delete',
      payload: { id },
    });
    return success;
  }
};
