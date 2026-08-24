import React, { useState } from 'react';
import {
  SunMoon,
  Volume2,
  VolumeX,
  Globe,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import { LANGUAGE_OPTIONS } from '../../i18n';
import type { LanguageCode } from '../../types';

export const AccessibilityBar: React.FC = () => {
  const { settings, setTextSize, toggleHighContrast, toggleSoundEffects } = useAccessibility();
  const { language, setLanguage } = useLanguage();
  const { isOnline, toggleSimulatedNetwork, pendingCount, isSyncing } = useSync();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  return (
    <aside
      aria-label="Accessibility & Demo Controls"
      className="bg-stone-900 text-stone-100 text-sm px-4 py-2 border-b border-stone-800 relative z-40 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Quick Accessible Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider hidden sm:inline">
            Elderly UX:
          </span>

          {/* Text Size Switcher */}
          <div
            className="flex items-center bg-stone-800 rounded-xl p-1 border border-stone-700"
            role="group"
            aria-label="Adjust text size"
          >
            <button
              onClick={() => setTextSize('normal')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                settings.textSize === 'normal'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Normal Text Size (18px)"
            >
              A
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                settings.textSize === 'large'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Large Text Size (22px - Recommended for Seniors)"
            >
              A+
            </button>
            <button
              onClick={() => setTextSize('extralarge')}
              className={`px-2.5 py-1 rounded-lg text-base font-extrabold transition-colors cursor-pointer ${
                settings.textSize === 'extralarge'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Extra Large Text Size (26px)"
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              settings.highContrast
                ? 'bg-yellow-400 text-black border-yellow-300 shadow-xs'
                : 'bg-stone-800 text-stone-200 border-stone-700 hover:border-stone-500'
            }`}
            title="Toggle High Contrast Mode"
          >
            <SunMoon className="w-4 h-4" />
            <span className="hidden sm:inline">High Contrast</span>
          </button>

          {/* Sound Chimes Toggle */}
          <button
            onClick={toggleSoundEffects}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              settings.soundEffects
                ? 'bg-stone-800 text-emerald-400 border-stone-700'
                : 'bg-stone-800 text-stone-400 border-stone-700 line-through'
            }`}
            title="Toggle Audio Feedback Chimes"
          >
            {settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">Audio Chimes</span>
          </button>
        </div>

        {/* Right: Language Selector & Network Simulation Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Offline/Online Live Simulation Toggle */}
          <button
            onClick={toggleSimulatedNetwork}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isOnline
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                : 'bg-amber-950/80 text-amber-300 border-amber-600 animate-pulse'
            }`}
            title="Click to toggle offline mode simulation"
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>
              {isOnline ? (
                isSyncing ? (
                  'Syncing...'
                ) : (
                  'Online'
                )
              ) : (
                <>Offline Demo ({pendingCount} queued)</>
              )}
            </span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-xl border border-stone-700 text-xs font-bold cursor-pointer"
              aria-expanded={showLanguageMenu}
              aria-label="Select Language"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>
                {LANGUAGE_OPTIONS.find((l) => l.code === language)?.nativeLabel || 'Language'}
              </span>
            </button>

            {showLanguageMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-stone-900 border border-stone-700 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                role="menu"
              >
                <div className="px-3 py-1.5 text-xs text-stone-400 font-semibold border-b border-stone-800">
                  Select Regional Language
                </div>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLanguage(opt.code as LanguageCode);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-colors cursor-pointer ${
                      language === opt.code
                        ? 'bg-amber-500 text-stone-950'
                        : 'text-stone-200 hover:bg-stone-800'
                    }`}
                    role="menuitem"
                  >
                    <span>{opt.nativeLabel}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md ${
                        language === opt.code
                          ? 'bg-stone-900/20 text-stone-950 font-bold'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {opt.regionBadge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
