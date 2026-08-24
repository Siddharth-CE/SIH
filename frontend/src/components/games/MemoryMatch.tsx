import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, ArrowLeft, Award, Info, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useGameSession } from '../../hooks/useGameSession';
import { useLanguage } from '../../context/LanguageContext';

interface CardItem {
  id: number;
  symbol: string;
  name: string;
  matched: boolean;
  flipped: boolean;
}

const REGIONAL_SYMBOLS = [
  { symbol: '🌿', name: 'Assam Tea Leaf' },
  { symbol: '🦏', name: 'Kaziranga Rhino' },
  { symbol: '🌸', name: 'Kopou Orchid' },
  { symbol: '🎋', name: 'Bamboo Weave' },
  { symbol: '🪶', name: 'Hornbill Feather' },
  { symbol: '🫖', name: 'Brass Tea Kettle' },
  { symbol: '🌾', name: 'Golden Rice Stalk' },
  { symbol: '🌺', name: 'Shirui Lily' },
];

export const MemoryMatch: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const {
    difficulty,
    isCompleted,
    score,
    attempts,
    accuracy,
    adaptiveResult,
    startGame,
    recordAttempt,
    completeGame,
  } = useGameSession({
    gameId: 'game-memory-match',
    gameCategory: 'memory',
    initialDifficulty: 'gentle',
  });

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const initCards = () => {
    const pairCount = difficulty === 'gentle' ? 2 : difficulty === 'easy' ? 3 : difficulty === 'moderate' ? 4 : 6;
    const selectedSymbols = REGIONAL_SYMBOLS.slice(0, pairCount);
    const deck = [...selectedSymbols, ...selectedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((item, idx) => ({
        id: idx,
        symbol: item.symbol,
        name: item.name,
        matched: false,
        flipped: false,
      }));

    setCards(deck);
    setFlippedIndices([]);
    setIsEvaluating(false);
  };

  useEffect(() => {
    initCards();
    startGame();
  }, [difficulty]);

  const handleCardClick = (index: number) => {
    if (isEvaluating || cards[index].flipped || cards[index].matched || isCompleted) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsEvaluating(true);
      const [firstIdx, secondIdx] = newFlipped;
      const match = cards[firstIdx].symbol === cards[secondIdx].symbol;

      setTimeout(() => {
        if (match) {
          newCards[firstIdx].matched = true;
          newCards[secondIdx].matched = true;
          setCards([...newCards]);
          recordAttempt(true, 25);

          const allMatched = newCards.every((c) => c.matched);
          if (allMatched) {
            completeGame();
          }
        } else {
          newCards[firstIdx].flipped = false;
          newCards[secondIdx].flipped = false;
          setCards([...newCards]);
          recordAttempt(false, 0);
        }
        setFlippedIndices([]);
        setIsEvaluating(false);
      }, 750);
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
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-bold bg-[#E7F3ED] text-[#0F4C3A] px-3.5 py-1.5 rounded-full border border-[#BDE0D0]">
            {t(`games.difficulty${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`)}
          </span>
          <span className="text-xs sm:text-sm font-bold bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full border border-amber-200">
            {t('games.score')}: {score}
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          {t('games.memoryMatch.title')} 🌿
        </h1>
        <p className="text-stone-600 text-lg max-w-xl mx-auto">
          {t('games.memoryMatch.instructions')}
        </p>
      </div>

      {!isCompleted ? (
        <div
          className={`grid gap-3 sm:gap-4 max-w-2xl mx-auto ${
            cards.length <= 4
              ? 'grid-cols-2'
              : cards.length <= 8
              ? 'grid-cols-2 sm:grid-cols-4'
              : 'grid-cols-3 sm:grid-cols-4'
          }`}
        >
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={card.matched || card.flipped || isEvaluating}
              className={`aspect-square rounded-3xl border-3 flex flex-col items-center justify-center p-4 transition-all duration-200 select-none cursor-pointer ${
                card.matched
                  ? 'bg-emerald-50 border-emerald-400 opacity-90 scale-95 shadow-inner'
                  : card.flipped
                  ? 'bg-white border-[#0F4C3A] shadow-lg scale-100'
                  : 'bg-[#FFFDF9] border-[#E2D8C3] hover:border-[#0F4C3A] hover:shadow-md shadow-xs active:scale-95'
              }`}
              aria-label={card.flipped || card.matched ? card.name : `Card ${idx + 1}`}
            >
              {card.flipped || card.matched ? (
                <>
                  <span className="text-4xl sm:text-6xl animate-in zoom-in-75 duration-150">
                    {card.symbol}
                  </span>
                  <span className="text-xs font-bold text-stone-700 mt-2 line-clamp-1 text-center">
                    {card.name}
                  </span>
                </>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[#E7F3ED] border border-[#BDE0D0] flex items-center justify-center text-[#0F4C3A] font-black text-xl">
                  ✦
                </div>
              )}
            </button>
          ))}
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
            You found all pairs with wonderful attention!
          </p>

          <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-stone-200 mb-6">
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">{t('games.score')}</div>
              <div className="text-2xl font-black text-stone-900">{score}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">{t('games.accuracy')}</div>
              <div className="text-2xl font-black text-emerald-700">{accuracy}%</div>
            </div>
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">{t('games.attempts')}</div>
              <div className="text-2xl font-black text-stone-900">{attempts}</div>
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
                <span>AI Adjustment: {adaptiveResult.adjustmentReason}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                initCards();
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
