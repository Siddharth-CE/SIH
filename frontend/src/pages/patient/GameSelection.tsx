import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  Grid,
  Eye,
  Smile,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, Badge } from '../../components/ui/Card';
import { useLanguage } from '../../context/LanguageContext';

export const GameSelection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const games = [
    {
      id: 'memory',
      title: t('games.memoryMatch.title'),
      desc: t('games.memoryMatch.desc'),
      route: '/patient/game/memory',
      icon: Brain,
      time: '4 mins',
      tag: 'Flora & Wildlife Cards',
      color: '#0F4C3A',
      badge: 'Visual Memory',
    },
    {
      id: 'recall',
      title: t('games.objectRecall.title'),
      desc: t('games.objectRecall.desc'),
      route: '/patient/game/recall',
      icon: Sparkles,
      time: '5 mins',
      tag: 'Household Objects',
      color: '#1E40AF',
      badge: 'Short-term Recall',
    },
    {
      id: 'pattern',
      title: t('games.pattern.title'),
      desc: t('games.pattern.desc'),
      route: '/patient/game/pattern',
      icon: Grid,
      time: '4 mins',
      tag: 'Handloom Sequences',
      color: '#7C2D12',
      badge: 'Logic & Sequencing',
    },
    {
      id: 'attention',
      title: t('games.attention.title'),
      desc: t('games.attention.desc'),
      route: '/patient/game/attention',
      icon: Eye,
      time: '3 mins',
      tag: 'Rapid Symbol Focus',
      color: '#D97706',
      badge: 'Visual Attention',
    },
    {
      id: 'emotion',
      title: t('games.emotion.title'),
      desc: t('games.emotion.desc'),
      route: '/patient/game/emotion',
      icon: Smile,
      time: '4 mins',
      tag: 'Friendly Expressions',
      color: '#E06D53',
      badge: 'Social & Emotion',
    },
    {
      id: 'routine',
      title: t('games.routineRecall.title'),
      desc: t('games.routineRecall.desc'),
      route: '/patient/game/routine',
      icon: Calendar,
      time: '4 mins',
      tag: 'Daily Schedule',
      color: '#065F46',
      badge: 'Orientation',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <div className="text-center mb-8">
        <Badge variant="forest" size="md" className="mb-2">
          AI Adaptive Exercises
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          {t('games.hubTitle')} 🌿
        </h1>
        <p className="text-stone-600 text-lg sm:text-xl max-w-xl mx-auto">
          {t('games.hubSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {games.map((game) => {
          const Icon = game.icon;

          return (
            <Card
              key={game.id}
              variant="warm"
              className="p-6 sm:p-7 border-2 border-[#E2D8C3] hover:border-[#0F4C3A] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: game.color }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {game.time}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400 block mb-1">
                  {game.badge}
                </span>
                <h3 className="text-2xl font-black text-stone-900 mb-2">
                  {game.title}
                </h3>
                <p className="text-stone-600 text-base leading-relaxed mb-6">
                  {game.desc}
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate(game.route)}
                className="flex items-center justify-center gap-2 text-lg font-bold"
              >
                <span>{t('games.startPlaying')}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
