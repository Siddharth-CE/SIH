import type {
  Patient,
  Caregiver,
  HealthcareWorker,
  Game,
  Reminder,
  DailyActivity,
  FamilyMemory,
  MoodEntry,
  Alert,
  AIInsight,
  RegionalProfile
} from '../../types';

export const REGIONAL_PROFILES: Record<string, RegionalProfile> = {
  assam: {
    id: 'assam',
    name: 'Assam',
    nativeName: 'অসম',
    themeColor: '#0F4C3A',
    iconName: 'TeaLeaf',
    culturalThemes: ['Tea Gardens of Jorhat', 'Kaziranga Wildlife', 'Bihu Festivities', 'Muga Silk Weaving', 'Brahmaputra River'],
    greeting: 'নমস্কাৰ (Namaskar)',
    folklorePrompt: 'Golden Muga silk and the soothing scent of autumn tea gardens.'
  },
  meghalaya: {
    id: 'meghalaya',
    name: 'Meghalaya',
    nativeName: 'Meghalaya (Ka Ri Khasi)',
    themeColor: '#1E40AF',
    iconName: 'CloudRain',
    culturalThemes: ['Living Root Bridges', 'Shillong Pine Hills', 'Sohra Waterfalls', 'Wangala Harvest Dance'],
    greeting: 'Khublei Shibun',
    folklorePrompt: 'Misty hills of Cherrapunji and music flowing through Shillong pines.'
  },
  manipur: {
    id: 'manipur',
    name: 'Manipur',
    nativeName: 'মণিপুৰ',
    themeColor: '#7C2D12',
    iconName: 'Flower',
    culturalThemes: ['Loktak Floating Lake', 'Shirui Lily', 'Ras Leela Dance', 'Polo & Traditional Weaving'],
    greeting: 'Khurumjari (খুরুমজরি)',
    folklorePrompt: 'Serene floating phumdis on Loktak lake under the morning sun.'
  },
  mizoram: {
    id: 'mizoram',
    name: 'Mizoram',
    nativeName: 'Mizoram',
    themeColor: '#065F46',
    iconName: 'Trees',
    culturalThemes: ['Cheraw Bamboo Dance', 'Blue Mountain Hills', 'Chapchar Kut Spring Festival'],
    greeting: 'Chibai',
    folklorePrompt: 'Gentle bamboo rhythms and birds singing across the Blue Mountain.'
  },
  nagaland: {
    id: 'nagaland',
    name: 'Nagaland',
    nativeName: 'Nagaland',
    themeColor: '#991B1B',
    iconName: 'Feather',
    culturalThemes: ['Hornbill Heritage', 'Dzukou Valley Lilies', 'Terrace Rice Fields', 'Ao & Angami Weaves'],
    greeting: 'Salute & Welcome',
    folklorePrompt: 'Emerald valleys of Dzukou where wild lilies bloom at dawn.'
  },
  tripura: {
    id: 'tripura',
    name: 'Tripura',
    nativeName: 'ত্রিপুরা',
    themeColor: '#9A3412',
    iconName: 'Castle',
    culturalThemes: ['Ujjayanta Palace', 'Neermahal Water Palace', 'Tripuri Bamboo Handicrafts', 'Garia Puja'],
    greeting: 'Khulumkha (নমস্কার)',
    folklorePrompt: 'White marble domes of Neermahal reflecting on Rudrasagar lake.'
  },
  arunachal_pradesh: {
    id: 'arunachal_pradesh',
    name: 'Arunachal Pradesh',
    nativeName: 'Arunachal',
    themeColor: '#155E75',
    iconName: 'Sun',
    culturalThemes: ['Tawang Monastery Chimes', 'Ziro Valley Orchids', 'Snow Peaks', 'Monpa Woodcraft'],
    greeting: 'Tashi Delek / Welcome',
    folklorePrompt: 'Golden sunrise over snow-capped Himalayan peaks of Tawang.'
  },
  sikkim: {
    id: 'sikkim',
    name: 'Sikkim',
    nativeName: 'Sikkim',
    themeColor: '#5B21B6',
    iconName: 'Mountain',
    culturalThemes: ['Kanchenjunga Guardian Peak', 'Rumtek Monastery', 'Noble Orchids', 'Cardamom Hills'],
    greeting: 'Kuzuzangpo / Tashi Delek',
    folklorePrompt: 'Majestic sacred white summit of Mt. Kanchenjunga protecting the valley.'
  }
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    name: 'Asha Das',
    preferredName: 'Asha Aideo',
    age: 72,
    gender: 'female',
    region: 'assam',
    primaryLanguage: 'as',
    secondaryLanguage: 'en',
    stage: 'mild',
    caregiverId: 'cg-201',
    healthcareWorkerId: 'hw-301',
    emergencyContact: {
      name: 'Ratul Das (Son)',
      relation: 'Son',
      phone: '+91 98640 12345'
    },
    dailyRoutineGoal: 4,
    hydrationGoalGlasses: 6,
    hydrationCurrentGlasses: 4,
    medicationAdherenceRate: 94,
    overallEngagement: 'high',
    statusSummary: 'Doing well. Completed morning routine, calm mood, good game accuracy.',
    currentStreakDays: 7,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-24T18:00:00Z'
  },
  {
    id: 'pat-102',
    name: 'Rongsen Ao',
    preferredName: 'Uncle Rongsen',
    age: 75,
    gender: 'male',
    region: 'nagaland',
    primaryLanguage: 'en',
    stage: 'early',
    caregiverId: 'cg-202',
    healthcareWorkerId: 'hw-302',
    emergencyContact: {
      name: 'Arenla Ao',
      relation: 'Daughter',
      phone: '+91 94360 88219'
    },
    dailyRoutineGoal: 4,
    hydrationGoalGlasses: 6,
    hydrationCurrentGlasses: 3,
    medicationAdherenceRate: 88,
    overallEngagement: 'high',
    statusSummary: 'Active and engaged. Enjoys morning walks and memory games.',
    currentStreakDays: 5,
    createdAt: '2026-02-14T09:30:00Z',
    updatedAt: '2026-08-24T17:30:00Z'
  },
  {
    id: 'pat-103',
    name: 'Mitali Devi',
    preferredName: 'Mitali Ibecha',
    age: 69,
    gender: 'female',
    region: 'manipur',
    primaryLanguage: 'mni',
    secondaryLanguage: 'bn',
    stage: 'mild',
    caregiverId: 'cg-203',
    healthcareWorkerId: 'hw-301',
    emergencyContact: {
      name: 'Bimol Sharma',
      relation: 'Husband',
      phone: '+91 97740 44100'
    },
    dailyRoutineGoal: 4,
    hydrationGoalGlasses: 6,
    hydrationCurrentGlasses: 2,
    medicationAdherenceRate: 78,
    overallEngagement: 'moderate',
    statusSummary: 'Needs gentle afternoon hydration reminder. Good recall in visual games.',
    currentStreakDays: 3,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-08-24T16:00:00Z'
  },
  {
    id: 'pat-104',
    name: 'Biren Lyngdoh',
    preferredName: 'Bah Biren',
    age: 78,
    gender: 'male',
    region: 'meghalaya',
    primaryLanguage: 'kha',
    secondaryLanguage: 'en',
    stage: 'moderate',
    caregiverId: 'cg-204',
    healthcareWorkerId: 'hw-302',
    emergencyContact: {
      name: 'Phira Lyngdoh',
      relation: 'Daughter',
      phone: '+91 98560 99011'
    },
    dailyRoutineGoal: 3,
    hydrationGoalGlasses: 5,
    hydrationCurrentGlasses: 3,
    medicationAdherenceRate: 85,
    overallEngagement: 'needs_attention',
    statusSummary: 'Mild evening restlessness reported. Prefers Khasi audio cues.',
    currentStreakDays: 2,
    createdAt: '2026-04-12T11:00:00Z',
    updatedAt: '2026-08-24T15:00:00Z'
  },
  {
    id: 'pat-105',
    name: 'Tashi Lama',
    preferredName: 'Pale Tashi',
    age: 71,
    gender: 'male',
    region: 'sikkim',
    primaryLanguage: 'en',
    stage: 'early',
    caregiverId: 'cg-205',
    healthcareWorkerId: 'hw-301',
    emergencyContact: {
      name: 'Sonam Lama',
      relation: 'Nephew',
      phone: '+91 94340 77312'
    },
    dailyRoutineGoal: 4,
    hydrationGoalGlasses: 6,
    hydrationCurrentGlasses: 5,
    medicationAdherenceRate: 96,
    overallEngagement: 'high',
    statusSummary: 'Consistent daily adherence. Pattern recognition accuracy high.',
    currentStreakDays: 12,
    createdAt: '2026-05-05T08:15:00Z',
    updatedAt: '2026-08-24T18:15:00Z'
  }
];

export const INITIAL_CAREGIVERS: Caregiver[] = [
  {
    id: 'cg-201',
    name: 'Ratul Das',
    relationToPatient: 'Son & Primary Caregiver',
    phone: '+91 98640 12345',
    email: 'ratul.das@example.com',
    patientIds: ['pat-101'],
    preferredLanguage: 'as',
    notificationPreferences: {
      sms: true,
      app: true,
      missedMedicationAlert: true,
      lowMoodAlert: true,
      dailySummary: true
    }
  },
  {
    id: 'cg-202',
    name: 'Arenla Ao',
    relationToPatient: 'Daughter & Primary Caregiver',
    phone: '+91 94360 88219',
    email: 'arenla.ao@example.com',
    patientIds: ['pat-102'],
    preferredLanguage: 'en',
    notificationPreferences: {
      sms: true,
      app: true,
      missedMedicationAlert: true,
      lowMoodAlert: false,
      dailySummary: true
    }
  }
];

export const INITIAL_HEALTHCARE_WORKERS: HealthcareWorker[] = [
  {
    id: 'hw-301',
    name: 'Dr. Arindam Barman, MD',
    designation: 'Senior Geriatric Specialist & Neurologist',
    centerName: 'Guwahati Medical College & Hospital (GMCH)',
    assignedRegion: 'assam',
    assignedPatientIds: ['pat-101', 'pat-103', 'pat-105']
  },
  {
    id: 'hw-302',
    name: 'Sister Mary Ralte',
    designation: 'Community Health Officer (ASHA Coordinator)',
    centerName: 'Shillong Civil Hospital & Rural Health Network',
    assignedRegion: 'meghalaya',
    assignedPatientIds: ['pat-102', 'pat-104']
  }
];

export const INITIAL_GAMES: Game[] = [
  {
    id: 'game-memory-match',
    slug: 'memory',
    titleKey: 'games.memoryMatch.title',
    descriptionKey: 'games.memoryMatch.desc',
    category: 'memory',
    estimatedMinutes: 4,
    icon: 'Brain',
    color: '#0F4C3A',
    recommendedTimeOfDay: 'morning',
    adaptiveSupport: true
  },
  {
    id: 'game-object-recall',
    slug: 'recall',
    titleKey: 'games.objectRecall.title',
    descriptionKey: 'games.objectRecall.desc',
    category: 'recall',
    estimatedMinutes: 5,
    icon: 'Sparkles',
    color: '#1E40AF',
    recommendedTimeOfDay: 'morning',
    adaptiveSupport: true
  },
  {
    id: 'game-pattern-rec',
    slug: 'pattern',
    titleKey: 'games.pattern.title',
    descriptionKey: 'games.pattern.desc',
    category: 'pattern',
    estimatedMinutes: 4,
    icon: 'Grid',
    color: '#7C2D12',
    recommendedTimeOfDay: 'afternoon',
    adaptiveSupport: true
  },
  {
    id: 'game-attention-tap',
    slug: 'attention',
    titleKey: 'games.attention.title',
    descriptionKey: 'games.attention.desc',
    category: 'attention',
    estimatedMinutes: 3,
    icon: 'Eye',
    color: '#D97706',
    recommendedTimeOfDay: 'afternoon',
    adaptiveSupport: true
  },
  {
    id: 'game-emotion-rec',
    slug: 'emotion',
    titleKey: 'games.emotion.title',
    descriptionKey: 'games.emotion.desc',
    category: 'emotion',
    estimatedMinutes: 4,
    icon: 'Smile',
    color: '#E06D53',
    recommendedTimeOfDay: 'evening',
    adaptiveSupport: true
  },
  {
    id: 'game-routine-recall',
    slug: 'routine',
    titleKey: 'games.routineRecall.title',
    descriptionKey: 'games.routineRecall.desc',
    category: 'routine',
    estimatedMinutes: 4,
    icon: 'Calendar',
    color: '#065F46',
    recommendedTimeOfDay: 'evening',
    adaptiveSupport: true
  }
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    patientId: 'pat-101',
    title: 'Morning Blood Pressure Medicine',
    type: 'medication',
    time: '09:00 AM',
    timeOfDay: 'morning',
    dosageOrInstruction: '1 tablet (Telmisartan 40mg) with warm water after breakfast',
    status: 'completed',
    scheduledForDate: '2026-08-24',
    completedAt: '2026-08-24T09:05:00Z',
    icon: 'Pill'
  },
  {
    id: 'rem-2',
    patientId: 'pat-101',
    title: 'Mid-Morning Hydration',
    type: 'hydration',
    time: '11:00 AM',
    timeOfDay: 'morning',
    dosageOrInstruction: 'Drink a glass of warm water or light green tea',
    status: 'completed',
    scheduledForDate: '2026-08-24',
    completedAt: '2026-08-24T11:15:00Z',
    icon: 'Droplets'
  },
  {
    id: 'rem-3',
    patientId: 'pat-101',
    title: 'Cognitive Game: Memory Garden',
    type: 'activity',
    time: '04:30 PM',
    timeOfDay: 'afternoon',
    dosageOrInstruction: '5 minutes of calming card matching with tea flowers',
    status: 'pending',
    scheduledForDate: '2026-08-24',
    icon: 'Brain'
  },
  {
    id: 'rem-4',
    patientId: 'pat-101',
    title: 'Evening Memory Walk & Family Chat',
    type: 'family',
    time: '06:00 PM',
    timeOfDay: 'evening',
    dosageOrInstruction: 'Gentle walk in veranda with Ratul',
    status: 'pending',
    scheduledForDate: '2026-08-24',
    icon: 'Users'
  },
  {
    id: 'rem-5',
    patientId: 'pat-101',
    title: 'Night Medicine & Warm Milk',
    type: 'medication',
    time: '08:30 PM',
    timeOfDay: 'night',
    dosageOrInstruction: '1 capsule Calcium & Vitamin D3 after dinner',
    status: 'pending',
    scheduledForDate: '2026-08-24',
    icon: 'Moon'
  }
];

export const INITIAL_DAILY_ACTIVITIES: DailyActivity[] = [
  {
    id: 'act-1',
    patientId: 'pat-101',
    time: '07:30 AM',
    titleKey: 'routine.wakeUp',
    defaultTitle: 'Morning Awakening & Warm Water',
    type: 'morning_wake',
    completed: true,
    durationMinutes: 20
  },
  {
    id: 'act-2',
    patientId: 'pat-101',
    time: '08:15 AM',
    titleKey: 'routine.breakfast',
    defaultTitle: 'Nourishing Breakfast (Komal Saul & Curd)',
    type: 'meal',
    completed: true,
    durationMinutes: 30
  },
  {
    id: 'act-3',
    patientId: 'pat-101',
    time: '09:00 AM',
    titleKey: 'routine.medicine',
    defaultTitle: 'Morning Prescription Medication',
    type: 'medication',
    completed: true,
    durationMinutes: 10
  },
  {
    id: 'act-4',
    patientId: 'pat-101',
    time: '10:30 AM',
    titleKey: 'routine.morningGame',
    defaultTitle: 'Cognitive Play: Object Recall',
    type: 'game',
    completed: true,
    durationMinutes: 15
  },
  {
    id: 'act-5',
    patientId: 'pat-101',
    time: '01:00 PM',
    titleKey: 'routine.lunch',
    defaultTitle: 'Lunch & Relaxing Music',
    type: 'meal',
    completed: true,
    durationMinutes: 40
  },
  {
    id: 'act-6',
    patientId: 'pat-101',
    time: '04:30 PM',
    titleKey: 'routine.afternoonPlay',
    defaultTitle: 'Memory Garden Activity',
    type: 'game',
    completed: false,
    durationMinutes: 10
  },
  {
    id: 'act-7',
    patientId: 'pat-101',
    time: '06:00 PM',
    titleKey: 'routine.familyTime',
    defaultTitle: 'Veranda Tea & Photo Memories',
    type: 'social',
    completed: false,
    durationMinutes: 30
  },
  {
    id: 'act-8',
    patientId: 'pat-101',
    time: '08:00 PM',
    titleKey: 'routine.dinner',
    defaultTitle: 'Light Dinner & Night Medicine',
    type: 'meal',
    completed: false,
    durationMinutes: 30
  },
  {
    id: 'act-9',
    patientId: 'pat-101',
    time: '09:30 PM',
    titleKey: 'routine.sleep',
    defaultTitle: 'Peaceful Rest & Sleep',
    type: 'sleep',
    completed: false
  }
];

export const INITIAL_MEMORIES: FamilyMemory[] = [
  {
    id: 'mem-1',
    patientId: 'pat-101',
    title: 'Son Ratul & Granddaughter Hiya',
    relationshipOrPlace: 'Beloved Family',
    category: 'people',
    description: 'Ratul brought fresh garden roses. Hiya sang her school prayer in Assamese.',
    dateOrEra: 'Yesterday afternoon',
    tags: ['Family', 'Hiya', 'Home'],
    favorite: true,
    createdAt: '2026-08-23T16:00:00Z'
  },
  {
    id: 'mem-2',
    patientId: 'pat-101',
    title: 'Jorhat Tea Estate Veranda',
    relationshipOrPlace: 'Jorhat, Upper Assam',
    category: 'places',
    description: 'The cool morning breeze across the tea bushes, watching myna birds in the jackfruit tree.',
    dateOrEra: '1984 — Jorhat Family Home',
    tags: ['Tea Garden', 'Jorhat', 'Breeze'],
    favorite: true,
    createdAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'mem-3',
    patientId: 'pat-101',
    title: 'Mother’s Hand-Carved Bell Metal Utensils (Kanh)',
    relationshipOrPlace: 'Sarthebari Bell Craft',
    category: 'favorites',
    description: 'The warm ringing sound of the traditional Assamese brass bell used during evening prayers.',
    dateOrEra: 'Heirloom from 1965',
    tags: ['Brass', 'Prayer', 'Tradition'],
    favorite: false,
    createdAt: '2026-08-18T14:30:00Z'
  },
  {
    id: 'mem-4',
    patientId: 'pat-101',
    title: 'Today’s Joy: Fresh Jasmine Bloom',
    relationshipOrPlace: 'Courtyard Garden',
    category: 'today',
    description: 'We picked five white jasmine buds this morning and placed them by the window.',
    dateOrEra: 'Today',
    tags: ['Flowers', 'Jasmine', 'Fragrance'],
    favorite: false,
    createdAt: '2026-08-24T08:30:00Z'
  }
];

export const INITIAL_MOODS: MoodEntry[] = [
  {
    id: 'mood-1',
    patientId: 'pat-101',
    mood: 'peaceful',
    loggedAt: '2026-08-24T08:00:00Z',
    note: 'Woke up refreshed after 8 hours of sleep.',
    loggedBy: 'patient'
  },
  {
    id: 'mood-2',
    patientId: 'pat-101',
    mood: 'happy',
    loggedAt: '2026-08-24T11:00:00Z',
    note: 'Enjoyed viewing family photographs.',
    loggedBy: 'caregiver'
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt-1',
    patientId: 'pat-101',
    patientName: 'Asha Das',
    severity: 'info',
    title: 'Morning Routine 100% Completed',
    message: 'Asha completed morning medication and hydration on time.',
    createdAt: '2026-08-24T09:10:00Z',
    read: false,
    resolved: false
  },
  {
    id: 'alt-2',
    patientId: 'pat-104',
    patientName: 'Biren Lyngdoh',
    severity: 'warning',
    title: 'Missed Afternoon Hydration Goal',
    message: 'Biren has recorded only 1 of 3 target glasses by 3 PM.',
    createdAt: '2026-08-24T15:30:00Z',
    read: false,
    resolved: false,
    actionRequired: 'Caregiver prompt suggested: Offer warm lemon water.'
  }
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-1',
    patientId: 'pat-101',
    title: 'Optimal Visual Memory Response Time',
    summary: 'Asha shows 24% faster response times and higher accuracy (92%) when games feature nature and floral icons.',
    recommendation: 'Schedule visually rich Memory Match sessions between 10:00 AM and 11:30 AM.',
    confidenceScore: 0.94,
    generatedAt: '2026-08-24T06:00:00Z',
    domain: 'memory',
    sentiment: 'positive'
  },
  {
    id: 'ins-2',
    patientId: 'pat-101',
    title: 'Hydration Adherence Consistency',
    summary: 'Logging hydration right after breakfast has increased 7-day adherence to 94%.',
    recommendation: 'Maintain gentle audio prompts in Assamese for mid-day hydration.',
    confidenceScore: 0.89,
    generatedAt: '2026-08-23T19:00:00Z',
    domain: 'wellness',
    sentiment: 'positive'
  }
];
