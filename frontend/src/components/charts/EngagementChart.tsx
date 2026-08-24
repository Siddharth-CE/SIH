import React from 'react';
import type { CognitiveMetric } from '../../types';

interface WeeklyChartProps {
  data?: { day: string; engagement: number; target: number }[];
}

export const WeeklyEngagementChart: React.FC<WeeklyChartProps> = ({
  data = [
    { day: 'Mon', engagement: 85, target: 80 },
    { day: 'Tue', engagement: 90, target: 80 },
    { day: 'Wed', engagement: 78, target: 80 },
    { day: 'Thu', engagement: 95, target: 80 },
    { day: 'Fri', engagement: 88, target: 80 },
    { day: 'Sat', engagement: 92, target: 80 },
    { day: 'Sun', engagement: 96, target: 80 },
  ],
}) => {
  const maxHeight = 120;

  return (
    <div className="w-full bg-[#FFFDF9] rounded-3xl p-6 border border-[#EAE3D2] shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900">7-Day Cognitive Engagement</h3>
          <p className="text-xs text-stone-500">Daily routine + memory exercises</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-[#0F4C3A]">
            <span className="w-3 h-3 rounded-md bg-[#0F4C3A]" /> Actual %
          </span>
          <span className="flex items-center gap-1 text-stone-400">
            <span className="w-3 h-1 bg-stone-300 rounded-full" /> Target (80%)
          </span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="flex items-end justify-between gap-2 sm:gap-4 h-36 pt-4 border-b border-stone-200">
        {data.map((item) => {
          const barHeight = Math.round((item.engagement / 100) * maxHeight);
          const isHigh = item.engagement >= 85;

          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[11px] font-bold text-stone-600 opacity-80 group-hover:opacity-100 transition-opacity">
                {item.engagement}%
              </span>
              <div className="w-full max-w-[36px] bg-stone-100 rounded-t-xl overflow-hidden relative flex items-end justify-center h-[120px]">
                {/* Target line guideline */}
                <div
                  className="absolute w-full border-t border-dashed border-stone-300 z-10"
                  style={{ bottom: `${(item.target / 100) * maxHeight}px` }}
                />
                {/* Active bar */}
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isHigh ? 'bg-[#0F4C3A] group-hover:bg-[#0A3327]' : 'bg-[#4E876B]'
                  }`}
                  style={{ height: `${barHeight}px` }}
                />
              </div>
              <span className="text-xs font-bold text-stone-700">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface CategoryProgressProps {
  metrics: CognitiveMetric[];
}

export const CognitiveCategoryBreakdown: React.FC<CategoryProgressProps> = ({ metrics }) => {
  return (
    <div className="space-y-4">
      {metrics.map((metric) => (
        <div key={metric.category} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: metric.color }}
              />
              <span className="font-bold text-stone-800 text-sm sm:text-base">
                {metric.categoryLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-stone-900 text-base">
                {metric.scorePercentage}%
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  metric.trend === 'improving'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {metric.trend === 'improving' ? '↑ Steady' : '→ Maintained'}
              </span>
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${metric.scorePercentage}%`,
                backgroundColor: metric.color,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 mt-2">
            <span>{metric.sessionsCount} sessions completed</span>
            <span>Last active: {metric.lastPlayedDate}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
