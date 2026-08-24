import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Sparkles, Heart, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useGameSession } from '../../hooks/useGameSession';
import { useLanguage } from '../../context/LanguageContext';

interface EmotionPrompt {
  id: string;
  avatar: string;
  scenario: string;
  correctEmotion: string;
  options: { label: string; emoji: string }[];
}

const EMOTIONS: EmotionPrompt[] = [
  {
    id: '1',
    avatar: '👵',
    scenario: 'Grandmother smiling warmly as her grandchildren arrive with tea.',
    correctEmotion: 'Joy & Warmth',
    options: [
      { label: 'Joy & Warmth', emoji: '😊' },
      { label: 'Sleepy', emoji: '😴' },
      { label: 'Worried', emoji: '😟' },
      { label: 'Surprised', emoji: '😲' },
    ],
  },
  {
    id: '2',
    avatar: '🧓',
    scenario: 'Uncle sitting quietly by the veranda enjoying the morning pine breeze.',
    correctEmotion: 'Peaceful Calm',
    options: [
      { label: 'Peaceful Calm', emoji: '😌' },
      { label: 'Angry', emoji: '😠' },
      { label: 'In a Hurry', emoji: '🏃' },
      { label: 'Confused', emoji: '🤔' },
    ],
  },
  {
    id: '3',
    avatar: '👩‍🌾',
    scenario: 'Farmer smiling proudly while holding fresh tea garden harvest.',
    correctEmotion: 'Gratitude & Pride',
    options: [
      { label: 'Gratitude & Pride', emoji: '🥰' },
      { label: 'Tired', emoji: '🥱' },
      { label: 'Afraid', emoji: '😨' },
      { label: 'Sad', emoji: '😢' },
    ],
  },
];

export const EmotionRecognition: React.FC = () => {
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
    gameId: 'game-emotion-rec',
    gameCategory: 'emotion',
    initialDifficulty: 'gentle',
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const initGame = () => {
    setCurrentIdx(0);
    setSelectedEmotion(null);
    startGame();
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const currentItem = EMOTIONS[currentIdx % EMOTIONS.length];

  const handlePick = (label: string) => {
    if (selectedEmotion !== null || isCompleted) return;
    setSelectedEmotion(label);

    const isCorrect = label === currentItem.correctEmotion;
    recordAttempt(isCorrect, 30);

    setTimeout(() => {
      if (currentIdx + 1 < EMOTIONS.length) {
        setCurrentIdx((prev) => prev + 1);
        setSelectedEmotion(null);
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
          Scenario {currentIdx + 1} of {EMOTIONS.length}
        </span>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          {t('games.emotion.title')} 💛
        </h1>
        <p className="text-stone-600 text-lg max-w-xl mx-auto">
          {t('games.emotion.howDoTheyFeel')}
        </p>
      </div>

      {!isCompleted ? (
        <div className="max-w-xl mx-auto">
          <div className="bg-[#FFFDF9] rounded-3xl p-8 border-2 border-[#E2D8C3] shadow-md text-center mb-8">
            <span className="text-7xl block mb-4 animate-in zoom-in duration-200">
              {currentItem.avatar}
            </span>
            <p className="text-xl sm:text-2xl font-bold text-stone-800 leading-relaxed">
              "{currentItem.scenario}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentItem.options.map((opt) => {
              const isSelected = selectedEmotion === opt.label;
              const isCorrect = opt.label === currentItem.correctEmotion;

              return (
                <button
                  key={opt.label}
                  onClick={() => handlePick(opt.label)}
                  disabled={selectedEmotion !== null}
                  className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all cursor-pointer select-none text-left ${
                    selectedEmotion === null
                      ? 'bg-white border-stone-200 hover:border-[#0F4C3A] hover:bg-stone-50 shadow-xs'
                      : isSelected && isCorrect
                      ? 'bg-emerald-100 border-emerald-500 scale-102 shadow-md'
                      : isSelected && !isCorrect
                      ? 'bg-rose-100 border-rose-400'
                      : isCorrect
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-stone-50 border-stone-200 opacity-40'
                  }`}
                >
                  <span className="text-4xl">{opt.emoji}</span>
                  <span className="font-extrabold text-stone-800 text-lg">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <Card variant="warm" className="max-w-xl mx-auto text-center p-8 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#0F4C3A] mx-auto flex items-center justify-center mb-4 shadow-sm">
            <Heart className="w-10 h-10 fill-emerald-600/20" />
          </div>
          <h2 className="text-3xl font-black text-[#0F4C3A] mb-2">
            {t('games.sessionComplete')}
          </h2>
          <p className="text-stone-600 text-lg mb-6">
            Recognizing emotional cues helps preserve empathetic connection.
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
