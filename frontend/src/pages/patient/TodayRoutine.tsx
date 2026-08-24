import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Coffee,
  Pill,
  Brain,
  Utensils,
  Users,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, Badge } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { activityService } from '../../services';
import type { DailyActivity } from '../../types';

export const TodayRoutine: React.FC = () => {
  const { activePatient } = useAuth();
  const { t } = useLanguage();
  const { playChime } = useAccessibility();

  const [activities, setActivities] = useState<DailyActivity[]>([]);

  const loadActivities = async () => {
    if (activePatient?.id) {
      const list = await activityService.getActivities(activePatient.id);
      setActivities(list);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [activePatient?.id]);

  const handleToggle = async (act: DailyActivity) => {
    playChime(act.completed ? 'click' : 'success');
    const updated = await activityService.toggleActivity(act.id, !act.completed);
    setActivities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const completedCount = activities.filter((a) => a.completed).length;
  const totalCount = activities.length;

  const getActivityIcon = (type: DailyActivity['type']) => {
    switch (type) {
      case 'morning_wake':
        return Sun;
      case 'meal':
        return Utensils;
      case 'medication':
        return Pill;
      case 'game':
        return Brain;
      case 'social':
        return Users;
      case 'sleep':
        return Moon;
      default:
        return Coffee;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <div className="text-center mb-8">
        <Badge variant="forest" size="md" className="mb-2">
          Daily Rhythm & Structure
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          {t('routine.title')} 📅
        </h1>
        <p className="text-stone-600 text-lg sm:text-xl max-w-xl mx-auto">
          {t('routine.subtitle')}
        </p>

        <div className="bg-white rounded-2xl p-4 mt-6 border border-stone-200 shadow-xs max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm font-bold text-stone-700 mb-2">
            <span>Progress Today</span>
            <span className="text-[#0F4C3A] font-extrabold">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0F4C3A] rounded-full transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-1 before:bg-[#E5DEC9]">
        {activities.map((act) => {
          const Icon = getActivityIcon(act.type);

          return (
            <div key={act.id} className="relative">
              <div
                className={`absolute -left-6 sm:-left-8 top-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  act.completed
                    ? 'bg-[#0F4C3A] border-[#0A3327] text-white shadow-xs'
                    : 'bg-white border-[#C9BFAC] text-stone-400'
                }`}
              >
                {act.completed ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-stone-400" />
                )}
              </div>

              <Card
                variant="warm"
                className={`p-5 sm:p-6 border-2 transition-all cursor-pointer select-none ${
                  act.completed
                    ? 'border-emerald-300/80 bg-emerald-50/40 opacity-95'
                    : 'border-[#E2D8C3] hover:border-[#0F4C3A]'
                }`}
                onClick={() => handleToggle(act)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        act.completed ? 'bg-emerald-100 text-[#0F4C3A]' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          {act.time}
                        </span>
                        {act.durationMinutes && (
                          <span className="text-xs text-stone-500 font-semibold">
                            {act.durationMinutes} mins
                          </span>
                        )}
                      </div>
                      <h3
                        className={`text-xl font-bold mt-1 ${
                          act.completed ? 'line-through text-stone-500' : 'text-stone-900'
                        }`}
                      >
                        {act.defaultTitle}
                      </h3>
                    </div>
                  </div>

                  <Button
                    variant={act.completed ? 'secondary' : 'primary'}
                    size="md"
                    className="shrink-0 min-w-[130px]"
                  >
                    {act.completed ? '✓ Completed' : 'Mark Done'}
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
