# NER CognitiveCare — API Contract Documentation (Phase 2)

Version: `v1.0.0`  
Base URL: `http://localhost:8000/api/v1`  
Protocol: `HTTP/1.1`, `JSON`, `Bearer JWT`

---

## 1. Authentication & Session Endpoints

### `POST /auth/login`
- **Description**: Authenticate user via email, phone, or ID and receive JWT access & refresh tokens.
- **Request Body**:
  ```json
  {
    "identifier": "asha.das@nercare.in",
    "password": "patient123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUz...",
    "refreshToken": "eyJhbGciOiJIUz...",
    "tokenType": "bearer",
    "userId": "usr-101",
    "role": "patient",
    "name": "Asha Das",
    "patientId": "pat-101"
  }
  ```

### `POST /auth/refresh`
- **Request Body**: `{ "refreshToken": "..." }`
- **Response `200 OK`**: New access & refresh tokens.

### `GET /auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: User profile & linked patient ID.

---

## 2. Patients & Clinical Profile Endpoints

### `GET /patients`
- **Query Parameters**: `search`, `region`, `stage`, `skip`, `limit`
- **Response `200 OK`**: List of patient profiles conforming to caller's role (Patient / Caregiver / Healthcare Specialist).

### `GET /patients/{id}`
- **Response `200 OK`**:
  ```json
  {
    "id": "pat-101",
    "name": "Asha Das",
    "preferredName": "Asha Aideo",
    "age": 72,
    "gender": "female",
    "region": "assam",
    "primaryLanguage": "as",
    "stage": "mild",
    "hydrationCurrentGlasses": 4,
    "hydrationGoalGlasses": 6,
    "medicationAdherenceRate": 94,
    "overallEngagement": "high",
    "currentStreakDays": 7
  }
  ```

### `POST /patients/{id}/hydration?count=5`
- **Response `200 OK`**: Updated patient record.

### `POST /patients/{id}/mood`
- **Request Body**: `{ "mood": "peaceful", "note": "Enjoyed morning tea" }`
- **Response `200 OK`**: Created mood entry.

---

## 3. Cognitive Games & Longitudinal Telemetry

### `GET /games`
- **Response `200 OK`**: Array of 6 regional games (Memory Garden, Object Recall, Handloom Flow, Reflex Tap, Friendly Face, Daily Rhythm).

### `POST /games/sessions`
- **Description**: Records complete game session and triggers AI adaptive difficulty stepping.
- **Request Body**:
  ```json
  {
    "sessionId": "sess-9821",
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
    "averageResponseTimeMs": 2300,
    "timeSpentSeconds": 45,
    "feedbackGiven": "Splendid! You matched everything smoothly."
  }
  ```
- **Response `201 Created`**: Saved session details.

### `GET /patients/{id}/metrics`
- **Response `200 OK`**: 6-domain cognitive performance metrics (Visual Memory, Short-term Recall, Pattern & Logic, Attention, Social/Emotion, Orientation).

---

## 4. Reminders, Daily Routine, and Memories

### `GET /patients/{id}/reminders` & `POST /reminders`
- Create, retrieve, and complete medication/hydration reminders.

### `PATCH /reminders/{id}/status?status=completed`
- Marks reminder as completed with server timestamp.

### `GET /patients/{id}/activities` & `PATCH /activities/{id}/toggle?completed=true`
- Retrieve daily schedule and toggle activities.

### `GET /patients/{id}/memories` & `PATCH /memories/{id}/favorite`
- Manage cultural and family memory cards.

---

## 5. Offline Sync & Idempotency Protocol

### `POST /sync`
- **Description**: Synchronizes offline client events in batch. Server guarantees idempotency using `client_event_id`.
- **Request Body**:
  ```json
  {
    "deviceId": "tablet-asha-01",
    "events": [
      {
        "id": "evt-uuid-12345",
        "entityType": "reminder",
        "action": "update",
        "payload": { "id": "rem-101", "status": "completed" },
        "timestamp": "2026-08-24T18:00:00Z"
      }
    ]
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "syncedEventsCount": 1,
    "failedEventsCount": 0,
    "duplicateEventsIgnored": 0,
    "lastSyncedTimestamp": "2026-08-24T18:00:01Z",
    "conflicts": []
  }
  ```

---

## 6. AI Companion & Adaptive Difficulty Endpoints

### `POST /ai/evaluate-difficulty`
- **Description**: Transparent rule-based cognitive progression engine.
- **Request Body**:
  ```json
  {
    "gameCategory": "memory",
    "currentDifficulty": "gentle",
    "currentDifficultyScore": 2,
    "accuracy": 95,
    "averageResponseTimeMs": 2100,
    "consecutiveSuccesses": 2,
    "consecutiveFailures": 0,
    "patientAge": 72
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "nextDifficulty": "gentle",
    "nextDifficultyScore": 3,
    "cardCountOrItemCount": 4,
    "timeLimitSeconds": null,
    "distractorCount": 2,
    "feedbackText": "Splendid job! You've matched these with wonderful focus.",
    "adjustmentReason": "High sustained accuracy and steady reaction time. Gently increased challenge by 1 step.",
    "delta": "increased"
  }
  ```

### `POST /ai/voice-assist`
- **Request Body**:
  ```json
  {
    "userVoiceText": "What medicine do I need to take?",
    "patientName": "Asha",
    "region": "Assam"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "responseText": "Good day, Asha! Your morning Telmisartan was scheduled at 9:00 AM. Remember to take it with warm water.",
    "suggestedAction": "view_reminders"
  }
  ```
