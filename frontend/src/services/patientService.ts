import { patientRepository, syncService } from './repositories';
import type { Patient, MoodEntry } from '../types';

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    return await patientRepository.getPatients();
  },

  async getPatientById(id: string): Promise<Patient | null> {
    return await patientRepository.getPatientById(id);
  },

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    const updated = await patientRepository.updatePatient(id, data);
    await syncService.queueEvent({
      entityType: 'hydration',
      action: 'update',
      payload: { id, ...data },
    });
    return updated;
  },

  async recordGlassOfWater(patientId: string): Promise<Patient> {
    const patient = await patientRepository.getPatientById(patientId);
    if (!patient) throw new Error('Patient not found');
    const newCount = (patient.hydrationCurrentGlasses || 0) + 1;
    const updated = await patientRepository.updateHydration(patientId, newCount);
    await syncService.queueEvent({
      entityType: 'hydration',
      action: 'update',
      payload: { patientId, hydrationCurrentGlasses: newCount },
    });
    return updated;
  },

  async logMood(patientId: string, mood: MoodEntry['mood'], note?: string, loggedBy: 'patient' | 'caregiver' = 'patient'): Promise<MoodEntry> {
    const entry = await patientRepository.logMood({
      patientId,
      mood,
      note,
      loggedBy,
    });
    await syncService.queueEvent({
      entityType: 'mood',
      action: 'create',
      payload: entry,
    });
    return entry;
  },

  async getMoods(patientId: string): Promise<MoodEntry[]> {
    return await patientRepository.getMoods(patientId);
  }
};
