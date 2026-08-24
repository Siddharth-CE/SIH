import type { IVoiceService } from '../interfaces';

// SpeechRecognition type declarations for browser compatibility
interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  }
}

export class MockVoiceService implements IVoiceService {
  private recognition: BrowserSpeechRecognition | null = null;
  private isListeningActive = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        try {
          this.recognition = new SpeechRecognitionClass();
          this.recognition.continuous = false;
          this.recognition.interimResults = false;
          this.recognition.lang = 'en-IN';
        } catch {
          this.recognition = null;
        }
      }
    }
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && ('speechSynthesis' in window || !!this.recognition);
  }

  startListening(onResult: (text: string) => void, onError: (err: string) => void): void {
    if (!this.recognition) {
      // Fallback simulated recognition for testing/browsers without microphone permissions
      this.isListeningActive = true;
      setTimeout(() => {
        if (this.isListeningActive) {
          onResult('What medicine do I need to take?');
          this.isListeningActive = false;
        }
      }, 2500);
      return;
    }

    try {
      this.isListeningActive = true;
      this.recognition.onresult = (event: SpeechRecognitionEventLike) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        this.isListeningActive = false;
      };

      this.recognition.onerror = (event: { error: string }) => {
        onError(event.error);
        this.isListeningActive = false;
      };

      this.recognition.onend = () => {
        this.isListeningActive = false;
      };

      this.recognition.start();
    } catch {
      onError('Unable to access microphone. Using simulated voice input.');
      this.isListeningActive = false;
    }
  }

  stopListening(): void {
    this.isListeningActive = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore already stopped
      }
    }
  }

  speak(text: string, language = 'en-IN', onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.85; // Slightly slower, clearer for elderly patients
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const mockVoiceService = new MockVoiceService();
