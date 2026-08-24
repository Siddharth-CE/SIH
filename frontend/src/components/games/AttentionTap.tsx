import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Award, Sparkles, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useGameSession } from '../../hooks/useGameSession';
import { useLanguage } from '../../context/LanguageContext';

const TARGET_SYMBOL = { emoji: '🌸', name: 'Pink Orchid' };
const DISTRACTORS = [
  { emoji: '🌿', name: 'Green Leaf' },
  { emoji: '🌾', name: 'Golden Rice' },
  { emoji: '🎋', name: 'Bamboo' },
  { emoji: '🪶', name: 'Feather' },
];

export const AttentionTap: React.FC = () => {
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
    gameId: 'game-attention-tap',
    gameCategory: 'attention',
    initialDifficulty: 'gentle',
  });

  const [currentDisplay, setCurrentDisplay] = useState<{ emoji: string; name: string }>(TARGET_SYMBOL);
  const [isTargetActive, setIsTargetActive] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [roundsLeft, setRoundsLeft] = useState(8);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerNextFlash = () => {
    setTapped(false);
    const isTarget = Math.random() < 0.45;
    setIsTargetActive(isTarget);

    if (isTarget) {
      setCurrentDisplay(TARGET_SYMBOL);
    } else {
      const randomDistractor = DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)];
      setCurrentDisplay(randomDistractor);
    }

    setRoundsLeft((prev) => {
      if (prev <= 1) {
        completeGame();
        return 0;
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    startGame();
    setRoundsLeft(8);
    timerRef.current = setInterval(triggerNextFlash, 2200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty]);

  const handleTap = () => {
    if (tapped || isCompleted) return;
    setTapped(true);

    if (isTargetActive) {
      recordAttempt(true, 15);
    } else {
      recordAttempt(false, 0);
    }
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
          Target: {TARGET_SYMBOL.emoji} {TARGET_SYMBOL.name}
        </span>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          {t('games.attention.title')} 🎯
        </h1>
        <p className="text-stone-600 text-lg max-w-xl mx-auto">
          Tap the big button only when you see the <span className="font-bold text-[#0F4C3A]">{TARGET_SYMBOL.name} {TARGET_SYMBOL.emoji}</span>!
        </p>
      </div>

      {!isCompleted ? (
        <div className="max-w-md mx-auto text-center">
          {/* Visual Display Screen */}
          <div className="bg-white rounded-3xl p-10 border-3 border-stone-200 shadow-md mb-8 flex flex-col items-center justify-center min-h-[220px]">
            <span className="text-7xl sm:text-8xl block mb-2 transition-transform scale-110">
              {currentDisplay.emoji}
            </span>
            <span className="font-bold text-stone-700 text-base">{currentDisplay.name}</span>
          </div>

          {/* Senior Accessible Giant Tap Button */}
          <Button
            variant={isTargetActive && tapped ? 'primary' : !isTargetActive && tapped ? 'coral' : 'amber'}
            size="xl"
            fullWidth
            onClick={handleTap}
            disabled={tapped}
            className="text-2xl py-6 rounded-3xl shadow-xl transform active:scale-95"
          >
            {tapped ? (isTargetActive ? '✓ Great Focus!' : '✕ Oops, not the target') : '👉 TAP WHEN MATCHES!'}
          </Button>

          <p className="text-stone-500 text-sm mt-4 font-semibold">
            {roundsLeft} changes remaining in this round
          </p>
        </div>
      ) : (
        <Card variant="warm" className="max-w-xl mx-auto text-center p-8 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#0F4C3A] mx-auto flex items-center justify-center mb-4 shadow-sm">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-[#0F4C3A] mb-2">
            {t('games.sessionComplete')}
          </h2>
          <p className="text-stone-600 text-lg mb-6">
            Quick visual attention exercises keep mental reflexes sharp.
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
              onClick={() => {
                setRoundsLeft(8);
                startGame();
              }}
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
