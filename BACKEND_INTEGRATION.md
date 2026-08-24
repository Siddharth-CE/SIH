# NER CognitiveCare — Backend Integration Guide & API Specification

> **Phase 1 Frontend Handoff Document**
> This document specifies the exact API contracts, data models, and repository interfaces required to connect a real backend service to the NER CognitiveCare frontend without rewriting UI components.

---

## 1. Architectural Model

The NER CognitiveCare frontend is engineered using a decoupled **Service-Repository Pattern**:

```
UI Component / Page
       ↓
Domain Custom Hook (e.g., useGameSession, useAuth)
       ↓
Domain Service (e.g., patientService, gameService, syncService)
       ↓
Repository Layer Interface (e.g., IPatientRepository, IGameRepository)
       ↓
┌───────────────────────────────┬──────────────────────────────┐
│  Mock Implementation (Phase 1) │  API Implementation (Phase 2)│
│  (IndexedDB / Local Storage)   │  (Fetch / Axios REST / gRPC) │
└───────────────────────────────┴──────────────────────────────┘
```

### Switching to Real Backend
In `src/services/repositories/index.ts`:
```typescript
export const environment = {
  useMockData: false, // Switch to false
  apiUrl: 'https://api.nercognitivecare.org/v1'
};
```
Implement `ApiPatientRepository`, `ApiGameRepository`, etc. conforming to their respective `src/services/interfaces/` contracts.

---

## 2. Authentication & Authorization

All authenticated requests must include the Bearer token in the `Authorization` header:
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Roles:
- `patient`: Access to own profile, games, memories, reminders, daily routine.
- `caregiver`: Access to assigned patients' telemetry, reminders, alerts, mood logs.
- `healthcare`: Access to regional cohorts, longitudinal analytics, clinical flags.

---

## 3. Core API Endpoints & Payloads

### 3.1 Patients API

#### `GET /api/v1/patients`
Retrieves all patients accessible by current user (caregiver/healthcare worker).

**Response (200 OK):**
```json
[
  {
    "id": "pat-101",
    "name": "Asha Das",
    "preferredName": "Asha Aideo",
    "age": 72,
    "gender": "female",
    "region": "assam",
    "primaryLanguage": "as",
    "secondaryLanguage": "en",
    "stage": "mild",
    "caregiverId": "cg-201",
    "healthcareWorkerId": "hw-301",
    "emergencyContact": {
      "name": "Ratul Das (Son)",
      "relation": "Son",
      "phone": "+91 98640 12345"
    },
    "dailyRoutineGoal": 4,
    "hydrationGoalGlasses": 6,
    "hydrationCurrentGlasses": 4,
    "medicationAdherenceRate": 94,
    "overallEngagement": "high",
    "statusSummary": "Completed morning routine, calm mood, good game accuracy.",
    "currentStreakDays": 7,
    "createdAt": "2026-01-10T08:00:00Z",
    "updatedAt": "2026-08-24T18:00:00Z"
  }
]
```

#### `GET /api/v1/patients/:id`
Retrieves single patient profile by ID.

#### `PATCH /api/v1/patients/:id`
Updates patient profile fields (e.g. hydration count, emergency contact, settings).

**Request Body:**
```json
{
  "hydrationCurrentGlasses": 5,
  "statusSummary": "Completed afternoon tea and garden walk."
}
```

#### `POST /api/v1/patients/:id/mood`
Logs emotional mood entry.

**Request Body:**
```json
{
  "mood": "peaceful",
  "note": "Woke up refreshed after 8 hours of sleep.",
  "loggedBy": "patient"
}
```

---

### 3.2 Game Sessions & Cognitive Telemetry API

#### `POST /api/v1/games/sessions`
Records completed cognitive exercise session with detailed latency & accuracy metrics.

**Request Body:**
```json
{
  "sessionId": "sess-1724523900-xyz",
  "patientId": "pat-101",
  "gameId": "game-memory-match",
  "gameCategory": "memory",
  "difficulty": "gentle",
  "difficultyScore": 3,
  "score": 100,
  "maxPossibleScore": 100,
  "accuracy": 92,
  "attempts": 6,
  "successfulAttempts": 5,
  "averageResponseTimeMs": 2400,
  "timeSpentSeconds": 45,
  "completedAt": "2026-08-24T10:35:00Z",
  "feedbackGiven": "Splendid! You matched everything so smoothly.",
  "adaptiveDelta": "increased"
}
```

#### `GET /api/v1/patients/:id/metrics`
Returns aggregated longitudinal cognitive metrics.

**Response (200 OK):**
```json
[
  {
    "category": "memory",
    "categoryLabel": "Visual Memory",
    "scorePercentage": 92,
    "trend": "improving",
    "sessionsCount": 8,
    "lastPlayedDate": "2026-08-24",
    "color": "#0F4C3A"
  }
]
```

---

### 3.3 Reminders API

#### `GET /api/v1/patients/:id/reminders?date=2026-08-24`
Returns scheduled reminders for patient on specified date.

#### `POST /api/v1/reminders`
Creates new medication, hydration, or activity reminder.

**Request Body:**
```json
{
  "patientId": "pat-101",
  "title": "Evening Blood Pressure Medicine",
  "type": "medication",
  "time": "08:30 PM",
  "timeOfDay": "evening",
  "dosageOrInstruction": "1 tablet with warm water",
  "status": "pending",
  "scheduledForDate": "2026-08-24"
}
```

#### `PATCH /api/v1/reminders/:id/status`
Updates reminder status (`completed`, `snoozed`, `missed`).

---

### 3.4 Family Memories API

#### `GET /api/v1/patients/:id/memories`
Retrieves patient's memory board albums.

#### `POST /api/v1/memories`
Adds a memory photo/story to the board.

**Request Body:**
```json
{
  "patientId": "pat-101",
  "title": "Jorhat Tea Estate Veranda",
  "relationshipOrPlace": "Jorhat, Upper Assam",
  "category": "places",
  "description": "The cool morning breeze across the tea bushes.",
  "dateOrEra": "1984 — Jorhat Family Home",
  "tags": ["Tea Garden", "Jorhat"],
  "favorite": true
}
```

---

### 3.5 Offline-First Synchronization API

#### `POST /api/v1/sync`
Batch synchronizes queued offline events when device reconnects.

**Request Body:**
```json
{
  "events": [
    {
      "id": "sync-172452399-abc",
      "entityType": "game_session",
      "action": "create",
      "payload": { ... },
      "timestamp": "2026-08-24T11:00:00Z"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "syncedEventsCount": 1,
  "failedEventsCount": 0,
  "lastSyncedTimestamp": "2026-08-24T11:00:05Z"
}
```

---

### 3.6 AI & Natural Speech API

#### `POST /api/v1/ai/evaluate-difficulty`
Backend machine-learning difficulty calibration.

**Request Body:**
```json
{
  "gameCategory": "memory",
  "currentDifficulty": "gentle",
  "currentDifficultyScore": 2,
  "accuracy": 92,
  "averageResponseTimeMs": 2100,
  "consecutiveSuccesses": 3,
  "consecutiveFailures": 0,
  "patientAge": 72
}
```

**Response (200 OK):**
```json
{
  "nextDifficulty": "easy",
  "nextDifficultyScore": 3,
  "cardCountOrItemCount": 6,
  "timeLimitSeconds": null,
  "distractorCount": 2,
  "feedbackText": "Splendid! You matched everything so smoothly. Let us try just a few more items.",
  "adjustmentReason": "High visual recall accuracy (>=85%). Stepped up by 1 level.",
  "delta": "increased"
}
```

#### `POST /api/v1/ai/voice-assist`
Natural Language Processing speech assistant response generator.

---

## 4. Recommended Database Schemas (PostgreSQL / Relational)

```sql
CREATE TABLE patients (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    age INT NOT NULL,
    gender VARCHAR(32),
    region VARCHAR(64) NOT NULL, -- 'assam', 'meghalaya', etc.
    primary_language VARCHAR(16) NOT NULL, -- 'en', 'as', 'bn', 'mni', 'kha'
    stage VARCHAR(32) NOT NULL, -- 'early', 'mild', 'moderate'
    caregiver_id VARCHAR(64),
    healthcare_worker_id VARCHAR(64),
    hydration_goal INT DEFAULT 6,
    hydration_current INT DEFAULT 0,
    medication_adherence_rate INT DEFAULT 90,
    overall_engagement VARCHAR(32) DEFAULT 'high',
    streak_days INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE game_sessions (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    patient_id VARCHAR(64) REFERENCES patients(id),
    game_id VARCHAR(64) NOT NULL,
    game_category VARCHAR(32) NOT NULL,
    difficulty VARCHAR(32) NOT NULL,
    difficulty_score INT NOT NULL,
    score INT NOT NULL,
    accuracy INT NOT NULL,
    attempts INT NOT NULL,
    avg_response_time_ms INT NOT NULL,
    time_spent_seconds INT NOT NULL,
    feedback_given TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reminders (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) REFERENCES patients(id),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL, -- 'medication', 'hydration', 'activity', 'family'
    time VARCHAR(32) NOT NULL,
    dosage_instruction TEXT,
    status VARCHAR(32) DEFAULT 'pending',
    scheduled_for_date DATE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);
```

---

## 5. Security & Ethical Boundaries
1. **Never generate medical diagnostic claims**: Wording must remain focused on *cognitive engagement*, *memory assistance*, and *routine support*.
2. **Encrypted telemetry in transit (TLS 1.3) & rest (AES-256)**.
3. **Store-and-forward tolerance**: Server must accept timestamps from offline events and reconcile them deterministically.
