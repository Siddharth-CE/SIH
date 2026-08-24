import { mockPatientRepository } from '../mock/mockPatientRepository';
import { mockGameRepository } from '../mock/mockGameRepository';
import { mockReminderRepository } from '../mock/mockReminderRepository';
import { mockActivityRepository } from '../mock/mockActivityRepository';
import { mockMemoryRepository } from '../mock/mockMemoryRepository';
import { mockAlertRepository } from '../mock/mockAlertRepository';
import { mockAIService } from '../mock/mockAIService';
import { mockVoiceService } from '../mock/mockVoiceService';
import { mockSyncService } from '../mock/mockSyncService';

import {
  apiPatientRepository,
  apiGameRepository,
  apiReminderRepository,
  apiActivityRepository,
  apiMemoryRepository,
  apiAlertRepository,
  apiAIService,
  apiSyncService,
} from '../api';
import { getApiBaseUrl, isMockEnabled, isProduction } from '../../config/env';

// Environment toggle for Mock vs Real FastAPI Backend
export const environment = {
  useMockData: isMockEnabled(),
  apiUrl: getApiBaseUrl(),
  isProduction: isProduction(),
};

// Repositories exported according to active environment (seamless swap)
export const patientRepository = environment.useMockData
  ? mockPatientRepository
  : apiPatientRepository;

export const gameRepository = environment.useMockData
  ? mockGameRepository
  : apiGameRepository;

export const reminderRepository = environment.useMockData
  ? mockReminderRepository
  : apiReminderRepository;

export const activityRepository = environment.useMockData
  ? mockActivityRepository
  : apiActivityRepository;

export const memoryRepository = environment.useMockData
  ? mockMemoryRepository
  : apiMemoryRepository;

export const alertRepository = environment.useMockData
  ? mockAlertRepository
  : apiAlertRepository;

export const aiService = environment.useMockData
  ? mockAIService
  : apiAIService;

export const voiceService = mockVoiceService;

export const syncService = environment.useMockData
  ? mockSyncService
  : apiSyncService;
