import type { Alert, AIInsight, DifficultyLevel, GameCategory } from '../../types';

export interface IAlertRepository {
  getAlerts(patientId?: string): Promise<Alert[]>;
  markAsRead(id: string): Promise<Alert>;
  resolveAlert(id: string): Promise<Alert>;
  createAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert>;
}

export interface DifficultyEvaluationInput {
  gameCategory: GameCategory;
  currentDifficulty: DifficultyLevel;
  currentDifficultyScore: number; // 1 - 10
  accuracy: number; // 0 - 100
  averageResponseTimeMs: number;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  patientAge: number;
}

export interface DifficultyEvaluationResult {
  nextDifficulty: DifficultyLevel;
  nextDifficultyScore: number;
  cardCountOrItemCount: number;
  timeLimitSeconds?: number;
  distractorCount: number;
  feedbackText: string;
  adjustmentReason: string;
  delta: 'increased' | 'maintained' | 'decreased';
}

export interface IAIService {
  evaluateAdaptiveDifficulty(input: DifficultyEvaluationInput): Promise<DifficultyEvaluationResult>;
  generatePatientInsight(patientId: string): Promise<AIInsight>;
  getInsights(patientId: string): Promise<AIInsight[]>;
  generateSpeechResponse(userVoiceText: string, context: { patientName: string; region: string }): Promise<string>;
}

export interface IVoiceService {
  isSupported(): boolean;
  startListening(onResult: (text: string) => void, onError: (err: string) => void): void;
  stopListening(): void;
  speak(text: string, language?: string, onEnd?: () => void): void;
  stopSpeaking(): void;
}

export interface SyncResult {
  success: boolean;
  syncedEventsCount: number;
  failedEventsCount: number;
  lastSyncedTimestamp: string;
}

export interface ISyncService {
  queueEvent(event: Omit<import('../../types').SyncEvent, 'id' | 'timestamp' | 'status' | 'retryCount'>): Promise<void>;
  sync(): Promise<SyncResult>;
  getPendingCount(): Promise<number>;
  isOnline(): boolean;
  subscribeToNetworkStatus(callback: (online: boolean) => void): () => void;
}
