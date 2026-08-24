import type { Game, GameSession, CognitiveMetric, GameCategory } from '../../types';

export interface IGameRepository {
  getGames(): Promise<Game[]>;
  getGameBySlug(slug: string): Promise<Game | null>;
  saveGameSession(session: Omit<GameSession, 'id'>): Promise<GameSession>;
  getGameSessions(patientId: string, limit?: number): Promise<GameSession[]>;
  getCognitiveMetrics(patientId: string): Promise<CognitiveMetric[]>;
  getLatestSession(patientId: string, category?: GameCategory): Promise<GameSession | null>;
}
