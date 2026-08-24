import type { IAlertRepository } from '../interfaces';
import type { Alert } from '../../types';
import { getDB } from '../../utils/db';
import { INITIAL_ALERTS } from '../../data/mock/initialData';

export class MockAlertRepository implements IAlertRepository {
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    const db = await getDB();
    const count = await db.count('alerts');
    if (count === 0) {
      const tx = db.transaction('alerts', 'readwrite');
      for (const a of INITIAL_ALERTS) {
        await tx.objectStore('alerts').put(a);
      }
      await tx.done;
    }
    this.initialized = true;
  }

  async getAlerts(patientId?: string): Promise<Alert[]> {
    await this.ensureInitialized();
    const db = await getDB();
    const all = await db.getAll('alerts');
    const filtered = patientId ? all.filter((a) => a.patientId === patientId) : all;
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markAsRead(id: string): Promise<Alert> {
    await this.ensureInitialized();
    const db = await getDB();
    const existing = await db.get('alerts', id);
    if (!existing) throw new Error(`Alert ${id} not found`);

    const updated: Alert = { ...existing, read: true };
    await db.put('alerts', updated);
    return updated;
  }

  async resolveAlert(id: string): Promise<Alert> {
    await this.ensureInitialized();
    const db = await getDB();
    const existing = await db.get('alerts', id);
    if (!existing) throw new Error(`Alert ${id} not found`);

    const updated: Alert = { ...existing, resolved: true, read: true };
    await db.put('alerts', updated);
    return updated;
  }

  async createAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> {
    await this.ensureInitialized();
    const db = await getDB();
    const newAlert: Alert = {
      ...alert,
      id: `alt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    await db.put('alerts', newAlert);
    return newAlert;
  }
}

export const mockAlertRepository = new MockAlertRepository();
