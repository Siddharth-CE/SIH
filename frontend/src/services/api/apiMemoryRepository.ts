import type { IMemoryRepository } from '../interfaces/IMemoryRepository';
import type { FamilyMemory } from '../../types';
import { apiClient } from './apiClient';

export class ApiMemoryRepository implements IMemoryRepository {
  async getMemories(patientId: string, category?: string): Promise<FamilyMemory[]> {
    const query = category ? `?category=${category}` : '';
    return apiClient.get<FamilyMemory[]>(`/patients/${patientId}/memories${query}`);
  }

  async createMemory(memory: Omit<FamilyMemory, 'id' | 'createdAt'>): Promise<FamilyMemory> {
    return apiClient.post<FamilyMemory>('/memories', memory);
  }

  async toggleFavorite(id: string): Promise<FamilyMemory> {
    return apiClient.patch<FamilyMemory>(`/memories/${id}/favorite`);
  }

  async deleteMemory(id: string): Promise<boolean> {
    const res = await apiClient.delete<{ success: boolean }>(`/memories/${id}`);
    return res.success;
  }
}

export const apiMemoryRepository = new ApiMemoryRepository();
