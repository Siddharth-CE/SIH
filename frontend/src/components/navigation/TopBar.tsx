import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  Users,
  Stethoscope,
  Mic,
  ChevronDown,
  UserCheck,
  Globe,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { VoiceAssistantModal } from '../voice/VoiceAssistantModal';
import { REGIONAL_PROFILES } from '../../data/mock/initialData';
import { LANGUAGE_OPTIONS } from '../../i18n';
import type { UserRole, LanguageCode } from '../../types';

export const TopBar: React.FC = () => {
  const { role, setRole, activePatient, allPatients, setActivePatientId } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { playChime } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showPatientMenu, setShowPatientMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    playChime('click');
    setRole(newRole);
    setShowRoleMenu(false);
    if (newRole === 'patient') navigate('/patient');
    if (newRole === 'caregiver') navigate('/caregiver');
    if (newRole === 'healthcare') navigate('/healthcare');
  };

  const handleLanguageChange = (langCode: LanguageCode) => {
    playChime('click');
    setLanguage(langCode);
    setShowLangMenu(false);
  };

  const isLandingPage = location.pathname === '/';
  const currentLangOption = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-30 bg-[#0c352c]/85 backdrop-blur-xl border-b border-emerald-500/25 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform border border-emerald-300/30">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white/20" />
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-2xl tracking-tight block leading-tight bg-gradient-to-r from-white via-emerald-200 to-teal-100 bg-clip-text text-transparent">
              NER CognitiveCare
            </span>
            <span className="text-xs sm:text-sm font-semibold text-emerald-200/70 hidden sm:block">
              {t('app.tagline')}
            </span>
          </div>
        </Link>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PROMINENT LANGUAGE SELECTOR BUTTON */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowRoleMenu(false);
                setShowPatientMenu(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-2 border-amber-500/40 px-3 sm:px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer active:scale-95 backdrop-blur-md"
              aria-label="Change Language"
              aria-expanded={showLangMenu}
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin-slow" />
              <span className="font-extrabold">{currentLangOption.nativeLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            </button>

            {/* Language Dropdown Menu */}
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0a2e26]/95 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl border-2 border-amber-500/40 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-xs font-black uppercase tracking-wider text-amber-300/90 border-b border-emerald-500/20 mb-2 flex items-center justify-between">
                  <span>Select Regional Language</span>
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="space-y-1">
                  {LANGUAGE_OPTIONS.map((opt) => {
                    const isSelected = language === opt.code;
                    return (
                      <button
                        key={opt.code}
                        onClick={() => handleLanguageChange(opt.code as LanguageCode)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600/40 text-white border border-emerald-400/50 shadow-md font-bold'
                            : 'hover:bg-emerald-900/30 text-stone-200'
                        }`}
                      >
                        <div>
                          <div className="font-black text-sm sm:text-base">
                            {opt.nativeLabel}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-emerald-300' : 'text-stone-400'}`}>
                            {opt.label} • {opt.regionBadge}
                          </div>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Voice Assistant Button */}
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-2 border-emerald-400/40 px-3 sm:px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-base transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer backdrop-blur-md"
            aria-label="Open Voice Assistant"
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-pulse" />
            <span className="hidden md:inline">{t('nav.talk')}</span>
          </button>

          {/* Active Patient Switcher */}
          {!isLandingPage && (
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setShowPatientMenu(!showPatientMenu);
                  setShowRoleMenu(false);
                  setShowLangMenu(false);
                }}
                className="flex items-center gap-2 bg-emerald-900/50 hover:bg-emerald-900/70 text-emerald-100 px-3.5 py-2.5 rounded-2xl border border-emerald-500/30 font-bold text-xs sm:text-sm cursor-pointer backdrop-blur-md"
                aria-label="Select active patient"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-900 shadow-[0_0_8px_#34d399]" />
                <span className="max-w-[100px] truncate">{activePatient?.preferredName || 'Asha'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-300/70" />
              </button>

              {showPatientMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0a2e26]/95 backdrop-blur-2xl rounded-3xl p-2.5 shadow-2xl border border-emerald-500/30 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400/70 border-b border-emerald-500/20 mb-1">
                    Select Demo Patient
                  </div>
                  {allPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePatientId(p.id);
                        setShowPatientMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-colors cursor-pointer ${
                        p.id === activePatient?.id ? 'bg-emerald-600/40 text-white border border-emerald-400/40 font-bold' : 'hover:bg-emerald-900/30 text-stone-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">{p.name}</div>
                        <div className="text-xs text-emerald-300/60">
                          {p.age} yrs • {REGIONAL_PROFILES[p.region]?.name} ({p.stage} stage)
                        </div>
                      </div>
                      {p.id === activePatient?.id && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Role Mode Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowPatientMenu(false);
                setShowLangMenu(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-3 sm:px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer border border-emerald-400/30"
              aria-label="Switch User Portal Role"
            >
              {role === 'patient' && <Heart className="w-4 h-4 text-emerald-200" />}
              {role === 'caregiver' && <Users className="w-4 h-4 text-amber-200" />}
              {role === 'healthcare' && <Stethoscope className="w-4 h-4 text-sky-200" />}
              <span className="capitalize hidden md:inline">{role} View</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/80" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0a2e26]/95 backdrop-blur-2xl rounded-3xl p-2.5 shadow-2xl border border-emerald-500/30 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400/70 border-b border-emerald-500/20 mb-1">
                  Switch Portal View
                </div>
                <button
                  onClick={() => handleRoleChange('patient')}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors cursor-pointer ${
                    role === 'patient' ? 'bg-emerald-600/40 text-white border border-emerald-400/40 font-bold' : 'hover:bg-emerald-900/30 text-stone-200'
                  }`}
                >
                  <Heart className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-bold text-sm">Patient Portal</div>
                    <div className="text-xs text-stone-400">Elderly-friendly large UI</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleChange('caregiver')}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors cursor-pointer ${
                    role === 'caregiver' ? 'bg-amber-600/40 text-amber-100 border border-amber-400/40 font-bold' : 'hover:bg-emerald-900/30 text-stone-200'
                  }`}
                >
                  <Users className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="font-bold text-sm">Caregiver Portal</div>
                    <div className="text-xs text-stone-400">Adherence & daily alerts</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleChange('healthcare')}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors cursor-pointer ${
                    role === 'healthcare' ? 'bg-sky-600/40 text-sky-100 border border-sky-400/40 font-bold' : 'hover:bg-emerald-900/30 text-stone-200'
                  }`}
                >
                  <Stethoscope className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="font-bold text-sm">Healthcare Portal</div>
                    <div className="text-xs text-stone-400">Clinical cohort analytics</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </header>
  );
};
