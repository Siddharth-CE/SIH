import type { IActivityRepository } from '../interfaces/IActivityRepository';
import type { DailyActivity } from '../../types';
import { getDB } from '../../utils/db';
import { INITIAL_DAILY_ACTIVITIES } from '../../data/mock/initialData';

export class MockActivityRepository implements IActivityRepository {
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    const db = await getDB();
    const count = await db.count('activities');
    if (count === 0) {
      const tx = db.transaction('activities', 'readwrite');
      for (const a of INITIAL_DAILY_ACTIVITIES) {
        await tx.objectStore('activities').put(a);
      }
      await tx.done;
    }
    this.initialized = true;
  }

  async getActivities(patientId: string): Promise<DailyActivity[]> {
    await this.ensureInitialized();
    const db = await getDB();
    const all = await db.getAll('activities');
    return all.filter((a) => a.patientId === patientId);
  }

  async toggleActivityCompletion(activityId: string, completed: boolean): Promise<DailyActivity> {
    await this.ensureInitialized();
    const db = await getDB();
    const existing = await db.get('activities', activityId);
    if (!existing) throw new Error(`Activity ${activityId} not found`);

    const updated: DailyActivity = {
      ...existing,
      completed,
    };
    await db.put('activities', updated);
    return updated;
  }

  async createActivity(activity: Omit<DailyActivity, 'id'>): Promise<DailyActivity> {
    await this.ensureInitialized();
    const db = await getDB();
    const newAct: DailyActivity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    await db.put('activities', newAct);
    return newAct;
  }

  async updateActivity(id: string, data: Partial<DailyActivity>): Promise<DailyActivity> {
    await this.ensureInitialized();
    const db = await getDB();
    const existing = await db.get('activities', id);
    if (!existing) throw new Error(`Activity ${id} not found`);

    const updated: DailyActivity = {
      ...existing,
      ...data,
    };
    await db.put('activities', updated);
    return updated;
  }

  async deleteActivity(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const db = await getDB();
    await db.delete('activities', id);
    return true;
  }
}

export const mockActivityRepository = new MockActivityRepository();
