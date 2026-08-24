import type { FamilyMemory } from '../../types';

export interface IMemoryRepository {
  getMemories(patientId: string, category?: string): Promise<FamilyMemory[]>;
  createMemory(memory: Omit<FamilyMemory, 'id' | 'createdAt'>): Promise<FamilyMemory>;
  toggleFavorite(id: string): Promise<FamilyMemory>;
  deleteMemory(id: string): Promise<boolean>;
}
