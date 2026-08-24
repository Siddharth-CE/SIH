import type { IGameRepository } from '../interfaces/IGameRepository';
import type { Game, GameSession, CognitiveMetric, GameCategory } from '../../types';
import { apiClient } from './apiClient';

export class ApiGameRepository implements IGameRepository {
  async getGames(): Promise<Game[]> {
    return apiClient.get<Game[]>('/games');
  }

  async getGameBySlug(slug: string): Promise<Game | null> {
    try {
      return await apiClient.get<Game>(`/games/${slug}`);
    } catch {
      return null;
    }
  }

  async saveGameSession(session: Omit<GameSession, 'id'>): Promise<GameSession> {
    return apiClient.post<GameSession>('/games/sessions', session);
  }

  async getGameSessions(patientId: string, limit?: number): Promise<GameSession[]> {
    const query = limit ? `?limit=${limit}` : '';
    return apiClient.get<GameSession[]>(`/patients/${patientId}/game-sessions${query}`);
  }

  async getCognitiveMetrics(patientId: string): Promise<CognitiveMetric[]> {
    return apiClient.get<CognitiveMetric[]>(`/patients/${patientId}/metrics`);
  }

  async getLatestSession(patientId: string, category?: GameCategory): Promise<GameSession | null> {
    const sessions = await this.getGameSessions(patientId, 10);
    if (!sessions || sessions.length === 0) return null;
    if (category) {
      return sessions.find((s) => s.gameCategory === category) || null;
    }
    return sessions[0] || null;
  }
}

export const apiGameRepository = new ApiGameRepository();
