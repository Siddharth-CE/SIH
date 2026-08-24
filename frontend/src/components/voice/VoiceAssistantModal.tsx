import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { voiceService, aiService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { REGIONAL_PROFILES } from '../../data/mock/initialData';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const { activePatient } = useAuth();
  const { t } = useLanguage();

  const [state, setState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const regionProfile = REGIONAL_PROFILES[activePatient?.region || 'assam'];

  useEffect(() => {
    if (!isOpen) {
      voiceService.stopListening();
      voiceService.stopSpeaking();
      setState('idle');
      setTranscript('');
      setResponseMessage('');
    }
  }, [isOpen]);

  const handleStartListening = () => {
    voiceService.stopSpeaking();
    setState('listening');
    setTranscript('');
    setResponseMessage('');

    voiceService.startListening(
      async (text: string) => {
        setTranscript(text);
        setState('processing');

        const answer = await aiService.generateSpeechResponse(text, {
          patientName: activePatient?.preferredName || 'Asha',
          region: regionProfile.name,
        });

        setResponseMessage(answer);
        setState('speaking');

        if (!isMuted) {
          voiceService.speak(answer, 'en-IN', () => {
            setState('idle');
          });
        } else {
          setTimeout(() => setState('idle'), 3000);
        }
      },
      (err: string) => {
        setState('idle');
        setResponseMessage(err || 'Could not understand clearly. Please tap and try again.');
      }
    );
  };

  const handleQuickQuestion = async (queryText: string) => {
    setTranscript(queryText);
    setState('processing');

    const answer = await aiService.generateSpeechResponse(queryText, {
      patientName: activePatient?.preferredName || 'Asha',
      region: regionProfile.name,
    });

    setResponseMessage(answer);
    setState('speaking');

    if (!isMuted) {
      voiceService.speak(answer, 'en-IN', () => {
        setState('idle');
      });
    } else {
      setTimeout(() => setState('idle'), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Voice Companion"
      subtitle={`Speaking with ${activePatient?.preferredName || 'Asha'} (${regionProfile.name})`}
      maxWidth="lg"
    >
      <div className="flex flex-col items-center text-center py-4">
        {/* Animated Central Voice Orb */}
        <div className="relative my-6 flex items-center justify-center">
          {state === 'listening' && (
            <div className="absolute w-36 h-36 rounded-full bg-[#0F4C3A]/20 animate-ping" />
          )}
          {state === 'speaking' && (
            <div className="absolute w-36 h-36 rounded-full bg-amber-500/30 animate-pulse" />
          )}
          <button
            onClick={state === 'listening' ? () => voiceService.stopListening() : handleStartListening}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
              state === 'listening'
                ? 'bg-rose-600 text-white scale-105'
                : state === 'speaking'
                ? 'bg-amber-600 text-white animate-voice-ripple'
                : 'bg-[#0F4C3A] text-white hover:bg-[#0A3327] hover:scale-105'
            }`}
            aria-label={state === 'listening' ? 'Stop listening' : 'Start speaking'}
          >
            {state === 'listening' ? (
              <MicOff className="w-12 h-12 animate-pulse" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </button>
        </div>

        {/* State Label */}
        <div className="h-8 mb-4">
          {state === 'idle' && (
            <p className="text-stone-700 font-bold text-lg">
              {t('voice.idle')}
            </p>
          )}
          {state === 'listening' && (
            <p className="text-emerald-700 font-bold text-lg animate-pulse flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              {t('voice.listening')}
            </p>
          )}
          {state === 'processing' && (
            <p className="text-amber-700 font-bold text-lg animate-pulse flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
              {t('voice.processing')}
            </p>
          )}
          {state === 'speaking' && (
            <p className="text-[#0F4C3A] font-bold text-lg flex items-center justify-center gap-2">
              <Volume2 className="w-5 h-5 animate-bounce" />
              {t('voice.speaking')}
            </p>
          )}
        </div>

        {/* Live User Transcript */}
        {transcript && (
          <div className="w-full bg-stone-100 rounded-2xl p-4 mb-4 text-left border border-stone-200">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
              You asked:
            </span>
            <p className="text-stone-900 font-semibold text-lg">"{transcript}"</p>
          </div>
        )}

        {/* Voice AI Response Box */}
        {responseMessage && (
          <div className="w-full bg-[#E7F3ED] rounded-2xl p-5 mb-6 text-left border border-[#BDE0D0] shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#0F4C3A] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Companion Response:
              </span>
              <button
                onClick={() => {
                  if (state === 'speaking') {
                    voiceService.stopSpeaking();
                    setState('idle');
                  } else {
                    voiceService.speak(responseMessage, 'en-IN');
                    setState('speaking');
                  }
                }}
                className="text-xs font-bold text-[#0F4C3A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> Replay Voice
              </button>
            </div>
            <p className="text-[#0A3327] font-semibold text-xl leading-relaxed">
              {responseMessage}
            </p>
          </div>
        )}

        {/* Quick Questions */}
        <div className="w-full mt-2">
          <p className="text-stone-500 font-bold text-sm mb-3 uppercase tracking-wider text-left">
            Or tap a common question:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => handleQuickQuestion('What medicine do I take today?')}
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-left font-semibold text-base flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <span className="text-xl">💊</span>
              <span>"What medicine do I need?"</span>
            </button>
            <button
              onClick={() => handleQuickQuestion('How much water did I drink?')}
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-left font-semibold text-base flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <span className="text-xl">💧</span>
              <span>"How much water did I drink?"</span>
            </button>
            <button
              onClick={() => handleQuickQuestion('Let us play a memory game')}
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-left font-semibold text-base flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <span className="text-xl">🌿</span>
              <span>"Let us play Memory Garden"</span>
            </button>
            <button
              onClick={() => handleQuickQuestion('What is my routine for today?')}
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-left font-semibold text-base flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <span className="text-xl">📅</span>
              <span>"What is on my routine today?"</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="w-full flex items-center justify-between mt-6 pt-4 border-t border-stone-100">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-semibold text-sm cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            <span>{isMuted ? 'Muted (Text Only)' : 'Spoken Audio Enabled'}</span>
          </button>
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
