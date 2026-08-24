import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplets,
  Pill,
  Sparkles,
  Gamepad2,
  Calendar,
  Clock,
  Mic,
  CheckCircle2,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { reminderService, patientService } from '../../services';
import { VoiceAssistantModal } from '../../components/voice/VoiceAssistantModal';
import { REGIONAL_PROFILES } from '../../data/mock/initialData';
import type { Reminder, MoodType } from '../../types';

export const PatientHome: React.FC = () => {
  const { activePatient, updateCurrentPatient } = useAuth();
  const { t } = useLanguage();
  const { playChime } = useAccessibility();
  const navigate = useNavigate();

  const [nextMedicine, setNextMedicine] = useState<Reminder | null>(null);
  const [medicineTaken, setMedicineTaken] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const regionProfile = REGIONAL_PROFILES[activePatient?.region || 'assam'];

  useEffect(() => {
    if (activePatient?.id) {
      reminderService.getReminders(activePatient.id).then((rems) => {
        const med = rems.find((r) => r.type === 'medication' && r.status !== 'completed');
        if (med) {
          setNextMedicine(med);
          setMedicineTaken(false);
        } else {
          setNextMedicine(rems.find((r) => r.type === 'medication') || null);
          setMedicineTaken(true);
        }
      });
    }
  }, [activePatient?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTakeMedicine = async () => {
    if (nextMedicine && !medicineTaken) {
      playChime('success');
      await reminderService.markAsTaken(nextMedicine.id);
      setMedicineTaken(true);
      showToast(t('patient.takenSuccess'));
    }
  };

  const handleDrinkWater = async () => {
    if (!activePatient) return;
    playChime('success');
    const updated = await patientService.recordGlassOfWater(activePatient.id);
    updateCurrentPatient({ hydrationCurrentGlasses: updated.hydrationCurrentGlasses });
    showToast(t('patient.drinkWaterSuccess'));
  };

  const handleLogMood = async (mood: MoodType) => {
    if (!activePatient) return;
    setSelectedMood(mood);
    playChime('click');
    await patientService.logMood(activePatient.id, mood, undefined, 'patient');
    showToast(t('patient.moodLogged'));
  };

  const currentGlasses = activePatient?.hydrationCurrentGlasses || 0;
  const goalGlasses = activePatient?.hydrationGoalGlasses || 6;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28 text-white">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-base flex items-center gap-2 animate-in fade-in slide-in-from-top-4 border border-emerald-300/40">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Greeting Card */}
      <section className="mb-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/35 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block mb-1">
                {regionProfile.greeting} • {regionProfile.name}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {t('patient.greetingMorning')}, {activePatient?.preferredName || 'Asha'} 🌿
              </h1>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl font-black text-sm shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{activePatient?.currentStreakDays || 7} Days</span>
            </div>
          </div>
          <p className="text-emerald-100/85 text-lg sm:text-xl font-medium mt-2">
            "{t('patient.calmMessage')}"
          </p>
        </div>
      </section>

      {/* Checklist Cards */}
      <div className="space-y-4 mb-8">
        <Card variant="warm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 shadow-xs border border-amber-500/30">
                <Pill className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  {t('patient.morningMedicine')}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {nextMedicine?.title || 'Telmisartan (Blood Pressure)'}
                </h3>
                <p className="text-emerald-200/80 text-sm font-semibold flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-emerald-400/60" />
                  <span>{t('patient.dueAt')} {nextMedicine?.time || '9:00 AM'} • With warm water</span>
                </p>
              </div>
            </div>

            <Button
              variant={medicineTaken ? 'secondary' : 'primary'}
              size="lg"
              onClick={handleTakeMedicine}
              disabled={medicineTaken}
              className="w-full sm:w-auto min-w-[160px] rounded-2xl shadow-md cursor-pointer border border-emerald-300/40 bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            >
              {medicineTaken ? (
                <span className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {t('patient.takenButton')} ✓
                </span>
              ) : (
                t('patient.takenButton')
              )}
            </Button>
          </div>
        </Card>

        <Card variant="warm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 shadow-xs border border-sky-500/30">
                <Droplets className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
                  {t('patient.hydrationTitle')}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {currentGlasses} {t('patient.glassesOf')} {goalGlasses} {t('patient.glassesLabel')}
                </h3>
                <div className="flex items-center gap-1.5 mt-2">
                  {Array.from({ length: goalGlasses }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        idx < currentGlasses
                          ? 'bg-sky-400 border-sky-300 shadow-[0_0_8px_#38bdf8]'
                          : 'bg-emerald-950/60 border-emerald-700/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleDrinkWater}
              className="w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 rounded-2xl bg-sky-500/20 text-sky-200 border-2 border-sky-400/40 hover:bg-sky-500/30 cursor-pointer"
            >
              <Droplets className="w-5 h-5 text-sky-400" />
              <span>{t('patient.drinkWater')} +1</span>
            </Button>
          </div>
        </Card>

        <div className="glass-panel-forest rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(16,185,129,0.3)] relative overflow-hidden border-2 border-emerald-400/50">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> {t('patient.todayActivity')}
            </span>
            <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full text-white">
              {t('patient.fiveMinutes')}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black mb-2 text-white">
            {t('patient.memoryGarden')} 🌸
          </h3>
          <p className="text-emerald-100 text-base sm:text-lg mb-6 leading-relaxed">
            Relaxing floral matching featuring Assam Kopou orchids and tea garden leaves.
          </p>

          <Button
            variant="primary"
            size="xl"
            fullWidth
            onClick={() => navigate('/patient/game/memory')}
            className="flex items-center justify-center gap-2 text-xl font-black rounded-2xl shadow-[0_0_25px_rgba(52,211,153,0.5)] cursor-pointer bg-gradient-to-r from-emerald-400 to-teal-400 text-black border-none"
          >
            <span>{t('patient.startActivity')}</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mood Check-In */}
      <section className="mb-8 glass-panel rounded-3xl p-6 border border-emerald-500/35 shadow-xs">
        <h3 className="text-lg font-bold text-white mb-3">
          {t('patient.howAreYouFeeling')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              { type: 'peaceful', label: 'Peaceful', emoji: '😌' },
              { type: 'happy', label: 'Happy', emoji: '😊' },
              { type: 'thoughtful', label: 'Thoughtful', emoji: '🤔' },
              { type: 'tired', label: 'Tired', emoji: '🥱' },
            ] as const
          ).map((m) => (
            <button
              key={m.type}
              onClick={() => handleLogMood(m.type)}
              className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2.5 font-black text-base transition-all cursor-pointer ${
                selectedMood === m.type
                  ? 'bg-emerald-500/30 border-emerald-400 text-white scale-102 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  : 'bg-emerald-950/40 border-emerald-500/20 hover:border-emerald-400 text-emerald-100'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Senior Big Action Tiles */}
      <section>
        <h3 className="text-lg font-bold text-emerald-400 mb-3 uppercase tracking-wider text-xs">
          {t('patient.quickActions')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            onClick={() => navigate('/patient/play')}
            className="min-h-[85px] p-4 glass-panel rounded-3xl border border-emerald-500/35 flex flex-col items-center justify-center gap-2 font-black text-white hover:border-emerald-400 transition-all shadow-xs cursor-pointer active:scale-95 card-warm-hover"
          >
            <Gamepad2 className="w-8 h-8 text-emerald-400" />
            <span className="text-base">{t('nav.play')}</span>
          </button>

          <button
            onClick={() => navigate('/patient/today')}
            className="min-h-[85px] p-4 glass-panel rounded-3xl border border-emerald-500/35 flex flex-col items-center justify-center gap-2 font-black text-white hover:border-emerald-400 transition-all shadow-xs cursor-pointer active:scale-95 card-warm-hover"
          >
            <Calendar className="w-8 h-8 text-amber-400" />
            <span className="text-base">{t('nav.today')}</span>
          </button>

          <button
            onClick={() => navigate('/patient/reminders')}
            className="min-h-[85px] p-4 glass-panel rounded-3xl border border-emerald-500/35 flex flex-col items-center justify-center gap-2 font-black text-white hover:border-emerald-400 transition-all shadow-xs cursor-pointer active:scale-95 card-warm-hover"
          >
            <Clock className="w-8 h-8 text-sky-400" />
            <span className="text-base">{t('nav.reminders')}</span>
          </button>

          <button
            onClick={() => setIsVoiceOpen(true)}
            className="min-h-[85px] p-4 bg-gradient-to-br from-emerald-600/30 to-teal-700/30 rounded-3xl border border-emerald-400/50 flex flex-col items-center justify-center gap-2 font-black text-emerald-300 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer active:scale-95 card-warm-hover"
          >
            <Mic className="w-8 h-8 text-emerald-400 animate-pulse" />
            <span className="text-base">{t('nav.talk')}</span>
          </button>
        </div>
      </section>

      {/* Voice Modal */}
      <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};
