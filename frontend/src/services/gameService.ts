import { gameRepository, syncService, patientRepository } from './repositories';
import type { Game, GameSession, CognitiveMetric, GameCategory } from '../types';

export const gameService = {
  async getGames(): Promise<Game[]> {
    return await gameRepository.getGames();
  },

  async getGameBySlug(slug: string): Promise<Game | null> {
    return await gameRepository.getGameBySlug(slug);
  },

  async recordSession(sessionData: Omit<GameSession, 'id' | 'synced'>): Promise<GameSession> {
    const isOnline = syncService.isOnline();
    const saved = await gameRepository.saveGameSession({
      ...sessionData,
      synced: isOnline,
    });

    // Queue for sync
    await syncService.queueEvent({
      entityType: 'game_session',
      action: 'create',
      payload: saved,
    });

    // Update patient streak & status
    try {
      const patient = await patientRepository.getPatientById(sessionData.patientId);
      if (patient) {
        await patientRepository.updatePatient(patient.id, {
          statusSummary: `Completed ${sessionData.gameCategory} game with ${sessionData.accuracy}% accuracy.`,
        });
      }
    } catch {
      // Non-blocking status summary update
    }

    return saved;
  },

  async getGameSessions(patientId: string, limit?: number): Promise<GameSession[]> {
    return await gameRepository.getGameSessions(patientId, limit);
  },

  async getLatestSession(patientId: string, category?: GameCategory): Promise<GameSession | null> {
    return await gameRepository.getLatestSession(patientId, category);
  },

  async getCognitiveMetrics(patientId: string): Promise<CognitiveMetric[]> {
    return await gameRepository.getCognitiveMetrics(patientId);
  },
};
