import type { IReminderRepository } from '../interfaces/IReminderRepository';
import type { Reminder, ReminderStatus } from '../../types';
import { getDB } from '../../utils/db';
import { INITIAL_REMINDERS } from '../../data/mock/initialData';

export class MockReminderRepository implements IReminderRepository {
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    const db = await getDB();
    const count = await db.count('reminders');
    if (count === 0) {
      const tx = db.transaction('reminders', 'readwrite');
      for (const r of INITIAL_REMINDERS) {
        await tx.objectStore('reminders').put(r);
      }
      await tx.done;
    }
    this.initialized = true;
  }

  async getReminders(patientId: string, date?: string): Promise<Reminder[]> {
    await this.ensureInitialized();
    const db = await getDB();
    const all = await db.getAll('reminders');
    return all.filter((r) => {
      const matchesPatient = r.patientId === patientId;
      const matchesDate = date ? r.scheduledForDate === date : true;
      return matchesPatient && matchesDate;
    });
  }

  async getReminderById(id: string): Promise<Reminder | null> {
    await this.ensureInitialized();
    const db = await getDB();
    const rem = await db.get('reminders', id);
    return rem || null;
  }

  async createReminder(reminder: Omit<Reminder, 'id'>): Promise<Reminder> {
    await this.ensureInitialized();
    const db = await getDB();
    const newRem: Reminder = {
      ...reminder,
      id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    await db.put('reminders', newRem);
    return newRem;
  }

  async updateReminderStatus(id: string, status: ReminderStatus): Promise<Reminder> {
    await this.ensureInitialized();
    const db = await getDB();
    const existing = await db.get('reminders', id);
    if (!existing) throw new Error(`Reminder ${id} not found`);

    const updated: Reminder = {
      ...existing,
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : existing.completedAt,
    };
    await db.put('reminders', updated);
    return updated;
  }

  async updateReminder(id: string, data: Partial<Reminder>): Promise<Reminder> {
    await this.ensureInitialized();
    const db = await getDB();
    const existing = await db.get('reminders', id);
    if (!existing) throw new Error(`Reminder ${id} not found`);

    const updated: Reminder = {
      ...existing,
      ...data,
    };
    await db.put('reminders', updated);
    return updated;
  }

  async deleteReminder(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const db = await getDB();
    await db.delete('reminders', id);
    return true;
  }
}

export const mockReminderRepository = new MockReminderRepository();
