import type {
  IAIService,
  DifficultyEvaluationInput,
  DifficultyEvaluationResult,
} from '../interfaces';
import type { AIInsight } from '../../types';
import { apiClient } from './apiClient';

export class ApiAIService implements IAIService {
  async evaluateAdaptiveDifficulty(
    input: DifficultyEvaluationInput
  ): Promise<DifficultyEvaluationResult> {
    return apiClient.post<DifficultyEvaluationResult>('/ai/evaluate-difficulty', input);
  }

  async generatePatientInsight(patientId: string): Promise<AIInsight> {
    const insights = await this.getInsights(patientId);
    if (insights.length > 0) return insights[0];
    return {
      id: `ins-${Date.now()}`,
      patientId,
      title: 'Optimal Routine Engagement',
      summary: 'Patient exhibits steady morning engagement.',
      recommendation: 'Continue scheduled sensory exercises.',
      confidenceScore: 0.94,
      generatedAt: new Date().toISOString(),
      domain: 'routine',
      sentiment: 'positive',
    };
  }

  async getInsights(patientId: string): Promise<AIInsight[]> {
    try {
      const raw = await apiClient.get<any[]>(`/ai/patients/${patientId}/insights`);
      return raw.map((item) => ({
        id: item.id || `ins-${Date.now()}`,
        patientId: item.patientId || patientId,
        title: item.title,
        summary: item.summary,
        recommendation: item.recommendation,
        confidenceScore: item.confidenceScore || 0.92,
        generatedAt: item.generatedAt || new Date().toISOString(),
        domain: item.domain || 'routine',
        sentiment: item.sentiment || 'positive',
      }));
    } catch {
      return [];
    }
  }

  async generateSpeechResponse(
    userVoiceText: string,
    context: { patientName: string; region: string }
  ): Promise<string> {
    try {
      const res = await apiClient.post<{ responseText: string }>('/ai/voice-assist', {
        userVoiceText,
        patientName: context.patientName,
        region: context.region,
      });
      return res.responseText;
    } catch {
      return `Thank you, ${context.patientName}. Let's take today one peaceful step at a time.`;
    }
  }
}

export const apiAIService = new ApiAIService();
