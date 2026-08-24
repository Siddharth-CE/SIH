import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type {
  Patient,
  GameSession,
  Reminder,
  DailyActivity,
  FamilyMemory,
  MoodEntry,
  Alert,
  SyncEvent,
  AIInsight
} from '../types';

interface CognitiveCareDB extends DBSchema {
  patients: {
    key: string;
    value: Patient;
  };
  game_sessions: {
    key: string;
    value: GameSession;
    indexes: { 'by-patient': string; 'by-game': string };
  };
  reminders: {
    key: string;
    value: Reminder;
    indexes: { 'by-patient': string; 'by-date': string };
  };
  activities: {
    key: string;
    value: DailyActivity;
    indexes: { 'by-patient': string };
  };
  memories: {
    key: string;
    value: FamilyMemory;
    indexes: { 'by-patient': string; 'by-category': string };
  };
  moods: {
    key: string;
    value: MoodEntry;
    indexes: { 'by-patient': string };
  };
  alerts: {
    key: string;
    value: Alert;
    indexes: { 'by-patient': string };
  };
  sync_queue: {
    key: string;
    value: SyncEvent;
    indexes: { 'by-status': string };
  };
  ai_insights: {
    key: string;
    value: AIInsight;
    indexes: { 'by-patient': string };
  };
}

const DB_NAME = 'ner_cognitive_care_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<CognitiveCareDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<CognitiveCareDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CognitiveCareDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Patients
        if (!db.objectStoreNames.contains('patients')) {
          db.createObjectStore('patients', { keyPath: 'id' });
        }
        // Game Sessions
        if (!db.objectStoreNames.contains('game_sessions')) {
          const gameStore = db.createObjectStore('game_sessions', { keyPath: 'id' });
          gameStore.createIndex('by-patient', 'patientId');
          gameStore.createIndex('by-game', 'gameId');
        }
        // Reminders
        if (!db.objectStoreNames.contains('reminders')) {
          const reminderStore = db.createObjectStore('reminders', { keyPath: 'id' });
          reminderStore.createIndex('by-patient', 'patientId');
          reminderStore.createIndex('by-date', 'scheduledForDate');
        }
        // Daily Activities
        if (!db.objectStoreNames.contains('activities')) {
          const actStore = db.createObjectStore('activities', { keyPath: 'id' });
          actStore.createIndex('by-patient', 'patientId');
        }
        // Memories
        if (!db.objectStoreNames.contains('memories')) {
          const memStore = db.createObjectStore('memories', { keyPath: 'id' });
          memStore.createIndex('by-patient', 'patientId');
          memStore.createIndex('by-category', 'category');
        }
        // Moods
        if (!db.objectStoreNames.contains('moods')) {
          const moodStore = db.createObjectStore('moods', { keyPath: 'id' });
          moodStore.createIndex('by-patient', 'patientId');
        }
        // Alerts
        if (!db.objectStoreNames.contains('alerts')) {
          const alertStore = db.createObjectStore('alerts', { keyPath: 'id' });
          alertStore.createIndex('by-patient', 'patientId');
        }
        // Sync Queue
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
          syncStore.createIndex('by-status', 'status');
        }
        // AI Insights
        if (!db.objectStoreNames.contains('ai_insights')) {
          const aiStore = db.createObjectStore('ai_insights', { keyPath: 'id' });
          aiStore.createIndex('by-patient', 'patientId');
        }
      },
    });
  }
  return dbPromise;
}
