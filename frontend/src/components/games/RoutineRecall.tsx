import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Award, Sparkles, Calendar, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useGameSession } from '../../hooks/useGameSession';
import { useLanguage } from '../../context/LanguageContext';

interface RoutineQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
}

const ROUTINE_QUESTIONS: RoutineQuestion[] = [
  {
    question: 'What time is your morning medicine usually scheduled?',
    correctAnswer: '9:00 AM after breakfast',
    options: [
      '9:00 AM after breakfast',
      'At midnight 12:00 AM',
      '3:00 PM afternoon',
    ],
  },
  {
    question: 'How many glasses of water are we aiming to drink today?',
    correctAnswer: '6 glasses throughout the day',
    options: [
      '6 glasses throughout the day',
      'Only 1 sip',
      '20 huge bottles',
    ],
  },
  {
    question: 'Where do you enjoy family tea and quiet conversation?',
    correctAnswer: 'On the veranda with family',
    options: [
      'On the veranda with family',
      'Inside a dark crowded room',
      'In a busy airport',
    ],
  },
];

export const RoutineRecall: React.FC = () => {
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
    gameId: 'game-routine-recall',
    gameCategory: 'routine',
    initialDifficulty: 'gentle',
  });

  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);

  const initGame = () => {
    setQuestionIdx(0);
    setSelectedAns(null);
    startGame();
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const currentQ = ROUTINE_QUESTIONS[questionIdx % ROUTINE_QUESTIONS.length];

  const handlePick = (ans: string) => {
    if (selectedAns !== null || isCompleted) return;
    setSelectedAns(ans);

    const isCorrect = ans === currentQ.correctAnswer;
    recordAttempt(isCorrect, 35);

    setTimeout(() => {
      if (questionIdx + 1 < ROUTINE_QUESTIONS.length) {
        setQuestionIdx((prev) => prev + 1);
        setSelectedAns(null);
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
          Question {questionIdx + 1} of {ROUTINE_QUESTIONS.length}
        </span>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          {t('games.routineRecall.title')} 📅
        </h1>
        <p className="text-stone-600 text-lg max-w-xl mx-auto">
          {t('games.routineRecall.instructions')}
        </p>
      </div>

      {!isCompleted ? (
        <div className="max-w-xl mx-auto">
          <div className="bg-[#FFFDF9] rounded-3xl p-8 border-2 border-[#E2D8C3] shadow-md text-center mb-8">
            <Calendar className="w-12 h-12 text-[#0F4C3A] mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-stone-800 leading-snug">
              "{currentQ.question}"
            </h2>
          </div>

          <div className="space-y-3.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAns === option;
              const isCorrect = option === currentQ.correctAnswer;

              return (
                <button
                  key={idx}
                  onClick={() => handlePick(option)}
                  disabled={selectedAns !== null}
                  className={`w-full p-5 rounded-2xl border-2 font-bold text-lg text-left transition-all cursor-pointer select-none ${
                    selectedAns === null
                      ? 'bg-white border-stone-200 hover:border-[#0F4C3A] hover:bg-stone-50 shadow-xs'
                      : isSelected && isCorrect
                      ? 'bg-emerald-100 border-emerald-500 shadow-md text-emerald-950 scale-101'
                      : isSelected && !isCorrect
                      ? 'bg-rose-100 border-rose-400 text-rose-950'
                      : isCorrect
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-stone-50 border-stone-200 opacity-40'
                  }`}
                >
                  {option}
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
            Orientation to your daily rhythm helps bring calm clarity.
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
