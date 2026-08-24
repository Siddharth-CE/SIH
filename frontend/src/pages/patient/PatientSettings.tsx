import React from 'react';
import {
  Type,
  SunMoon,
  Volume2,
  Globe,
  MapPin,
  Database,
} from 'lucide-react';
import { Card, Badge } from '../../components/ui/Card';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import { LANGUAGE_OPTIONS } from '../../i18n';
import { REGIONAL_PROFILES } from '../../data/mock/initialData';
import type { LanguageCode, NERRegion } from '../../types';

export const PatientSettings: React.FC = () => {
  const { settings, setTextSize, toggleHighContrast, toggleSoundEffects } = useAccessibility();
  const { language, setLanguage, t } = useLanguage();
  const { activePatient, updateCurrentPatient } = useAuth();
  const { isOnline, pendingCount } = useSync();

  const handleRegionChange = (region: NERRegion) => {
    updateCurrentPatient({ region });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <div className="text-center mb-8">
        <Badge variant="forest" size="md" className="mb-2">
          Personal Preferences
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          {t('accessibility.title')} ⚙️
        </h1>
        <p className="text-stone-600 text-lg">
          Adjust visual contrast, text size, and cultural regional settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Text Size Card */}
        <Card variant="warm" className="p-6 border-2 border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <Type className="w-6 h-6 text-[#0F4C3A]" />
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                {t('accessibility.textSize')}
              </h3>
              <p className="text-sm text-stone-500">
                Choose text sizing that feels most comfortable for your eyes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'normal', label: t('accessibility.normalText') },
              { id: 'large', label: t('accessibility.largeText') },
              { id: 'extralarge', label: t('accessibility.extraLargeText') },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTextSize(opt.id as typeof settings.textSize)}
                className={`p-4 rounded-2xl border-2 font-bold text-center transition-all cursor-pointer ${
                  settings.textSize === opt.id
                    ? 'bg-[#0F4C3A] text-white border-[#0A3327] shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        {/* High Contrast & Audio Toggles */}
        <Card variant="warm" className="p-6 border-2 border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SunMoon className="w-6 h-6 text-amber-600" />
              <div>
                <div className="font-bold text-stone-900 text-lg">
                  {t('accessibility.highContrast')}
                </div>
                <div className="text-xs text-stone-500">
                  Maximum readability with dark backgrounds & yellow borders
                </div>
              </div>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                settings.highContrast ? 'bg-amber-500' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.highContrast ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="font-bold text-stone-900 text-lg">
                  {t('accessibility.soundEffects')}
                </div>
                <div className="text-xs text-stone-500">
                  Gentle harp chords and celebratory chimes on game completion
                </div>
              </div>
            </div>
            <button
              onClick={toggleSoundEffects}
              className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEffects ? 'bg-[#0F4C3A]' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.soundEffects ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Language Selection */}
        <Card variant="warm" className="p-6 border-2 border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-stone-900">Regional Language</h3>
              <p className="text-sm text-stone-500">
                Native interface and audio instructions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => setLanguage(opt.code as LanguageCode)}
                className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                  language === opt.code
                    ? 'bg-[#0F4C3A] text-white border-[#0A3327] shadow-xs'
                    : 'bg-white text-stone-800 hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div>
                  <div className="font-black text-base">{opt.nativeLabel}</div>
                  <div className="text-xs opacity-80">{opt.label}</div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    language === opt.code
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {opt.regionBadge}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Northeast State Regional Theme */}
        <Card variant="warm" className="p-6 border-2 border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-teal-700" />
            <div>
              <h3 className="text-xl font-bold text-stone-900">Northeast State Profile</h3>
              <p className="text-sm text-stone-500">
                Customizes imagery, flora, and cultural references in memory games
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.values(REGIONAL_PROFILES).map((prof) => (
              <button
                key={prof.id}
                onClick={() => handleRegionChange(prof.id as NERRegion)}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                  activePatient?.region === prof.id
                    ? 'bg-[#0F4C3A] text-white border-[#0A3327] shadow-xs font-black'
                    : 'bg-white text-stone-800 hover:bg-stone-50 border-stone-200 font-bold'
                }`}
              >
                <div className="text-sm">{prof.name}</div>
                <div className="text-xs opacity-75 mt-0.5">{prof.greeting}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Local Storage & Offline Status */}
        <Card variant="sand" className="p-6 border border-stone-300">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-5 h-5 text-stone-600" />
            <h3 className="text-lg font-bold text-stone-900">
              Offline Storage (IndexedDB)
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed mb-4">
            All your memory games, reminder logs, and streak metrics are securely preserved in your device's local database. {isOnline ? 'Online cloud synchronization active.' : 'Currently running in offline cache mode.'}
          </p>
          <div className="flex items-center gap-3">
            <Badge variant="forest" size="md">
              ✓ IndexedDB Ready
            </Badge>
            <Badge variant="amber" size="md">
              {pendingCount} Sync Events Queued
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};
