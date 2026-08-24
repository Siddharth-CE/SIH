import { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { gameService, aiService } from '../services';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import type { GameCategory, DifficultyLevel, GameSession } from '../types';
import type { DifficultyEvaluationResult } from '../services/interfaces';

interface UseGameSessionProps {
  gameId: string;
  gameCategory: GameCategory;
  initialDifficulty?: DifficultyLevel;
  maxPossibleScore?: number;
}

export function useGameSession({
  gameId,
  gameCategory,
  initialDifficulty = 'gentle',
  maxPossibleScore = 100,
}: UseGameSessionProps) {
  const { activePatient } = useAuth();
  const { playChime, settings } = useAccessibility();

  const [sessionId] = useState<string>(() => `sess-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [difficultyScore, setDifficultyScore] = useState<number>(() => {
    const map: Record<DifficultyLevel, number> = { gentle: 2, easy: 4, moderate: 6, challenging: 8 };
    return map[initialDifficulty] || 2;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [successfulAttempts, setSuccessfulAttempts] = useState<number>(0);
  const [lastActionTimestamp, setLastActionTimestamp] = useState<number>(Date.now());
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [adaptiveResult, setAdaptiveResult] = useState<DifficultyEvaluationResult | null>(null);
  const [savedSession, setSavedSession] = useState<GameSession | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const consecutiveSuccessRef = useRef<number>(0);
  const consecutiveFailureRef = useRef<number>(0);

  const startGame = useCallback(() => {
    startTimeRef.current = Date.now();
    setLastActionTimestamp(Date.now());
    setIsPlaying(true);
    setIsCompleted(false);
    setScore(0);
    setAttempts(0);
    setSuccessfulAttempts(0);
    setResponseTimes([]);
    setAdaptiveResult(null);
    setSavedSession(null);
    consecutiveSuccessRef.current = 0;
    consecutiveFailureRef.current = 0;
  }, []);

  const recordAttempt = useCallback(
    (isSuccess: boolean, pointsEarned = 10) => {
      const now = Date.now();
      const latency = Math.max(200, now - lastActionTimestamp);
      setResponseTimes((prev) => [...prev, latency]);
      setLastActionTimestamp(now);

      setAttempts((prev) => prev + 1);
      if (isSuccess) {
        setSuccessfulAttempts((prev) => prev + 1);
        setScore((prev) => Math.min(maxPossibleScore, prev + pointsEarned));
        consecutiveSuccessRef.current += 1;
        consecutiveFailureRef.current = 0;
        playChime('card_flip');
      } else {
        consecutiveFailureRef.current += 1;
        consecutiveSuccessRef.current = 0;
      }
    },
    [lastActionTimestamp, maxPossibleScore, playChime]
  );

  const completeGame = useCallback(async () => {
    setIsPlaying(false);
    setIsCompleted(true);
    const totalTimeSpentSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    
    const accuracy = attempts > 0 ? Math.round((successfulAttempts / attempts) * 100) : 100;
    const avgResponseTime =
      responseTimes.length > 0
        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
        : 2500;

    // Trigger celebratory chimes and lightweight confetti if reduced motion is disabled
    playChime('success');
    if (!settings.reducedMotion) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#0F4C3A', '#4E876B', '#D97706', '#E06D53'],
        });
      } catch {
        // Safe fallback
      }
    }

    // Adaptive AI Evaluation
    const evalResult = await aiService.evaluateAdaptiveDifficulty({
      gameCategory,
      currentDifficulty: difficulty,
      currentDifficultyScore: difficultyScore,
      accuracy,
      averageResponseTimeMs: avgResponseTime,
      consecutiveSuccesses: consecutiveSuccessRef.current,
      consecutiveFailures: consecutiveFailureRef.current,
      patientAge: activePatient?.age || 72,
    });

    setAdaptiveResult(evalResult);
    setDifficulty(evalResult.nextDifficulty);
    setDifficultyScore(evalResult.nextDifficultyScore);

    // Save session to repository (IndexedDB + Sync Queue)
    const session = await gameService.recordSession({
      sessionId,
      patientId: activePatient?.id || 'pat-101',
      gameId,
      gameCategory,
      difficulty,
      difficultyScore,
      score,
      maxPossibleScore,
      accuracy,
      attempts,
      successfulAttempts,
      averageResponseTimeMs: avgResponseTime,
      timeSpentSeconds: totalTimeSpentSeconds,
      completedAt: new Date().toISOString(),
      feedbackGiven: evalResult.feedbackText,
      adaptiveDelta: evalResult.delta,
    });

    setSavedSession(session);
  }, [
    attempts,
    successfulAttempts,
    responseTimes,
    playChime,
    settings.reducedMotion,
    gameCategory,
    difficulty,
    difficultyScore,
    activePatient?.age,
    activePatient?.id,
    sessionId,
    gameId,
    score,
    maxPossibleScore,
  ]);

  // Load previous difficulty for this category when mounted
  useEffect(() => {
    if (activePatient?.id) {
      gameService.getLatestSession(activePatient.id, gameCategory).then((latest) => {
        if (latest) {
          setDifficulty(latest.difficulty);
          setDifficultyScore(latest.difficultyScore);
        }
      });
    }
  }, [activePatient?.id, gameCategory]);

  return {
    sessionId,
    difficulty,
    difficultyScore,
    isPlaying,
    isCompleted,
    score,
    attempts,
    successfulAttempts,
    accuracy: attempts > 0 ? Math.round((successfulAttempts / attempts) * 100) : 0,
    adaptiveResult,
    savedSession,
    startGame,
    recordAttempt,
    completeGame,
  };
}
