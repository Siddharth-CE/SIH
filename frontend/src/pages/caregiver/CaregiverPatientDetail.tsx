import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { WeeklyEngagementChart, CognitiveCategoryBreakdown } from '../../components/charts/EngagementChart';
import {
  patientService,
  reminderService,
  activityService,
  gameService,
  aiService,
} from '../../services';
import { REGIONAL_PROFILES } from '../../data/mock/initialData';
import type {
  Patient,
  Reminder,
  DailyActivity,
  CognitiveMetric,
  GameSession,
  MoodEntry,
  AIInsight,
} from '../../types';

export const CaregiverPatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [metrics, setMetrics] = useState<CognitiveMetric[]>([]);
  const [recentSessions, setRecentSessions] = useState<GameSession[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'cognitive' | 'meds' | 'routine' | 'mood'>('overview');

  useEffect(() => {
    const patientId = id || 'pat-101';
    patientService.getPatientById(patientId).then((p) => {
      if (p) setPatient(p);
    });
    reminderService.getReminders(patientId).then(setReminders);
    activityService.getActivities(patientId).then(setActivities);
    gameService.getCognitiveMetrics(patientId).then(setMetrics);
    gameService.getGameSessions(patientId, 6).then(setRecentSessions);
    patientService.getMoods(patientId).then(setMoods);
    aiService.getInsights(patientId).then(setInsights);
  }, [id]);

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <p className="text-xl font-bold text-stone-600">Loading patient telemetry profile...</p>
      </div>
    );
  }

  const region = REGIONAL_PROFILES[patient.region];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28">
      {/* Back Button & Top Action */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/caregiver')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Caregiver Portal</span>
        </Button>

        <span className="text-xs sm:text-sm font-bold bg-[#E7F3ED] text-[#0F4C3A] px-4 py-1.5 rounded-full border border-[#BDE0D0]">
          {region.name} • {patient.stage} Dementia
        </span>
      </div>

      {/* Patient Header Banner */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900">
                {patient.name} ({patient.preferredName})
              </h1>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                  patient.overallEngagement === 'high'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {patient.overallEngagement} engagement
              </span>
            </div>
            <p className="text-stone-600 text-base font-semibold mt-1">
              {patient.age} years old • Emergency Contact: {patient.emergencyContact.name} ({patient.emergencyContact.phone})
            </p>
          </div>

          <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center">
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">Adherence</div>
              <div className="text-2xl font-black text-[#0F4C3A]">{patient.medicationAdherenceRate}%</div>
            </div>
            <div className="w-px h-8 bg-stone-300" />
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">Hydration</div>
              <div className="text-2xl font-black text-blue-700">
                {patient.hydrationCurrentGlasses}/{patient.hydrationGoalGlasses}
              </div>
            </div>
            <div className="w-px h-8 bg-stone-300" />
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">Streak</div>
              <div className="text-2xl font-black text-amber-700">{patient.currentStreakDays}d</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview & AI Insights' },
          { id: 'cognitive', label: 'Cognitive Engagement' },
          { id: 'meds', label: 'Medications & Hydration' },
          { id: 'routine', label: 'Daily Routine Timeline' },
          { id: 'mood', label: 'Mood & Emotional State' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & AI Insights */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#E7F3ED] rounded-3xl p-6 border border-[#BDE0D0]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F4C3A] mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" /> AI-Generated Caregiver Insight
            </div>
            {insights.map((ins) => (
              <div key={ins.id} className="mb-4 last:mb-0">
                <h3 className="text-xl font-bold text-[#0A3327] mb-1">{ins.title}</h3>
                <p className="text-stone-800 text-base mb-2">{ins.summary}</p>
                <div className="bg-white p-3.5 rounded-xl border border-[#BDE0D0] text-sm text-[#0F4C3A] font-bold">
                  💡 Recommendation: {ins.recommendation}
                </div>
              </div>
            ))}
          </div>

          <WeeklyEngagementChart />
        </div>
      )}

      {/* Tab 2: Cognitive Activity */}
      {activeTab === 'cognitive' && (
        <div className="space-y-6">
          <CognitiveCategoryBreakdown metrics={metrics} />

          <h3 className="text-2xl font-black text-stone-900 mt-8 mb-4">
            Recent Play Telemetry
          </h3>
          <div className="space-y-3">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-stone-900 capitalize">
                    {s.gameCategory} Exercise
                  </div>
                  <div className="text-xs text-stone-500">
                    Accuracy: {s.accuracy}% • Latency: {s.averageResponseTimeMs}ms • Time: {s.timeSpentSeconds}s
                  </div>
                </div>
                <span className="text-xs font-extrabold uppercase bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                  {s.difficulty} Pace
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Medications & Hydration */}
      {activeTab === 'meds' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200">
            <h3 className="text-2xl font-bold text-stone-900 mb-4">Medication Schedule</h3>
            <div className="space-y-3">
              {reminders
                .filter((r) => r.type === 'medication')
                .map((med) => (
                  <div
                    key={med.id}
                    className="p-4 rounded-2xl border border-stone-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-stone-900 text-lg">{med.title}</div>
                      <div className="text-sm text-stone-600">
                        {med.time} • {med.dosageOrInstruction}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        med.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {med.status === 'completed' ? '✓ Taken on time' : 'Pending'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Routine Timeline */}
      {activeTab === 'routine' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200">
          <h3 className="text-2xl font-bold text-stone-900 mb-4">Daily Schedule</h3>
          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-2xl border border-stone-200 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md mr-2">
                    {act.time}
                  </span>
                  <span className="font-bold text-stone-900">{act.defaultTitle}</span>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    act.completed ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {act.completed ? 'Completed' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Mood State */}
      {activeTab === 'mood' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200">
          <h3 className="text-2xl font-bold text-stone-900 mb-4">Emotional Logs</h3>
          <div className="space-y-3">
            {moods.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl border border-stone-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-stone-900 capitalize text-lg">
                    {m.mood === 'peaceful'
                      ? '😌 Peaceful Calm'
                      : m.mood === 'happy'
                      ? '😊 Joyful & Happy'
                      : m.mood}
                  </div>
                  {m.note && <div className="text-sm text-stone-600 mt-0.5">"{m.note}"</div>}
                  <div className="text-xs text-stone-400 mt-1">
                    Logged by {m.loggedBy} • {new Date(m.loggedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
