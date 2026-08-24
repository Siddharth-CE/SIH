import type { IGameRepository } from '../interfaces/IGameRepository';
import type { Game, GameSession, CognitiveMetric, GameCategory } from '../../types';
import { getDB } from '../../utils/db';
import { INITIAL_GAMES } from '../../data/mock/initialData';

export class MockGameRepository implements IGameRepository {
  private games: Game[] = [...INITIAL_GAMES];

  async getGames(): Promise<Game[]> {
    return this.games;
  }

  async getGameBySlug(slug: string): Promise<Game | null> {
    return this.games.find((g) => g.slug === slug) || null;
  }

  async saveGameSession(session: Omit<GameSession, 'id'>): Promise<GameSession> {
    const db = await getDB();
    const newSession: GameSession = {
      ...session,
      id: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    await db.put('game_sessions', newSession);
    return newSession;
  }

  async getGameSessions(patientId: string, limit = 50): Promise<GameSession[]> {
    const db = await getDB();
    const all = await db.getAll('game_sessions');
    const filtered = all
      .filter((s) => s.patientId === patientId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    return filtered.slice(0, limit);
  }

  async getLatestSession(patientId: string, category?: GameCategory): Promise<GameSession | null> {
    const sessions = await this.getGameSessions(patientId, 100);
    if (!category) return sessions[0] || null;
    return sessions.find((s) => s.gameCategory === category) || null;
  }

  async getCognitiveMetrics(patientId: string): Promise<CognitiveMetric[]> {
    const sessions = await this.getGameSessions(patientId, 100);

    const categories: { cat: GameCategory; label: string; color: string }[] = [
      { cat: 'memory', label: 'Visual Memory', color: '#0F4C3A' },
      { cat: 'recall', label: 'Object Recall', color: '#1E40AF' },
      { cat: 'pattern', label: 'Pattern Recognition', color: '#7C2D12' },
      { cat: 'attention', label: 'Visual Attention', color: '#D97706' },
      { cat: 'emotion', label: 'Emotion Recognition', color: '#E06D53' },
      { cat: 'routine', label: 'Daily Routine Recall', color: '#065F46' },
    ];

    return categories.map(({ cat, label, color }) => {
      const catSessions = sessions.filter((s) => s.gameCategory === cat);
      if (catSessions.length === 0) {
        // Base seed default score for realistic demo initial state
        const defaultScores: Record<GameCategory, number> = {
          memory: 92,
          recall: 85,
          pattern: 88,
          attention: 90,
          emotion: 94,
          routine: 86,
        };
        return {
          category: cat,
          categoryLabel: label,
          scorePercentage: defaultScores[cat] || 85,
          trend: 'improving',
          sessionsCount: 3,
          lastPlayedDate: '2026-08-24',
          color,
        };
      }

      const totalAccuracy = catSessions.reduce((acc, curr) => acc + curr.accuracy, 0);
      const avgAccuracy = Math.round(totalAccuracy / catSessions.length);
      const trend =
        catSessions.length > 1
          ? catSessions[0].accuracy >= catSessions[1].accuracy
            ? 'improving'
            : 'stable'
          : 'stable';

      return {
        category: cat,
        categoryLabel: label,
        scorePercentage: avgAccuracy,
        trend,
        sessionsCount: catSessions.length,
        lastPlayedDate: catSessions[0].completedAt.split('T')[0],
        color,
      };
    });
  }
}

export const mockGameRepository = new MockGameRepository();
