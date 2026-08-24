import type { IPatientRepository } from '../interfaces/IPatientRepository';
import type { Patient, MoodEntry } from '../../types';
import { getDB } from '../../utils/db';
import { INITIAL_PATIENTS, INITIAL_MOODS } from '../../data/mock/initialData';

export class MockPatientRepository implements IPatientRepository {
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    const db = await getDB();
    const count = await db.count('patients');
    if (count === 0) {
      const tx = db.transaction(['patients', 'moods'], 'readwrite');
      for (const p of INITIAL_PATIENTS) {
        await tx.objectStore('patients').put(p);
      }
      for (const m of INITIAL_MOODS) {
        await tx.objectStore('moods').put(m);
      }
      await tx.done;
    }
    this.initialized = true;
  }

  async getPatients(): Promise<Patient[]> {
    await this.ensureInitialized();
    const db = await getDB();
    return await db.getAll('patients');
  }

  async getPatientById(id: string): Promise<Patient | null> {
    await this.ensureInitialized();
    const db = await getDB();
    const patient = await db.get('patients', id);
    return patient || null;
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    await this.ensureInitialized();
    const db = await getDB();
    const existing = await db.get('patients', id);
    if (!existing) {
      throw new Error(`Patient ${id} not found`);
    }
    const updated: Patient = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await db.put('patients', updated);
    return updated;
  }

  async updateHydration(patientId: string, count: number): Promise<Patient> {
    await this.ensureInitialized();
    const db = await getDB();
    const existing = await db.get('patients', patientId);
    if (!existing) throw new Error(`Patient ${patientId} not found`);

    const newCount = Math.max(0, count);
    const updated: Patient = {
      ...existing,
      hydrationCurrentGlasses: newCount,
      updatedAt: new Date().toISOString(),
    };
    await db.put('patients', updated);
    return updated;
  }

  async logMood(entry: Omit<MoodEntry, 'id' | 'loggedAt'>): Promise<MoodEntry> {
    await this.ensureInitialized();
    const db = await getDB();
    const newMood: MoodEntry = {
      ...entry,
      id: `mood-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      loggedAt: new Date().toISOString(),
    };
    await db.put('moods', newMood);
    return newMood;
  }

  async getMoods(patientId: string): Promise<MoodEntry[]> {
    await this.ensureInitialized();
    const db = await getDB();
    const all = await db.getAll('moods');
    return all.filter((m) => m.patientId === patientId);
  }
}

export const mockPatientRepository = new MockPatientRepository();
