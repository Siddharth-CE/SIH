/**
 * NER CognitiveCare - Core Domain Types
 * Strongly typed models for elderly patient care, cognitive games,
 * multi-language support, regional personalization, and sync management.
 */

export type UserRole = 'patient' | 'caregiver' | 'healthcare' | 'guest';

export type LanguageCode = 'en' | 'as' | 'bn' | 'mni' | 'kha';

export type NERRegion = 
  | 'assam'
  | 'meghalaya'
  | 'manipur'
  | 'mizoram'
  | 'nagaland'
  | 'tripura'
  | 'arunachal_pradesh'
  | 'sikkim';

export type DementiaStage = 'early' | 'mild' | 'moderate' | 'healthy_aging';

export interface RegionalProfile {
  id: NERRegion;
  name: string;
  nativeName: string;
  themeColor: string;
  iconName: string;
  culturalThemes: string[];
  greeting: string;
  folklorePrompt: string;
}

export interface Patient {
  id: string;
  name: string;
  preferredName: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  region: NERRegion;
  primaryLanguage: LanguageCode;
  secondaryLanguage?: LanguageCode;
  stage: DementiaStage;
  caregiverId: string;
  healthcareWorkerId: string;
  avatarUrl?: string;
  photoUrl?: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  dailyRoutineGoal: number; // target activities per day (e.g. 4)
  hydrationGoalGlasses: number; // e.g. 6
  hydrationCurrentGlasses: number;
  medicationAdherenceRate: number; // 0 to 100 percentage
  overallEngagement: 'high' | 'moderate' | 'low' | 'needs_attention';
  statusSummary: string;
  currentStreakDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface Caregiver {
  id: string;
  name: string;
  relationToPatient: string;
  phone: string;
  email: string;
  patientIds: string[];
  preferredLanguage: LanguageCode;
  notificationPreferences: {
    sms: boolean;
    app: boolean;
    missedMedicationAlert: boolean;
    lowMoodAlert: boolean;
    dailySummary: boolean;
  };
}

export interface HealthcareWorker {
  id: string;
  name: string;
  designation: string; // e.g., 'Geriatric Neurologist', 'Community Health Officer (ASHA Coordinator)'
  centerName: string; // e.g., 'Guwahati Medical College & Hospital', 'Shillong Civil Hospital'
  assignedRegion: NERRegion;
  assignedPatientIds: string[];
}

export type GameCategory = 
  | 'memory'
  | 'recall'
  | 'pattern'
  | 'attention'
  | 'emotion'
  | 'routine';

export type DifficultyLevel = 'gentle' | 'easy' | 'moderate' | 'challenging';

export interface Game {
  id: string;
  slug: string;
  titleKey: string;
  descriptionKey: string;
  category: GameCategory;
  estimatedMinutes: number;
  icon: string;
  color: string;
  recommendedTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  adaptiveSupport: boolean;
}

export interface GameSession {
  id: string;
  sessionId: string;
  patientId: string;
  gameId: string;
  gameCategory: GameCategory;
  difficulty: DifficultyLevel;
  difficultyScore: number; // numeric scale 1 - 10
  score: number;
  maxPossibleScore: number;
  accuracy: number; // 0 to 100 percentage
  attempts: number;
  successfulAttempts: number;
  averageResponseTimeMs: number;
  timeSpentSeconds: number;
  completedAt: string;
  feedbackGiven: string;
  adaptiveDelta: 'increased' | 'maintained' | 'decreased';
  synced: boolean;
}

export interface CognitiveMetric {
  category: GameCategory;
  categoryLabel: string;
  scorePercentage: number; // 0 - 100
  trend: 'improving' | 'stable' | 'declining';
  sessionsCount: number;
  lastPlayedDate: string;
  color: string;
}

export type ReminderType = 
  | 'medication'
  | 'hydration'
  | 'activity'
  | 'appointment'
  | 'family'
  | 'routine';

export type ReminderStatus = 'pending' | 'completed' | 'snoozed' | 'missed';

export interface Reminder {
  id: string;
  patientId: string;
  title: string;
  type: ReminderType;
  time: string; // "09:00 AM" or "14:30"
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dosageOrInstruction?: string;
  status: ReminderStatus;
  scheduledForDate: string; // ISO date YYYY-MM-DD
  completedAt?: string;
  icon?: string;
  audioPromptKey?: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  scheduleTimes: string[]; // ["09:00 AM", "08:00 PM"]
  instructions: string; // e.g. "Take after breakfast with warm water"
  withFood: boolean;
  prescribingDoctor: string;
  refillReminderDate?: string;
  active: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  title: string;
  doctorName: string;
  clinicOrHospital: string;
  date: string;
  time: string;
  notes?: string;
  isVirtual: boolean;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface DailyActivity {
  id: string;
  patientId: string;
  time: string;
  titleKey: string;
  defaultTitle: string;
  type: 'morning_wake' | 'meal' | 'medication' | 'game' | 'rest' | 'social' | 'walk' | 'sleep';
  completed: boolean;
  durationMinutes?: number;
  notes?: string;
}

export type MoodType = 'peaceful' | 'happy' | 'calm' | 'thoughtful' | 'confused' | 'tired' | 'restless';

export interface MoodEntry {
  id: string;
  patientId: string;
  mood: MoodType;
  loggedAt: string;
  note?: string;
  loggedBy: 'patient' | 'caregiver';
}

export interface FamilyMemory {
  id: string;
  patientId: string;
  title: string;
  relationshipOrPlace: string;
  category: 'people' | 'places' | 'favorites' | 'today';
  description: string;
  voiceNoteUrl?: string;
  photoUrl?: string;
  dateOrEra?: string; // e.g., "1978 — Jorhat Tea Estate"
  tags: string[];
  favorite: boolean;
  createdAt: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  resolved: boolean;
  actionRequired?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'game_progress' | 'caregiver_alert' | 'system';
  createdAt: string;
  read: boolean;
}

export interface SyncEvent {
  id: string;
  entityType: 'game_session' | 'reminder' | 'hydration' | 'mood' | 'memory' | 'activity';
  action: 'create' | 'update' | 'delete';
  payload: unknown;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
}

export interface AIInsight {
  id: string;
  patientId: string;
  title: string;
  summary: string;
  recommendation: string;
  confidenceScore: number;
  generatedAt: string;
  domain: 'memory' | 'attention' | 'routine' | 'wellness';
  sentiment: 'positive' | 'neutral' | 'attention_needed';
}

export interface AccessibilitySettings {
  textSize: 'normal' | 'large' | 'extralarge';
  highContrast: boolean;
  reducedMotion: boolean;
  audioPrompts: boolean;
  soundEffects: boolean;
  voiceSpeed: number; // 0.8 to 1.2
}
