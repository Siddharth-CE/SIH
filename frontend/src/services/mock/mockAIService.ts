import type { IAIService, DifficultyEvaluationInput, DifficultyEvaluationResult } from '../interfaces';
import type { AIInsight, DifficultyLevel } from '../../types';
import { getDB } from '../../utils/db';
import { INITIAL_AI_INSIGHTS } from '../../data/mock/initialData';

export class MockAIService implements IAIService {
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    const db = await getDB();
    const count = await db.count('ai_insights');
    if (count === 0) {
      const tx = db.transaction('ai_insights', 'readwrite');
      for (const ins of INITIAL_AI_INSIGHTS) {
        await tx.objectStore('ai_insights').put(ins);
      }
      await tx.done;
    }
    this.initialized = true;
  }

  async evaluateAdaptiveDifficulty(input: DifficultyEvaluationInput): Promise<DifficultyEvaluationResult> {
    // Simulate brief AI engine calculation time
    await new Promise((r) => setTimeout(r, 150));

    const {
      currentDifficulty,
      currentDifficultyScore,
      accuracy,
      averageResponseTimeMs,
      consecutiveSuccesses,
      consecutiveFailures,
    } = input;

    let nextDifficulty: DifficultyLevel = currentDifficulty;
    let nextDifficultyScore = currentDifficultyScore;
    let delta: 'increased' | 'maintained' | 'decreased' = 'maintained';
    let feedbackText = 'Wonderful effort! You are keeping a great, steady rhythm.';
    let adjustmentReason = 'Optimal cognitive performance match.';

    // High performance condition (> 85% accuracy and responsive)
    if (accuracy >= 85 && (consecutiveSuccesses >= 2 || averageResponseTimeMs < 4000)) {
      if (currentDifficulty === 'gentle') {
        nextDifficulty = 'easy';
        nextDifficultyScore = Math.min(10, currentDifficultyScore + 1);
        delta = 'increased';
        feedbackText = 'Splendid! You matched everything so smoothly. Let us try just a few more items.';
        adjustmentReason = 'High visual recall accuracy (>=85%). Stepped up by 1 level.';
      } else if (currentDifficulty === 'easy') {
        nextDifficulty = 'moderate';
        nextDifficultyScore = Math.min(10, currentDifficultyScore + 1);
        delta = 'increased';
        feedbackText = 'You are doing great! Let us gently explore the next level.';
        adjustmentReason = 'Consistent accuracy and fast response time. Upgraded to moderate.';
      } else if (currentDifficulty === 'moderate') {
        nextDifficulty = 'challenging';
        nextDifficultyScore = Math.min(10, currentDifficultyScore + 1);
        delta = 'increased';
        feedbackText = 'Impressive focus! You have unlocked the highest memory challenge for today.';
        adjustmentReason = 'Peak engagement observed.';
      } else {
        feedbackText = 'Masterful! You solved all challenging patterns effortlessly.';
        adjustmentReason = 'Already at maximum gentle difficulty ceiling.';
      }
    }
    // Low performance condition (< 50% accuracy or consecutive struggles)
    else if (accuracy < 50 || consecutiveFailures >= 2) {
      if (currentDifficulty === 'challenging') {
        nextDifficulty = 'moderate';
        nextDifficultyScore = Math.max(1, currentDifficultyScore - 1);
        delta = 'decreased';
        feedbackText = 'Take your time. We have adjusted the pace to make it gentle and pleasant.';
        adjustmentReason = 'Reduced distraction count to sustain confidence.';
      } else if (currentDifficulty === 'moderate') {
        nextDifficulty = 'easy';
        nextDifficultyScore = Math.max(1, currentDifficultyScore - 1);
        delta = 'decreased';
        feedbackText = 'No rush at all. Every memory exercise strengthens your mind.';
        adjustmentReason = 'Lowered card count to ease cognitive load.';
      } else if (currentDifficulty === 'easy') {
        nextDifficulty = 'gentle';
        nextDifficultyScore = Math.max(1, currentDifficultyScore - 1);
        delta = 'decreased';
        feedbackText = 'Here is a calm, relaxing exercise with familiar friendly pictures.';
        adjustmentReason = 'Transitioned to gentle mode with maximum visual clarity.';
      } else {
        feedbackText = 'Well done on completing today’s session. Rest a little before the next.';
        adjustmentReason = 'Maintained at gentle baseline.';
      }
    } else {
      // 50% - 84% accuracy -> Maintain
      feedbackText = 'Nicely done! You are maintaining great concentration.';
      adjustmentReason = 'Steady accuracy in target comfort zone (50-84%).';
    }

    // Determine card/item counts based on resulting level
    const cardMap: Record<DifficultyLevel, number> = {
      gentle: 4, // 2 pairs
      easy: 6, // 3 pairs
      moderate: 8, // 4 pairs
      challenging: 12, // 6 pairs
    };

    const distractorMap: Record<DifficultyLevel, number> = {
      gentle: 1,
      easy: 2,
      moderate: 3,
      challenging: 5,
    };

    return {
      nextDifficulty,
      nextDifficultyScore,
      cardCountOrItemCount: cardMap[nextDifficulty],
      timeLimitSeconds: nextDifficulty === 'challenging' ? 60 : undefined,
      distractorCount: distractorMap[nextDifficulty],
      feedbackText,
      adjustmentReason,
      delta,
    };
  }

  async generatePatientInsight(patientId: string): Promise<AIInsight> {
    await this.ensureInitialized();
    const db = await getDB();
    const insights = await db.getAll('ai_insights');
    const existing = insights.find((i) => i.patientId === patientId);
    if (existing) return existing;

    const newInsight: AIInsight = {
      id: `ins-${Date.now()}`,
      patientId,
      title: 'Positive Cognitive Engagement Trend',
      summary: 'Consistent engagement observed during morning sessions with strong visual pattern recognition.',
      recommendation: 'Encourage daily 5-minute Memory Garden play following breakfast.',
      confidenceScore: 0.92,
      generatedAt: new Date().toISOString(),
      domain: 'memory',
      sentiment: 'positive',
    };
    await db.put('ai_insights', newInsight);
    return newInsight;
  }

  async getInsights(patientId: string): Promise<AIInsight[]> {
    await this.ensureInitialized();
    const db = await getDB();
    const all = await db.getAll('ai_insights');
    return all.filter((i) => i.patientId === patientId);
  }

  async generateSpeechResponse(userVoiceText: string, context: { patientName: string; region: string }): Promise<string> {
    const text = userVoiceText.toLowerCase().trim();

    if (text.includes('medicine') || text.includes('pill') || text.includes('tablet') || text.includes('ঔষধ')) {
      return `Good morning ${context.patientName}. Your morning medicine was Telmisartan at 9:00 AM. Would you like me to mark it as taken?`;
    }
    if (text.includes('water') || text.includes('drink') || text.includes('পানি') || text.includes('জল')) {
      return `Staying hydrated helps memory stay fresh. You have had 4 glasses of water today. Let us drink one more glass together.`;
    }
    if (text.includes('play') || text.includes('game') || text.includes('memory') || text.includes('খেলা')) {
      return `Let us play the Memory Garden game. Matching beautiful Northeast flowers and tea leaves is ready for you!`;
    }
    if (text.includes('today') || text.includes('routine') || text.includes('schedule')) {
      return `Today is a peaceful day. Next on your routine is your afternoon memory exercise, followed by family tea in the veranda.`;
    }
    if (text.includes('who are you') || text.includes('help')) {
      return `I am your NER CognitiveCare voice assistant. I am right here by your side to help you with reminders, games, and daily routines.`;
    }
    if (text.includes('hello') || text.includes('hi') || text.includes('namaskar') || text.includes('khublei')) {
      return `Hello ${context.patientName}! It is wonderful to hear your voice today. How can I assist you?`;
    }

    return `I heard you say "${userVoiceText}". You are doing wonderfully today. Let us take things one gentle step at a time.`;
  }
}

export const mockAIService = new MockAIService();
