import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, RotateCcw, Award, Eye, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useGameSession } from '../../hooks/useGameSession';
import { useLanguage } from '../../context/LanguageContext';

interface RecallItem {
  id: string;
  name: string;
  emoji: string;
}

const ALL_OBJECTS: RecallItem[] = [
  { id: 'tea', name: 'Assam Tea Cup', emoji: '☕' },
  { id: 'bell', name: 'Brass Prayer Bell', emoji: '🔔' },
  { id: 'flower', name: 'Jasmine Bloom', emoji: '🌼' },
  { id: 'basket', name: 'Bamboo Basket', emoji: '🧺' },
  { id: 'water', name: 'Copper Water Pitcher', emoji: '🏺' },
  { id: 'lamp', name: 'Clay Diya Lamp', emoji: '🪔' },
  { id: 'silk', name: 'Muga Silk Scarf', emoji: '🧣' },
  { id: 'flute', name: 'Bamboo Flute', emoji: '🎋' },
];

export const ObjectRecall: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const {
    difficulty,
    isCompleted,
    score,
    accuracy,
    adaptiveResult,
    startGame,
    recordAttempt,
    completeGame,
  } = useGameSession({
    gameId: 'game-object-recall',
    gameCategory: 'recall',
    initialDifficulty: 'gentle',
  });

  const [phase, setPhase] = useState<'memorize' | 'recall' | 'result'>('memorize');
  const [targetItems, setTargetItems] = useState<RecallItem[]>([]);
  const [candidateItems, setCandidateItems] = useState<RecallItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number>(6);

  const initRound = () => {
    const targetCount = difficulty === 'gentle' ? 3 : difficulty === 'easy' ? 4 : 5;
    const shuffled = [...ALL_OBJECTS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, targetCount);
    
    const remaining = shuffled.slice(targetCount);
    const distractorCount = difficulty === 'gentle' ? 2 : 3;
    const candidates = [...targets, ...remaining.slice(0, distractorCount)].sort(() => Math.random() - 0.5);

    setTargetItems(targets);
    setCandidateItems(candidates);
    setSelectedIds([]);
    setPhase('memorize');
    setCountdown(6);
    startGame();
  };

  useEffect(() => {
    initRound();
  }, [difficulty]);

  useEffect(() => {
    if (phase === 'memorize' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'memorize' && countdown === 0) {
      setPhase('recall');
    }
  }, [phase, countdown]);

  const toggleSelect = (id: string) => {
    if (phase !== 'recall') return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleVerify = () => {
    const targetIds = new Set(targetItems.map((t) => t.id));
    let correctCount = 0;
    let falseAlarmCount = 0;

    selectedIds.forEach((id) => {
      if (targetIds.has(id)) {
        correctCount += 1;
      } else {
        falseAlarmCount += 1;
      }
    });

    const isFullSuccess = correctCount === targetItems.length && falseAlarmCount === 0;
    const points = Math.max(0, correctCount * 20 - falseAlarmCount * 10);

    recordAttempt(isFullSuccess, points);
    setPhase('result');
    completeGame();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/patient/play')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('games.backToGames')}</span>
        </Button>
        <span className="text-xs sm:text-sm font-bold bg-[#E7F3ED] text-[#0F4C3A] px-3.5 py-1.5 rounded-full border border-[#BDE0D0]">
          {t(`games.difficulty${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`)}
        </span>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          {t('games.objectRecall.title')} 🌸
        </h1>
        <p className="text-stone-600 text-lg max-w-xl mx-auto">
          {phase === 'memorize'
            ? t('games.objectRecall.memorizePrompt')
            : phase === 'recall'
            ? t('games.objectRecall.whichItemsWereShown')
            : t('games.sessionComplete')}
        </p>
      </div>

      {/* Phase 1: Memorization */}
      {phase === 'memorize' && (
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-stone-500 font-bold text-sm mb-4">
            <Eye className="w-4 h-4 text-[#0F4C3A]" />
            <span>Hiding in {countdown} seconds...</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {targetItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 text-center border-2 border-stone-200 shadow-md transform animate-in zoom-in-95 duration-200"
              >
                <span className="text-5xl sm:text-6xl block mb-2">{item.emoji}</span>
                <span className="font-bold text-stone-800 text-base">{item.name}</span>
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setPhase('recall')}
          >
            I've Memorized Them! →
          </Button>
        </div>
      )}

      {/* Phase 2: Recall Selection */}
      {phase === 'recall' && (
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {candidateItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`p-6 rounded-3xl border-3 text-center transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#E7F3ED] border-[#0F4C3A] shadow-md scale-102 ring-2 ring-[#0F4C3A]/20'
                      : 'bg-white border-stone-200 hover:border-stone-400 shadow-xs'
                  }`}
                >
                  <span className="text-5xl block mb-2">{item.emoji}</span>
                  <span className="font-bold text-stone-800 text-sm sm:text-base block">{item.name}</span>
                  <div className="mt-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isSelected
                          ? 'bg-[#0F4C3A] text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {isSelected ? '✓ Selected' : 'Tap to Pick'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            variant="primary"
            size="xl"
            fullWidth
            onClick={handleVerify}
            disabled={selectedIds.length === 0}
          >
            {t('games.objectRecall.checkAnswers')} ({selectedIds.length} chosen)
          </Button>
        </div>
      )}

      {/* Phase 3: Results */}
      {phase === 'result' && isCompleted && (
        <Card variant="warm" className="max-w-xl mx-auto text-center p-8 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#0F4C3A] mx-auto flex items-center justify-center mb-4 shadow-sm">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-[#0F4C3A] mb-2">
            {t('games.sessionComplete')}
          </h2>
          <p className="text-stone-600 text-lg mb-6">
            Your visual object memory is being gently nurtured.
          </p>

          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-stone-200 mb-6">
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">{t('games.score')}</div>
              <div className="text-2xl font-black text-stone-900">{score}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">{t('games.accuracy')}</div>
              <div className="text-2xl font-black text-emerald-700">{accuracy}%</div>
            </div>
          </div>

          {adaptiveResult && (
            <div className="bg-[#E7F3ED] border border-[#BDE0D0] rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F4C3A] uppercase tracking-wider mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t('games.adaptiveFeedbackTitle')}</span>
              </div>
              <p className="text-stone-800 font-semibold text-base mb-2">
                "{adaptiveResult.feedbackText}"
              </p>
              <div className="text-xs text-stone-600 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#0F4C3A]" />
                <span>Adjustment: {adaptiveResult.adjustmentReason}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={initRound}
              className="flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{t('games.playAgain')}</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/patient/play')}
            >
              {t('games.nextExercise')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
