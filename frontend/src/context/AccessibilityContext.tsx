import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AccessibilitySettings } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setTextSize: (size: AccessibilitySettings['textSize']) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleAudioPrompts: () => void;
  toggleSoundEffects: () => void;
  playChime: (type?: 'success' | 'click' | 'card_flip' | 'alert') => void;
}

const defaultSettings: AccessibilitySettings = {
  textSize: 'large', // Default to Large for senior readability
  highContrast: false,
  reducedMotion: false,
  audioPrompts: true,
  soundEffects: true,
  voiceSpeed: 0.9,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('ner_cognitive_a11y');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('ner_cognitive_a11y', JSON.stringify(settings));

    // Update body classes
    const root = document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-extralarge');
    root.classList.add(`text-size-${settings.textSize}`);

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [settings]);

  const setTextSize = (size: AccessibilitySettings['textSize']) => {
    setSettings((prev) => ({ ...prev, textSize: size }));
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleReducedMotion = () => {
    setSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const toggleAudioPrompts = () => {
    setSettings((prev) => ({ ...prev, audioPrompts: !prev.audioPrompts }));
  };

  const toggleSoundEffects = () => {
    setSettings((prev) => ({ ...prev, soundEffects: !prev.soundEffects }));
  };

  // Gentle Web Audio API synthesizer for offline auditory feedback
  const playChime = (type: 'success' | 'click' | 'card_flip' | 'alert' = 'click') => {
    if (!settings.soundEffects || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'success') {
        // Warm two-tone pleasant harp chord (E5 -> G#5 -> B5)
        const notes = [659.25, 830.61, 987.77];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.45);
        });
      } else if (type === 'card_flip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(554, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } else if (type === 'alert') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        // subtle soft tap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch {
      // Audio playback fails gracefully without throwing
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setTextSize,
        toggleHighContrast,
        toggleReducedMotion,
        toggleAudioPrompts,
        toggleSoundEffects,
        playChime,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
