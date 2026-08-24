import type { Reminder, ReminderStatus } from '../../types';

export interface IReminderRepository {
  getReminders(patientId: string, date?: string): Promise<Reminder[]>;
  getReminderById(id: string): Promise<Reminder | null>;
  createReminder(reminder: Omit<Reminder, 'id'>): Promise<Reminder>;
  updateReminderStatus(id: string, status: ReminderStatus): Promise<Reminder>;
  updateReminder(id: string, data: Partial<Reminder>): Promise<Reminder>;
  deleteReminder(id: string): Promise<boolean>;
}
