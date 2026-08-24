import { memoryRepository, syncService } from './repositories';
import type { FamilyMemory } from '../types';

export const memoryService = {
  async getMemories(patientId: string, category?: string): Promise<FamilyMemory[]> {
    return await memoryRepository.getMemories(patientId, category);
  },

  async createMemory(memory: Omit<FamilyMemory, 'id' | 'createdAt'>): Promise<FamilyMemory> {
    const created = await memoryRepository.createMemory(memory);
    await syncService.queueEvent({
      entityType: 'memory',
      action: 'create',
      payload: created,
    });
    return created;
  },

  async toggleFavorite(id: string): Promise<FamilyMemory> {
    const updated = await memoryRepository.toggleFavorite(id);
    await syncService.queueEvent({
      entityType: 'memory',
      action: 'update',
      payload: updated,
    });
    return updated;
  },

  async deleteMemory(id: string): Promise<boolean> {
    const success = await memoryRepository.deleteMemory(id);
    await syncService.queueEvent({
      entityType: 'memory',
      action: 'delete',
      payload: { id },
    });
    return success;
  }
};
