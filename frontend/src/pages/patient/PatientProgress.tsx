import React, { useState, useEffect } from 'react';
import {
  Flame,
  Award,
  CheckCircle2,
  Brain,
  ShieldAlert,
} from 'lucide-react';
import { Card, Badge } from '../../components/ui/Card';
import { WeeklyEngagementChart, CognitiveCategoryBreakdown } from '../../components/charts/EngagementChart';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { gameService } from '../../services';
import type { CognitiveMetric, GameSession } from '../../types';

export const PatientProgress: React.FC = () => {
  const { activePatient } = useAuth();
  const { t } = useLanguage();

  const [metrics, setMetrics] = useState<CognitiveMetric[]>([]);
  const [recentSessions, setRecentSessions] = useState<GameSession[]>([]);

  useEffect(() => {
    if (activePatient?.id) {
      gameService.getCognitiveMetrics(activePatient.id).then(setMetrics);
      gameService.getGameSessions(activePatient.id, 5).then(setRecentSessions);
    }
  }, [activePatient?.id]);

  const avgAccuracy =
    metrics.length > 0
      ? Math.round(metrics.reduce((acc, m) => acc + m.scorePercentage, 0) / metrics.length)
      : 88;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <div className="text-center mb-8">
        <Badge variant="forest" size="md" className="mb-2">
          Longitudinal Engagement
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          {t('progress.title')} 🌿
        </h1>
        <p className="text-stone-600 text-lg sm:text-xl max-w-xl mx-auto">
          {t('progress.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card variant="warm" className="p-6 border-2 border-amber-200/70 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-3">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-stone-900 mb-1">
            {activePatient?.currentStreakDays || 7} Days
          </div>
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {t('progress.streak')}
          </div>
        </Card>

        <Card variant="warm" className="p-6 border-2 border-emerald-200/70 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0F4C3A] mx-auto flex items-center justify-center mb-3">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-800 mb-1">
            {avgAccuracy}%
          </div>
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {t('progress.averageAccuracy')}
          </div>
        </Card>

        <Card variant="warm" className="p-6 border-2 border-teal-200/70 text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-stone-900 mb-1">
            4 / 4
          </div>
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Activities Today
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <WeeklyEngagementChart />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-black text-stone-900 mb-4">
          {t('progress.categoryBreakdown')}
        </h2>
        <CognitiveCategoryBreakdown metrics={metrics} />
      </div>

      {recentSessions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-black text-stone-900 mb-4">
            Recent Play Sessions
          </h2>
          <div className="space-y-3">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E7F3ED] text-[#0F4C3A] flex items-center justify-center font-bold">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 capitalize">
                      {s.gameCategory} Exercise
                    </div>
                    <div className="text-xs text-stone-500">
                      {new Date(s.completedAt).toLocaleDateString()} • {s.timeSpentSeconds}s duration
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-[#0F4C3A] text-lg">
                    {s.accuracy}%
                  </div>
                  <div className="text-xs text-stone-500 capitalize">
                    {s.difficulty} Pace
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E5DEC9] flex items-start gap-3.5 text-stone-600 text-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t('progress.disclaimer')}
        </p>
      </div>
    </div>
  );
};
