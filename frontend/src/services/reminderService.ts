import { reminderRepository, syncService } from './repositories';
import type { Reminder } from '../types';

export const reminderService = {
  async getReminders(patientId: string, date?: string): Promise<Reminder[]> {
    return await reminderRepository.getReminders(patientId, date);
  },

  async getReminderById(id: string): Promise<Reminder | null> {
    return await reminderRepository.getReminderById(id);
  },

  async markAsTaken(id: string): Promise<Reminder> {
    const updated = await reminderRepository.updateReminderStatus(id, 'completed');
    await syncService.queueEvent({
      entityType: 'reminder',
      action: 'update',
      payload: updated,
    });
    return updated;
  },

  async snoozeReminder(id: string): Promise<Reminder> {
    const updated = await reminderRepository.updateReminderStatus(id, 'snoozed');
    await syncService.queueEvent({
      entityType: 'reminder',
      action: 'update',
      payload: updated,
    });
    return updated;
  },

  async createReminder(reminder: Omit<Reminder, 'id'>): Promise<Reminder> {
    const created = await reminderRepository.createReminder(reminder);
    await syncService.queueEvent({
      entityType: 'reminder',
      action: 'create',
      payload: created,
    });
    return created;
  },

  async updateReminder(id: string, data: Partial<Reminder>): Promise<Reminder> {
    const updated = await reminderRepository.updateReminder(id, data);
    await syncService.queueEvent({
      entityType: 'reminder',
      action: 'update',
      payload: updated,
    });
    return updated;
  },

  async deleteReminder(id: string): Promise<boolean> {
    const success = await reminderRepository.deleteReminder(id);
    await syncService.queueEvent({
      entityType: 'reminder',
      action: 'delete',
      payload: { id },
    });
    return success;
  }
};
