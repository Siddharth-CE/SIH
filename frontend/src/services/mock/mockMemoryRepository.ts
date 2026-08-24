import type { IMemoryRepository } from '../interfaces/IMemoryRepository';
import type { FamilyMemory } from '../../types';
import { getDB } from '../../utils/db';
import { INITIAL_MEMORIES } from '../../data/mock/initialData';

export class MockMemoryRepository implements IMemoryRepository {
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    const db = await getDB();
    const count = await db.count('memories');
    if (count === 0) {
      const tx = db.transaction('memories', 'readwrite');
      for (const m of INITIAL_MEMORIES) {
        await tx.objectStore('memories').put(m);
      }
      await tx.done;
    }
    this.initialized = true;
  }

  async getMemories(patientId: string, category?: string): Promise<FamilyMemory[]> {
    await this.ensureInitialized();
    const db = await getDB();
    const all = await db.getAll('memories');
    return all.filter((m) => {
      const matchPatient = m.patientId === patientId;
      const matchCat = category ? m.category === category : true;
      return matchPatient && matchCat;
    });
  }

  async createMemory(memory: Omit<FamilyMemory, 'id' | 'createdAt'>): Promise<FamilyMemory> {
    await this.ensureInitialized();
    const db = await getDB();
    const newMem: FamilyMemory = {
      ...memory,
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    await db.put('memories', newMem);
    return newMem;
  }

  async toggleFavorite(id: string): Promise<FamilyMemory> {
    await this.ensureInitialized();
    const db = await getDB();
    const existing = await db.get('memories', id);
    if (!existing) throw new Error(`Memory ${id} not found`);

    const updated: FamilyMemory = {
      ...existing,
      favorite: !existing.favorite,
    };
    await db.put('memories', updated);
    return updated;
  }

  async deleteMemory(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const db = await getDB();
    await db.delete('memories', id);
    return true;
  }
}

export const mockMemoryRepository = new MockMemoryRepository();
