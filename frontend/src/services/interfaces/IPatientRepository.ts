import type { Patient, MoodEntry } from '../../types';

export interface IPatientRepository {
  getPatients(): Promise<Patient[]>;
  getPatientById(id: string): Promise<Patient | null>;
  updatePatient(id: string, data: Partial<Patient>): Promise<Patient>;
  updateHydration(patientId: string, count: number): Promise<Patient>;
  logMood(entry: Omit<MoodEntry, 'id' | 'loggedAt'>): Promise<MoodEntry>;
  getMoods(patientId: string): Promise<MoodEntry[]>;
}
