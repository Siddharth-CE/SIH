import type { IPatientRepository } from '../interfaces/IPatientRepository';
import type { Patient, MoodEntry } from '../../types';
import { apiClient } from './apiClient';

export class ApiPatientRepository implements IPatientRepository {
  async getPatients(): Promise<Patient[]> {
    return apiClient.get<Patient[]>('/patients');
  }

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      return await apiClient.get<Patient>(`/patients/${id}`);
    } catch {
      return null;
    }
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    return apiClient.patch<Patient>(`/patients/${id}`, data);
  }

  async updateHydration(patientId: string, count: number): Promise<Patient> {
    return apiClient.post<Patient>(`/patients/${patientId}/hydration?count=${count}`);
  }

  async logMood(entry: Omit<MoodEntry, 'id' | 'loggedAt'>): Promise<MoodEntry> {
    return apiClient.post<MoodEntry>(`/patients/${entry.patientId}/mood`, entry);
  }

  async getMoods(patientId: string): Promise<MoodEntry[]> {
    return apiClient.get<MoodEntry[]>(`/patients/${patientId}/mood`);
  }
}

export const apiPatientRepository = new ApiPatientRepository();
