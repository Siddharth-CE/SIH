import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mic,
  WifiOff,
  Users,
  Shield,
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Globe2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, Badge } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { REGIONAL_PROFILES } from '../../data/mock/initialData';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useAuth();
  const { t } = useLanguage();

  const handleStartDemo = () => {
    setRole('patient');
    navigate('/patient');
  };

  const handleCaregiverDemo = () => {
    setRole('caregiver');
    navigate('/caregiver');
  };

  const handleHealthcareDemo = () => {
    setRole('healthcare');
    navigate('/healthcare');
  };

  return (
    <div className="min-h-screen text-stone-100 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 bg-emerald-900/80 backdrop-blur-xl text-emerald-300 px-4 py-2 rounded-full border border-emerald-500/40 text-xs sm:text-sm font-extrabold mb-6 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>AI-Powered Dementia & Memory Assistance for Northeast India</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent drop-shadow-sm">
                Helping Every Memory Stay Meaningful.
              </h1>

              <p className="text-lg sm:text-2xl text-emerald-100/90 font-medium leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 drop-shadow-xs">
                Cognitive gaming, medication reminders, native voice assistance, and caregiver peace of mind — crafted with cultural warmth for elders across 8 North Eastern states.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button
                  variant="primary"
                  size="xl"
                  onClick={handleStartDemo}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 text-xl px-8 py-5 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-102 group cursor-pointer transition-all border border-emerald-300/40 bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                >
                  <span>Try the Patient Demo</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="secondary"
                  size="xl"
                  onClick={handleCaregiverDemo}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-3xl cursor-pointer bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-2 border-amber-500/40 backdrop-blur-md transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Caregiver Portal</span>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={handleHealthcareDemo}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-3xl cursor-pointer bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 border-2 border-sky-400/30 backdrop-blur-md transition-all"
                >
                  <Activity className="w-5 h-5 text-sky-400" />
                  <span>Healthcare View</span>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 pt-6 border-t border-emerald-500/25 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-bold text-emerald-200">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 56px+ Touch Targets
                </span>
                <span className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-emerald-400" /> 100% Offline-First
                </span>
                <span className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-emerald-400" /> 5 Regional Languages
                </span>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md glass-panel rounded-[40px] p-6 sm:p-7 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border-2 border-emerald-400/40">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-500/20 text-xs font-bold text-emerald-200">
                  <span className="flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" /> Asha Aideo (72y)
                  </span>
                  <span className="bg-amber-900/80 text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-500/40">Assam • Mild</span>
                </div>

                <div className="bg-emerald-950/70 rounded-3xl p-5 mb-4 border border-emerald-500/30 shadow-xs">
                  <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-1">
                    Good morning 🌿
                  </div>
                  <h3 className="text-xl font-black text-white">
                    "Let's take today one gentle step at a time."
                  </h3>
                </div>

                <div className="bg-[#082b22]/90 rounded-2xl p-4 mb-3 border border-emerald-500/30 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💊</span>
                    <div>
                      <div className="font-bold text-sm text-white">Morning Medicine</div>
                      <div className="text-xs text-emerald-300/80">9:00 AM • Telmisartan</div>
                    </div>
                  </div>
                  <span className="bg-emerald-800 text-emerald-100 border border-emerald-400/40 text-xs font-bold px-3 py-1.5 rounded-full">
                    ✓ Taken
                  </span>
                </div>

                <div className="glass-panel-forest rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Recommended Activity
                    </span>
                    <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-semibold text-white">5 mins</span>
                  </div>
                  <h4 className="text-lg font-black text-white mb-1">Memory Garden Match</h4>
                  <p className="text-xs text-emerald-100 mb-4">
                    Orchids, Tea Flowers, and Bamboo Craft
                  </p>
                  <button
                    onClick={handleStartDemo}
                    className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-black text-sm py-3 rounded-2xl shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:brightness-110 transition-all cursor-pointer"
                  >
                    Start Activity →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="forest" size="md" className="mb-4">
            Specialized Health-Tech Innovation
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
            Designed for Northeast India's Elders
          </h2>
          <p className="text-emerald-100/85 text-lg sm:text-xl leading-relaxed">
            Combining empathetic geriatric UX, adaptive neuro-cognitive routines, and local cultural resonance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="warm" className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center mb-6 shadow-xs">
              <Brain className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Adaptive AI Engine</h3>
            <p className="text-emerald-100/80 text-base leading-relaxed mb-4">
              Difficulty calibrates subtly in real-time based on reaction latency and comfort, preventing both frustration and boredom.
            </p>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Gradual 1-step calibration
            </div>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center mb-6 shadow-xs">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Voice Companion</h3>
            <p className="text-emerald-100/80 text-base leading-relaxed mb-4">
              Speak naturally in native accents and languages to check medicines, log water, or play games without typing.
            </p>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Web Speech & Fallback AI
            </div>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center mb-6 shadow-xs">
              <WifiOff className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Remote & Offline-Ready</h3>
            <p className="text-emerald-100/80 text-base leading-relaxed mb-4">
              Fully operational in remote hilly districts without internet. Local IndexedDB event queue syncs automatically when network returns.
            </p>
            <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Zero connectivity dropouts
            </div>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center justify-center mb-6 shadow-xs">
              <Globe2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">8 NER State Profiles</h3>
            <p className="text-emerald-100/80 text-base leading-relaxed mb-4">
              Tailored culturally for Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal, and Sikkim.
            </p>
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Assamese, Bengali, Khasi, Manipuri
            </div>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center mb-6 shadow-xs">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Caregiver Telemetry</h3>
            <p className="text-emerald-100/80 text-base leading-relaxed mb-4">
              Live medication adherence rates, daily hydration trackers, mood logs, and automated risk alert feeds for families.
            </p>
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Real-time family alerts
            </div>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center mb-6 shadow-xs">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Healthcare Specialist Hub</h3>
            <p className="text-emerald-100/80 text-base leading-relaxed mb-4">
              Empowering ASHA health workers and geriatricians with cohort triage, engagement trends, and clinical audit data.
            </p>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Longitudinal tracking
            </div>
          </Card>
        </div>
      </section>

      {/* Regional States Showcase */}
      <section className="py-20 border-y border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-white">
              Rooted Across Northeast India
            </h2>
            <p className="text-emerald-100/80 text-base sm:text-lg">
              Every state profile incorporates familiar imagery, languages, and soothing cultural nostalgia.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {Object.values(REGIONAL_PROFILES).map((prof) => (
              <div
                key={prof.id}
                className="glass-panel p-6 rounded-3xl border border-emerald-500/30 hover:border-emerald-400 hover:scale-102 transition-all group cursor-default shadow-lg"
              >
                <div className="text-xs font-black text-amber-400 mb-1 tracking-wide">{prof.greeting}</div>
                <h4 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                  {prof.name}
                </h4>
                <p className="text-xs text-emerald-200/75 mt-2 line-clamp-2 leading-relaxed">
                  {prof.culturalThemes.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible AI & Privacy Guarantee */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="glass-panel rounded-3xl p-8 sm:p-14 border-2 border-emerald-400/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <Shield className="w-14 h-14 text-emerald-400 mx-auto mb-5 animate-pulse" />
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
            Ethical & Responsible Health AI
          </h2>
          <p className="text-emerald-100/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
            {t('app.disclaimer')}
          </p>
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="xl"
              onClick={handleStartDemo}
              className="rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.5)] px-10 border border-emerald-300/40 bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            >
              Launch Interactive Patient Demo →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
