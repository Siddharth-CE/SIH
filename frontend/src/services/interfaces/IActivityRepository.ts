import type { DailyActivity } from '../../types';

export interface IActivityRepository {
  getActivities(patientId: string): Promise<DailyActivity[]>;
  toggleActivityCompletion(activityId: string, completed: boolean): Promise<DailyActivity>;
  createActivity(activity: Omit<DailyActivity, 'id'>): Promise<DailyActivity>;
  updateActivity(id: string, data: Partial<DailyActivity>): Promise<DailyActivity>;
  deleteActivity(id: string): Promise<boolean>;
}
