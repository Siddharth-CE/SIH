import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Award, Sparkles, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useGameSession } from '../../hooks/useGameSession';
import { useLanguage } from '../../context/LanguageContext';

interface PatternQuestion {
  sequence: string[]; // e.g. ['🌿', '🌸', '🌿', '🌸', '?']
  correctAnswer: string;
  options: string[];
  theme: string;
}

const PATTERNS: PatternQuestion[] = [
  {
    sequence: ['🌿', '🌸', '🌿', '🌸', '?'],
    correctAnswer: '🌿',
    options: ['🌿', '🦏', '🌸', '🌾'],
    theme: 'Tea Leaf & Orchid Rhythm',
  },
  {
    sequence: ['🎋', '🎋', '🫖', '🎋', '🎋', '?'],
    correctAnswer: '🫖',
    options: ['🫖', '🌸', '🎋', '🔔'],
    theme: 'Bamboo & Brass Pattern',
  },
  {
    sequence: ['🦏', '🪶', '🦏', '🪶', '🦏', '?'],
    correctAnswer: '🪶',
    options: ['🪶', '🦏', '🌾', '🌸'],
    theme: 'Wildlife Heritage Sequence',
  },
  {
    sequence: ['🌾', '🌾', '🌾', '🌸', '🌾', '🌾', '🌾', '?'],
    correctAnswer: '🌸',
    options: ['🌸', '🌾', '🌿', '🎋'],
    theme: 'Harvest Festival Sequence',
  },
];

export const PatternRecognition: React.FC = () => {
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
    gameId: 'game-pattern-rec',
    gameCategory: 'pattern',
    initialDifficulty: 'gentle',
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const initGame = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    startGame();
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const currentPattern = PATTERNS[currentIndex % PATTERNS.length];

  const handleSelectOption = (option: string) => {
    if (selectedOption !== null || isCompleted) return;
    setSelectedOption(option);

    const isCorrect = option === currentPattern.correctAnswer;
    recordAttempt(isCorrect, 25);

    setTimeout(() => {
      if (currentIndex + 1 < 3) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        completeGame();
      }
    }, 900);
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
          Round {currentIndex + 1} of 3
        </span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          {t('games.pattern.title')} 🎋
        </h1>
        <p className="text-stone-600 text-lg max-w-xl mx-auto">
          {t('games.pattern.whatComesNext')}
        </p>
      </div>

      {!isCompleted ? (
        <div className="max-w-2xl mx-auto">
          {/* Pattern Strip */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border-2 border-[#E2D8C3] shadow-sm mb-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-4 text-center">
              {currentPattern.theme}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {currentPattern.sequence.map((symbol, i) => (
                <div
                  key={i}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border-2 font-black transition-all ${
                    symbol === '?'
                      ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse scale-105'
                      : 'bg-white border-stone-200 shadow-xs'
                  }`}
                >
                  {symbol === '?' && selectedOption ? selectedOption : symbol}
                </div>
              ))}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {currentPattern.options.map((option, idx) => {
              const isPicked = selectedOption === option;
              const isCorrect = option === currentPattern.correctAnswer;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  disabled={selectedOption !== null}
                  className={`p-5 sm:p-6 rounded-3xl border-3 text-4xl sm:text-5xl flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                    selectedOption === null
                      ? 'bg-white border-stone-200 hover:border-[#0F4C3A] hover:scale-105 shadow-xs'
                      : isPicked && isCorrect
                      ? 'bg-emerald-100 border-emerald-500 scale-105 shadow-md'
                      : isPicked && !isCorrect
                      ? 'bg-rose-100 border-rose-400 opacity-80'
                      : isCorrect
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-stone-50 border-stone-200 opacity-40'
                  }`}
                >
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
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
            Pattern sequencing helps strengthen logical orientation.
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
              onClick={initGame}
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
